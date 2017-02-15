var utils = (function () {
    /**
	 * 多选框cookie记住账号密码
	 * @param {Object} ele        绑定事件的当前元素
	 * @param {String} selected   选中时的样式
	 */
    var checkbox = function (ele, selected) {
        var parent = ele.parent();
        if (ele.prop("checked")) {
            parent.addClass(selected);
        } else {
            parent.removeClass(selected);
        }
    }

    /**
	 * 存储cookie
	 * @param {String} c_name cookie名
	 * @param {String} value cookie值
	 * @param {Date}   expiredays cookie有效期
	 */
    var setCookie = function (c_name, value, expiredays) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + expiredays);
        document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
    }

    /**
	 * 获取cookie
	 * @param {String} c_name cookie名
	 */
    var getCookie = function (c_name) {
        if (document.cookie.length > 0) {
            var c_start = document.cookie.indexOf(c_name + "=");
            if (c_start != -1) {
                c_start = c_start + c_name.length + 1;
                var c_end = document.cookie.indexOf(";", c_start);
                if (c_end == -1) {
                    c_end = document.cookie.length;
                }
                return unescape(document.cookie.substring(c_start, c_end));
            }
        }
        return "";
    }


    return {
        checkbox: checkbox,
        setCookie: setCookie,
        getCookie: getCookie
    }

})();

$(function () {
    //输入框验证规则
    $("#loginForm").validate({
        rules: {
            LoginName: "required",
            Password: {
                required: true,
                minlength: 3,
                maxlength: 20
            }
        },
        messages: {
            LoginName: "请输入用户名",
            Password: {
                required: "请输入密码",
                minlength: "密码不能少于3个字符",
                maxlength: "密码不能超过20个字符"
            }
        }
    });

    //cookie记住账号密码选择按钮
    var ele = $("#account-pwd"),
		selected = "selected";
    ele.on("click", function () {
        var _this = $(this),
			cookieObj = {
			    userName: $(".user-name").val().trim(),
			    userPwd: $(".user-pwd").val().trim()
			};
        utils.checkbox(_this, selected);
        if (_this.prop("checked")) {
            utils.setCookie("cookieName", JSON.stringify(cookieObj), 7);
        }
    });

    //页面初始化时赋予输入框记住的cookie数据
    var cookies = utils.getCookie("cookieName");
    if (cookies != '') {
        var cookieData = JSON.parse(cookies);
        $(".user-name").val(cookieData.userName);
        $(".user-pwd").val(cookieData.userPwd);
    }


    //按回车键触发提交表单事件
    $(document).keypress(function (event) {
        if (event.keyCode == 13) {
            $(".login-btn").click();
        }
    });

    //输入框获得焦点时登录错误提示隐藏
    $(".user-name-input,.user-pwd-input").on("focus", function () {
        $(".login-fail").hide();
    });

    //点击提交按钮提交表单
    $(".login-btn").click(function() {
        var $loginForm = $("#loginForm");
        if($loginForm.valid()) {
            var callback = function (data) {
                if (data.Success) {
                    location.href = data.TargetUrl;
                } else
                    $(".login-fail").html(data.Error.Message).show();
            };
            topevery.ajax({
                url: $loginForm.attr("action"),
                data: $loginForm.serialize()
            }, callback, true);
        }
        return false;
    });

    $('#Password').bind('keypress', function (event) {
        if (event.keyCode == "13") {
            $(".login-btn").click();
        }
    });
});







