$(document).ready(function() {
    $("main").append(`
    <div>
        <link rel="stylesheet" href="../static/css/wangeditor.css">
        <script src="../static/js/plugins/wangeditor.js"></script>
        <div>
            <div id="editor-wrapper-title">
                <div id="toolbar-container-title"><!-- 工具栏 --></div>
                <div id="editor-container-title"><!-- 编辑器 --></div>
            </div>
            <textarea id="editor-content-title"></textarea>

            <style>
                #editor-wrapper-title {
                    border: 1px solid #ccc;
                    z-index: 100; /* 按需定义 */
                }
                #toolbar-container-title { border-bottom: 0px; }
                #editor-container-title { height: 50px; }
            </style>
            <script>
                $(document).ready(function() {
                    $("#editor-content-title").hide();
                });
            </script>

            <script>
                $(document).ready(function() {
                    let { createEditor, createToolbar } = window.wangEditor

                    let editorConfig = { MENU_CONF: {} }
                    editorConfig.placeholder = '标题'
                    editorConfig.onChange = (editor) => {
                        const html = editor.getHtml()
                        if (html.length > 11 && html.endsWith("<p><br></p>")) {
                            editor.setHtml(html.slice(0, -11))
                        }
                        $("#editor-content-title").val(html)
                    }
                
                    let editor = createEditor({
                        selector: '#editor-container-title',
                        html: '<p><br></p>',
                        config: editorConfig,
                        mode: 'simple' // or 'default'
                    })
                
                    let toolbarConfig = {}
                    toolbarConfig.toolbarKeys = []
                
                    let toolbar = createToolbar({
                        editor,
                        selector: '#toolbar-container-title',
                        config: toolbarConfig,
                        mode: 'default' // or 'simple'
                    })
                });
            </script>
        </div>
        <hr>
        <div>
            <div id="editor-wrapper-content">
                <div id="toolbar-container-content"><!-- 工具栏 --></div>
                <div id="editor-container-content"><!-- 编辑器 --></div>
            </div>
            <textarea id="editor-content-content"></textarea>

            <style>
                #editor-wrapper-content {
                    border: 1px solid #ccc;
                    z-index: 100; /* 按需定义 */
                }
                #toolbar-container-content { border-bottom: 1px solid #ccc; }
                #editor-container-content { height: 400px; }
            </style>
            <script>
                $(document).ready(function() {
                    $("#editor-content-content").hide();
                });
            </script>
        </div>
        <div>
            <span><button id="submit_button">发布</button></span>
            <span id="submit_msg"></span>
        </div>
    </div>
    `);

    $(document).ready(function() {
        let { createEditor, createToolbar } = window.wangEditor

        let editorConfig = { MENU_CONF: {} }
        editorConfig.placeholder = '正文（试试全屏编辑框吧~）'
        editorConfig.onChange = (editor) => {
            const html = editor.getHtml()
            $("#editor-content-content").val(html)
        }
        editorConfig.MENU_CONF['uploadImage'] = {
            server: '/service/uploadimg/assets_article'
        }
    
        let editor = createEditor({
            selector: '#editor-container-content',
            html: '<p><br></p>',
            config: editorConfig,
            mode: 'simple' // or 'default'
        })
    
        let toolbarConfig = {}
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
    
        let toolbar = createToolbar({
            editor,
            selector: '#toolbar-container-content',
            config: toolbarConfig,
            mode: 'default' // or 'simple'
        })
    });

    $("#submit_button").click(function() {
        let title = $("#editor-content-title").val();
        let content = $("#editor-content-content").val();
        if (title === "" || title === "<p><br></p>") {
            $("#submit_msg").empty();
            $("#submit_msg").append("标题不能为空");
        } else if (content === "" || content === "<p><br></p>") {
            $("#submit_msg").empty();
            $("#submit_msg").append("正文不能为空");
        } else if (title.length > 100) {
            $("#submit_msg").empty();
            $("#submit_msg").append("标题过长");
        } else {
            $.ajax({
                url: "/edit_article",
                type: "post",
                data: {
                    "title": title,
                    "content": content
                },
                success: function(resp) {
                    $("#submit_msg").empty();
                    $("#submit_msg").append("发布成功");
                    location.assign("/article/" + resp);
                },
                error: function(resp) {
                    $("#submit_msg").empty();
                    $("#submit_msg").append("请稍后再试");
                }
            });
        }
    });
});
