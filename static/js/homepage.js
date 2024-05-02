$(document).ready(function() {
    $("main").append(`
    <div>
        <img id="homepage_head" height="100" width="100">
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
        <span>动态</span>
        <span>提问</span>
        <span>回答</span>
        <span>文章</span>
    </div>
    `);

    $.ajax({
        url: "/service/userinfo",
        type: "get",
        success: function(resp) {
            $("#homepage_head").attr("src", resp.head);
            $("#homepage_username").append(resp.username);
            if (resp.sex !== null) {
                if (resp.sex === "M") {
                    $("#homepage_sex").append('<embed src="/static/img/male.svg" height="20" width="20" type="image/svg+xml" pluginspage="http://www.adobe.com/svg/viewer/install/" />');
                } else {
                    $("#homepage_sex").append('<embed src="/static/img/female.svg" height="20" width="20" type="image/svg+xml" pluginspage="http://www.adobe.com/svg/viewer/install/" />');
                }
            }
            $("#homepage_signature").append(resp.signature);
        }
    });
});