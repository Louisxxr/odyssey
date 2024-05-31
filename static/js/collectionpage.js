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
        
        .content {
            font-size: 16px;
            margin: 5px 0;
            display: inline-block;
        }
        
        .like_num {
            font-size: 14px;
            color: #333;
            display: inline-block;
        }

        .tooltip-container {
            position: relative;
            display: inline-block;
        }
        
        .tooltip {
            position: absolute;
            background-color: rgba(0, 0, 0, 0.75);
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            white-space: nowrap;
            display: none;
            z-index: 1000;
        }
        
        .tooltip-container:hover .tooltip {
            display: block;
        }
    </style>
    <div style="display: flex; justify-content: space-between; align-items: center;">
        <div class="tooltip-container" style="margin-right: auto;">
            <img src="/static/img/tip.svg" height="20" width="20">
            <div class="tooltip">点赞回答或文章后，自动加入收藏夹</div>
        </div>
        <div style="height: 50px; margin-left: auto;">
            <div id="answer_list_button" style="cursor:pointer; display: inline-block; font-size: 20px; height: 40px; width: 150px; text-align: center; line-height: 40px;">收藏的回答</div>
            <div id="article_list_button" style="cursor:pointer; display: inline-block; font-size: 20px; height: 40px; width: 150px; text-align: center; line-height: 40px;">收藏的文章</div>
        </div>
    </div>
    <div id="answer_list_area">
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="margin-left: auto;"><strong>收藏了</strong> <span id="answer_count"></span> <strong>个回答</strong></span>
        </div>
        <div id="answer_list">
        </div>
    </div>
    <div id="article_list_area">
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="margin-left: auto;"><strong>收藏了</strong> <span id="article_count"></span> <strong>篇文章</strong></span>
        </div>
        <div id="article_list">
        </div>
    </div>
    <script>
        $(document).ready(function() {
            $("#answer_list_button").css("background-color", "#002fa7");
            $("#answer_list_button").css("color", "white");
            $("#article_list_area").hide();
        });
    </script>
    `);

    $.ajax({
        url: "/service/collection/answer",
        type: "get",
        success: function(resp) {
            if (resp === "") {
                $("#answer_count").append("0");
                $("#answer_list").append("<div>你还没有收藏的回答哦</div>");
            } else {
                magic_split_flag = resp.slice(0, 4);
                resp = resp.slice(4, resp.length);
                resp = resp.split(magic_split_flag);
                $("#answer_count").append(String(resp.length / 9));
                for (let i = 0; i < resp.length; i += 9) {
                    let userid = resp[i];
                    let username = resp[i + 1];
                    let head = resp[i + 2];
                    let questionid = resp[i + 3];
                    let title = resp[i + 4];
                    let answerid = resp[i + 5];
                    let content = resp[i + 6];
                    let issue_time = resp[i + 7];
                    let like_num = resp[i + 8];
                    $("#answer_list").append(`
                    <div class="list_item">
                        <a href="/user/${userid}"><img class="head" src="${head}" alt="头像"></a>
                        <div class="info">
                            <div class="info_top">
                                <span class="username">${username}</span>
                                <span class="issue_time">收藏于 ${issue_time}</span>
                            </div>
                            <a href="/question/${questionid}#answer_${answerid}_to_the_question" class="title">${title.slice(3, -4)}</a>
                            <div class="content">${content.slice(3, -4)}</div>
                            <div>
                                <img src="/static/img/like.svg" alt="喜欢" height="15" width="15">
                                <div class="like_num">${like_num}</div>
                            </div>
                        </div>
                    </div>
                    `);
                }
            }
        }
    });

    $.ajax({
        url: "/service/collection/article",
        type: "get",
        success: function(resp) {
            if (resp === "") {
                $("#article_count").append("0");
                $("#article_list").append("<div>你还没有收藏的文章哦，快去广场发现感兴趣的文章吧</div>");
            } else {
                magic_split_flag = resp.slice(0, 4);
                resp = resp.slice(4, resp.length);
                resp = resp.split(magic_split_flag);
                $("#article_count").append(String(resp.length / 7));
                for (let i = 0; i < resp.length; i += 7) {
                    let userid = resp[i];
                    let username = resp[i + 1];
                    let head = resp[i + 2];
                    let articleid = resp[i + 3];
                    let title = resp[i + 4];
                    let issue_time = resp[i + 5];
                    let like_num = resp[i + 6];
                    $("#article_list").append(`
                    <div class="list_item">
                        <a href="/user/${userid}"><img class="head" src="${head}" alt="头像"></a>
                        <div class="info">
                            <div class="info_top">
                                <span class="username">${username}</span>
                                <span class="issue_time">收藏于 ${issue_time}</span>
                            </div>
                            <a href="/article/${articleid}" class="title">${title.slice(3, -4)}</a>
                            <div>
                                <img src="/static/img/like.svg" alt="喜欢" height="15" width="15">
                                <div class="like_num">${like_num}</div>
                            </div>
                        </div>
                    </div>
                    `);
                }
            }
        }
    });

    $("#answer_list_button").click(function() {
        $("#answer_list_button").css("background-color", "#002fa7");
        $("#answer_list_button").css("color", "white");
        $("#article_list_button").css("background-color", "white");
        $("#article_list_button").css("color", "black");
        $("#answer_list_area").show();
        $("#article_list_area").hide();
    });

    $("#article_list_button").click(function() {
        $("#answer_list_button").css("background-color", "white");
        $("#answer_list_button").css("color", "black");
        $("#article_list_button").css("background-color", "#002fa7");
        $("#article_list_button").css("color", "white");
        $("#answer_list_area").hide();
        $("#article_list_area").show();
    });

    document.addEventListener('DOMContentLoaded', () => {
        const tooltipContainer = document.querySelector('.tooltip-container');
        const tooltip = document.querySelector('.tooltip');
    
        tooltipContainer.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            tooltip.style.left = `${mouseX + 10}px`;
            tooltip.style.top = `${mouseY + 10}px`;
        });
    
        tooltipContainer.addEventListener('mouseenter', () => {
            tooltip.style.display = 'block';
        });
    
        tooltipContainer.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
        });
    });
});