"""Report_Generation URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from dashboard.views import home, fetch_transactions, fetch_acc_state, fetch_user_details, fetch_accounts, fetch_accounts_transaction

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home, name='home'),
    path('transactions/fetch', fetch_transactions, name='fetch-transactions'),
    path('accounts/fetch', fetch_acc_state, name='fetch-acc-state'),
    path('user/fetch', fetch_user_details, name='fetch-user'),
    path('acc/fetch', fetch_accounts, name='fetch-acc'),
    path('fetch/all', fetch_accounts_transaction, name='fetch-all')
]
