$(document).ready(function() {
    $("main").append(`
    <div>
        <span id="hotspot_button" style="cursor:pointer;">热门</span>
        <span id="newspot_button" style="cursor:pointer;">最近</span>
    </div>
    <div id="hotspot_block">
        热门...
    </div>
    <div id="newspot_block">
        最近...
    </div>
    <script>
        $(document).ready(function() {
            $("#hotspot_button").css("background-color", "grey");
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
                    <div>
                        <span><a href="/user/${userid}"><img src="${head}" height="40" width="40" style="border-radius: 10%;"></a></span>
                        <span>${username}</span>
                        <span><img src="/static/img/${type_msg["en"]}.svg" alt="${type_msg["zh"]}" height="20" width="20"></span>
                    </div>
                    <div>
                        <span><a href="/${type_msg["en"]}/${assetid}">${title}</a></span>
                    </div>
                </div>
                `);
                if (type === "0") {
                    $("#hotspot_block").append(`
                    <div>
                        <span>${update_time}</span>
                        <span><img src="/static/img/view.svg" alt="浏览量" height="15" width="15"></span>
                        <span>${views}</span>
                        <span>共 ${answer_or_like_num} 条回答</span>
                    </div>
                    `);
                } else {
                    $("#hotspot_block").append(`
                    <div>
                        <span>${update_time}</span>
                        <span><img src="/static/img/view.svg" alt="浏览量" height="15" width="15"></span>
                        <span>${views}</span>
                        <span><img src="/static/img/like.svg" alt="喜欢" height="15" width="15"></span>
                        <span>${answer_or_like_num}</span>
                    </div>
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
                    <div>
                        <span><a href="/user/${userid}"><img src="${head}" height="40" width="40" style="border-radius: 10%;"></a></span>
                        <span>${username}</span>
                        <span><img src="/static/img/${type_msg["en"]}.svg" alt="${type_msg["zh"]}" height="20" width="20"></span>
                    </div>
                    <div>
                        <span><a href="/${type_msg["en"]}/${assetid}">${title}</a></span>
                    </div>
                </div>
                `);
                if (type === "0") {
                    $("#newspot_block").append(`
                    <div>
                        <span>${update_time}</span>
                        <span><img src="/static/img/view.svg" alt="浏览量" height="15" width="15"></span>
                        <span>${views}</span>
                        <span>共 ${answer_or_like_num} 条回答</span>
                    </div>
                    `);
                } else {
                    $("#newspot_block").append(`
                    <div>
                        <span>${update_time}</span>
                        <span><img src="/static/img/view.svg" alt="浏览量" height="15" width="15"></span>
                        <span>${views}</span>
                        <span><img src="/static/img/like.svg" alt="喜欢" height="15" width="15"></span>
                        <span>${answer_or_like_num}</span>
                    </div>
                    `);
                }
            }
        }
    });

    $("#hotspot_button").click(function() {
        $("#hotspot_button").css("background-color", "grey");
        $("#newspot_button").css("background-color", "white");
        $("#hotspot_block").show();
        $("#newspot_block").hide();
    });

    $("#newspot_button").click(function() {
        $("#hotspot_button").css("background-color", "white");
        $("#newspot_button").css("background-color", "grey");
        $("#hotspot_block").hide();
        $("#newspot_block").show();
    });
});