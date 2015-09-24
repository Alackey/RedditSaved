//Loads the homepage posts on page load
function homeOnLoad(){
    $.get('/savedposts', {
    }).done(function(posts) {
        for(var i = 0; i < posts.length; i++){
            var div = document.createElement('div');
            div.id = 'posts';
            div.innerHTML = '<p>' + posts[i].text + '</p>';
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
