from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.core import serializers
from .models import Group
import json
import requests
import time
import praw

user_agent = "Reddit Saved web application to save/unsave reddit posts \
              by u/Tech_Runner ver 0.1 see https://github.com/Alackey/\
              RedditSaved for source"
r = praw.Reddit(user_agent=user_agent)
access_information = ""
savedPosts = []


def home(request):
    r.set_oauth_app_info(
        client_id='R0RrAiBvmgk-3Q',
        client_secret='YPVjlyJoon9CsONiCU4TnJK8-Z8',
        redirect_uri='http://127.0.0.1:8000/callback/'
    )

    return render(
        request,
        'webapp/home.html',
        {'authURL': r.get_authorize_url(
                'uniqueKey',
                'identity read history save',
                True)}
    )


def dashboard(request):
    global savedPosts
    try:
        savedPosts = list(r.user.get_saved())
    except:
        return redirect('/')
    return render(request, 'webapp/posts.html', {'savedPosts': savedPosts})


def groups(request):
    response = {}
    response = serializers.serialize(
        "json",
        Group.objects.filter(username="Tech_Runner")
    )
    print(response)
    return HttpResponse(response, content_type="application/json")


def group(request):

    response = serializers.serialize(
        "json",
        Group.objects.filter(
            username="Tech_Runner",
            groupname=request.GET['group_name']
        )
    )
    print(json.dumps(response))
    return HttpResponse(response, content_type="application/json")


def groupAdd(request):
    user = r.get_me()
    Group.objects.create(
        username=user.name,
        groupname=request.GET['group_name']
    )
    print("add the group")
    return HttpResponse("Added group")


def postsAdd(request):

    posts_unicode = request.body.decode('utf-8')
    posts = json.loads(posts_unicode)

    group = Group.objects.get(
            username="Tech_Runner",
            groupname=str(posts['group_name'])
        )

    for post in posts['posts']:
        group.posts['data'].append(post)
    group.save()

    return HttpResponse("Posts added to group")


def unsave(request):

    start = time.time()
    submission = r.get_submission(request.GET['postLink'])
    comments = list(submission.comments)
    print(comments[0].body)
    comments[0].unsave()
    submission = r.get_submission(request.GET['postLink'])
    comments = list(submission.comments)
    done = time.time()
    print(done - start)

    return HttpResponse("return this string")


def callback(request):
    authorize(request.GET['code'])
    return redirect('/dashboard/')


'''

    Functions

'''


def build_url(url, api_params):
    return '%s?%s' % (url, urllib.urlencode(api_params))


def authorize(code):
    access_information = r.get_access_information(code)
    r.refresh_access_information(access_information['refresh_token'])
    user = r.get_me()
    print(user.name, user.link_karma)
