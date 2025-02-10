from django.urls import path
from Instahyre.views import Register,Login,MarkSpam,SearchName,SearchPhoneNumber,ReactAppView


urlpatterns=[
	path('register/',Register.as_view(),name='register'),
	path('login/',Login.as_view(),name='login'),
	path('spams/',MarkSpam.as_view(),name='spams'),
	path('search_by_name/',SearchName.as_view(),name='search_name'),
	path('search_by_phone_number/',SearchPhoneNumber.as_view(),name='search_phone_number'),
    path('', ReactAppView.as_view(), name='react-frontend-app')
]
