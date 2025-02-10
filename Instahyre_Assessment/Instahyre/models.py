from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=False)
    phone_number = models.IntegerField(null=False, unique=True)
    email = models.EmailField(max_length=50, null=True)
    spam_count = models.IntegerField(default=0)  # Replace `spam` field with `spam_count`
    spam_insight = models.TextField(null=True, blank=True)

    def spam_severity(self):
        """
        Calculate the spam severity based on the spam count.
        Returns: "none", "low", "medium", or "high".
        """
        if self.spam_count == 0:
            return "none"
        elif self.spam_count <= 3:
            return "low"
        elif self.spam_count <= 7:
            return "medium"
        else:
            return "high"

    def __str__(self):
        return str(self.user)
