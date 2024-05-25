$(document).ready(function() {
    $("main").append(`
    <style>
        main a {
            text-decoration: none;
            color: black;
            font-size: 24px;
            font-weight: bold;
        }
        main hr {
            border: 0;
            height: 1px;
            background: #ddd;
        }
    </style>
    <div style="display: flex; justify-content: space-between; align-items: center;">
        <div style="height: 50px; margin-left: auto;">
            <div id="hotspot_button" style="cursor:pointer; display: inline-block; font-size: 20px; height: 40px; width: 100px; text-align: center; line-height: 40px;">热门</div>
            <div id="newspot_button" style="cursor:pointer; display: inline-block; font-size: 20px; height: 40px; width: 100px; text-align: center; line-height: 40px;">最近</div>
        </div>
    </div>
    <div id="hotspot_block">
        热门...
    </div>
    <div id="newspot_block">
        最近...
    </div>
    <script>
        $(document).ready(function() {
            $("#hotspot_button").css("background-color", "#002fa7");
            $("#hotspot_button").css("color", "white");
            $("#newspot_block").hide();
        });
    </script>
    `);

    $.ajax({
        url: "/service/matching/hottest",
        type: "get",
        success: function(resp) {
            magic_split_flag = resp.slice(0, 4);
            resp = resp.slice(4, resp.length);
            resp = resp.split(magic_split_flag);
            $("#hotspot_block").empty();
            for (let i = 0; i < resp.length; i += 9) {
                // type - userid - username - head - questionid/articleid - title - issue_time/update_time - views - answer_num/like_num
                let type = resp[i];
                let userid = resp[i + 1];
                let username = resp[i + 2];
                let head = resp[i + 3];
                let assetid = resp[i + 4];
                let title = resp[i + 5];
                let update_time = resp[i + 6];
                let views = resp[i + 7];
                let answer_or_like_num = resp[i + 8];
                let type_msg = new Array();
                if (type === "0") {
                    type_msg["en"] = "question";
                    type_msg["zh"] = "问题";
                } else {
                    type_msg["en"] = "article";
                    type_msg["zh"] = "文章";
                }
                $("#hotspot_block").append(`
                <div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; align-items: center;">
                            <span style="display: inline-flex; align-items: center;"><a href="/user/${userid}"><img src="${head}" height="40" width="40" style="border-radius: 10%;"></a></span>
                            &nbsp&nbsp&nbsp
                            <span style="display: inline-flex; align-items: center;">${username}</span>
                        </div>
                        <span style="margin-left: auto;"><img src="/static/img/${type_msg["en"]}.svg" alt="${type_msg["zh"]}" height="20" width="20"></span>
                    </div>
                    <div>
                        <span><a href="/${type_msg["en"]}/${assetid}">${title}</a></span>
                    </div>
                </div>
                `);
                if (type === "0") {
                    $("#hotspot_block").append(`
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="margin-right: auto;">${update_time}</span>
                        <div style="margin-left: auto;">
                            <span>共 ${answer_or_like_num} 条回答</span>
                            <span><img src="/static/img/view.svg" alt="浏览量" height="15" width="15"></span>
                            <span>${views}</span>
                        </div>
                    </div>
                    <hr>
                    `);
                } else {
                    $("#hotspot_block").append(`
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="margin-right: auto;">更新于 ${update_time}</span>
                        <div style="margin-left: auto;">
                            <span><img src="/static/img/like.svg" alt="喜欢" height="15" width="15"></span>
                            <span>${answer_or_like_num}</span>
                            <span><img src="/static/img/view.svg" alt="浏览量" height="15" width="15"></span>
                            <span>${views}</span>
                        </div>
                    </div>
                    <hr>
                    `);
                }
            }
        }
    });

    $.ajax({
        url: "/service/matching/latest",
        type: "get",
        success: function(resp) {
            magic_split_flag = resp.slice(0, 4);
            resp = resp.slice(4, resp.length);
            resp = resp.split(magic_split_flag);
            $("#newspot_block").empty();
            for (let i = 0; i < resp.length; i += 9) {
                // type - userid - username - head - questionid/articleid - title - issue_time/update_time - views - answer_num/like_num
                let type = resp[i];
                let userid = resp[i + 1];
                let username = resp[i + 2];
                let head = resp[i + 3];
                let assetid = resp[i + 4];
                let title = resp[i + 5];
                let update_time = resp[i + 6];
                let views = resp[i + 7];
                let answer_or_like_num = resp[i + 8];
                let type_msg = new Array();
                if (type === "0") {
                    type_msg["en"] = "question";
                    type_msg["zh"] = "问题";
                } else {
                    type_msg["en"] = "article";
                    type_msg["zh"] = "文章";
                }
                $("#newspot_block").append(`
                <div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; align-items: center;">
                            <span style="display: inline-flex; align-items: center;"><a href="/user/${userid}"><img src="${head}" height="40" width="40" style="border-radius: 10%;"></a></span>
                            &nbsp&nbsp&nbsp
                            <span style="display: inline-flex; align-items: center;">${username}</span>
                        </div>
                        <span style="margin-left: auto;"><img src="/static/img/${type_msg["en"]}.svg" alt="${type_msg["zh"]}" height="20" width="20"></span>
                    </div>
                    <div>
                        <span><a href="/${type_msg["en"]}/${assetid}">${title}</a></span>
                    </div>
                </div>
                `);
                if (type === "0") {
                    $("#newspot_block").append(`
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="margin-right: auto;">${update_time}</span>
                        <div style="margin-left: auto;">
                            <span>共 ${answer_or_like_num} 条回答</span>
                            <span><img src="/static/img/view.svg" alt="浏览量" height="15" width="15"></span>
                            <span>${views}</span>
                        </div>
                    </div>
                    <hr>
                    `);
                } else {
                    $("#newspot_block").append(`
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="margin-right: auto;">更新于 ${update_time}</span>
                        <div style="margin-left: auto;">
                            <span><img src="/static/img/like.svg" alt="喜欢" height="15" width="15"></span>
                            <span>${answer_or_like_num}</span>
                            <span><img src="/static/img/view.svg" alt="浏览量" height="15" width="15"></span>
                            <span>${views}</span>
                        </div>
                    </div>
                    <hr>
                    `);
                }
            }
        }
    });

    $("#hotspot_button").click(function() {
        $("#hotspot_button").css("background-color", "#002fa7");
        $("#hotspot_button").css("color", "white");
        $("#newspot_button").css("background-color", "white");
        $("#newspot_button").css("color", "black");
        $("#hotspot_block").show();
        $("#newspot_block").hide();
    });

    $("#newspot_button").click(function() {
        $("#hotspot_button").css("background-color", "white");
        $("#hotspot_button").css("color", "black");
        $("#newspot_button").css("background-color", "#002fa7");
        $("#newspot_button").css("color", "white");
        $("#hotspot_block").hide();
        $("#newspot_block").show();
    });
});