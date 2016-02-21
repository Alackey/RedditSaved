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
            "<li class='sidebar-brand'>\
                <a href='#'>Reddit Saved</a>\
            </li>\
            <li>\
                <p class='group' id='Home'><a href=''>Home</a></p>\
            </li>";
        for (var group of groups) {
            group_name = group.fields.groupname;
            result += 
                "<li>\
                    <p class='group' id='" + group_name + "'><a href=''>" + group_name + "</a></p>\
                </li>";
        }
        result += 
            "<li>\
                <p class='group' id='AddGroup'><a href=''>+ Add Group</a></p>\
            </li>";
        console.log(result);
        return result;
    });
}