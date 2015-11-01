function signInButton() {
    $.get('/authURL', {
    }).done(function(signInLink) {
        $('.signInButton').html(signInLink);
    });
}

window.onload = function() {
    signInButton();
};
