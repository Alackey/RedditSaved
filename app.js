var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
app.use(cookieParser());
var Snoocore = require('snoocore');
var url = require('url');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/RedditSaved');
console.log(mongoose.connection.host);
console.log(mongoose.connection.port);
console.log(mongoose.connection.collections);

//Check to see if connected
mongoose.connection.on('connected', function () {
    console.log('hello');
});

var GroupsSchema = new mongoose.Schema({
    name: String,
    posts: Array
}, {collection: "groups"});

var Group = mongoose.model("Group", GroupsSchema);

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

var uniqId = 0; // unique id for our user
var accounts = {}; // Snoocore instances. Each instance is a different account

function getInstance(accountId) {

    // Check if we already have an instance with this id. If
    // so, use this instance
    if (accounts[accountId]) {
        return accounts[accountId];
    }

    // Else, return a new instance
    return new Snoocore({
        userAgent: 'test-express-web / snoocore-examples',
        oauth: {
            type: 'explicit',
            duration: 'permanent',
            key: 'R0RrAiBvmgk-3Q', // not an actual working key, use your own
            secret: 'YPVjlyJoon9CsONiCU4TnJK8-Z8', // not an actual working secret, use your own
            redirectUri: 'http://localhost:3000/reddit_redirect',
            scope: [ 'identity save read history' ]
        }
    });
}


app.get('/', function (req, res) {
    var accountId = req.cookies ? req.cookies.account_id : void 0;

    // We have an account, redirect to the authenticated route
    if (accountId) {
        return res.redirect('/me');
    }

    //var reddit = getInstance();
    //return res.send('<a href="' + reddit.getAuthUrl() + '">Authenticate!</a>');

    return res.render('home.html');
});

app.get('/authURL', function (req, res) {
    var reddit = getInstance();
    return res.send('<a href="' + reddit.getAuthUrl() + '">Sign in</a>');
});

app.get('/me', function(req, res) {

    var accountId = req.cookies ? req.cookies.account_id : void 0;

    // If the user has not authenticated bump them back to the main route
    if (!accountId) {
        return res.redirect('/');
    }

    return res.render('index.html');
});

app.get('/savedposts', function(req, res) {
    return accounts[req.cookies.account_id]('/api/v1/me').get().then(function(result) {
        //Get saved posts
        accounts[req.cookies.account_id]('/user/' + result.name + '/saved').get().then(function(posts) {
            var redditPosts = [];
            console.log(posts.data.children[0].data.id);
            for( var i = 0; i < posts.data.children.length; i++){
                //test
                if (i==0) {
                    console.log(posts.data.children[0].data);
                }

                if (posts.data.children[i].data.body != undefined) {
                    redditPosts.push({ 'info': [
                                        { 'type': 'Comment'},
                                        { 'mainText': posts.data.children[i].data.body },
                                        { 'permalink': "http://www.reddit.com/comments/" +
                                            posts.data.children[i].data.link_id.split("_")[1] +
                                            "/x/" + posts.data.children[i].data.id},
                                        { 'fullname': posts.data.children[i].data.name}
                                    ]});
                    //Post is a Comment
                    //console.log(posts.data.children[i].data.body);
                } else {
                    redditPosts.push({ 'info': [
                                        { 'type': 'Submission'},
                                        { 'mainText': posts.data.children[i].data.title },
                                        { 'permalink': "http://www.reddit.com" + posts.data.children[i].data.permalink},
                                        { 'titleLink': posts.data.children[i].data.url},
                                        { 'fullname': posts.data.children[i].data.name}
                                    ]});
                    //Post is a Submission
                    //console.log(posts.data.children[i].data.title);
                }
            }
            //console.log(JSON.stringify(redditPosts, null, 4));
            console.log("about to send posts");
            console.log(redditPosts);
            Group.findOne({name: 'Home'}, function (err, data) {
                console.log(data);
                data.posts = redditPosts;
                data.save();
            });
            return res.json(redditPosts);
        });
    });
});

app.get('/groups', function(req, res) {
    var groups;

    newPosts = [ { "type" : "Submission", "mainText" : "the new title", "permalink" : "new link" } ];

    // Group.findOne({name: 'Home'}, function (err, data) {
    //     console.log(data);
    //     data.posts = newPosts;
    //     data.save();
    // });

    // Group.find({name: 'Home'},  function(err, data){
    //     console.log(data[0].posts[0].type);
    //     data[0].posts = newPosts;
    //     data.save();
    //     console.log(data);
    //     groups = data;
    // });

    return res.json(groups);
});

app.get('/clear', function(req, res) {
    console.log("clear started");
    Group.find({name: "Home"}, function(err, info) {
        console.log(info);
    });
});

app.get('/unsave', function(req, res) {
    var fullname = url.parse(req.url, true).query.fullname;
    accounts[req.cookies.account_id]('/api/unsave').post({
        id: fullname
    });
});

// does not account for hitting "deny" / etc. Assumes that
// the user has pressed "allow"
app.get('/reddit_redirect', function(req, res) {

    var accountId = ++uniqId; // an account id for this instance
    var instance = getInstance(); // an account instance

    // In a real app, you would save the refresh token in
    // a database / etc for use later so the user does not have
    // to allow your app every time...
    return instance.auth(req.query.code).then(function(refreshToken) {
        // Store the account (Snoocore instance) into the accounts hash
        accounts[accountId] = instance;

        // Set the account_id cookie in the users browser so that
        // later calls we can refer to the stored instance in the
        // account hash


        console.log(accounts);
        res.cookie('account_id', String(accountId), { maxAge: 900000, httpOnly: true });

        // redirect to the authenticated route
        return res.redirect('/me');
    });

});

var server = app.listen(3000, function () {
  console.log('Example app listening at http://localhost:3000');
});
