var url = window.location.pathname.split("/");
var articleid = url[url.length - 1];
var article_info = new Array();
var login_state = false;

$(document).ready(function() {
    $.ajax({
        async: false,
        url: "/service/articleinfo",
        type: "get",
        data: { "articleid": articleid },
        success: function(resp) {
            article_info["userid"] = resp.userid;
            article_info["username"] = resp.username;
            article_info["head"] = resp.head;
            article_info["title"] = resp.title;
            article_info["content"] = resp.content;
            article_info["update_time"] = resp.update_time;
            article_info["views"] = resp.views;
            article_info["like_num"] = resp.like_num;
            article_info["comment_num"] = resp.comment_num;
        }
    });

    $("title").prepend(article_info["title"].slice(3, -4) + " - ");

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
    <div>
        <div style="display: flex; align-items: center;">
            <span style="display: inline-flex; align-items: center;"><a href="/user/${article_info["userid"]}"><img src="${article_info["head"]}" height="40" width="40" style="border-radius: 10%;"></a></span>
            &nbsp&nbsp&nbsp
            <span style="display: inline-flex; align-items: center;">${article_info["username"]}</span>
        </div>
        <div>
            <h1>${article_info["title"].slice(3, -4)}</h1>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="margin-right: auto;">
                <span>${article_info["update_time"]}</span>
            </div>
            <div style="margin-left: auto;">
                <span><img src="/static/img/view.svg" alt="浏览量" height="15" width="15"></span>
                <span>${article_info["views"]}</span>
            </div>
        </div>
    </div>
    <hr>
    <div>
        <div id="update_button" style="display: flex; justify-content: space-between; align-items: center;">
            <a href="/update_article/${articleid}" style="margin-left: auto;">更新文章</a>
        </div>
        <div id="editor-content-view" class="editor-content-view">
            ${article_info["content"]}
        </div>
    </div>
    <div>
        <div style="display: inline-block; width: 150px;">
            <span id="like_button_area"></span>
            <span id="like_sign">${article_info["like_num"]}</span>
            <span id="added_to_collection">已同步至收藏夹</span>
            <span id="removed_from_collection">已从收藏夹移出</span>
            <script>
                $(document).ready(function() {
                    $("#added_to_collection").hide();
                    $("#removed_from_collection").hide();
                });
            </script>
        </div>
        <div style="display: inline-block; width: 150px;">
            <span><img id="comment_button" style="cursor:pointer;" src="/static/img/comment.svg" alt="评论" height="20" width="20"></span>
            <span id="comment_sign">${article_info["comment_num"]}</span>
        </div>
    </div>
    <div id="comment_block">
        <div id="comment_block_editor"></div>
        <div id="comment_block_comments"></div>
    <div>
    <script>
        $(document).ready(function() {
            $("#comment_block").hide();
        });
    </script>
    `);

    if (!login_state) {
        $("#update_button").hide();
        $("#like_button_area").append('<img id="like_button" style="cursor:pointer;" src="/static/img/like.svg" alt="点赞" height="20" width="20">');
    } else {
        $.ajax({
            async: false,
            url: "/service/checkismyarticle",
            type: "get",
            data: { "articleid": articleid },
            success: function(resp) {
                if (resp === "1") {
                    $("#update_button").show();
                } else {
                    $("#update_button").hide();
                }
            }
        });
        $.ajax({
            async: false,
            url: "/service/checklikearticle",
            type: "get",
            data: { "articleid": articleid },
            success: function(resp) {
                if (resp === "1") {
                    $("#like_button_area").append('<img id="like_button" style="cursor:pointer;" src="/static/img/liked.svg" alt="点赞" height="20" width="20">');
                } else {
                    $("#like_button_area").append('<img id="like_button" style="cursor:pointer;" src="/static/img/like.svg" alt="点赞" height="20" width="20">');
                }
            }
        });
    }

    $("#like_button").click(function() {
        if (!login_state) {
            alert("您还未登录哦~");
        } else {
            $.ajax({
                url: "/service/checklikearticle",
                type: "get",
                data: { "articleid": articleid },
                success: function(resp) {
                    if (resp === "1") {
                        $.ajax({
                            url: "/service/unlikearticle",
                            type: "get",
                            data: { "articleid": articleid },
                            success: function() {
                                $("#like_button_area").empty();
                                $("#like_button_area").append('<img id="like_button" style="cursor:pointer;" src="/static/img/like.svg" alt="点赞" height="20" width="20">');
                                article_info["like_num"]--;
                                $("#like_sign").empty();
                                $("#like_sign").append(article_info["like_num"]);
                                $("#removed_from_collection").fadeIn(500);
                                $("#removed_from_collection").fadeOut(1800);
                            },
                            error: function() {
                                alert("请稍后再试~");
                            }
                        });
                    } else {
                        $.ajax({
                            url: "/service/likearticle",
                            type: "get",
                            data: { "articleid": articleid },
                            success: function() {
                                $("#like_button_area").empty();
                                $("#like_button_area").append('<img id="like_button" style="cursor:pointer;" src="/static/img/liked.svg" alt="点赞" height="20" width="20">');
                                article_info["like_num"]++;
                                $("#like_sign").empty();
                                $("#like_sign").append(article_info["like_num"]);
                                $("#added_to_collection").fadeIn(500);
                                $("#added_to_collection").fadeOut(1800);
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

    $("#comment_button").click(function() {
        if ($("#comment_block").is(":visible")) {
            $("#comment_block").slideUp(400);
        } else {
            // 评论内容
            $("#comment_block_comments").empty();
            $.ajax({
                async: false, // 重要
                url: "/service/getallcomment/article",
                type: "get",
                data: { "articleid": articleid },
                success: function(resp) {
                    if (resp === "") {
                        if (login_state) {
                            $("#comment_block_comments").append("<div>来抢个沙发吧</div>");
                        }
                    } else {
                        magic_split_flag = resp.slice(0, 4);
                        resp = resp.slice(4, resp.length);
                        resp = resp.split(magic_split_flag);
                        for (let i = 0; i < resp.length; i += 5) {
                            // userid - username - head - content - issue_time
                            let userid = resp[i];
                            let username = resp[i + 1];
                            let head = resp[i + 2];
                            let content = resp[i + 3];
                            let issue_time = resp[i + 4];
                            $("#comment_block_comments").append(`
                            <div>
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <div style="display: flex; align-items: center;">
                                        <span style="display: inline-flex; align-items: center;"><a href="/user/${userid}"><img src="${head}" height="30" width="30" style="border-radius: 10%;"></a></span>
                                        &nbsp&nbsp&nbsp
                                        <span style="display: inline-flex; align-items: center;">${username}</span>
                                    </div>
                                    <span style="margin-left: auto;">${issue_time}</span>
                                </div>
                                <div>${content}</div>
                            </div>
                            `);
                        }
                    }
                }
            });
            // 评论编辑框
            $("#comment_block_editor").empty();
            if (login_state) {
                $("#comment_block_editor").append(`
                <link rel="stylesheet" href="../static/css/wangeditor.css">
                <script src="../static/js/plugins/wangeditor.js"></script>
                
                <div id="editor-wrapper-comment">
                    <div id="toolbar-container-comment"><!-- 工具栏 --></div>
                    <div id="editor-container-comment"><!-- 编辑器 --></div>
                </div>
                <textarea id="editor-content-comment"></textarea>

                <style>
                    #editor-wrapper-comment {
                        border: 1px solid #ccc;
                        z-index: 100; /* 按需定义 */
                    }
                    #toolbar-container-comment { height: 50px; }
                    #editor-container-comment { height: 50px; }
                </style>
                <script>
                    $(document).ready(function() {
                        $("#editor-content-comment").hide();
                    });
                </script>

                <div>
                    <span><button id="submit_comment_button">发布</button></span>
                    <span id="submit_comment_msg"></span>
                </div>

                <script>
                    $(document).ready(function() {
                        let { createEditor, createToolbar } = window.wangEditor

                        let editorConfig = { MENU_CONF: {} }
                        editorConfig.placeholder = '锐评一下'
                        editorConfig.onChange = (editor) => {
                            const html = editor.getHtml()
                            $("#editor-content-comment").val(html)
                        }
                    
                        let editor = createEditor({
                            selector: '#editor-container-comment',
                            html: '<p><br></p>',
                            config: editorConfig,
                            mode: 'simple' // or 'default'
                        })
                    
                        let toolbarConfig = {}
                        toolbarConfig.toolbarKeys = [ "emotion" ]
                    
                        let toolbar = createToolbar({
                            editor,
                            selector: '#toolbar-container-comment',
                            config: toolbarConfig,
                            mode: 'default' // or 'simple'
                        })
                    });
                </script>
                `);
            } else {
                $("#comment_block_editor").append("登录后才可以发表评论哦~");
            }
            $("#comment_block").slideDown(400);

            $("#submit_comment_button").click(function() {
                let content = $("#editor-content-comment").val();
                if (content === "" || content === "<p><br></p>") {
                    alert("评论不能为空~");
                } else {
                    $.ajax({
                        url: "/service/submitcomment/article",
                        type: "post",
                        data: {
                            "articleid": articleid,
                            "content": content
                        },
                        success: function() {
                            $("#submit_comment_msg").empty();
                            $("#submit_comment_msg").append("发布成功");

                            $("#comment_block_comments").empty();
                            $.ajax({
                                url: "/service/getallcomment/article",
                                type: "get",
                                data: { "articleid": articleid },
                                success: function(resp) {
                                    if (resp === "") {
                                        if (login_state) {
                                            $("#comment_block_comments").append("<div>来抢个沙发吧</div>");
                                        }
                                    } else {
                                        magic_split_flag = resp.slice(0, 4);
                                        resp = resp.slice(4, resp.length);
                                        resp = resp.split(magic_split_flag);
                                        for (let i = 0; i < resp.length; i += 5) {
                                            // userid - username - head - content - issue_time
                                            let userid = resp[i];
                                            let username = resp[i + 1];
                                            let head = resp[i + 2];
                                            let content = resp[i + 3];
                                            let issue_time = resp[i + 4];
                                            $("#comment_block_comments").append(`
                                            <div>
                                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                                    <div style="display: flex; align-items: center;">
                                                        <span style="display: inline-flex; align-items: center;"><a href="/user/${userid}"><img src="${head}" height="30" width="30" style="border-radius: 10%;"></a></span>
                                                        &nbsp&nbsp&nbsp
                                                        <span style="display: inline-flex; align-items: center;">${username}</span>
                                                    </div>
                                                    <span style="margin-left: auto;">${issue_time}</span>
                                                </div>
                                                <div>${content}</div>
                                            </div>
                                            `);
                                        }
                                    }
                                }
                            });
                        },
                        error: function() {
                            alert("发布失败，请稍后再试~");
                        }
                    });
                    article_info["comment_num"]++;
                    $("#comment_sign").empty();
                    $("#comment_sign").append(article_info["comment_num"]);
                }
            });
        }
    });
});