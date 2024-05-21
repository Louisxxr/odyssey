$(document).ready(function() {
    $("#login").empty();
    $("#login").append('<a href="/register">注册</a>');
    $("main").append(`
    <div>
        <div>
            登录
        </div>
        <div>
            用户名：<input type="text" id="username" placeholder="用户名或邮箱">
        </div>
        <div>
            密码：<input type="password" id="password" placeholder="密码">
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

    $("#login_button").click(function() {
        let username = $("#username").val();
        let password = $("#password").val();
        if (username === "") {
            $("#login_errormsg").empty();
            $("#login_errormsg").append("用户名不能为空");
        } else if (password === "") {
            $("#login_errormsg").empty();
            $("#login_errormsg").append("密码不能为空");
        } else {
            $("#login_errormsg").empty();
            let password_encrypted = hex_md5(password);
            $.ajax({
                url: "/login",
                type: "post",
                data: {
                    "username": username,
                    "password": password_encrypted
                },
                success: function(resp) {
                    $("#login_errormsg").append(resp.result);
                    if (resp.result === "登录成功") {
                        location.reload();
                    }
                },
                error: function() {
                    $("#login_errormsg").append("请稍后再试");
                }
            });
        }
    });
});