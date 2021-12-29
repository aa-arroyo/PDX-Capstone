from django import forms

class NewRegistrationForm(forms.Form):
    username = forms.CharField(label='Username', max_length=30)
    password = forms.CharField(widget=forms.PasswordInput, label='Password', max_length=30)
    email = forms.EmailField(label='Email')

class NewLoginForm(forms.Form):
    username = forms.CharField(label='Username', max_length=30)
    password = forms.CharField(widget=forms.PasswordInput, label='Password', max_length=30)