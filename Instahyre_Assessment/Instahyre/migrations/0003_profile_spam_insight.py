# Generated by Django 5.1.4 on 2024-12-25 05:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Instahyre', '0002_remove_profile_spam_profile_spam_count'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='spam_insight',
            field=models.TextField(blank=True, null=True),
        ),
    ]
