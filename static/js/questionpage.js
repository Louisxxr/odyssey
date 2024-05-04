var url = window.location.pathname.split("/");
var questionid = url[url.length - 1]
var question_info = new Array();
var login_state = false;

$(document).ready(function() {
    $.ajax({
        async: false,
        url: "/service/questioninfo",
        type: "get",
        data: { "questionid": questionid },
        success: function(resp) {
            question_info["userid"] = resp.userid,
            question_info["username"] = resp.username,
            question_info["head"] = resp.head,
            question_info["title"] = resp.title,
            question_info["description"] = resp.description,
            question_info["issue_time"] = resp.issue_time,
            question_info["views"] = resp.views,
            question_info["follow_num"] = resp.follow_num,
            question_info["answer_num"] = resp.answer_num
        }
    });

    $("title").prepend(question_info["title"] + " - ");

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
    `);
});