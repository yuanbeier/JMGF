///保存数据ajax请求
bindDicToDrp("CertName", "D11CFDA8-992B-4A9A-81D3-7201BD4D6E4D", "");
bindDicToDrp("Sex", "C8CEFBB2-6F98-4F70-8A47-932B9487FC37", "");
bindDicToDrp("TenantType", "7705DB66-07EB-4F3E-86F5-51A79663DF6A", "");
bindDropDown("HouseManageId", "Common/GetWorkstationBind", "工作站", false);
var $grid, $dialog;
var submitFormEdit = function (dialog, grid, type, that) {
    submitCallback(dialog, grid, type, that);
    $grid = grid, $dialog = dialog;
};
var submitCallback = function (dialog, grid, type, that) {
    if (!$("#LesseeInfoAdd").form("validate")) {
        return;
    }
    that.onclick = function () {
        window.top.topeveryMessage.show("请不要重复提交");
    }
    var array = ezg.serializeObject($("form"));
    topevery.ajax({
        type: "POST",
        url: "api/services/app/LesseeInfoW/EditLessInfoAsync",
        contentType: "application/json",
        data: JSON.stringify(array),
        error: function () {
            that.onclick = function () {
                return submitFormEdit(dialog, grid, type, that)();
            }
        }
    }, function (data) {
        if (data.success) {
            if (data.result.isSuccess) {
                $("#testid").datagrid('reload');
                $dialog.dialog('destroy');
                $grid.datagrid('reload');
                $dialog.dialog('close');
                window.top.topeveryMessage.show(data.result.message);
            } else {
                window.top.topeveryMessage.show(data.result.message);
            }
        }
    }, true);
};
if ($("#TenantType").combobox("getValue") !== "500049") {
    $("#hidden2").hide();
}
if ($("#CertName").combobox("getValue") == "500145") {
    $("#CertNo").textbox({
        validType: 'idCode'
    });
} else {
    $("#CertNo").textbox({
        validType: ""
    });
}
$("#CertNo").textbox({
    onChange: function (newValue, oldValue) {
        var t = $("#CertName").combobox("getText").trim();
        if (t === "身份证") {
            changeCertNo();
        }
    }
});
$("#CertName").combobox({
    onChange: function (newValue, oldValue) {
        var t = $.trim($(this).combobox("getText"));
        if (t === "身份证") {
            $("#CertNo").textbox({
                validType: 'idCode'
            });
            $("#CertNo").textbox("textbox").bind("blur", function () {
                changeCertNo();
            });
        } else {
            $("#CertNo").textbox({
                validType: ''
            });
            $("#CertNo").textbox("textbox").bind("blur", function () {

            });
        }
    }
});


$("#TenantType").combobox({
    onChange: function (newValue, oldValue) {
        var t = $.trim($(this).combobox("getValue"));
        if (t !== "500049") {
            $("#hidden2").hide();
            $("#DateBirth").datebox("setValue", "");
            $("#Sex").combobox("setValue", "");
        } else {
            $("#hidden2").show();
            var tt = $("#CertName").combobox("getText").trim();
            if (tt === "身份证") {
                changeCertNo();
            }
        }
    }
});

function changeCertNo() {
    var str = $("#CertNo").textbox("getText");
    if ($("#CertNo").textbox("isValid") && str) {
        var temp = str.substring(6, 14);
        var year = temp.substring(0, 4);
        var month = temp.substring(4, 6);
        var day = temp.substring(6, 8);
        if (str.substring(16, 17) % 2 === 0) {
            $("#Sex").combobox("select", 500046);
        } else {
            $("#Sex").combobox("select", 500045);
        }
        $("#DateBirth").datebox('setValue', year + "-" + month + "-" + day);
        var date = new Date();
        $("#Age").numberbox("setValue", date.getFullYear() - year);
    }
}