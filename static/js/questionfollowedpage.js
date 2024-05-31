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
        
        .info_top {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
        }
        
        .username {
            color: #333;
        }
        
        .issue_time {
            color: #666;
        }
        
        .title {
            font-weight: bold;
            font-size: 18px;
            margin: 5px 0;
            text-decoration: none;
            color: black;
        }
        
        .answer_num {
            font-size: 14px;
            color: #333;
        }    
    </style>
    <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="margin-left: auto;"><strong>关注了</strong> <span id="followingcount"></span> <strong>个问题</strong></span>
    </div>
    <div id="followinglist">
    </div>
    `);

    $.ajax({
        url: "/service/questionfollowinglist",
        type: "get",
        success: function(resp) {
            if (resp === "") {
                $("#followingcount").append("0");
                $("#followinglist").append("<div>你还没有关注的问题哦，快去广场发现感兴趣的问题吧</div>");
            } else {
                magic_split_flag = resp.slice(0, 4);
                resp = resp.slice(4, resp.length);
                resp = resp.split(magic_split_flag);
                $("#followingcount").append(String(resp.length / 7));
                for (let i = 0; i < resp.length; i += 7) {
                    let userid = resp[i];
                    let username = resp[i + 1];
                    let head = resp[i + 2];
                    let questionid = resp[i + 3];
                    let title = resp[i + 4];
                    let issue_time = resp[i + 5];
                    let answer_num = resp[i + 6];
                    $("#followinglist").append(`
                    <div class="list_item">
                        <a href="/user/${userid}"><img class="head" src="${head}" alt="头像"></a>
                        <div class="info">
                            <div class="info_top">
                                <span class="username">${username}</span>
                                <span class="issue_time">关注于 ${issue_time}</span>
                            </div>
                            <a href="/question/${questionid}" class="title">${title.slice(3, -4)}</a>
                            <div class="answer_num">已有 ${answer_num} 条回答</div>
                        </div>
                    </div>
                    `);
                }
            }
        }
    });
});