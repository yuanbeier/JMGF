///保存数据ajax请求

bindDicToDrp("CertName", "D11CFDA8-992B-4A9A-81D3-7201BD4D6E4D", "", true, true);
bindDicToDrp("Sex", "C8CEFBB2-6F98-4F70-8A47-932B9487FC37", "", true, true);
bindDicToDrp("TenantType", "7705DB66-07EB-4F3E-86F5-51A79663DF6A", "", true, true);
bindDropDown("HouseManageId", "Common/GetWorkstationBind", "", true);
var $grid, $dialog;
var submitFormAdd = function (dialog, grid, type,that) {
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
    var array = ezg.serializeObject($('form'));
    //$.ajax({
    //    type: 'POST',
    //    url: virtualDirName + 'api/services/app/lesseeInfoW/AddLesseeInfoAsync',
    //    data: JSON.stringify(array),
    //    cache: false,
    //    contentType: "application/json",
    //    Type: "JSON",
    //    success: function (row) {
    //        if (row.result.isSuccess) {
    //            $grid.datagrid('reload');
    //            $dialog.dialog('destroy');
    //            $("#testid").datagrid('reload');
    //            $dialog.dialog('close');
    //            window.top.topeveryMessage.show(row.result.message);
    //        } else {
    //            window.top.topeveryMessage.show(row.result.message);
    //        }
    //    },
    //    error: function (e) {
    //        that.onclick = function () {
    //            return submitFormAdd(dialog, grid, type, that)();
    //        }
    //    }
    //});

    topevery.ajax({
        type: "POST",
        url: 'api/services/app/lesseeInfoW/AddLesseeInfoAsync',
        contentType: "application/json",
        data: JSON.stringify(array)
        //error: function () {
        //    that.onclick = function () {
        //        return submitFormEdit(dialog, grid, type, that)();
        //    }
        //}
    }, function (row) {
        if (row.result.isSuccess) {
            $grid.datagrid('reload');
            $dialog.dialog('destroy');
            $("#testid").datagrid('reload');
            $dialog.dialog('close');
            window.top.topeveryMessage.show(row.result.message);
        } else {
            window.top.topeveryMessage.show(row.result.message);
        }
    }, true);
};
$(function () {
    $("#CertName").combobox({
        onChange: function (newValue, oldValue) {
            var t = $.trim($(this).combobox("getText"));
            if (t === "身份证") {
                $("#CertNo").textbox({
                    validType: 'idCode'
                });
                $("#CertNo").textbox("textbox").bind("blur", function () {
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
                        // if (!$("#DateBirth").datebox("getText")) {
                        $("#DateBirth").datebox('setValue', year + "-" + month + "-" + day);
                        //}
                        //if (!$("#Age").numberbox("getValue")) {
                        var date = new Date();
                        $("#Age").numberbox("setValue", date.getFullYear() - year);
                        // }
                    }
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
    $("#CertNo").textbox({
        onChange: function (newValue, oldValue) {
            var t = $("#CertName").combobox("getText").trim();
            if (t === "身份证") {
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
            }
        }
    });
    topevery.ajax({
        type: "POST",
        url: "api/services/app/HouseBanR/GetJurisdictUnitDefaultByUserDept",
        contentType: "application/json"
    }, function (data) {//根据当前用户的所属机构，默认带出是公房中心还是历史街区
        var result = $("#HouseManageId").combobox("getData");
        for (var i in result) {
            if (result[i].value === data.result.houseManageId) {
                //$("#jurisdictUnitId").combobox("select", data.result.jurisdictUnitId);
                $("#HouseManageId").combobox("select", data.result.houseManageId);
                break;
            }
        }
    }, false);
});

