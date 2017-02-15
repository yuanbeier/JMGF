///保存数据ajax请求
bindDicToDrp("CertName", "D11CFDA8-992B-4A9A-81D3-7201BD4D6E4D", "", true, true);
bindDicToDrp("Sex", "C8CEFBB2-6F98-4F70-8A47-932B9487FC37", "", false, false);
bindDicToDrp("TenantType", "7705DB66-07EB-4F3E-86F5-51A79663DF6A", "", true, true);
bindDropDown("HouseManageId", "Common/GetWorkstationBind", "", true, true);


HouseRentApplyAdd= {
    submitFormAdd :function () {
        if ($("#LesseeInfoAdd").form('validate') === false) {
            return;
        } else {
            var array = ezg.serializeObject($('form'));
            topevery.ajax({
                type: "POST",
                url: 'api/services/app/lesseeInfoW/HouseRentApplyAddAsync',
                contentType: "application/json",
                data: JSON.stringify(array)
            }, function (data) {
                if (data.success) {
                    frameHelper.getDialogParentIframe().LeasingApplication.setValueName(data.result);
                    frameHelper.getDialogParentIframe().dialog2.dialog('close');
                } else {
                    error();
                }
            }, true);
        }
    }
}

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
                        $("#DateBirth").datebox('setValue', year + "-" + month + "-" + day);
                        var date = new Date();
                        $("#Age").numberbox("setValue", date.getFullYear() - year);
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
});


