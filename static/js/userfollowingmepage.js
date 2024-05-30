$(document).ready(function() {
    $("main").append(`
    <style>
        .list_item {
            display: flex;
            align-items: center;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            margin: 10px;
            background-color: #fff;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .head {
            width: 50px;
            height: 50px;
            border-radius: 5%;
            margin-right: 15px;
        }
        
        .info {
            flex: 1;
            display: flex;
            flex-direction: column;
        }
        
        .username {
            font-weight: bold;
            font-size: 16px;
        }
        
        .signature {
            font-size: 14px;
            color: #666;
            margin: 5px 0;
        }
        
        .fans_num {
            font-size: 12px;
            color: #999;
        }

        .followed_button {
            background-color: #666;
            border: none;
            border-radius: 5px;
            color: white;
            font-family: inherit;
            font-size: 16px;
            padding: 5px 20px;
            margin: 4px 2px;
            cursor: pointer;
            display: block;
            white-space: nowrap;
            overflow: hidden;
        }
        
        .followed_button:hover {
            background-color: #555;
        }
    </style>
    <div style="display: flex; justify-content: space-between; align-items: center;">
        <div style="height: 50px; margin-left: auto;">
            <a href="/user_followed"><div style="cursor:pointer; display: inline-block; font-size: 20px; height: 40px; width: 100px; text-align: center; line-height: 40px; background-color: white; color: black;">关注了</div></a>
            <a href="/user_following_me"><div style="cursor:pointer; display: inline-block; font-size: 20px; height: 40px; width: 100px; text-align: center; line-height: 40px; background-color: #002fa7; color: white;">被关注</div></a>
        </div>
    </div>
    <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="margin-left: auto;"><strong>被</strong> <span id="followercount"></span> <strong>人关注</strong></span>
    </div>
    <div id="followerlist">
    </div>
    `);

    $.ajax({
        async: false,
        url: "/service/followerlist",
        type: "get",
        success: function(resp) {
            if (resp === "") {
                $("#followercount").append("0");
                $("#followerlist").append("<div>还没有其他人关注你哦</div>");
            } else {
                magic_split_flag = resp.slice(0, 4);
                resp = resp.slice(4, resp.length);
                resp = resp.split(magic_split_flag);
                $("#followercount").append(String(resp.length / 5));
                for (let i = 0; i < resp.length; i += 5) {
                    let userid = resp[i];
                    let username = resp[i + 1];
                    let head = resp[i + 2];
                    let signature = resp[i + 3];
                    let fans_num = resp[i + 4];
                    $("#followerlist").append(`
                    <div class="list_item">
                        <a href="/user/${userid}"><img class="head" src="${head}" alt="头像"></a>
                        <div class="info">
                            <div class="username">${username}</div>
                            <div class="signature">${signature}</div>
                            <div class="fans_num">粉丝数: ${fans_num}</div>
                        </div>
                        <button id="followed_button_${userid}" class="followed_button">已关注</button>
                        <button id="to_follow_button_${userid}">关注</button>
                        <script>
                            $(document).ready(function() {
                                $("#followed_button_${userid}").hide();
                                $("#to_follow_button_${userid}").hide();
                            })
                        </script>
                    </div>
                    `);
                    $.ajax({
                        url: "/service/checkfollowuser",
                        type: "get",
                        data: { "followee_userid": userid },
                        success: function(resp) {
                            if (resp === "1") {
                                $(`#followed_button_${userid}`).show();
                            } else {
                                $(`#to_follow_button_${userid}`).show();
                            }
                        }
                    });
                }
            }
        }
    });

    $("[id^=followed_button_]").click(function() {
        let userid = $(this).context.id.split("_")[2];
        $.ajax({
            url: "/service/unfollowuser",
            type: "get",
            data: { "followee_userid": userid },
            success: function() {
                $(`#followed_button_${userid}`).hide();
                $(`#to_follow_button_${userid}`).show();
            },
            error: function() {
                alert("请稍后再试~");
            }
        });
    });

    $("[id^=to_follow_button_]").click(function() {
        let userid = $(this).context.id.split("_")[3];
        $.ajax({
            url: "/service/followuser",
            type: "get",
            data: { "followee_userid": userid },
            success: function() {
                $(`#followed_button_${userid}`).show();
                $(`#to_follow_button_${userid}`).hide();
            },
            error: function() {
                alert("请稍后再试~");
            }
        });
    });
});