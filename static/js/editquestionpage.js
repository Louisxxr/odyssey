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
                    editorConfig.placeholder = '简要地概括问题'
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
                #toolbar-container-content { border-bottom: 0px; }
                #editor-container-content { height: 200px; }
            </style>
            <script>
                $(document).ready(function() {
                    $("#editor-content-content").hide();
                });
            </script>

            <script>
                $(document).ready(function() {
                    let { createEditor, createToolbar } = window.wangEditor

                    let editorConfig = { MENU_CONF: {} }
                    editorConfig.placeholder = '输入问题背景、条件等详细信息（选填）'
                    editorConfig.onChange = (editor) => {
                        const html = editor.getHtml()
                        $("#editor-content-content").val(html)
                    }
                
                    let editor = createEditor({
                        selector: '#editor-container-content',
                        html: '<p><br></p>',
                        config: editorConfig,
                        mode: 'simple' // or 'default'
                    })
                
                    let toolbarConfig = {}
                    toolbarConfig.toolbarKeys = []
                
                    let toolbar = createToolbar({
                        editor,
                        selector: '#toolbar-container-content',
                        config: toolbarConfig,
                        mode: 'default' // or 'simple'
                    })
                });
            </script>
        </div>
        <div>
            <span><button id="submit_button">发布</button></span>
            <span id="submit_msg"></span>
        </div>
    </div>
    `);

    $("#submit_button").click(function() {
        let title = $("#editor-content-title").val();
        let description = $("#editor-content-content").val();
        if (title === "" || title === "<p><br></p>") {
            $("#submit_msg").empty();
            $("#submit_msg").append("问题不能为空");
        } else if (title.length > 100) {
            $("#submit_msg").empty();
            $("#submit_msg").append("问题过长");
        } else if (description.length > 500) {
            $("#submit_msg").empty();
            $("#submit_msg").append("问题描述过长");
        } else {
            $.ajax({
                url: "/edit_question",
                type: "post",
                data: {
                    "title": title,
                    "description": description
                },
                success: function(resp) {
                    $("#submit_msg").empty();
                    $("#submit_msg").append("发布成功");
                    location.assign("/question/" + resp);
                },
                error: function(resp) {
                    $("#submit_msg").empty();
                    $("#submit_msg").append("请稍后再试");
                }
            });
        }
    });
});
