from django.shortcuts import render, redirect
import praw

user_agent = "Reddit Saved 0.1 by /u/Tech_Runner"
r = praw.Reddit(user_agent=user_agent)


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
    savedPosts = list(r.user.get_saved())
    print(savedPosts[0].title)
    return render(request, 'webapp/posts.html', {'savedPosts': savedPosts})


def callback(request):
    authorize(request.GET['code'])
    return redirect('/dashboard/')


'''

    Functions

'''


def authorize(code):
    access_information = r.get_access_information(code)
    user = r.get_me()
    print(user.name, user.link_karma)
