//Loads the homepage posts on page load
var homePosts;
function homeOnLoad(){
    $.get('/savedposts', {
    }).done(function(posts) {
        homePosts = posts;
        console.log("homeOnLoad started");
        console.log(posts);
        console.log(posts[3].info[2].permalink);
        for(var i = 0; i < posts.length; i++){
            var div = document.createElement('div');
            div.id = 'posts';
            if ( posts[i].info[0].type == 'Submission'){
                div.innerHTML = '<input type="checkbox" name="selection" value="selected" class="selection">' +
                                '<a href="' + posts[i].info[3].titleLink + '"><h3 class="inline">'
                                + posts[i].info[1].mainText + '</h3></a>' +
                                '<p>' + posts[i].info[0].type + '</p>' +
                                '<a href="' + posts[i].info[2].permalink + '">Comments</a>' +
                                '<a href="#">unsave</a>' ;
            } else {
                div.innerHTML = '<input type="checkbox" name="selection" value="selected" class="selection">' +
                                '<h4 class="inline">' + posts[i].info[1].mainText + '</h4>' +
                                '<p>' + posts[i].info[0].type + '</p>' +
                                '<a href="' + posts[i].info[2].permalink + '">permalink</a>' +
                                '<a href="#">unsave</a>';
            }
            $("#javascriptposts").hide().append(div).fadeIn(350);
        }
        console.log("homeOnLoad finished");
    });
}

function loadGroups() {
    console.log(homePosts);
    $.get('/groups?name=timing', {
    }).done(function(groups) {  //Returns empty array
        /*console.log('get /groups done');
        console.log(groups);
        for (var i = 0; i < groups.length; i++) {
            var div = document.createElement('div');
            div.class = 'group';
            div.innerHTML = '<p>' + groups[i].name + '</p>';
            console.log(div);
            $('#groupSection').append(div);
        }
        */
    });
}

window.onload = function() {
    homeOnLoad();
    loadGroups();
};

function changeGroup(allPostsID) {
    $(allPostsID).empty();

}

function change(sourceId, btnId) {
    $(btnId).hide();
    $.get('/change', {
    }).done(function(changed) {
        $(sourceId).text(changed['text'])
    }).fail(function() {
        $(btnid).show();
    });
}

function clear(postsId) {
    $(postsId).empty();
    $.get('/clear', {
    }).done(function(changed) {
        for(var i = 0; i < changed.length; i++){
            var div = document.createElement('div');
            div.id = 'posts';
            div.innerHTML = '<p>' + changed[i].text + '</p>';
            $("#javascriptposts").append(div).hide().fadeIn(100);
        }
    }).fail(function() {
        $(postsId).show();
    });
}
