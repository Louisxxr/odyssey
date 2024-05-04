$(document).ready(function() {
    $("main").append(`
    <div>
        <div>
            <span><img id="editquestionpage_head" height="60" width="60"></span>
            <span><textarea id="editquestionpage_title" placeholder="简要地概括问题" style="resize:none"></textarea></span>
        </div>
        <div>
            <textarea id="editquestionpage_description" placeholder="输入问题背景、条件等详细信息（选填）" style="resize:none"></textarea>
        </div>
        <div>
            <span><button id="editquestionpage_release_button">发布</button></span>
            <span id="editquestionpage_release_errormsg"></span>
        </div>
    </div>
    `);

    $.ajax({
        url: "/service/userinfo",
        type: "get",
        success: function(resp) {
            $("#editquestionpage_head").attr("src", resp.head);
        }
    });

    $("#editquestionpage_release_button").click(function() {
        let title = $("#editquestionpage_title").val();
        let description = $("#editquestionpage_description").val();
        if (title === "") {
            $("#editquestionpage_release_errormsg").empty();
            $("#editquestionpage_release_errormsg").append("问题不能为空");
        } else if (title.length > 100) {
            $("#editquestionpage_release_errormsg").empty();
            $("#editquestionpage_release_errormsg").append("问题过长");
        } else if (description.length > 500) {
            $("#editquestionpage_release_errormsg").empty();
            $("#editquestionpage_release_errormsg").append("问题描述过长");
        } else {
            $.ajax({
                url: "/edit_question",
                type: "post",
                data: {
                    "title": title,
                    "description": description
                },
                success: function(resp) {
                    if (resp === "0") {
                        $("#editquestionpage_release_errormsg").empty();
                        $("#editquestionpage_release_errormsg").append("请稍后再试");
                    } else {
                        $("#editquestionpage_release_errormsg").empty();
                        $("#editquestionpage_release_errormsg").append("发布成功");
                        location.assign("/question/" + resp);
                    }
                },
                error: function(resp) {
                    $("#editquestionpage_release_errormsg").empty();
                    $("#editquestionpage_release_errormsg").append("请稍后再试");
                }
            });
        }
    });
});