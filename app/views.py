from app import app
from flask import request, render_template
from pprint import pprint
import praw, webbrowser

@app.route('/')
@app.route('/index')
def index():
    rule = request.url_rule
    posts = [  # fake array of posts
        {
            'author': {'nickname': 'John'},
            'body': 'Beautiful day in Portland!'
        },
        {
            'author': {'nickname': 'Susan'},
            'body': 'The Avengers movie was so cool!'
        }
    ]
    return render_template('index.html',
                            title='nothome',
                            posts=posts)

r = praw.Reddit('OAuth testing example by u/Tech_Runmner ver 0.1')
code = ''
@app.route('/login')
def login():
    r.set_oauth_app_info(client_id='R0RrAiBvmgk-3Q',
                         client_secret='',
                         redirect_uri='http://127.0.0.1:5000/'
                                      'authorize_callback')
    url = r.get_authorize_url('uniqueKey', 'identity read save history', True)
    webbrowser.open(url, new=0)
    return "login"


@app.route('/authorize_callback')
def authorized():
    #Changes the user from me to authenticated user
    access_information = r.get_access_information(request.args.get('code', ''))
    code = request.args.get('code', '')
    return "hello"

@app.route('/savedposts')
def getSaved():
    reddit_saved_links = []
    reddit_saves = r.user.get_saved(limit=2)

    #Add the reddit saved posts to list and print titles + points
    '''
    #Option 1
    for reddit_save in reddit_saves:
        reddit_saved_links.append(reddit_save)
    for thing in reddit_saved_links:
        print(thing)
    #Option 2
    links = list(reddit_saves)
    for thing in links:
        print(thing)
    '''

    #Checks the type of the object
    for thing in reddit_saves:
        if type(thing) == praw.objects.Submission:
            print('Submission')
        else:
            print('not')

    '''
    #Prints the attributes of the object
    for thing in reddit_saves:
        pprint(vars(thing))

    #Get the body of comment.
    for thing in reddit_saves:
        print(thing.body)

    #Gets the title of post. Doesn't work on comments
    for thing in reddit_saves:
        print(thing.title)
    '''

    #Prints the generator objects. Including type.
    '''
    pprint(list(reddit_saves))
    '''

    return 'done'
