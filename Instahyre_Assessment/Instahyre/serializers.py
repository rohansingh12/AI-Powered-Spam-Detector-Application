# from rest_framework import serializers
# from .models import Profile
# from django.contrib.auth.models import User

# class ProfileSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Profile
#         fields = '__all__'
from rest_framework import serializers
from .models import Profile
from django.contrib.auth.models import User

class ProfileSerializer(serializers.ModelSerializer):
    spam_severity = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = '__all__'

    def get_spam_severity(self, obj):
        return obj.spam_severity()
