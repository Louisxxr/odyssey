$(document).ready(function() {
    $("#login").empty();
    $("#login").append('<a href="/register">注册</a>');
    $("main").append(`
    <form>
        <div>
            <label>
                用户名：
                <input type="text">
            </label>
        </div>
        <div>
            <label>
                密码：
                <input type="password">
            </label>
        </div>
        <a href="/reset_password">忘记密码</a>
        <div>
            <input type="submit" value="登录">
        </div>
    </form>
    `);
});