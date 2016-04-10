from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.core import serializers
from .models import Group, Post
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
    user = r.get_me()
    response = {}
    response = serializers.serialize(
        "json",
        Group.objects.filter(username=user.name)
    )
    return HttpResponse(response, content_type="application/json")


def group(request):
    user = r.get_me()

    group = Group.objects.get(
        username=user.name,
        groupname=request.GET['group_name']
    )
    posts = serializers.serialize(
        "json",
        Post.objects.filter(group=group)
    )

    return HttpResponse(posts, content_type="application/json")


def groupAdd(request):
    user = r.get_me()
    Group.objects.create(
        username=user.name,
        groupname=request.GET['group_name']
    )
    return HttpResponse("Added group")


def postsAdd(request):
    user = r.get_me()
    posts_unicode = request.body.decode('utf-8')
    posts = json.loads(posts_unicode)

    group = Group.objects.get(
        username=user.name,
        groupname=str(posts['group_name'])
    )

    for post in posts['posts']:
        if (post['type'] == 'comment'):
            Post(
                group=group,
                post_link=post['post_link'],
                unsaveURL=post['unsaveURL'],
                name=post['name'],
                body=post['body'],
                type=post['type']
            ).save()
        else:
            Post(
                group=group,
                post_link=post['post_link'],
                unsaveURL=post['unsaveURL'],
                name=post['name'],
                title=post['title'],
                url=post['url'],
                type=post['type']
            ).save()

    return HttpResponse("Posts added to group")


def unsave(request):

    if request.GET['type'] == "comment":
        submission = r.get_submission(request.GET['postLink'])
        comments = list(submission.comments)
        comments[0].unsave()
    else:
        print(request.GET['id'])
        submission = r.get_submission(submission_id=request.GET['id'])
        submission.unsave()

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
