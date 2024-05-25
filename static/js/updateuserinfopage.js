var email_pattern = /^([A-Za-z0-9_\-\.])+\@(qq\.com|163\.com|sina\.com|sina\.cn|sohu\.com|hotmail\.com|189\.cn|gmail\.com)$/;

$(document).ready(function() {
    $("main").append(`
    <style>
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
        select {
            width: 10%;
            padding: 4px 10px 10px 10px;
            border: 2px solid #ddd;
            border-radius: 25px;
            height: 40px;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
        }
    </style>
    <div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="color: black; font-size: 48px; font-weight: bold; margin-left: auto;">编辑个人资料</div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="margin-left: auto;"><a href="/homepage">返回我的主页</a></span>
        </div>
        <div style="height: 50px;">
            <span style="color: black; font-style: italic;">修改头像&emsp;&emsp;</span><input type="file" accept="image/*" id="select_head">
            <button id="upload_head">保存</button>
            <span id="upload_head_errormsg" style="color: red;"></span>
            <script>
                $(document).ready(function() {
                    $("#upload_head").hide();
                })
            </script>
        </div>
        <div>
            <input type="text" id="fillin_username" placeholder="用户名">
            <button id="upload_username">保存</button>
            <span id="upload_username_errormsg" style="color: red;"></span>
            <script>
                $(document).ready(function() {
                    $("#upload_username").hide();
                })
            </script>
        </div>
        <div>
            <div>
                <input type="text" id="fillin_email" placeholder="邮箱">
                <button id="send_authcode">发送验证码</button>
                <span id="send_authcode_errormsg" style="color: red;"></span>
            </div>
            <div id="authcode_block">
                <input type="text" id="fillin_authcode" placeholder="验证码">
                <button id="upload_email_authcode">保存</button>
                <span id="upload_email_authcode_errormsg" style="color: red;"></span>
            </div>
            <script>
                $(document).ready(function() {
                    $("#send_authcode").hide();
                    $("#authcode_block").hide();
                })
            </script>
        </div>
        <div style="height: 50px;">
            <span style="color: black; font-style: italic;">性别&emsp;&emsp;&emsp;</span>
            <select id="select_sex">
                <option value="M">男</option>
                <option value="W">女</option>
            </select>
            <button id="upload_sex">保存</button>
            <span id="upload_sex_errormsg" style="color: red;"></span>
            <script>
                $(document).ready(function() {
                    $("#upload_sex").hide();
                })
            </script>
        </div>
        <div>
            <link rel="stylesheet" href="../static/css/xs-date.css">
            <input type="text" id="select_birthday" readonly="readonly" placeholder="生日">
            <button id="upload_birthday">保存</button>
            <span id="upload_birthday_errormsg" style="color: red;"></span>

            <div style="position: relative;">
                <div class="xs-date">
                    <div class="xs-date-title">
                        <div class="date-year-prev"> << </div>
                        <div class="date-prev"> < </div>
                        <div class="date-time"></div>
                        <div class="date-next"> > </div>
                        <div class="date-year-next"> >> </div>
                    </div>
                    <div class="xs-date-week">
                        <div>日</div>
                        <div>一</div>
                        <div>二</div>
                        <div>三</div>
                        <div>四</div>
                        <div>五</div>
                        <div>六</div>
                    </div>
                    <div class="xs-date-day">
                    </div>
                </div>
            </div>

			<script>
                let date_time = document.querySelector(".date-time");
                let prev = document.querySelector(".date-prev");
                let next = document.querySelector(".date-next");
                let prev_year = document.querySelector(".date-year-prev");
                let next_year = document.querySelector(".date-year-next");
                let date_day = document.querySelector(".xs-date-day");

                // 初始
                let date = new Date() // 当前时间

                function updateTime() {
                    let year = date.getFullYear(); // 当前年份
                    let month = date.getMonth() + 1; // 当前月
                    month < 10 ? month = "0" + month : month;
                    let day = date.getDate(); // 当前天
                    day < 10 ? day = "0" + day : day;

                    date_day.innerHTML = "";
                    date_time.innerText = year + "年 " + month + "月"; // 标题时间

                    var setDate = new Date(year, month, 0);
                    var setDay = setDate.getDate(); // 这个月天数
                    var setWeek = new Date(year, month - 1, 1).getDay(); // 上个月星期几
                    var setDayEM = new Date(year, month - 1, 0).getDate(); // 上个月天数

                    // 渲染上个月星期
                    setWeek <= 0 ? setWeek = 7 : setWeek;
                    for (let i = (setDayEM - setWeek) + 1; i <= setDayEM; i++) {
                        let EmptyDiv = document.createElement('div');
                        EmptyDiv.innerText = i;
                        EmptyDiv.className = "Disable";
                        date_day.appendChild(EmptyDiv);
                    }

                    // 渲染日期
                    for (let i = 1; i <= setDay; i++) {
                        let TimeDiv = document.createElement('div');
                        TimeDiv.innerText = i;
                        TimeDiv.className = "item-time";
                        if (i == day) {
                            TimeDiv.classList.add("active");
                        }
                        date_day.appendChild(TimeDiv);
                    }

                    // 渲染尾部
                    for (let i = 1; i <= (42 - setWeek - setDay); i++) {
                        let DisDiv = document.createElement('div');
                        DisDiv.innerText = i;
                        DisDiv.className = "Disable";
                        date_day.appendChild(DisDiv);
                    }
                    itemClick(year,month);
                }

                updateTime();
                prev.onclick = function() {
                    date.setMonth(date.getMonth() - 1);
                    updateTime();
                };
                next.onclick = function() {
                    date.setMonth(date.getMonth() + 1);
                    updateTime();
                };
                prev_year.onclick = function() {
                    date.setYear(date.getFullYear() - 1);
                    updateTime();
                };
                next_year.onclick = function() {
                    date.setYear(date.getFullYear() + 1);
                    updateTime();
                };

                function itemClick(year, month) {
                    let item_time = document.querySelectorAll(".item-time");
                    for (let i = 0; i < item_time.length; i++) {
                        item_time[i].onclick = function() {
                            for (let i = 0; i < item_time.length; i++) {
                                item_time[i].classList.remove("active");
                            }
                            this.classList.add("active");
                            let that = this;
                            $(document).ready(function() {
                                if (that.innerText < 10) {
                                    $("#select_birthday").val(year + "-" + month + "-0" + that.innerText);
                                } else {
                                    $("#select_birthday").val(year + "-" + month + "-" + that.innerText);
                                }
                            });
                        }
                    }
                }

                $(document).ready(function() {
                    $("#upload_birthday").hide();
                    $(".xs-date").hide();
                    $("#select_birthday").focus(function() {
                        $(".xs-date").show();
                        $(".xs-date-day").click(function() {
                            $(".xs-date").hide();
                        });
                    });
                });
			</script>
        </div>
        <div>
            <input type="text" id="fillin_signature" placeholder="个性签名">
            <button id="upload_signature">保存</button>
            <span id="upload_signature_errormsg" style="color: red;"></span>
            <script>
                $(document).ready(function() {
                    $("#upload_signature").hide();
                })
            </script>
        </div>
        <div>
        <span style="color: black; font-style: italic;">所在地&emsp;&emsp;</span>
            <select id="select_province"></select>
            <select id="select_city"></select>
            <button id="upload_city">保存</button>
            <span id="upload_city_errormsg" style="color: red;"></span>
            <script>
                $(document).ready(function() {
                    $("#upload_city").hide();
                })
            </script>
        </div>
        <div>
            <input type="text" id="fillin_job" placeholder="职业">
            <button id="upload_job">保存</button>
            <span id="upload_job_errormsg" style="color: red;"></span>
            <script>
                $(document).ready(function() {
                    $("#upload_job").hide();
                })
            </script>
        </div>
        <div>
            <button id="update_password_button">修改密码</button>
        </div>
        <div id="update_password_block">
            <div>
                <input type="password" id="fillin_old_password" placeholder="原密码">
            </div>
            <div>
                <input type="password" id="fillin_new_password" placeholder="新密码">
            </div>
            <div>
                <input type="password" id="fillin_confirm_password" placeholder="确认密码">
            </div>
            <div>
                <span id="update_password_errormsg" style="color: red;">&nbsp</span>
            </div>
            <div>
                <button id="update_password_save">保存</button>
            </div>
        </div>
        <script>
            $(document).ready(function() {
                $("#update_password_block").hide();
            })
        </script>
        <script src="../static/js/plugins/md5.js"></script>
    </div>
    `);

    $("#select_head").on("change", function() {
        $("#upload_head").show();
        $("#upload_head").click(function() {
            let img_in_form = new FormData();
            img_in_form.append("file", $("#select_head")[0].files[0]);
            $.ajax({
                url: "/service/uploadimg/head",
                type: "post",
                data: img_in_form,
                processData: false,
                contentType: false,
                success: function(resp) {
                    let head = resp.data.url;
                    $.ajax({
                        url: "/update_userinfo/head",
                        type: "post",
                        data: { "head": head },
                        success: function(resp) {
                            $("#upload_head_errormsg").empty();
                            $("#upload_head_errormsg").append(resp);
                        },
                        error: function() {
                            $("#upload_head_errormsg").empty();
                            $("#upload_head_errormsg").append("请稍后再试");
                        }
                    });
                },
                error: function() {
                    $("#upload_head_errormsg").empty();
                    $("#upload_head_errormsg").append("请稍后再试");
                }
            });
        });
    });

    $("#fillin_username").focus(function() {
        $("#upload_username").show();
        $("#upload_username").click(function() {
            let username = $("#fillin_username").val();
            if (username === "") {
                $("#upload_username_errormsg").empty();
                $("#upload_username_errormsg").append("用户名不能为空");
            } else if (username.length > 25) {
                $("#upload_username_errormsg").empty();
                $("#upload_username_errormsg").append("用户名过长");
            } else {
                $.ajax({
                    url: "/update_userinfo/username",
                    type: "post",
                    data: { "username": username },
                    success: function(resp) {
                        $("#upload_username_errormsg").empty();
                        $("#upload_username_errormsg").append(resp);
                    },
                    error: function() {
                        $("#upload_username_errormsg").empty();
                        $("#upload_username_errormsg").append("请稍后再试");
                    }
                });
            }
        });
    });

    $("#fillin_email").focus(function() {
        $("#send_authcode").show();
        $("#authcode_block").show();
        $("#send_authcode").click(function() {
            let email = $("#fillin_email").val();
            if (email === "") {
                $("#send_authcode_errormsg").empty();
                $("#send_authcode_errormsg").append("邮箱不能为空");
            } else if (email > 320) {
                $("#send_authcode_errormsg").empty();
                $("#send_authcode_errormsg").append("发送失败，请检查邮箱");
            } else if (!email_pattern.test(email)) {
                $("#send_authcode_errormsg").empty();
                $("#send_authcode_errormsg").append("发送失败，请检查邮箱");
                alert("暂仅支持QQ邮箱、网易邮箱、新浪邮箱、搜狐邮箱、Hotmail邮箱、189邮箱、谷歌邮箱！");
            } else {
                $.ajax({
                    url: "/service/verifyemail",
                    type: "get",
                    data: { "email": email },
                    success: function(resp) {
                        if (resp === "1") {
                            $("#send_authcode_errormsg").empty();
                            $("#send_authcode_errormsg").append("邮箱已注册");
                        } else if (resp === "2") {
                            $("#send_authcode_errormsg").empty();
                            $("#send_authcode_errormsg").append("请稍后再试");
                        } else {
                            $.ajax({
                                url: "/service/authcode",
                                type: "get",
                                data: { "email": email },
                                success: function(resp) {
                                    $("#send_authcode_errormsg").empty();
                                    $("#send_authcode_errormsg").append(resp.result);
                                },
                                error: function() {
                                    $("#send_authcode_errormsg").empty();
                                    $("#send_authcode_errormsg").append("请稍后再试");
                                }
                            });
                        }
                    },
                    error: function() {
                        $("#send_authcode_errormsg").empty();
                        $("#send_authcode_errormsg").append("请稍后再试");
                    }
                });
            }
        });
    });

    $("#upload_email_authcode").click(function() {
        let email = $("#fillin_email").val();
        let authcode = $("#fillin_authcode").val();
        if (email === "") {
            $("#upload_email_authcode_errormsg").empty();
            $("#upload_email_authcode_errormsg").append("邮箱不能为空");
        } else if (authcode === "") {
            $("#upload_email_authcode_errormsg").empty();
            $("#upload_email_authcode_errormsg").append("验证码不能为空");
        } else {
            $.ajax({
                url: "/update_userinfo/email",
                type: "post",
                data: {
                    "email": email,
                    "authcode": authcode
                },
                success: function(resp) {
                    $("#upload_email_authcode_errormsg").empty();
                    $("#upload_email_authcode_errormsg").append(resp);
                },
                error: function() {
                    $("#upload_email_authcode_errormsg").empty();
                    $("#upload_email_authcode_errormsg").append("请稍后再试");
                }
            });
        }
    });

    $("#select_sex").focus(function() {
        $("#upload_sex").show();
        $("#upload_sex").click(function() {
            let sex = $("#select_sex").val();
            $.ajax({
                url: "/update_userinfo/sex",
                type: "post",
                data: { "sex": sex },
                success: function(resp) {
                    $("#upload_sex_errormsg").empty();
                    $("#upload_sex_errormsg").append(resp);
                },
                error: function() {
                    $("#upload_sex_errormsg").empty();
                    $("#upload_sex_errormsg").append("请稍后再试");
                }
            });
        });
    });

    $("#select_birthday").focus(function() {
        $("#upload_birthday").show();
        $("#upload_birthday").click(function() {
            let birthday = $("#select_birthday").val();
            if (birthday === "") {
                $("#upload_birthday_errormsg").empty();
                $("#upload_birthday_errormsg").append("请选择日期");
            } else {
                $.ajax({
                    url: "/update_userinfo/birthday",
                    type: "post",
                    data: { "birthday": birthday },
                    success: function(resp) {
                        $("#upload_birthday_errormsg").empty();
                        $("#upload_birthday_errormsg").append(resp);
                    },
                    error: function() {
                        $("#upload_birthday_errormsg").empty();
                        $("#upload_birthday_errormsg").append("请稍后再试");
                    }
                });
            }
        });
    });

    $("#fillin_signature").focus(function() {
        $("#upload_signature").show();
        $("#upload_signature").click(function() {
            let signature = $("#fillin_signature").val();
            if (signature.length > 250) {
                $("#upload_signature_errormsg").empty();
                $("#upload_signature_errormsg").append("内容过长");
            } else {
                $.ajax({
                    url: "/update_userinfo/signature",
                    type: "post",
                    data: { "signature": signature },
                    success: function(resp) {
                        $("#upload_signature_errormsg").empty();
                        $("#upload_signature_errormsg").append(resp);
                    },
                    error: function() {
                        $("#upload_signature_errormsg").empty();
                        $("#upload_signature_errormsg").append("请稍后再试");
                    }
                });
            }
        });
    });

    $.ajax({
        url: "/service/provincelist",
        type: "get",
        success: function(resp) {
            resp = resp.split(" ");
            for (let i = 0; i < resp.length; i += 2) {
                let id = resp[i];
                let name = resp[i + 1];
                $("#select_province").append('<option value="' + id + '">' + name + '</option>');
            }
            $.ajax({
                url: "/service/citylist",
                type: "get",
                data: { "provinceid": "1" },
                success: function(resp) {
                    resp = resp.split(" ");
                    $("#select_city").empty();
                    for (let i = 0; i < resp.length; i += 2) {
                        let id = resp[i];
                        let name = resp[i + 1];
                        $("#select_city").append('<option value="' + id + '">' + name + '</option>');
                    }
                }
            });
        }
    });

    $("#select_province").on("change", function() {
        let provinceid = $("#select_province").val();
        $.ajax({
            url: "/service/citylist",
            type: "get",
            data: { "provinceid": provinceid },
            success: function(resp) {
                resp = resp.split(" ");
                $("#select_city").empty();
                for (let i = 0; i < resp.length; i += 2) {
                    let id = resp[i];
                    let name = resp[i + 1];
                    $("#select_city").append('<option value="' + id + '">' + name + '</option>');
                }
            }
        });
    });

    $("#select_province").focus(function() {
        $("#upload_city").show();
        $("#upload_city").click(function() {
            let cityid = $("#select_city").val();
            $.ajax({
                url: "/update_userinfo/city",
                type: "post",
                data: { "cityid": cityid },
                success: function(resp) {
                    $("#upload_city_errormsg").empty();
                    $("#upload_city_errormsg").append(resp);
                },
                error: function() {
                    $("#upload_city_errormsg").empty();
                    $("#upload_city_errormsg").append("请稍后再试");
                }
            });
        });
    });

    $("#fillin_job").focus(function() {
        $("#upload_job").show();
        $("#upload_job").click(function() {
            let job = $("#fillin_job").val();
            if (job.length > 25) {
                $("#upload_job_errormsg").empty();
                $("#upload_job_errormsg").append("内容过长");
            } else {
                $.ajax({
                    url: "/update_userinfo/job",
                    type: "post",
                    data: { "job": job },
                    success: function(resp) {
                        $("#upload_job_errormsg").empty();
                        $("#upload_job_errormsg").append(resp);
                    },
                    error: function() {
                        $("#upload_job_errormsg").empty();
                        $("#upload_job_errormsg").append("请稍后再试");
                    }
                });
            }
        });
    });

    $("#update_password_button").click(function() {
        $("#update_password_block").show();
    });

    $("#update_password_save").click(function() {
        let old_password = $("#fillin_old_password").val();
        let new_password = $("#fillin_new_password").val();
        let confirm_password = $("#fillin_confirm_password").val();
        if (old_password === "") {
            $("#update_password_errormsg").empty();
            $("#update_password_errormsg").append("原密码不能为空");
        } else if (new_password === "") {
            $("#update_password_errormsg").empty();
            $("#update_password_errormsg").append("新密码不能为空");
        } else if (confirm_password === "") {
            $("#update_password_errormsg").empty();
            $("#update_password_errormsg").append("确认密码不能为空");
        } else if (new_password !== confirm_password) {
            $("#update_password_errormsg").empty();
            $("#update_password_errormsg").append("两次密码不一致");
        } else {
            let lv = 0;
            if (new_password.match(/[A-Za-z]/g)) { lv++; }
            if (new_password.match(/[0-9]/g)) { lv++; }
            if (new_password.match(/[^A-Za-z0-9]/g)) { lv++; }
            if (new_password.length < 6) { lv = 1; }
            if (lv <= 1) {
                $("#update_password_errormsg").empty();
                $("#update_password_errormsg").append("新密码强度低");
                alert("密码应至少包含字母、数字、标点符号中的两种，且不少于6位！");
            } else {
                let old_password_encrypted = hex_md5(old_password);
                let new_password_encrypted = hex_md5(new_password);
                $.ajax({
                    url: "/update_userinfo/password",
                    type: "post",
                    data: {
                        "old_password": old_password_encrypted,
                        "new_password": new_password_encrypted
                    },
                    success: function(resp) {
                        $("#update_password_errormsg").empty();
                        $("#update_password_errormsg").append(resp);
                    },
                    error: function() {
                        $("#update_password_errormsg").empty();
                        $("#update_password_errormsg").append("请稍后再试");
                    }
                });
            }
        }
    });
});