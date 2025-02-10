from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Profile
from django.views.generic import TemplateView
from .serializers import ProfileSerializer
import openai
from .profile_services import(
    create_user_and_profile,
    mark_phone_number_as_spam,
    search_profile_by_phone_number,
    search_profiles_by_name,
    calculate_spam_severity,
    analyze_comment_with_llm
    
)

class ReactAppView(TemplateView):
    template_name = "index.html"

class Register(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("name")
        phone_number = request.data.get("phone_number")
        password = request.data.get("password")
        email = request.data.get("email", None)

        if not all([username, phone_number, password]):
            return Response(
                {"Error": "Name, phone number, and password are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = create_user_and_profile(username, phone_number, password, email)
            return Response({"Message": "Registered successfully."}, status=status.HTTP_201_CREATED)
        except ValueError as error:
            return Response({"Error": str(error)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as error:
            return Response({"Error": "An unexpected error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class Login(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response(
                {"Error": "Both username and password are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(username=username, password=password)
        if not user:
            return Response(
                {"Error": "Invalid credentials."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        token, _ = Token.objects.get_or_create(user=user)
        return Response({"Token": token.key}, status=status.HTTP_200_OK)


class MarkSpam(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        phone_number = request.data.get("phone_number")
        user_comment = request.data.get("comment", "")

        if not phone_number:
            return Response(
                {"Error": "Phone number is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        success = mark_phone_number_as_spam(phone_number)

        insight=None
        if user_comment:
            insight = analyze_comment_with_llm(user_comment)

        if success:
            profile = Profile.objects.filter(phone_number=phone_number).first()
            if profile and insight:
                if profile.spam_insight:
                    profile.spam_insight += f"\n\n{insight}"  # Append new insight
                else:
                    profile.spam_insight = insight
                profile.save()
            return Response(
                {"Message": "Contact successfully marked as spam."},
                status=status.HTTP_200_OK,
            )
        return Response(
            {"Error": "Phone number not found."},
            status=status.HTTP_404_NOT_FOUND,
        )


class SearchName(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        name = request.query_params.get("name")

        if not name:
            return Response(
                {"Error": "Name parameter is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        profiles = search_profiles_by_name(name)
        response_data = [
            {
                "name": profile.user.username,
                "phone_number": profile.phone_number,
                "email": profile.email,
                "spam_count":profile.spam_count,
                "spam_severity": calculate_spam_severity(profile.spam_count),
                "insight":profile.spam_insight
            } for profile in profiles
        ]

        return Response(response_data, status=status.HTTP_200_OK)


class SearchPhoneNumber(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        phone_number = request.query_params.get("phone_number")

        if not phone_number:
            return Response(
                {"Error": "Phone number parameter is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        profile = search_profile_by_phone_number(phone_number)
        

        if profile:
            user = profile.user
            spam_severity = calculate_spam_severity(profile.spam_count)
            response_data = {
                "name": user.username,
                "phone_number": profile.phone_number,
                "spam_severity": spam_severity,
                "spam_count":profile.spam_count,
                "email": profile.email,
                "insight":profile.spam_insight
            }
            return Response(response_data, status=status.HTTP_200_OK)

        return Response(
            {"Error": "No profile found for the given phone number."},
            status=status.HTTP_404_NOT_FOUND,
        )
