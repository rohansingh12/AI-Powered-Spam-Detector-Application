from django.contrib.auth.models import User
from .models import Profile
from django.db.models import Q
from openai import OpenAI
from django.core.exceptions import ValidationError
import os
from dotenv import load_dotenv

def create_user_and_profile(username, phone_number, password, email=None):
    """
    Create a new user and associated profile.

    Args:
        username (str): The username for the new user.
        phone_number (str): The phone number for the new profile.
        password (str): The password for the new user.
        email (str, optional): The email for the new profile. Defaults to None.

    Returns:
        User: The created user object.

    Raises:
        ValueError: If username, phone number, or email already exists.
    """
    if User.objects.filter(username=username).exists():
        raise ValueError("Username already exists.")
    if Profile.objects.filter(phone_number=phone_number).exists():
        raise ValueError("Phone number already exists.")
    if email and Profile.objects.filter(email=email).exists():
        raise ValueError("Email already exists.")

    user = User.objects.create_user(username=username, password=password, email=email)
    Profile.objects.create(user=user, phone_number=phone_number, email=email)
    return user

def mark_phone_number_as_spam(phone_number):
    """
    Increment the spam count for the profile associated with the given phone number.

    Args:
        phone_number (str): The phone number to mark as spam.

    Returns:
        bool: True if a profile was updated, False otherwise.
    """
    profile = Profile.objects.filter(phone_number=phone_number).first()
    if profile:
        profile.spam_count += 1  # Increment spam count
        profile.save()
        return True
    return False


def search_profiles_by_name(name):
    """
    Search for profiles whose usernames match the given name.

    Args:
        name (str): The name to search for.

    Returns:
        QuerySet: A queryset of matching profiles.
    """
    profile_start = Profile.objects.filter(user__username__startswith=name)
    profile_contain = Profile.objects.filter(user__username__contains=name).exclude(user__username__startswith=name)
    return profile_start.union(profile_contain)

def search_profile_by_phone_number(phone_number):
    """
    Retrieve a profile by phone number.

    Args:
        phone_number (str): The phone number to search for.

    Returns:
        Profile or None: The matching profile, or None if no match is found.
    """
    try:
        return Profile.objects.filter(phone_number=phone_number).first()
    except ValidationError:
        return None

def calculate_spam_severity(spam_count):
        """
        Calculate spam severity based on the spam count.
        Returns one of: 'none', 'low', 'medium', 'high'.
        """
        if spam_count == 0:
            return "none"
        elif spam_count < 5:
            return "low"
        elif spam_count < 10:
            return "medium"
        else:
            return "high"
        

def analyze_comment_with_llm(user_comment):
    """
    Use OpenAI's LLM to analyze user comments and extract meaningful insights.

    Args:
        user_comment (str): The comment provided by the user.

    Returns:
        str: A summary or insight from the LLM.
    """
    api_key = os.getenv("OPENAI_API_KEY")
    
    if not api_key:
        return "Error: OpenAI API key not found in environment variables."

    client = OpenAI(api_key=api_key)

    try:
        prompt = (
            f"A user has marked a phone number as spam with the following comment:\n"
            f"\"{user_comment}\"\n\n"
            "Analyze the comment and return a concise reason for marking it as spam, "
            "such as 'telemarketing,' 'fraudulent activity,' or 'unknown caller.'"
        )

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",  # Or "gpt-4" if available
            messages=[
                {"role": "system", "content": "You are an assistant specializing in spam analysis."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=50,
            temperature=0.7,
        )

        # Extract and return the LLM's response
        insight = response.choices[0].message.content.strip()
        return insight

    except Exception as e:
        # Log or handle errors as needed
        return f"Error analyzing comment: {str(e)}"

