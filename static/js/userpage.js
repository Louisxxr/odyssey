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
    <div style="height: 50px;">
        <div id="question_button" style="cursor:pointer; display: inline-block; font-size: 20px; height: 40px; width: 100px; text-align: center; line-height: 40px;">提问</div>
        <div id="answer_button" style="cursor:pointer; display: inline-block; font-size: 20px; height: 40px; width: 100px; text-align: center; line-height: 40px;">回答</div>
        <div id="article_button" style="cursor:pointer; display: inline-block; font-size: 20px; height: 40px; width: 100px; text-align: center; line-height: 40px;">文章</div>
    </div>
    <div id="question_block">
        问题...
    </div>
    <div id="answer_block">
        回答...
    </div>
    <div id="article_block">
        文章...
    </div>
    <script>
        $(document).ready(function() {
            $("#question_button").css("background-color", "#002fa7");
            $("#question_button").css("color", "white");
            $("#answer_block").hide();
            $("#article_block").hide();
        });
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

    $.ajax({
        url: "/service/userinfo",
        type: "get",
        success: function(resp) {
            $("#homepage_head").attr("src", resp.head);
            $("#homepage_username").append(resp.username);
            if (resp.sex !== null) {
                if (resp.sex === "M") {
                    $("#homepage_sex").append('<img src="/static/img/male.svg" height="20" width="20">');
                } else {
                    $("#homepage_sex").append('<img src="/static/img/female.svg" height="20" width="20">');
                }
            }
            $("#homepage_signature").append(resp.signature);
            if (resp.birthday !== "") {
                $("#homepage_otherinfo").append(`<div>生日：${resp.birthday}</div>`);
            }
            if (resp.city !== "") {
                $("#homepage_otherinfo").append(`<div>常居地：${resp.city}</div>`);
            }
            if (resp.job !== "") {
                $("#homepage_otherinfo").append(`<div>职业：${resp.job}</div>`);
            }
            if ($("#homepage_otherinfo").text().trim().length === 0) {
                $("#homepage_otherinfo").append(`<div>可以在“编辑个人资料”中完善哦</div>`);
            }
        }
    });

    $.ajax({
        async: false, // 重要
        url: "/service/userasset/question",
        type: "get",
        success: function(resp) {
            if (resp === "") {
                $("#question_block").empty();
                $("#question_block").append("Ta 还没有提问过哦");
            } else {
                magic_split_flag = resp.slice(0, 4);
                resp = resp.slice(4, resp.length);
                resp = resp.split(magic_split_flag);
                $("#question_block").empty();
                for (let i = 0; i < resp.length; i += 5) {
                    // questionid - title - issue_time - views - answer_num
                    let questionid = resp[i];
                    let title = resp[i + 1];
                    let issue_time = resp[i + 2];
                    let views = resp[i + 3];
                    let answer_num = resp[i + 4];
                    $("#question_block").append(`
                    <div>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="margin-right: auto;"><a href="/question/${questionid}">${title}</a></span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="margin-right: auto;">${issue_time}</span>
                            <div style="margin-left: auto;">
                                <span>共 ${answer_num} 条回答</span>
                                <span><img src="/static/img/view.svg" alt="浏览量" height="15" width="15"></span>
                                <span>${views}</span>
                            </div>
                        </div>
                    </div>
                    <hr>
                    `);
                }
            }
        }
    });

    $.ajax({
        async: false,
        url: "/service/userasset/answer",
        type: "get",
        success: function(resp) {
            if (resp === "") {
                $("#answer_block").empty();
                $("#answer_block").append("Ta 还没有回答过问题哦");
            } else {
                magic_split_flag = resp.slice(0, 4);
                resp = resp.slice(4, resp.length);
                resp = resp.split(magic_split_flag);
                $("#answer_block").empty();
                for (let i = 0; i < resp.length; i += 6) {
                    // answerid - questionid - question_title - content - update_time - like_num
                    let answerid = resp[i];
                    let questionid = resp[i + 1];
                    let question_title = resp[i + 2];
                    let content = resp[i + 3];
                    let update_time = resp[i + 4];
                    let like_num = resp[i + 5];
                    $("#answer_block").append(`
                    <div>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="margin-right: auto;"><a href="/question/${questionid}#answer_${answerid}_to_the_question">${question_title}</a></span>
                        </div>
                        <div>
                            ${content}
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="margin-right: auto;">更新于 ${update_time}</span>
                            <div style="margin-left: auto;">
                                <span><img src="/static/img/like.svg" alt="点赞" height="15" width="15"></span>
                                <span>${like_num}</span>
                            </div>
                        </div>
                    </div>
                    <hr>
                    `);
                }
            }
        }
    });

    $.ajax({
        async: false,
        url: "/service/userasset/article",
        type: "get",
        success: function(resp) {
            if (resp === "") {
                $("#article_block").empty();
                $("#article_block").append("Ta 还没有写过文章哦");
            } else {
                magic_split_flag = resp.slice(0, 4);
                resp = resp.slice(4, resp.length);
                resp = resp.split(magic_split_flag);
                $("#article_block").empty();
                for (let i = 0; i < resp.length; i += 5) {
                    // articleid - title - update_time - views - like_num
                    let articleid = resp[i];
                    let title = resp[i + 1];
                    let update_time = resp[i + 2];
                    let views = resp[i + 3];
                    let like_num = resp[i + 4];
                    $("#article_block").append(`
                    <div>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="margin-right: auto;"><a href="/article/${articleid}">${title}</a></span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="margin-right: auto;">更新于 ${update_time}</span>
                            <div style="margin-left: auto;">
                                <span><img src="/static/img/like.svg" alt="点赞" height="15" width="15"></span>
                                <span>${like_num}</span>
                                <span><img src="/static/img/view.svg" alt="浏览量" height="15" width="15"></span>
                                <span>${views}</span>
                            </div>
                        </div>
                    </div>
                    <hr>
                    `);
                }
            }
        }
    });

    $("#question_button").click(function() {
        $("#question_button").css("background-color", "#002fa7");
        $("#question_button").css("color", "white");
        $("#answer_button").css("background-color", "white");
        $("#answer_button").css("color", "black");
        $("#article_button").css("background-color", "white");
        $("#article_button").css("color", "black");
        $("#question_block").show();
        $("#answer_block").hide();
        $("#article_block").hide();
    });

    $("#answer_button").click(function() {
        $("#answer_button").css("background-color", "#002fa7");
        $("#answer_button").css("color", "white");
        $("#question_button").css("background-color", "white");
        $("#question_button").css("color", "black");
        $("#article_button").css("background-color", "white");
        $("#article_button").css("color", "black");
        $("#answer_block").show();
        $("#question_block").hide();
        $("#article_block").hide();
    });

    $("#article_button").click(function() {
        $("#article_button").css("background-color", "#002fa7");
        $("#article_button").css("color", "white");
        $("#question_button").css("background-color", "white");
        $("#question_button").css("color", "black");
        $("#answer_button").css("background-color", "white");
        $("#answer_button").css("color", "black");
        $("#article_block").show();
        $("#question_block").hide();
        $("#answer_block").hide();
    });
});