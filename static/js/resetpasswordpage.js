var email_pattern = /^([A-Za-z0-9_\-\.])+\@(qq\.com|163\.com|sina\.com|sina\.cn|sohu\.com|hotmail\.com|189\.cn|gmail\.com)$/;

$(document).ready(function() {
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
        <div style="color: white; font-size: 48px; font-weight: bold; margin-left: auto;">找回密码</div>
    </div>
    <div style="display: flex; justify-content: space-between; align-items: center;">
        <div style="color: white; font-size: 14px; font-weight: bold; margin-left: auto;"><span style="color: #002fa7; font-size: 20px;">Odyssey</span>是一个<span style="color: #002fa7; font-size: 20px;">问答互动</span>和<span style="color: #002fa7; font-size: 20px;">文章分享</span>平台</div>
    </div>
        <div>
            <input type="text" id="email" placeholder="邮箱">
            <button id="send_authcode_button">发送验证码</button>
            <span id="send_state_msg" style="color: brown;"></span>
        </div>
        <div>
            <input type="text" id="authcode" placeholder="验证码">
        </div>
        <div>
            <input type="password" id="password" placeholder="密码">
        </div>
        <div>
            <input type="password" id="confirm_password" placeholder="确认密码">
        </div>
        <div>
            <span id="reset_password_errormsg" style="color: brown;">&nbsp</span>
        </div>
        <div>
            <button id="reset_password_button">重置密码</button>
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
        } else {
            $.ajax({
                url: "/service/verifyemail",
                type: "get",
                data: { "email": email },
                success: function(resp) {
                    if (resp === "0") {
                        $("#send_state_msg").empty();
                        $("#send_state_msg").append("邮箱未注册");
                    } else if (resp === "2") {
                        $("#send_state_msg").empty();
                        $("#send_state_msg").append("请稍后再试");
                    } else {
                        $.ajax({
                            url: "/service/authcode",
                            type: "get",
                            data: { "email": email },
                            success: function(resp) {
                                $("#send_state_msg").empty();
                                $("#send_state_msg").append(resp.result);
                            },
                            error: function() {
                                $("#send_state_msg").empty();
                                $("#send_state_msg").append("请稍后再试");
                            }
                        });
                    }
                },
                error: function() {
                    $("#send_state_msg").empty();
                    $("#send_state_msg").append("请稍后再试");
                }
            });
        }
    });

    $("#reset_password_button").click(function() {
        let email = $("#email").val();
        let authcode = $("#authcode").val();
        let password = $("#password").val();
        let confirm_password = $("#confirm_password").val();
        if (email === "") {
            $("#reset_password_errormsg").empty();
            $("#reset_password_errormsg").append("邮箱不能为空");
        } else if (authcode === "") {
            $("#reset_password_errormsg").empty();
            $("#reset_password_errormsg").append("验证码不能为空");
        } else if (password === "") {
            $("#reset_password_errormsg").empty();
            $("#reset_password_errormsg").append("密码不能为空");
        } else if (confirm_password === "") {
            $("#reset_password_errormsg").empty();
            $("#reset_password_errormsg").append("确认密码不能为空");
        } else if (password !== confirm_password) {
            $("#reset_password_errormsg").empty();
            $("#reset_password_errormsg").append("两次密码不一致");
        } else {
            let lv = 0;
            if (password.match(/[A-Za-z]/g)) { lv++; }
            if (password.match(/[0-9]/g)) { lv++; }
            if (password.match(/[^A-Za-z0-9]/g)) { lv++; }
            if (password.length < 6) { lv = 1; }
            if (lv <= 1) {
                $("#reset_password_errormsg").empty();
                $("#reset_password_errormsg").append("密码强度低");
                alert("密码应至少包含字母、数字、标点符号中的两种，且不少于6位！");
            } else {
                let password_encrypted = hex_md5(password);
                $.ajax({
                    url: "/reset_password",
                    type: "post",
                    data: {
                        "email": email,
                        "authcode": authcode,
                        "password": password_encrypted
                    },
                    success: function(resp) {
                        $("#reset_password_errormsg").empty();
                        $("#reset_password_errormsg").append(resp);
                        if (resp === "重置密码成功") {
                            location.assign("/login");
                        }
                    },
                    error: function() {
                        $("#reset_password_errormsg").empty();
                        $("#reset_password_errormsg").append("请稍后再试");
                    }
                });
            }
        }
    });
});