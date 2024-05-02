var url = window.location.pathname;
var login_state = false;

$(document).ready(function() {
    if (url === "/") {
        $("title").prepend("广场 - ");
        $("#specific_js").attr("src", "../static/js/mainpage.js");
    } else if (url === "/login") {
        $("title").prepend("登录 - ");
        $("#specific_js").attr("src", "../static/js/loginpage.js");
    } else if (url === "/register") {
        $("title").prepend("注册 - ");
        $("#specific_js").attr("src", "../static/js/registerpage.js");
    } else if (url === "/reset_password") {
        $("title").prepend("忘记密码 - ");
        $("#specific_js").attr("src", "../static/js/resetpasswordpage.js");
    } else if (url === "/homepage") {
        $("title").prepend(" 的主页 - ");
        $("#specific_js").attr("src", "../static/js/homepage.js");
    } else if (url === "/update_userinfo") {
        $("title").prepend(" 的主页 - ");
        $("#specific_js").attr("src", "../static/js/updateuserinfopage.js");
    }

    $("#login").hide();
    $("#login_nav").hide();

    $.ajax({
        url: "/service/loginstate",
        type: "get",
        success: function(resp) {
            if (resp !== "0") {
                login_state = true;
            }
            if (login_state) {
                if (url === "/homepage" || url === "/update_userinfo") {
                    $("title").prepend(resp.username);
                }
                $("#head_to_be_stuck_up").attr("src", resp.head);
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