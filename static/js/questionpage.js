var url = window.location.pathname.split("/");
var questionid = url[url.length - 1]
var question_info = new Array();
var login_state = false;
var my_head;

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
                my_head = resp.head;
            }
        }
    });

    $("main").append(`
    <div>
        <div>
            <span><a href="/user/${question_info["userid"]}"><img src="${question_info["head"]}" height="40" width="40" style="border-radius: 10%;"></a></span>
            <span>${question_info["username"]}</span>
        </div>
        <div>
            ${question_info["title"]}
        </div>
        <div style="background-color: #eee; padding: 1px 1px;">
            ${question_info["description"]}
        </div>
        <div>
            <span id="follow_sign">共 ${question_info["follow_num"]} 人关注</span>
            <span id="follow_button"></span>
        </div>
        <div>
            <span><img src="/static/img/view.svg" alt="浏览量" height="15" width="15"></span>
            <span>${question_info["views"]}</span>
            <span>共 ${question_info["answer_num"]} 条回答</span>
            <span><button id="answer_question_button"></button></span>
        </div>
    </div>

    <link rel="stylesheet" href="../static/css/wangeditor.css">
    <style>
        #editor-wrapper {
            border: 1px solid #ccc;
            z-index: 100; /* 按需定义 */
        }
        #toolbar-container { border-bottom: 1px solid #ccc; }
        #editor-container { height: 200px; }
    </style>
    <script src="../static/js/plugins/wangeditor.js"></script>
    <div id="editor-wrapper">
        <div id="toolbar-container"><!-- 工具栏 --></div>
        <div id="editor-container"><!-- 编辑器 --></div>
    </div>
    <div id="submit_answer_block">
        <span><button id="submit_answer_button">发布</button></span>
        <span id="submit_answer_msg"></span>
    </div>
    <textarea id="editor-content"></textarea>
    <script>
        $(document).ready(function() {
            $("#editor-wrapper").hide();
            $("#submit_answer_block").hide();
            $("#editor-content").hide();
        });
    </script>

    <hr>
    <div id="answers_to_the_question">
    </div>
    `);

    // ----------------

    const { createEditor, createToolbar } = window.wangEditor

    const editorConfig = { MENU_CONF: {} }
    editorConfig.placeholder = '编辑你的回答...（试试全屏编辑框吧~）'
    editorConfig.onChange = (editor) => {
        const html = editor.getHtml()
        $("#editor-content").val(html)
    }
    editorConfig.MENU_CONF['uploadImage'] = {
        server: '/service/uploadimg/assets_answer'
    }

    const editor = createEditor({
        selector: '#editor-container',
        html: '<p><br></p>',
        config: editorConfig,
        mode: 'simple' // or 'default'
    })

    const toolbarConfig = {}
    toolbarConfig.toolbarKeys = [
        "fullScreen",
        "|",
        "undo",
        "redo",
        "|",
        "headerSelect",
        "blockquote",
        "divider",
        "|",
        "bold",
        "underline",
        "italic",
        {
            "key": "group-more-style",
            "title": "更多",
            "iconSvg": "<svg viewBox=\"0 0 1024 1024\"><path d=\"M204.8 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z\"></path><path d=\"M505.6 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z\"></path><path d=\"M806.4 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z\"></path></svg>",
            "menuKeys": [
                "through",
                "code",
                "sup",
                "sub",
                "clearStyle"
            ]
        },
        "color",
        "fontSize",
        "fontFamily",
        "|",
        "bulletedList",
        "numberedList",
        {
            "key": "group-justify",
            "title": "对齐",
            "iconSvg": "<svg viewBox=\"0 0 1024 1024\"><path d=\"M768 793.6v102.4H51.2v-102.4h716.8z m204.8-230.4v102.4H51.2v-102.4h921.6z m-204.8-230.4v102.4H51.2v-102.4h716.8zM972.8 102.4v102.4H51.2V102.4h921.6z\"></path></svg>",
            "menuKeys": [
                "justifyLeft",
                "justifyRight",
                "justifyCenter"
            ]
        },
        "|",
        "insertTable",
        {
            "key": "group-image",
            "title": "图片",
            "iconSvg": "<svg viewBox=\"0 0 1024 1024\"><path d=\"M959.877 128l0.123 0.123v767.775l-0.123 0.122H64.102l-0.122-0.122V128.123l0.122-0.123h895.775zM960 64H64C28.795 64 0 92.795 0 128v768c0 35.205 28.795 64 64 64h896c35.205 0 64-28.795 64-64V128c0-35.205-28.795-64-64-64zM832 288.01c0 53.023-42.988 96.01-96.01 96.01s-96.01-42.987-96.01-96.01S682.967 192 735.99 192 832 234.988 832 288.01zM896 832H128V704l224.01-384 256 320h64l224.01-192z\"></path></svg>",
            "menuKeys": [
                "insertImage",
                "uploadImage"
            ]
        },
        "emotion",
        "insertLink",
        "codeBlock"
    ]

    const toolbar = createToolbar({
        editor,
        selector: '#toolbar-container',
        config: toolbarConfig,
        mode: 'default' // or 'simple'
    })

    // ----------------

    if (!login_state) {
        $("#follow_button").append('<img id="follow_question" style="cursor:pointer;" src="/static/img/follow.svg" alt="关注" height="20" width="20">');
    } else {
        $.ajax({
            async: false,
            url: "/service/checkfollowquestion",
            type: "get",
            data: { "questionid": questionid },
            success: function(resp) {
                if (resp === "1") {
                    $("#follow_button").append('<img id="follow_question" style="cursor:pointer;" src="/static/img/followed.svg" alt="关注" height="20" width="20">');
                } else {
                    $("#follow_button").append('<img id="follow_question" style="cursor:pointer;" src="/static/img/follow.svg" alt="关注" height="20" width="20">');
                }
            }
        });
    }

    if (!login_state) {
        $("#answer_question_button").append("我要回答");
    } else {
        $.ajax({
            async: false,
            url: "/service/getmyanswer",
            type: "get",
            data: { "questionid": questionid },
            success: function(resp) {
                if (resp === "") {
                    $("#answer_question_button").append("我要回答");
                } else {
                    $("#answer_question_button").append("更新回答");
                    editor.setHtml(resp);
                }
            }
        });
    }

    $("#follow_question").click(function() {
        if (!login_state) {
            alert("您还未登录哦~");
        } else {
            $.ajax({
                url: "/service/checkfollowquestion",
                type: "get",
                data: { "questionid": questionid },
                success: function(resp) {
                    if (resp === "1") {
                        $.ajax({
                            url: "/service/unfollowquestion",
                            type: "get",
                            data: { "questionid": questionid },
                            success: function() {
                                $("#follow_button").empty();
                                $("#follow_button").append('<img id="follow_question" style="cursor:pointer;" src="/static/img/follow.svg" alt="关注" height="20" width="20">');
                                question_info["follow_num"]--;
                                $("#follow_sign").empty();
                                $("#follow_sign").append(`共 ${question_info["follow_num"]} 人关注`);
                            },
                            error: function() {
                                alert("请稍后再试~");
                            }
                        });
                    } else {
                        $.ajax({
                            url: "/service/followquestion",
                            type: "get",
                            data: { "questionid": questionid },
                            success: function() {
                                $("#follow_button").empty();
                                $("#follow_button").append('<img id="follow_question" style="cursor:pointer;" src="/static/img/followed.svg" alt="关注" height="20" width="20">');
                                question_info["follow_num"]++;
                                $("#follow_sign").empty();
                                $("#follow_sign").append(`共 ${question_info["follow_num"]} 人关注`);
                            },
                            error: function() {
                                alert("请稍后再试~");
                            }
                        });
                    }
                }
            });
        }
        return false;
    });

    $("#answer_question_button").click(function() {
        if (!login_state) {
            alert("您还未登录哦~");
        } else {
            $("#editor-wrapper").show();
            $("#submit_answer_block").show();
        }
        return false;
    });

    $("#submit_answer_button").click(function() {
        let content = $("#editor-content").val();
        if (content === "" || content === "<p><br></p>") {
            alert("回答不能为空~");
        } else {
            $.ajax({
                url: "/question/" + questionid,
                type: "post",
                data: { "content": content },
                success: function() {
                    $("#submit_answer_msg").append("发布成功");
                    location.reload();
                },
                error: function() {
                    alert("发布失败，请稍后再试~");
                }
            });
        }
        return false;
    });

    $.ajax({
        async: false, // 重要
        url: "/service/getallanswer",
        type: "get",
        data: { "questionid": questionid },
        success: function(resp) {
            if (resp === "") {
                $("#answers_to_the_question").append("<div>等待你的回答哦</div>");
            } else {
                magic_split_flag = resp.slice(0, 4);
                resp = resp.slice(4, resp.length);
                resp = resp.split(magic_split_flag);
                for (let i = 0; i < resp.length; i += 8) {
                    // userid - username - head - answerid - content - update_time - like_num - comment_num
                    let uid = resp[i];
                    let username = resp[i + 1];
                    let head = resp[i + 2];
                    let answerid = resp[i + 3];
                    let content = resp[i + 4];
                    let update_time = resp[i + 5];
                    let like_num = resp[i + 6];
                    let comment_num = resp[i + 7];
                    $("#answers_to_the_question").append(`
                    <div>
                        <div>
                            <span><a href="/user/${uid}"><img src="${head}" height="40" width="40" style="border-radius: 10%;"></a></span>
                            <span>${username}</span>
                        </div>
                        <div id="editor-content-view" class="editor-content-view">
                            ${content}
                        </div>
                        <div>
                            <span>更新于 ${update_time}</span>
                        </div>
                        <div>
                            <div style="display: inline-block; width: 150px;">
                                <span id="like_answer_button_${answerid}"></span>
                                <span id="like_answer_sign_${answerid}">${like_num}</span>
                                <span id="added_to_collection_${answerid}">已同步至收藏夹</span>
                                <span id="removed_from_collection_${answerid}">已从收藏夹移出</span>
                                <script>
                                    $(document).ready(function() {
                                        $("#added_to_collection_${answerid}").hide();
                                        $("#removed_from_collection_${answerid}").hide();
                                    });
                                </script>
                            </div>
                            <div style="display: inline-block; width: 150px;">
                                <span><img id="to_comment_answer_${answerid}" style="cursor:pointer;" src="/static/img/comment.svg" alt="评论" height="20" width="20"></span>
                                <span>${comment_num}</span>
                            </div>
                        </div>
                        <div id="comments_block_${answerid}">
                            <div id="edit_comment_to_answer_${answerid}">
                            </div>
                            <div id="comments_to_answer_${answerid}">
                            </div>
                        </div>
                        <script>
                            $(document).ready(function() {
                                $("#comments_block_${answerid}").hide();
                            });
                        </script>
                    </div>
                    <hr style="border: 0; padding: 2px; background: repeating-linear-gradient(135deg, #a2a9b6 0px, #a2a9b6 1px, transparent 1px, transparent 5px);">
                    `);
                    if (login_state) {
                        $.ajax({
                            async: false, // 重要
                            url: "/service/checklikeanswer",
                            type: "get",
                            data: { "answerid": answerid },
                            success: function(resp) {
                                if (resp === "1") {
                                    $(`#like_answer_button_${answerid}`).append(`<img id="to_like_answer_${answerid}" style="cursor:pointer;" src="/static/img/liked.svg" alt="点赞" height="20" width="20">`);
                                } else {
                                    $(`#like_answer_button_${answerid}`).append(`<img id="to_like_answer_${answerid}" style="cursor:pointer;" src="/static/img/like.svg" alt="点赞" height="20" width="20">`);
                                }
                            }
                        });
                    }
                }
            }
        }
    });

    if (!login_state) {
        $("[id^=like_answer_button_]").append('<img class="invalid_to_like_answer" style="cursor:pointer;" src="/static/img/like.svg" alt="点赞" height="20" width="20">');
    }

    $(".invalid_to_like_answer").click(function() {
        alert("您还未登录哦~");
        return false;
    });

    $("[id^=to_like_answer_]").click(function() {
        let answerid = $(this).context.id.split("_")[3];
        $.ajax({
            url: "/service/checklikeanswer",
            type: "get",
            data: { "answerid": answerid },
            success: function(resp) {
                if (resp === "1") {
                    $.ajax({
                        url: "/service/unlikeanswer",
                        type: "get",
                        data: { "answerid": answerid },
                        success: function() {
                            $(`#like_answer_button_${answerid}`).empty();
                            $(`#like_answer_button_${answerid}`).append(`<img id="to_like_answer_${answerid}" style="cursor:pointer;" src="/static/img/like.svg" alt="点赞" height="20" width="20">`);
                            let tmp = Number($(`#like_answer_sign_${answerid}`).text()) - 1;
                            $(`#like_answer_sign_${answerid}`).empty();
                            $(`#like_answer_sign_${answerid}`).append(tmp);
                            $(`#removed_from_collection_${answerid}`).fadeIn(500);
                            $(`#removed_from_collection_${answerid}`).fadeOut(1800);
                        },
                        error: function() {
                            alert("请稍后再试~");
                        }
                    });
                } else {
                    $.ajax({
                        url: "/service/likeanswer",
                        type: "get",
                        data: { "answerid": answerid },
                        success: function() {
                            $(`#like_answer_button_${answerid}`).empty();
                            $(`#like_answer_button_${answerid}`).append(`<img id="to_like_answer_${answerid}" style="cursor:pointer;" src="/static/img/liked.svg" alt="点赞" height="20" width="20">`);
                            let tmp = Number($(`#like_answer_sign_${answerid}`).text()) + 1;
                            $(`#like_answer_sign_${answerid}`).empty();
                            $(`#like_answer_sign_${answerid}`).append(tmp);
                            $(`#added_to_collection_${answerid}`).fadeIn(500);
                            $(`#added_to_collection_${answerid}`).fadeOut(1800);
                        },
                        error: function() {
                            alert("请稍后再试~");
                        }
                    });
                }
            }
        });
        return false;
    });

    $("[id^=to_comment_answer_]").click(function() {
        let answerid = $(this).context.id.split("_")[3];
        let $comments_block = $(`#comments_block_${answerid}`);
        if ($comments_block.is(":visible")) {
            $comments_block.slideUp(400);
        } else {
            // 评论内容
            $(`#comments_to_answer_${answerid}`).empty();
            $.ajax({
                async: false, // 重要，防止slideDown卡顿
                url: "/service/getallcomment",
                type: "get",
                data: { "answerid": answerid },
                success: function(resp) {
                    if (resp === "") {
                        if (login_state) {
                            $(`#comments_to_answer_${answerid}`).append("<div>来抢个沙发吧</div>");
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
                            $(`#comments_to_answer_${answerid}`).append(`
                            <div>
                                <div>
                                    <span><a href="/user/${userid}"><img src="${head}" height="30" width="30" style="border-radius: 10%;"></a></span>
                                    <span>${username}</span>
                                    <div style="display: inline-block;" class="editor-content-view-for-comment">${content}</div>
                                    <span>${issue_time}</span>
                                </div>
                            </div>
                            `);
                        }
                    }
                }
            });
            // 评论编辑框
            $(`#edit_comment_to_answer_${answerid}`).empty();
            if (login_state) {
                $(`#edit_comment_to_answer_${answerid}`).append(`
                <style>
                    #editor-wrapper-${answerid} {
                        border: 1px solid #ccc;
                        z-index: 100; /* 按需定义 */
                    }
                    #toolbar-container-${answerid} { height: 50px; }
                    #editor-container-${answerid} { height: 50px; }
                </style>
                
                <div id="editor-wrapper-${answerid}">
                    <div id="toolbar-container-${answerid}"><!-- 工具栏 --></div>
                    <div id="editor-container-${answerid}"><!-- 编辑器 --></div>
                </div>
                <div>
                    <span><button id="submit_comment_button_${answerid}">发布</button></span>
                    <span id="submit_comment_msg_${answerid}"></span>
                </div>
                <textarea id="editor-content-${answerid}"></textarea>
                <script>
                    $(document).ready(function() {
                        $("#editor-content-${answerid}").hide();
                    });
                </script>
                
                <script>
                    $(document).ready(function() {
                        let { createEditor, createToolbar } = window.wangEditor

                        let editorConfig = { MENU_CONF: {} }
                        editorConfig.placeholder = '锐评一下'
                        editorConfig.onChange = (editor) => {
                            const html = editor.getHtml()
                            $("#editor-content-${answerid}").val(html)
                        }
                    
                        let editor = createEditor({
                            selector: '#editor-container-${answerid}',
                            html: '<p><br></p>',
                            config: editorConfig,
                            mode: 'simple' // or 'default'
                        })
                    
                        let toolbarConfig = {}
                        toolbarConfig.toolbarKeys = [ "emotion" ]
                    
                        let toolbar = createToolbar({
                            editor,
                            selector: '#toolbar-container-${answerid}',
                            config: toolbarConfig,
                            mode: 'default' // or 'simple'
                        })
                    });
                </script>
                `);
            } else {
                $(`#edit_comment_to_answer_${answerid}`).append("登录后才可以发表评论哦~");
            }
            $comments_block.slideDown(400);

            $("[id^=submit_comment_button_]").click(function() {
                let answerid = $(this).context.id.split("_")[3];
                let content = $(`#editor-content-${answerid}`).val();
                if (content === "" || content === "<p><br></p>") {
                    alert("评论不能为空~");
                } else {
                    $.ajax({
                        url: "/service/submitcomment/answer",
                        type: "post",
                        data: {
                            "answerid": answerid,
                            "content": content
                        },
                        success: function() {
                            $(`#submit_comment_msg_${answerid}`).empty();
                            $(`#submit_comment_msg_${answerid}`).append("发布成功");

                            $(`#comments_to_answer_${answerid}`).empty();
                            $.ajax({
                                async: false, // 重要，防止slideDown卡顿
                                url: "/service/getallcomment",
                                type: "get",
                                data: { "answerid": answerid },
                                success: function(resp) {
                                    if (resp === "") {
                                        if (login_state) {
                                            $(`#comments_to_answer_${answerid}`).append("<div>来抢个沙发吧</div>");
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
                                            $(`#comments_to_answer_${answerid}`).append(`
                                            <div>
                                                <div>
                                                    <span><a href="/user/${userid}"><img src="${head}" height="25" width="25"></a></span>
                                                    <span>${username}</span>
                                                    <div style="display: inline-block;" class="editor-content-view">${content}</div>
                                                    <span>${issue_time}</span>
                                                </div>
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
                }
                return false;
            });
        }
        return false;
    });
});