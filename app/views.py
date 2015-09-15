from app import app
from flask import request
import praw, webbrowser

@app.route('/')
@app.route('/index')
def index():
    rule = request.url_rule
    return rule.rule

r = praw.Reddit('OAuth testing example by u/Tech_Runmner ver 0.1')
@app.route('/login')
def login():
    r.set_oauth_app_info(client_id='R0RrAiBvmgk-3Q',
                         client_secret='YPVjlyJoon9CsONiCU4TnJK8-Z8',
                         redirect_uri='http://127.0.0.1:5000/'
                                      'authorize_callback')
    url = r.get_authorize_url('uniqueKey', 'identity', True)
    webbrowser.open(url)
    return "login"

@app.route('/authorize_callback')
def authorized():
    access_information = r.get_access_information(request.args.get('code', ''))
    authenticated_user = r.get_me()
    return "hello"


@app.route('/loginsuccess')
def success():
    #access_information = r.get_access_information('8aunZCxfv8mcCfD8no4CSlO55u0')
    return "login success"
