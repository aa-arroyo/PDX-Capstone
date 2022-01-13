from django.http.response import HttpResponse
from django.shortcuts import render
from django.http import JsonResponse
from .models import NewApplication
from .forms import NewRegistrationForm, NewLoginForm
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect
from django.urls import reverse
import json

# Create your views here.
def home_page(request):
    return render(request, 'jat/index.html')

def dashboard_page(request):
    return render(request, 'jat/dashboard.html')

def favorites_page(request):
    return render(request, 'jat/favorites.html')

def charts_page(request):
    return render(request, 'jat/charts.html')


def sign_up_page(request):
    # will get the user to the registration page
    if request.method == 'GET':
        form = NewRegistrationForm()
        return render(request, 'jat/sign_up.html', {
            'form':form,
            })

    # will allow the user to register and send them back to the
    # login page
    elif request.method == 'POST':
        form = NewRegistrationForm(request.POST)
        if form.is_valid():
            user = User.objects.create_user(
                username = form.cleaned_data['username'],
                password = form.cleaned_data['password'],
                email = form.cleaned_data['email'],
            )
            

            return HttpResponseRedirect(reverse('log_in'))


def log_in_page(request):
    if request.method == 'GET':
        form = NewLoginForm()
        return render(request, 'jat/log_in.html', {
            'form':form,
        })

    elif request.method == 'POST':
        form = NewLoginForm(request.POST)
        if form.is_valid():
            # authenticate method returns user or None
            user = authenticate(request, 
            username = form.cleaned_data['username'],
            password = form.cleaned_data['password'],
            )

            if user != None:
                login(request, user)
                return HttpResponseRedirect(reverse('dashboard_page'))
            
            else:
                form.add_error('username', 'Invalid username or password')
                return render(request, 'jat/log_in.html', {
                    'form':form
                })

@login_required(login_url='log_in')
def log_out_page(request):
    logout(request)
    return HttpResponseRedirect(reverse('home_page'))


@login_required(login_url='log_in')
def get_applications(request):
    applications = NewApplication.objects.all().filter(user=request.user).order_by('date_applied')
    data = []
    for application in applications:
        data.append({
            'id': application.id,
            'job_title': application.job_title,
            'company_name': application.company_name,
            'date_applied': application.date_applied,
            'compensation_type': application.compensation_type,
            'compensation_amount': application.compensation_amount,
            'type_of_hire': application.type_of_hire,
            'shift': application.shift,
            'status': application.status,
            'notes': application.notes,
            'favorite': application.favorite
        })

    return JsonResponse({'applications': data})


@login_required(login_url='log_in')
def save_application(request):
    data = json.loads(request.body)
    newApplication = NewApplication()
    newApplication.job_title = data['job_title']
    newApplication.company_name = data['company_name']
    newApplication.date_applied = data['date_applied']
    newApplication.compensation_type = data['compensation_type']
    newApplication.compensation_amount = data['compensation_amount']
    newApplication.type_of_hire = data['type_of_hire']
    newApplication.shift = data['shift']
    newApplication.status = data['status']
    newApplication.notes = data['notes']
    newApplication.favorite = data['favorite']
    newApplication.user = request.user 
    newApplication.save()
    return JsonResponse({'status': 'It worked!'})


def favorite_toggle(request):
    data = json.loads(request.body)
    application = NewApplication.objects.get(id=data['identifier'])
    if application.favorite == 'true':
        application.favorite = 'false'
    else:
        application.favorite = 'true'
    application.save()

    return JsonResponse({'status': 'It worked!'})


def update_application(request):
    data = json.loads(request.body)
    application = NewApplication.objects.get(id=data['identifier'])
    application.job_title = data['job_title']
    application.company_name = data['company_name']
    application.date_applied = data['date_applied']
    application.compensation_type = data['compensation_type']
    application.compensation_amount = data['compensation_amount']
    application.type_of_hire = data['type_of_hire']
    application.shift = data['shift']
    application.status = data['status']
    application.notes = data['notes']
    application.favorite = data['favorite']
    application.user = request.user 
    application.save()

    return JsonResponse({'status': 'It worked!'})

def delete_application(request):
    data = json.loads(request.body)
    if NewApplication.objects.filter(id=data['identifier'], user=request.user).exists():
        application = NewApplication.objects.get(id=data['identifier'], user=request.user)
        application.delete()
    return JsonResponse({'status': 'It worked!'})