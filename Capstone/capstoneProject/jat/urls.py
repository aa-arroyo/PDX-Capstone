from django.urls import path
from . import views

urlpatterns = [
    path('home/', views.home_page, name='home_page'),
    path('dashboard/', views.dashboard_page, name='dashboard_page'),
    path('favorites/', views.favorites_page, name='favorites'),
    path('charts/', views.charts_page, name='charts'),
    path('log_in/', views.log_in_page, name='log_in'),
    path('sign_up/', views.sign_up_page, name='sign_up'),
    path('log_out/', views.log_out_page, name='log_out'),
    path('applications/', views.get_applications, name='get_applications'),
    path('save_application/', views.save_application, name='save_application'),
    path('favorite_toggle/', views.favorite_toggle, name='favorite_toggle'),
    path('update_application/', views.update_application, name='update_application'),
    path('delete_application/', views.delete_application, name='delete_application'),
]