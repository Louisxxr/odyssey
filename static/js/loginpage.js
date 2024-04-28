$(document).ready(function() {
    $("#login").empty();
    $("#login").append('<a href="/register">注册</a>');
    $("main").append(`
    <div>
        <div>
            登录
        </div>
        <div>
            用户名：<input type="text" id="username">
        </div>
        <div>
            密码：<input type="password" id="password">
        </div>
        <div>
            <span id="login_errormsg"></span>
            <span><a href="/reset_password">忘记密码</a></span>
        </div>
        <div>
            <button id="login_button">登录</button>
        </div>
    </div>
    <script src="../static/js/plugins/md5.js"></script>
    `);
});