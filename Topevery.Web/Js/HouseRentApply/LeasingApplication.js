/// <reference path="D:\192.168.1.250\江门市\Code\JMGF\Topevery.Web\print/Apply/leaseSheet.html" />
/// <reference path="D:\192.168.1.250\江门市\Code\JMGF\Topevery.Web\print/Apply/leaseSheet.html" />
/// <reference path="D:\192.168.1.250\江门市\Code\JMGF\Topevery.Web\print/Apply/leaseSheet.html" />
bindDicToDrp("Sex", "C8CEFBB2-6F98-4F70-8A47-932B9487FC37", "");
bindDicToDrp("UsePropertyId", "28519BAC-0C61-4921-A7C1-80F3CEB80AC0", "");
bindDicToDrp("BuildStructureId", "29A43A34-8D05-4F9A-B0FA-EFB8A38F7F98", "");
bindDicToDrp("PayType", "AD33D5B6-42C0-4129-B501-BE6D748F6F7E", "", true);
bindDicToDrp("ReduceType", "A7CD7C95-EA39-42A6-BBFB-DF0210C0E374", "--请选择--");
bindDicToDrp("RentType", "497E9547-0CBD-49EB-B556-BED08F4B5CF0", "--请选择--");
bindDicToDrp("ExpireHandle", "EC39DF03-EFAE-4F59-9ED7-A210F3F1913A", "--请选择--");
bindDicToDrp("CreditCard", "8F746198-36E5-49B7-8929-6BFE6C51431B", "", false);
var HouseId;
var dialog;
var dialog1;
var dialog2;
var LeasingApplication = {

///弹出选择租户窗口
    openName: function() {
        dialog = ezg.modalDialog({
            width: 1000,
            height: 450,
            title: '租户信息选择',
            url: virtualDirName + 'LesseeInfo/TenantsSelect'
        });
    },
    ///弹出选择房屋窗口
    OpenHouse: function () {
        dialog1 = ezg.modalDialog({
            width: 950,
            height: 450,
            title: '房屋信息选择',
            url: virtualDirName + 'House/TenantInformation?mapHouseNo=' + $("#mapHouseNo").val()
        });
    },
    ///添加租户信息
    AddLesseeInfo: function() {
        dialog2 = ezg.modalDialog({
            width: 730,
            height: 450,
            title: '添加租户',
            url: virtualDirName + 'LesseeInfo/HouseRentApplyAdd'
        });
    },
    EditLesseeInfo: function () {
        //var card = $("#CertNo").textbox('getValue');
        //var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        //if (reg.test(card) === false) {
        //    window.top.topeveryMessage.show("请输入有效的身份证号码！");
        //    return;
        //}
        topevery.ajax({
            type: "POST",
            url: "api/services/app/LesseeInfoW/EditLessInfoSimpleAsync",
            contentType: "application/json",
            data: JSON.stringify({
                Name: $("#Name").textbox('getValue'),
                Id: $("#LesseeId").val(),
                Sex: $("#Sex").combobox('getValue'),
                DateBirth: $("#DateBirth").datebox("getValue"),
                CertNo: $("#CertNo").textbox('getValue'),
                ContactAddress: $("#ContactAddress").textbox('getValue'),
                ContactNumber: $("#ContactNumber").textbox('getValue'),
                WorkUnits: $("#WorkUnits").textbox('getValue')
            }),
        }, function (data) {
            if (data.success) {
                if (data.result.isSuccess) {
                    window.top.topeveryMessage.show(data.result.message);
                } else {
                    window.top.topeveryMessage.show(data.result.message);
                }
            }
        }, true);
    },
    ///租户信息赋值方法
    setValueName: function(data) {
        if (data.familyMembersCount != null && data.familyMembersCount !== "") {
            $("#familyMembersCount").textbox('setValue', data.familyMembersCount);
        } else {
            $("#familyMembersCount").textbox('setValue', 1);
        }
        $("#LesseeId").val(data.id);
        $("#Name").textbox('setValue', data.name);
        $("#Sex").combobox('setValue', data.sex);
        $("#CertNo").textbox('setValue', data.certNo);
        $("#ContactAddress").textbox('setValue', data.contactAddress);
        $("#ContactNumber").textbox('setValue', data.contactNumber);
        $("#WorkUnits").textbox('setValue', data.workUnits);
        $("#DateBirth").datebox("setValue", data.dateBirth);
        $("#BankCardNo").textbox("setValue", data.bankCardNo);

        $("#edit").css({ "display":"inline-block" });
        $("#add").css({ "display": "none" });
        //window.top.topeveryMessage.show("新增成功");
    },
    ///分户信息赋值
    setValueHouse: function(data) {
        HouseId = data.houseId;
        $("#HouseUnitId").val(data.id);
        //var array = {};
        //for (var i in data) {
        //    array["" + UpperFirstLetter(i) + ""] = data[i];
        //};
       // $("#RentReduction").form("load", array);
        $("#HouseNo").textbox('setValue', data.houseNo);
        $("#mapHouseNo").val(data.houseNo);
        $("#RentRange").textbox('setValue', data.rentRange);
        $("#BuildArea").textbox('setValue', data.buildArea);
        $("#UsePropertyId").combobox('setValue', data.usePropertyId);
        $("#BuildStructureId").combobox('setValue', data.buildStructureId);
        $("#HouseDoorplate").textbox('setValue', data.houseDoorplate);
        $("#MetRentArea").textbox('setValue', data.metRentArea);
    },
    ///租赁申请提交方法
    SaveLA: function() {
        if ($("#LesseeInfoAdd").form('validate') === false) {
            return;
        } else {
            if ($("#RentStartTime").val() == null || $("#RentStartTime").val() === "" || $("#RentStartTime").val() === undefined) {
                window.top.topeveryMessage.show("租赁起始日期不能为空！");
                return;
            }
            if ($("#RentEndTime").val() == null || $("#RentEndTime").val() === "") {
                window.top.topeveryMessage.show("租赁结束日期不能为空！");
                return;
            }
            if ($('#ReduceType').combobox('getValue') !== "") {
                if ($("#ReduceStartTime").val() == null || $("#ReduceStartTime").val() === "") {
                    window.top.topeveryMessage.show("减免日期起不能为空！");
                    return;
                }
                if ($("#ReduceEndTime").val() == null || $("#ReduceEndTime").val() === "") {
                    window.top.topeveryMessage.show("减免日期止不能为空！");
                    return;
                }
                if ($("input[name='fileDivIdhiddenFile']").val() === "") {
                    window.top.topeveryMessage.show("请上传减免证件,保证金单据号相关文件！");
                    return;
                }
            }
            topevery.ajax({
                type: "POST",
                url: "api/services/app/HouseRentApplyW/AddHouseRentApplyAsync",
                contentType: "application/json",
                data: topevery.extend(ezg.serializeObject($('form')), {
                    LesseeId: $("#LesseeId").val(),
                    MonthMoney: $("#MonthMoney").textbox('getValue'),
                    PayType: $("#PayType").combobox('getValue'),
                    BankCardNo: $("#BankCardNo").textbox('getValue'),
                    HouseUnitId: $("#HouseUnitId").val(),
                    FileId: $("input[name='fileDivIdhiddenFile']").val(),
                    HouseId: HouseId
                })
            }, function(data) {
                if (data.success) {
                    if (data.result.isSuccess) {
                        var id = data.result.id;
                        window.top.topeveryMessage.show(data.result.message);
                        //window.location = virtualDirName + 'Home/TodoLists';
                        window.open(virtualDirName + "PrintRelevant/LeaseSheet?id=" + id);

                        window.top.$(".center-menu").find("li").eq(1).click();
                    } else {
                        window.top.topeveryMessage.show(data.result.message);
                    }
                } else {
                    error();
                }
            }, true);
        }
    },
    openLA: function() {
        LeasingApplication.SaveLA();
    },
    init: function () {
        console.log($("#mapHouseNo").val());
        if ($("#mapHouseNo").val() != null && $("#mapHouseNo").val() !== "") {
            LeasingApplication.OpenHouse();
        }
    }
}

