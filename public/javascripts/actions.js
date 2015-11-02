//Loads the homepage posts on page load
var homePosts;
function homeOnLoad(){
    $.get('/savedposts', {
    }).done(function(posts) {
        homePosts = posts;
        for(var i = 0; i < posts.length; i++){
            var div = document.createElement('div');
            div.id = 'posts';
            if ( posts[i].info[0].type == 'Submission'){
                div.innerHTML = '<input type="checkbox" name="selection" value="selected" class="selection">' +
                                '<h3 class="inline"><a href="' + posts[i].info[3].titleLink + '">'
                                + posts[i].info[1].mainText + '</a></h3><hr class="line">' +
                                '<a href="' + posts[i].info[2].permalink + '">Comments</a>' +
                                '<a  class="unsave">Unsave</a>' +
                                '<span class="fullname">' + posts[i].info[4].fullname + '</span>';
            } else {
                div.innerHTML = '<input type="checkbox" name="selection" value="selected" class="selection">' +
                                '<h4 class="inline">' + posts[i].info[1].mainText + '</h4><hr class="line">' +
                                '<a href="' + posts[i].info[2].permalink + '">Permalink</a>' +
                                '<a class="unsave">Unsave</a>' +
                                '<span class="fullname">' + posts[i].info[3].fullname + '</span>';
            }
            $("#javascriptposts").hide().append(div).fadeIn(350);
        }
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
    }).done(function(data) {

    });

    /*$.get('/clear', {
    }).done(function(changed) {
        for(var i = 0; i < changed.length; i++){
            var div = document.createElement('div');
            div.id = 'posts';
            div.innerHTML = '<p>' + changed[i].text + '</p>';
            $("#javascriptposts").append(div).hide().fadeIn(100);
        }
    }).fail(function() {
        $(postsId).show();
    });*/
}

function unsave(id) {
    $.get('/unsave', { fullname: id}
    ).done(function(data){
        console.log(data);
    });
}
