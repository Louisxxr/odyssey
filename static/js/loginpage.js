$(document).ready(function() {
    $("#login").empty();
    $("#login").append('<a href="/register">注册</a>');
    $("main").append(`
    <style>
        body > main {
            background-color: rgba(255, 255, 255, 15%);
            border-radius: 10px;
        }
        input[type="text"],
        input[type="password"] {
            width: 40%;
            padding: 10px 15px;
            margin: 10px 0;
            border: 2px solid #ddd;
            border-radius: 25px;
            font-size: 16px;
            transition: all 0.3s ease;
            outline: none;
        }
        input[type="text"]:focus,
        input[type="password"]:focus {
            border-color: #002fa7;
            box-shadow: 0 0 8px rgba(00, 47, 167, 0.3);
        }
        input[type="text"]::placeholder,
        input[type="password"]::placeholder {
            color: #999;
            font-style: italic;
        }
    </style>
    <div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="color: white; font-size: 48px; font-weight: bold; margin-left: auto;">登录</div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="color: white; font-size: 14px; font-weight: bold; margin-left: auto;"><span style="color: #002fa7; font-size: 20px;">Odyssey</span>是一个<span style="color: #002fa7; font-size: 20px;">问答互动</span>和<span style="color: #002fa7; font-size: 20px;">文章分享</span>平台</div>
        </div>
        <div>
            <input type="text" id="username" placeholder="用户名或邮箱">
        </div>
        <div>
            <input type="password" id="password" placeholder="密码">
        </div>
        <div style="width: 43%; display: flex; justify-content: space-between; align-items: center;">
            <span id="login_errormsg" style="margin-right: auto; color: brown;"></span>
            <span style="margin-left: auto;"><a href="/reset_password">忘记密码</a></span>
        </div>
        <div>
            <button id="login_button">登录</button>
        </div>
    </div>
    <script src="../static/js/plugins/md5.js"></script>
    `);

    $(document).keydown(function(event) {
        if (event.keyCode === 13) {
            $("#login_button").click();
            return true;
        }
        return true;
    });

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