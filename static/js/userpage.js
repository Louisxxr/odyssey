var url = window.location.pathname.split("/");
var userid = url[url.length - 1];
var login_state = false;

$(document).ready(function() {
    $.ajax({
        async: false,
        url: "/service/loginstate",
        type: "get",
        success: function(resp) {
            if (resp !== "0") {
                login_state = true;
            }
        }
    });

    $("main").append(`
    <style>
        main a {
            text-decoration: none;
            color: #002fa7;
        }

        main hr {
            border: 0;
            height: 1px;
            background: #ddd;
        }

        #userpage_container {
            display: flex;
            align-items: center;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 10px;
            background-color: #fff;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        #userpage_head {
            border-radius: 5%;
            border: 1px solid #ccc;
            margin-right: 20px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            transition: transform 0.3s ease;
        }

        #userpage_head:hover {
            transform: scale(1.05);
        }

        #userpage_info {
            display: flex;
            flex-direction: column;
        }

        #userpage_info > div {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
        }

        #userpage_sex {
            margin-right: 10px;
            color: #002fa7;
            font-weight: bold;
        }

        #userpage_username {
            font-size: 20px;
            font-weight: bold;
            color: #002fa7;
        }

        #userpage_signature {
            font-style: italic;
            color: #666;
        }
    </style>
    <div id="userpage_container">
        <img id="userpage_head" height="100" width="100">
        <div id="userpage_info">
            <div>
                <span id="userpage_sex"></span>
                &nbsp
                <span id="userpage_username"></span>
            </div>
            <div id="userpage_signature"></div>
        </div>
        <button id="follow_user_button" style="margin-left: auto; width: 100px;">关注</button>
    </div>
    <div id="userpage_otherinfo" style="font-size: 14px;">
    </div>
    <div>
        <span id="otherinfo_button" style="cursor: pointer; color: #666;">﹀ 查看详细资料</span>
    </div>
    <script>
        $(document).ready(function() {
            $("#userpage_otherinfo").hide();
            $("#otherinfo_button").click(function() {
                if ($("#userpage_otherinfo").is(":visible")) {
                    $("#userpage_otherinfo").slideUp();
                    $("#otherinfo_button").empty();
                    $("#otherinfo_button").append("﹀ 查看详细资料");
                } else {
                    $("#userpage_otherinfo").slideDown();
                    $("#otherinfo_button").empty();
                    $("#otherinfo_button").append("︿ 收起详细资料");
                }
            });
        })
    </script>
    `);

    $.ajax({
        async: false,
        url: "/service/userinfo",
        type: "get",
        data: { "userid": userid },
        success: function(resp) {
            $("title").prepend(resp.username + " 的主页 - ");
            $("#userpage_head").attr("src", resp.head);
            $("#userpage_username").append(resp.username);
            if (resp.sex !== null) {
                if (resp.sex === "M") {
                    $("#userpage_sex").append('<img src="/static/img/male.svg" height="20" width="20">');
                } else {
                    $("#userpage_sex").append('<img src="/static/img/female.svg" height="20" width="20">');
                }
            }
            $("#userpage_signature").append(resp.signature);
            if (resp.birthday !== "") {
                $("#userpage_otherinfo").append(`<div>生日：${resp.birthday}</div>`);
            }
            if (resp.city !== "") {
                $("#userpage_otherinfo").append(`<div>常居地：${resp.city}</div>`);
            }
            if (resp.job !== "") {
                $("#userpage_otherinfo").append(`<div>职业：${resp.job}</div>`);
            }
            if ($("#userpage_otherinfo").text().trim().length === 0) {
                $("#userpage_otherinfo").append(`<div>保密</div>`);
            }
        }
    });

    if (login_state) {
        $.ajax({
            async: false,
            url: "/service/checkfollowuser",
            type: "get",
            data: { "followee_userid": userid },
            success: function(resp) {
                if (resp === "1") {
                    $("#follow_user_button").css("background-color", "#888");
                    $("#follow_user_button").empty();
                    $("#follow_user_button").append("已关注");
                }
            }
        });
    }

    $("#follow_user_button").click(function() {
        if (!login_state) {
            alert("您还未登录哦~");
        } else {
            $.ajax({
                url: "/service/checkfollowuser",
                type: "get",
                data: { "followee_userid": userid },
                success: function(resp) {
                    if (resp === "1") {
                        $.ajax({
                            url: "/service/unfollowuser",
                            type: "get",
                            data: { "followee_userid": userid },
                            success: function() {
                                $("#follow_user_button").css("background-color", "#002fa7");
                                $("#follow_user_button").empty();
                                $("#follow_user_button").append("关注");
                            },
                            error: function() {
                                alert("请稍后再试~");
                            }
                        });
                    } else {
                        $.ajax({
                            url: "/service/followuser",
                            type: "get",
                            data: { "followee_userid": userid },
                            success: function() {
                                $("#follow_user_button").css("background-color", "#888");
                                $("#follow_user_button").empty();
                                $("#follow_user_button").append("已关注");
                            },
                            error: function() {
                                alert("请稍后再试~");
                            }
                        });
                    }
                }
            });
        }
    });
});