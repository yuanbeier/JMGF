
editUser = {
    ///获取用户信息，文本赋值
    init:function() {
        topevery.ajax({
            type: "POST",
            url: "api/services/app/UserR/GetUserInfoAsync",
            contentType: "application/json"
        }, function (data) {
            if (data.success) {
                data = data.result;
                for (var j in data) {
                    if (UpperFirstLetter(j)!=="Id") {
                        $("#" + UpperFirstLetter(j) + "").textbox("setValue", data[j]);
                    }
                }
                $("#Id").val(data.id);
            } else {
                error();
            }
        }, true);
    },
    ///更新用户信息
    Update: function () {
        if (!$("#EditUser").form("validate")) {
            return;
        }
        var array = ezg.serializeObject($('form'));
        topevery.ajax({
            type: "POST",
            url: "api/services/app/UserW/ChangeUserInfoAsync",
            contentType: "application/json",
            data: JSON.stringify(array)
    }, function (data) {
        if (data.success) {
            window.top.topeveryMessage.show("修改成功！");
            window.top.$(".panel-tool-close").click();
            //frameHelper.getDialogParentIframe().dialog.dialog('destroy');
            //frameHelper.getDialogParentIframe().dialog.dialog('close');
        } else {
                error();
            }
        }, true);
    }
}
///首字母转大写
function UpperFirstLetter(str) {
    return str.replace(/\b\w+\b/g, function (word) {
        return word.substring(0, 1).toUpperCase() + word.substring(1);
    });
}

$(function () {
    /*初始化*/
    editUser.init();
});