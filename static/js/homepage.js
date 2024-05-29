$(document).ready(function() {
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

        #homepage_container {
            display: flex;
            align-items: center;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 10px;
            background-color: #fff;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        #homepage_head {
            border-radius: 5%;
            border: 1px solid #ccc;
            margin-right: 20px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            transition: transform 0.3s ease;
        }

        #homepage_head:hover {
            transform: scale(1.1);
        }

        #homepage_info {
            display: flex;
            flex-direction: column;
        }

        #homepage_info > div {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
        }

        #homepage_sex {
            margin-right: 10px;
            color: #002fa7;
            font-weight: bold;
        }

        #homepage_username {
            font-size: 20px;
            font-weight: bold;
            color: #002fa7;
        }

        #homepage_signature {
            font-style: italic;
            color: #666;
        }
    </style>
    <div id="homepage_container">
        <a href="/update_userinfo"><img id="homepage_head" height="100" width="100"></a>
        <div id="homepage_info">
            <div>
                <span id="homepage_sex"></span>
                &nbsp
                <span id="homepage_username"></span>
            </div>
            <div id="homepage_signature"></div>
        </div>
        <a href="/user_following_me" style="margin-left: auto; color: pink; font-size: 18px;"><strong>粉丝数</strong>  <span id="homepage_fans_num"></span></a>
    </div>
    <div id="homepage_otherinfo" style="font-size: 14px;">
    </div>
    <div style="display: flex; justify-content: space-between; align-items: center;">
        <span id="otherinfo_button" style="cursor: pointer; color: #666; margin-right: auto;">﹀ 查看详细资料</span>
        <a href="/update_userinfo" style="margin-left: auto;">编辑个人资料</a>
    </div>
    <script>
        $(document).ready(function() {
            $("#homepage_otherinfo").hide();
            $("#otherinfo_button").click(function() {
                if ($("#homepage_otherinfo").is(":visible")) {
                    $("#homepage_otherinfo").slideUp();
                    $("#otherinfo_button").empty();
                    $("#otherinfo_button").append("﹀ 查看详细资料");
                } else {
                    $("#homepage_otherinfo").slideDown();
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
            $("#homepage_fans_num").append(resp.fans_num);
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
                $("#question_block").append("快去提问吧");
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
                            <span style="margin-left: auto;"><img id="delete_question_${questionid}" style="cursor:pointer;" src="/static/img/trash.svg" alt="删除" height="15" width="15"></span>
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

    $("[id^='delete_question_']").click(function() {
        questionid = $(this).context.id.split("_")[2];
        $.ajax({
            url: "/service/delete/question",
            type: "get",
            data: { "questionid": questionid },
            success: function() {
                location.reload();
            },
            error: function() {
                alert("删除失败，请稍后再试~");
            }
        });
    });

    $.ajax({
        async: false,
        url: "/service/userasset/answer",
        type: "get",
        success: function(resp) {
            if (resp === "") {
                $("#answer_block").empty();
                $("#answer_block").append("快去回答问题吧");
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
                            <span style="margin-left: auto;"><img id="delete_answer_${answerid}" style="cursor:pointer;" src="/static/img/trash.svg" alt="删除" height="15" width="15"></span>
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

    $("[id^='delete_answer_']").click(function() {
        answerid = $(this).context.id.split("_")[2];
        $.ajax({
            url: "/service/delete/answer",
            type: "get",
            data: { "answerid": answerid },
            success: function() {
                location.reload();
            },
            error: function() {
                alert("删除失败，请稍后再试~");
            }
        });
    });

    $.ajax({
        async: false,
        url: "/service/userasset/article",
        type: "get",
        success: function(resp) {
            if (resp === "") {
                $("#article_block").empty();
                $("#article_block").append("快去写文章吧");
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
                            <span style="margin-left: auto;"><img id="delete_article_${articleid}" style="cursor:pointer;" src="/static/img/trash.svg" alt="删除" height="15" width="15"></span>
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

    $("[id^='delete_article_']").click(function() {
        articleid = $(this).context.id.split("_")[2];
        $.ajax({
            url: "/service/delete/article",
            type: "get",
            data: { "articleid": articleid },
            success: function() {
                location.reload();
            },
            error: function() {
                alert("删除失败，请稍后再试~");
            }
        });
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