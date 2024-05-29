$(document).ready(function() {
    $("main").append(`
    <style>
        main hr {
            border: 0;
            height: 1px;
            background: #ddd;
        }
    </style>
    <div style="display: flex; justify-content: space-between; align-items: center;">
        <div style="height: 50px; margin-left: auto;">
            <a href="/user_followed"><div style="cursor:pointer; display: inline-block; font-size: 20px; height: 40px; width: 100px; text-align: center; line-height: 40px; background-color: white; color: black;">关注了</div></a>
            <a href="/user_following_me"><div style="cursor:pointer; display: inline-block; font-size: 20px; height: 40px; width: 100px; text-align: center; line-height: 40px; background-color: #002fa7; color: white;">被关注</div></a>
        </div>
    </div>
    <div id="followerlist">
    </div>
    `);
});