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
        <div class="list_item">
            <img class="head" src="head" alt="头像">
            <div class="info">
                <div class="info_top">
                    <span class="username">username</span>
                    <span class="issue_time">关注于 issue_time</span>
                </div>
                <div class="title">title</div>
                <div class="answer_num">已有 answer_num 条回答</div>
            </div>
        </div>
    </div>
    `);
});