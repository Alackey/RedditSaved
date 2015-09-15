from app import app
from flask import request
from flask import jsonify
from pprint import pprint
import praw, webbrowser, requests

@app.route('/')
@app.route('/index')
def index():
    rule = request.url_rule
    return rule.rule

r = praw.Reddit('OAuth testing example by u/Tech_Runmner ver 0.1')
code = ''
access_token = ''
@app.route('/login')
def login():
    r.set_oauth_app_info(client_id='R0RrAiBvmgk-3Q',
                         client_secret='',
                         redirect_uri='http://127.0.0.1:5000/'
                                      'authorize_callback')
    url = r.get_authorize_url('uniqueKey', 'identity read save history', True)
    webbrowser.open(url)
    return "login"


@app.route('/authorize_callback')
def authorized():
    #Changes the user from me to authenticated user
    access_information = r.get_access_information(request.args.get('code', ''))
    code = request.args.get('code', '')
    return "hello"


@app.route('/loginsuccess')
def success():
    return "login success"

@app.route('/savedposts')
def getSaved():
    reddit_saved_links = []
    reddit_saves = r.user.get_saved(limit=4)
    #add the reddit saved posts to list
    for reddit_save in reddit_saves:
        reddit_saved_links.append(reddit_save)

    for thing in reddit_saved_links:
        print(thing)
    return 'done'
