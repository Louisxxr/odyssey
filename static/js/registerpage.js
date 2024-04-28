var email_pattern = /^([A-Za-z0-9_\-\.])+\@(qq\.com|163\.com|sina\.com|sina\.cn|sohu\.com|hotmail\.com|189\.cn|gmail\.com)$/;

$(document).ready(function() {
    $("main").append(`
    <div>
        <div>
            注册
        </div>
        <div>
            <span>邮箱：<input type="text" id="email"></span>
            <span><button id="send_authcode_button">发送验证码</button></span>
            <span id="send_state_msg"></span>
        </div>
        <div>
            验证码：<input type="text" id="authcode">
        </div>
        <div>
            用户名：<input type="text" id="username">
        </div>
        <div>
            密码：<input type="password" id="password">
        </div>
        <div>
            确认密码：<input type="password" id="confirm_password">
        </div>
        <div>
            <span id="register_errormsg"></span>
        </div>
        <div>
            <button id="register_button">注册</button>
        </div>
    </div>
    <script src="../static/js/plugins/md5.js"></script>
    `);

    $("#send_authcode_button").click(function() {
        let email = $("#email").val();
        if (email === "") {
            $("#send_state_msg").empty();
            $("#send_state_msg").append("邮箱不能为空");
        } else if (email.length > 320) {
            $("#send_state_msg").empty();
            $("#send_state_msg").append("发送失败，请检查邮箱");
        } else if (!email_pattern.test(email)) {
            $("#send_state_msg").empty();
            $("#send_state_msg").append("发送失败，请检查邮箱");
            alert("暂仅支持QQ邮箱、网易邮箱、新浪邮箱、搜狐邮箱、Hotmail邮箱、189邮箱、谷歌邮箱！");
        } else {
            $("#send_state_msg").empty();
            $.ajax({
                url: "/service/verifyemail",
                type: "get",
                data: { "email": email },
                success: function(resp) {
                    if (resp.result === "1") {
                        $("#send_state_msg").append("邮箱已注册");
                    } else if (resp.result === "2") {
                        $("#send_state_msg").append("请稍后再试");
                    } else {
                        $.ajax({
                            url: "/service/authcode",
                            type: "get",
                            data: { "email": email },
                            success: function(resp) {
                                $("#send_state_msg").append(resp.result);
                            },
                            error: function() {
                                $("#send_state_msg").append("请稍后再试");
                            }
                        });
                    }
                }
            });
        }
    });

    $("#register_button").click(function() {
        let email = $("#email").val();
        let authcode = $("#authcode").val();
        let username = $("#username").val();
        let password = $("#password").val();
        let confirm_password = $("#confirm_password").val();
        if (email === "") {
            $("#register_errormsg").empty();
            $("#register_errormsg").append("邮箱不能为空");
        } else if (authcode === "") {
            $("#register_errormsg").empty();
            $("#register_errormsg").append("验证码不能为空");
        } else if (username === "") {
            $("#register_errormsg").empty();
            $("#register_errormsg").append("用户名不能为空");
        } else if (password === "") {
            $("#register_errormsg").empty();
            $("#register_errormsg").append("密码不能为空");
        } else if (confirm_password === "") {
            $("#register_errormsg").empty();
            $("#register_errormsg").append("确认密码不能为空");
        } else if (username.length > 25) {
            $("#register_errormsg").empty();
            $("#register_errormsg").append("用户名过长");
        } else if (password !== confirm_password) {
            $("#register_errormsg").empty();
            $("#register_errormsg").append("两次密码不一致");
        } else {
            let lv = 0;
            if (password.match(/[A-Za-z]/g)) { lv++; }
            if (password.match(/[0-9]/g)) { lv++; }
            if (password.match(/[^A-Za-z0-9]/g)) { lv++; }
            if (password.length < 6) { lv = 1; }
            if (lv <= 1) {
                $("#register_errormsg").empty();
                $("#register_errormsg").append("密码强度低");
                alert("密码应至少包含字母、数字、标点符号中的两种，且不少于6位！");
            } else {
                $("#register_errormsg").empty();
                let password_encrypted = hex_md5(password);
                $.ajax({
                    url: "/register",
                    type: "post",
                    data: {
                        "email": email,
                        "authcode": authcode,
                        "username": username,
                        "password": password_encrypted
                    },
                    success: function(resp) {
                        $("#register_errormsg").append(resp.result);
                        if (resp.result === "注册成功") {
                            location.assign("/login");
                        }
                    },
                    error: function() {
                        $("#register_errormsg").append("请稍后再试");
                    }
                });
            }
        }
    });
});