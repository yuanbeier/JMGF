
editPassWord = {
    ///获取用户信息，文本赋值
    init: function () {
        topevery.ajax({
            type: "POST",
            url: "api/services/app/UserR/GetUserInfoAsync",
            contentType: "application/json"
        }, function (data) {
            if (data.success) {
                data = data.result;
                $("#Id").val(data.id);
            } else {
                error();
            }
        }, true);
    },
    ///更新用户信息
    Update: function () {
        if (!$("#EditPassWord").form("validate")) {
            return;
        }

        if ($("#LoginNewPassword1").textbox('getValue') !== $("#LoginNewPassword").textbox('getValue')) {
            window.top.topeveryMessage.show("两次密码不一致！请重新输入！");
        }
        var array = ezg.serializeObject($('form'));
        topevery.ajax({
            type: "POST",
            url: "api/services/app/UserW/ChangePassWordAsync",
            contentType: "application/json",
            data: JSON.stringify(array)
        }, function (data) {
            if (data.success) {
                if (data.result.isSuccess) {
                    window.top.topeveryMessage.show(data.result.message);
                    window.top.$(".panel-tool-close").click();
                } else {
                    window.top.topeveryMessage.show(data.result.message);
                }

            } else {
                error();
            }
        }, true);
    }
}
$(function () {
    /*初始化*/
    editPassWord.init();
});