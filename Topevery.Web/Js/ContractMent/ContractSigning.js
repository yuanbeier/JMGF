var dialog;
var dialog1;
var LeasingApplication = {

    ///弹出选择租户窗口
    openName: function() {
        dialog = ezg.modalDialog({
            width: 900,
            height: 530,
            title: '租户信息选择',
            url: virtualDirName + 'LesseeInfo/TenantsSelect',
            buttons: [
                {
                    text: '取消',
                    iconCls: 'icon-remove',
                    handler: function() {
                        dialog.dialog('close');
                    }
                }
            ]
        });
    },

    ///弹出选择房屋窗口
    OpenHouse: function() {
        dialog1 = ezg.modalDialog({
            width: 900,
            height: 530,
            title: '房屋信息选择',
            url: virtualDirName + 'House/TenantInformation',
            buttons: [
                {
                    text: '取消',
                    iconCls: 'icon-remove',
                    handler: function() {
                        dialog1.dialog('close');
                    }
                }
            ]
        });
    },
    ///租户信息赋值方法
    setValueName: function(data) {
        $("#LesseeId").val(data.id);
        $("#Name").textbox('setValue', data.name);
        $("#Sex").combobox('setValue', data.sex);
        $("#CertNo").textbox('setValue', data.certNo);
        $("#ContactAddress").textbox('setValue', data.contactAddress);
        $("#ContactNumber").textbox('setValue', data.contactNumber);
        $("#WorkUnits").textbox('setValue', data.workUnits);
        $("#familyMembersCount").val(data.familyMembersCount);
        $("#DateBirth").datebox("setValue", data.dateBirth);
        $("#BankCardNo").textbox('setValue', data.bankCardNo);
    },
    ///分户信息赋值
    setValueHouse: function(data) {
        $("#HouseId").val(data.houseId);
        $("#HouseUnitId").val(data.id);
        $("#HouseNo").textbox('setValue', data.houseNo);
        $("#RentRange").textbox('setValue', data.rentRange);
        $("#BuildArea").textbox('setValue', data.buildArea);
        $("#UsePropertyId").combobox('setValue', data.usePropertyId);
        $("#BuildStructureId").combobox('setValue', data.buildStructureId);
        $("#HouseDoorplate").textbox('setValue', data.houseDoorplate);
        $("#MetRentArea").textbox('setValue', data.metRentArea);
    },
    ///租赁申请提交方法
    SaveLA: function() {
        if ($("#ContractSigningAdd").form('validate') === false) {
            return;
        } else {
            topevery.ajax({
                type: "POST",
                url: "api/services/app/ContractW/AddContractAsync",
                contentType: "application/json",
                data: JSON.stringify(ezg.serializeObject($('form'))
                )
            }, function(data) {
                if (data.success) {
                    window.top.topeveryMessage.show("提交成功");
                } else {
                    error();
                }
            }, true);
        }
    },
    openLA: function() {
        LeasingApplication.SaveLA(1);
    }
}

$(function () {
    bindDicToDrp("Sex", "C8CEFBB2-6F98-4F70-8A47-932B9487FC37", "");
    bindDicToDrp("UsePropertyId", "28519BAC-0C61-4921-A7C1-80F3CEB80AC0", "");
    bindDicToDrp("BuildStructureId", "29A43A34-8D05-4F9A-B0FA-EFB8A38F7F98", "");
    bindDicToDrp("PayType", "AD33D5B6-42C0-4129-B501-BE6D748F6F7E", "",true);
    bindDicToDrp("ReduceType", "8F746198-36E5-49B7-8929-6BFE6C51431B", "");
    bindDicToDrp("RentType", "497E9547-0CBD-49EB-B556-BED08F4B5CF0", "");
    bindDicToDrp("ExpireHandle", "EC39DF03-EFAE-4F59-9ED7-A210F3F1913A", "");

    var myDate = new Date();
    var year = myDate.getFullYear();
    var month = myDate.getMonth();
    var date = myDate.getDate();
    $("#SignDate").html(year + "-" + month + "-" + date);

    window.onload = function () {
        $('#ReduceType').combobox({
            onChange: function () {
                rentcheng();
            }
        });

        $("#MonthMoney").textbox({
            onChange: function () {
                rentcheng();
            }
        });
    }

    function rentcheng() {
        var monthMoney = parseFloat($('#MonthMoney').textbox('getValue'));
        if ($('#ReduceType').combobox('getValue') !== "") {
            if ($('#ReduceType').combobox('getText') === "低收入家庭证（50%）") {
                $("#ReduceMoney").textbox('setValue', monthMoney * 0.50);
                $("#CollectMoney").textbox('setValue', monthMoney * 0.50);
            } else {
                $("#ReduceMoney").textbox('setValue', monthMoney);
                $("#CollectMoney").textbox('setValue', 0.00);
            }
        } else {
            $("#ReduceMoney").textbox('setValue', '0.00');
            $("#CollectMoney").textbox('setValue', monthMoney);
        }
    }
});
