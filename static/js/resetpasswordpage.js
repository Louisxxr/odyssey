var email_pattern = /^([A-Za-z0-9_\-\.])+\@(qq\.com|163\.com|sina\.com|sina\.cn|sohu\.com|hotmail\.com|189\.cn|gmail\.com)$/;

$(document).ready(function() {
    $("main").append(`
    <div>
        <div>
            忘记密码
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
            密码：<input type="password" id="password">
        </div>
        <div>
            确认密码：<input type="password" id="confirm_password">
        </div>
        <div>
            <span id="reset_password_errormsg"></span>
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