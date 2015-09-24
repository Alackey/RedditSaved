//Loads the homepage posts on page load
function homeOnLoad(){
    $.get('/savedposts', {
    }).done(function(posts) {
        for(var i = 0; i < posts.length; i++){
            var div = document.createElement('div');
            div.id = 'posts';
            if ( posts[i].info[0].type == 'Submission'){
                div.innerHTML = '<a href="' + posts[i].info[3].titleLink + '"><h3>'
                                + posts[i].info[1].mainText + '</h3></a>' +
                                '<p>' + posts[i].info[0].type + '</p>' +
                                '<a href="' + posts[i].info[2].permalink + '">Comments</a>' +
                                '<a href="#">unsave</a>' ;
            } else {
                div.innerHTML = '<h4>' + posts[i].info[1].mainText + '</h4>' +
                                '<p>' + posts[i].info[0].type + '</p>' +
                                '<a href="' + posts[i].info[2].permalink + '">permalink</a>' +
                                '<a href="#">unsave</a>';
            }
            $("#javascriptposts").hide().append(div).fadeIn(350);
        }
    });
}
window.onload = homeOnLoad;

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
