from django import forms

class NewRegistrationForm(forms.Form):
    username = forms.CharField(label='Username', max_length=30, widget=forms.TextInput(attrs={'style': 'width: 300px;', 'class': 'form-control'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'style': 'width: 300px;', 'class': 'form-control'}), label='Password', max_length=30)
    email = forms.EmailField(label='Email', widget=forms.EmailInput(attrs={'style': 'width: 300px;', 'class': 'form-control'}))

class NewLoginForm(forms.Form):
    username = forms.CharField(label='Username', max_length=30, widget=forms.TextInput(attrs={'style': 'width: 300px;', 'class': 'form-control'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'style': 'width: 300px;', 'class': 'form-control'}), label='Password', max_length=30)