function rentcheng() {
    if ($('#PayType').combobox('getText') !== "现金") {
        $("#BankCardNo").textbox({
            required: true,
            validType: 'length[19, 19]',
            invalidMessage: "请输入正确的银行卡号"
        });
    } else {
        $("#BankCardNo").textbox({
            required: false
        });
    }
}
/**
 * 初始化
 */
$(function() {
    LeasingApplication.init();
    $('#PayType').combobox({
        onChange: function () {
            rentcheng();
        }
    });
    $('#ReduceType').combobox({
        onChange: function () {
            rentchengReduceType();
        }
    });
    $('#MonthMoney').textbox({
        onChange: function () {
            rentchengReduceType();
        }
    });
    $("#Name").textbox({
        required: true,
        editable: false,
        icons: [
            {
                iconCls: "icon-search",
                handler: function () {
                    LeasingApplication.openName();
                }
            }
        ]
    });
    $("#HouseNo").textbox({
        required: true,
        editable: false,
        icons: [
            {
                iconCls: "icon-search",
                handler: function () {
                    LeasingApplication.OpenHouse();
                }
            }
        ]
    });
});


function rentchengReduceType() {
    var monthMoney = $("#MonthMoney").textbox('getValue');
    if ($('#ReduceType').combobox('getText') === "减半") {
        $("#ReduceMoney").textbox('setValue', parseFloat(monthMoney * 0.5));
        $("#CollectMoney").textbox('setValue', parseFloat(monthMoney * 0.5));
    } else if ($('#ReduceType').combobox('getText') === "--请选择--") {
        $("#ReduceMoney").textbox('setValue', 0);
        $("#CollectMoney").textbox('setValue', monthMoney);
        $("#ReduceEndTime").val("");
        $("#ReduceStartTime").val("");
    } else if ($('#ReduceType').combobox('getText') === "八成") {
        $("#ReduceMoney").textbox('setValue', parseFloat(monthMoney * 0.8).toFixed(2));
        $("#CollectMoney").textbox('setValue', parseFloat(monthMoney * 0.2).toFixed(2));
    } else if ($('#ReduceType').combobox('getText') === "七成") {
        $("#ReduceMoney").textbox('setValue', parseFloat(monthMoney * 0.7).toFixed(2));
        $("#CollectMoney").textbox('setValue', parseFloat(monthMoney * 0.3).toFixed(2));
    } else if ($('#ReduceType').combobox('getText') === "六成") {
        $("#ReduceMoney").textbox('setValue', parseFloat(monthMoney * 0.6).toFixed(2));
        $("#CollectMoney").textbox('setValue', parseFloat(monthMoney * 0.4).toFixed(2));
    } else {
        $("#ReduceMoney").textbox('setValue', monthMoney);
        $("#CollectMoney").textbox('setValue', 0);
    }
}