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
            <span><a href="/user/${question_info["userid"]}"><img src="${question_info["head"]}" height="40" width="40"></a></span>
            <span>${question_info["username"]}</span>
        </div>
        <div>
            <span>${question_info["title"]}</span>
            <span id="follow_sign">共 ${question_info["follow_num"]} 人关注</span>
            <span id="follow_button"></span>
        </div>
        <div>
            <span>${question_info["description"]}</span>
        </div>
        <div>
            <span><img src="/static/img/view.svg" alt="浏览量" height="15" width="15"></span>
            <span>${question_info["views"]}</span>
            <span>共 ${question_info["answer_num"]} 条回答</span>
            <span><button id="answer_question_button">我要回答</button></span>
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
        <span style="color: #ccc;">编辑框支持全屏~</span>
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

    <div id="answers_to_the_question">
    </div>
    `);

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
    });

    $("#answer_question_button").click(function() {
        if (!login_state) {
            alert("您还未登录哦~");
        } else {
            $("#editor-wrapper").show();
            $("#submit_answer_block").show();
        }
    });

    $("#submit_answer_button").click(function() {
        let content = $("#editor-content").val();
        if (content === "" || content === "<p><br></p>") {
            alert("回答不能为空哦~");
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
                    alert("发布失败，稍后再试哦~");
                }
            });
        }
    });
});

// ----------------

const { createEditor, createToolbar } = window.wangEditor

const editorConfig = { MENU_CONF: {} }
editorConfig.placeholder = '编辑你的回答...'
editorConfig.onChange = (editor) => {
    const html = editor.getHtml()
    $(document).ready(function() {
        $("#editor-content").val(html)
    })
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