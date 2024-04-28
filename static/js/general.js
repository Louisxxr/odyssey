var url = window.location.pathname;
var login_state = false;

$(document).ready(function() {
    if (url === "/") {
        $("title").append(" - 广场");
        $("#specific_js").attr("src", "../static/js/mainpage.js");
    } else if (url === "/login") {
        $("title").append(" - 登录");
        $("#specific_js").attr("src", "../static/js/loginpage.js");
    } else if (url === "/register") {
        $("title").append(" - 注册");
        $("#specific_js").attr("src", "../static/js/registerpage.js");
    }

    $("#login").hide();
    $("#login_nav").hide();

    $.ajax({
        url: "/service/loginstate",
        type: "get",
        success: function(resp) {
            if (resp === "1") {
                login_state = true;
            }
            if (login_state) {
                $("#login_nav").show();
            } else {
                $("#login").show();
            }
        }
    });

    $("#logout").click(function() {
        $.ajax({
            url: "/service/logout",
            type: "get",
            success: function() {
                location.reload();
            }
        });
    });
});