from django.shortcuts import render, redirect
from django.http import HttpResponse
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


def unsave(request):
    # data = {'id': request.GET['id'],
    #         'executed': 'unsaved'}
    # url = r.config['unsave']
    # response = r.request_json(url, data=data)
    # r.evict(r.config['saved'])
    # api_url = build_url('api/unsave/', {'id': id})
    # response = r.get_content(api_url, _use_oauth=True)
    # r.get_content(url, params=data, _use_oauth=True)
    # print('start loop')
    # for post in savedPosts:
    #     print('if statement')
    #     if post.id == request.GET['id']:
    #         print('start unsave')
    #         post.unsave()
    #         print('done unsave')
    #         break
    # if request.GET['type'] == "comment":
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
