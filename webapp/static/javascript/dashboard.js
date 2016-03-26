window.onload = function() {
    loadGroups();

};

function loadGroups() {
    $.ajax({
        method: "GET",
        url: "/groups/",
        dataType: "json"
    }).done(function( groups ) {
        displayGroups(groups);
        for ( var group of groups) {
            console.log("Group: " + JSON.stringify(group.fields));
        }
        console.log("groups loaded");
    });
}

function displayGroups(groups) {
    $(".sidebar-nav").html(function() {
        var result =
            "<li class='sidebar-brand'> \
                <a href='#'>Reddit Saved</a> \
            </li> \
            <li> \
                <p class='group' id='Home'><a href=''>Home</a></p> \
            </li>";
        for (var group of groups) {
            group_name = group.fields.groupname;
            result +=
                "<li> \
                    <p  id='" + group_name + "'><a class='group' >" + group_name + "</a></p> \
                </li>";
        }
        result +=
            "<li> \
                <p id='AddGroup'><a class='group' href=''>+ Add Group</a></p> \
            </li>";
        console.log(result);
        return result;
    });


}
$(document).ready(function() {

    $(document.body).on("click", ".group", function (data) {
        alert("Group clicked");
        console.log(data.toElement.innerText);
        $.ajax({
            method: "GET",
            url: "/group/" + data.toElement.innerText + "/",
            datatype: "json",
            success: function(data) {
                clearPosts();
                displayPosts(data[0].fields.posts.data);
                console.log("data: " + JSON.stringify(data[0].fields.posts.data));
                alert("done");
            },
            error: function(data) {
                console.log(data);
                alert("nooooooooooooo");
            },
        });
        // $.get("/group/" + data.toElement.innerText + "/",
        // function(data,status) {
        //     alert("done");
        // });
    });
});

function displayPosts(posts) {
    var postsHTML = "";

    for (var post of posts) {
        console.log(post);

        if(post.body) {
            postsHTML += constructComment(post);
            console.log("%cBody Exits", 'background:  yellow;');
        } else {
            postsHTML += constructSubmission(post);
        }
    }

    $(".posts-container").html(postsHTML);
}

function constructComment(comment) {

    var resultHTML =
        '<input type="checkbox" name="selection" value="selected" class="selection"> \
        <h4 class="inline">' + comment.body + '</h4> \
        <div class="post-options"> \
            <a href="' + comment.post_link + '">Comments</a> \
            <a href="/unsave/?postLink=' + comment.post_link + '&type=comment">Unsave</a> \
            <span>' + comment.name + '</span> \
        </div> \
        <hr>';

    return resultHTML;
}

function constructSubmission(submission) {

    var resultHTML =
    '<input type="checkbox" name="selection" value="selected" class="selection"> \
        <h3 class="inline"><a href="' + submission.url +'">' + submission.title +'</a></h3> \
        <div class="post-options"> \
            <a href="' + submission.post_link + '">Comments</a> \
            <a href="">Unsave</a> \
            <span>t3_4blhxt</span> \
        </div> \
        <hr>';

    return resultHTML;
}

function clearPosts() {
    $(".posts-container").html("");
}
