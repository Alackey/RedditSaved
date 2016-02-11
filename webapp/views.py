from django.shortcuts import render
import praw


def home(request):
    return render(request, 'webapp/home.html', {})
