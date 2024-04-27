url = window.location.pathname;
login_state = false;

$(document).ready(function() {
    if (url == "/") {
        $("title").append(" - 广场");
        $("#specific_js").attr("src", "../static/js/mainpage.js");
    } else if (url == "/login") {
        $("title").append(" - 登录");
        $("#specific_js").attr("src", "../static/js/loginpage.js");
    }
    // ...

    if (login_state) {
        $("#login").hide();
        $("#login_nav").show();
    } else {
        $("#login_nav").hide();
        $("#login").show();
    }
});