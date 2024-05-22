$(document).ready(function() {
    $("main").append(`
    <div>
        <img id="homepage_head" height="100" width="100" style="border-radius: 5%;">
    </div>
    <div>
        <span id="homepage_sex"></span>
        <span id="homepage_username"></span>
    </div>
    <div id="homepage_signature"></div>
    <div>
        <a href="/update_userinfo">编辑个人资料</a>
    </div>
    <hr>
    <div>
        <span id="moment_button" style="cursor:pointer;">动态</span>
        <span id="question_button" style="cursor:pointer;">提问</span>
        <span id="answer_button" style="cursor:pointer;">回答</span>
        <span id="article_button" style="cursor:pointer;">文章</span>
    </div>
    <div id="moment_block">
        动态...
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
            $("#moment_button").css("background-color", "grey");
            $("#question_block").hide();
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
        }
    });

    $.ajax({
        async: false, // 重要
        url: "/service/userasset/question",
        type: "get",
        success: function(resp) {
            magic_split_flag = resp.slice(0, 4);
            resp = resp.slice(4, resp.length);
            resp = resp.split(magic_split_flag);
            $("#question_block").empty();
            for (let i = 0; i < resp.length; i += 4) {
                // questionid - title - issue_time - views
                let questionid = resp[i];
                let title = resp[i + 1];
                let issue_time = resp[i + 2];
                let views = resp[i + 3];
                $("#question_block").append(`
                <div>
                    <div>
                        <span><a href="/question/${questionid}">${title}</a></span>
                        <span><img id="delete_question_${questionid}" style="cursor:pointer;" src="/static/img/trash.svg" alt="删除" height="15" width="15"></span>
                    </div>
                    <div>
                        <span>${issue_time}</span>
                        <span><img src="/static/img/view.svg" alt="浏览量" height="15" width="15"></span>
                        <span>${views}</span>
                    </div>
                </div>
                `);
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

    $("#moment_button").click(function() {
        $("#moment_button").css("background-color", "grey");
        $("#question_button").css("background-color", "white");
        $("#answer_button").css("background-color", "white");
        $("#article_button").css("background-color", "white");
        $("#moment_block").show();
        $("#question_block").hide();
        $("#answer_block").hide();
        $("#article_block").hide();
    });

    $("#question_button").click(function() {
        $("#question_button").css("background-color", "grey");
        $("#moment_button").css("background-color", "white");
        $("#answer_button").css("background-color", "white");
        $("#article_button").css("background-color", "white");
        $("#question_block").show();
        $("#moment_block").hide();
        $("#answer_block").hide();
        $("#article_block").hide();
    });

    $("#answer_button").click(function() {
        $("#answer_button").css("background-color", "grey");
        $("#moment_button").css("background-color", "white");
        $("#question_button").css("background-color", "white");
        $("#article_button").css("background-color", "white");
        $("#answer_block").show();
        $("#moment_block").hide();
        $("#question_block").hide();
        $("#article_block").hide();
    });

    $("#article_button").click(function() {
        $("#article_button").css("background-color", "grey");
        $("#moment_button").css("background-color", "white");
        $("#question_button").css("background-color", "white");
        $("#answer_button").css("background-color", "white");
        $("#article_block").show();
        $("#moment_block").hide();
        $("#question_block").hide();
        $("#answer_block").hide();
    });
});