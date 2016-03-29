window.onload = function() {
    loadGroups();
};

//Display groups in sidebar/dropdown
function loadGroups() {
    $.ajax({
        method: "GET",
        url: "/groups/",
        dataType: "json"
    }).done(function( groups ) {
        displayGroups(groups);
        displayDropdownMenu(groups);
        for (var group of groups) {
            console.log("Group: " + JSON.stringify(group.fields));
        }
    });
}

//Display groups in sidebar
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
                    <p id='" + group_name + "'><a class='group'>" + group_name + "</a></p> \
                </li>";
        }
        result +=
            "<li id='addGroup'> \
                <p><a class='AddGroup'>+ Add Group</a></p> \
            </li>";

        return result;
    });
}

//Display groups in dropdown menu
function displayDropdownMenu(groups) {
    $(".dropdown-content").html(function() {
        var resultHTML = "";

        for (var group of groups) {
            group_name = group.fields.groupname;
            resultHTML +=
                '<a class="addTo">' + group_name + '</a>';
        }
        return resultHTML;
    });
}

$(document).ready(function() {

    //Group Clicked
    $(document.body).on("click", ".group", function (data) {

        console.log(data.toElement.innerText);
        $.ajax({
            method: "GET",
            url: "/group/?group_name=" + data.toElement.innerText,
            datatype: "json",
            success: function(data) {
                clearPosts();
                displayPosts(data[0].fields.posts.data);
                console.log("data: " + JSON.stringify(data[0].fields.posts.data));
            },
            error: function(data) {
                console.log(data);
                alert("nooooooooooooo");
            },
        });
    });

    //Add a new group
    $(document.body).on("click", ".AddGroup", function (data) {
        if ($("#newGroup").length == 0) {
            $("#addGroup").before(
                '<li id="newGroup"> \
                    <form> \
                        <input type="text" name="group_name" placeholder="Group Name"> \
                    </form> \
                </li>'
            );
        } else {
            $("#newGroup").append(
                '<p style="color: red;">Enter a new group name.</p>'
            );
        }
    });

    //Group name specified
    $(document.body).on("submit", "form", function(data) {
        var group_name = $("input:first").val();
        $.ajax({
            method: "GET",
            url: "/group/add/?group_name=" + group_name,
            datatype: "json",
            error: function(data) {
                alert("Error: Could not add group.");
                return false;
            }
        });

        $("#newGroup").replaceWith(
            "<li> \
                <p id='" + group_name + "'> \
                    <a class='group'>" + group_name + "</a> \
                </p> \
            </li>"
        );

        $(".dropdown-content").append(
            "<a class='addTo'>" + group_name + "</a>"
        );
        return false;
    });

    //Adding checked posts to a group
    $(document.body).on("click", ".addTo", function (data) {

        var posts = getChecked();

        $.ajax({
            method: "POST",
            url: "/posts/add/",
            data: JSON.stringify(
                {"group_name": data.toElement.innerText, "posts": posts}
            ),
            datatype: "json",
            success: function(msg) {
                console.log(msg);
            }
        });

        for(var post of posts) {
            console.log(JSON.stringify(post));
        }
    });
});

//Display posts in the group
function displayPosts(posts) {
    var postsHTML = "";

    for (var post of posts) {
        if(post.body) {
            postsHTML += constructComment(post);
            console.log("%cBody Exits", 'background:  yellow;');
        } else {
            postsHTML += constructSubmission(post);
        }
    }
    $(".posts-container").html(postsHTML);
}

//Create comment in HTML
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

//Create submission in HTML
function constructSubmission(submission) {

    var resultHTML =
    '<input type="checkbox" name="selection" value="selected" class="selection"> \
        <h3 class="inline"><a href="' + submission.url +'">' + submission.title +'</a></h3> \
        <div class="post-options"> \
            <a href="' + submission.post_link + '">Comments</a> \
            <a href="">Unsave</a> \
            <span>' + submission.name + '</span> \
        </div> \
        <hr>';

    return resultHTML;
}

//Get checked posts as JSON
function getChecked() {
    var posts = [];

    $('input:checked').each(function() {
        var result, post_link, title, body, unsaveURL, name;

        if ($(this).next().is("h3")) {    //Submission
            console.log($(this).next().text());

            title = $(this).next().text();
            $(this).next().next().children().each(function() {
                if ($(this).text() == "Comments") {
                    post_link = $(this).attr("href");
                } else if ($(this).text() == "Unsave") {
                    unsaveURL = $(this).attr("href");
                } else {
                    name = $(this).text();
                }
            });
            result = {
                "post_link": post_link,
                "title": title,
                "unsaveURL": unsaveURL,
                "name": name
            };
            posts.push(result);
        } else {    //Comment
            body = $(this).next().text();
            $(this).next().next().children().each(function() {
                if ($(this).text() == "Comments") {
                    post_link = $(this).attr("href");
                } else if ($(this).text() != "Unsave") {
                    name = $(this).text();
                }
            });
            result = {
                "post_link": post_link,
                "body": body,
                "name": name
            };
            posts.push(result);
        }
    });
    return posts;
}

//Clear all posts
function clearPosts() {
    $(".posts-container").html("");
}
