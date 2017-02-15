
var dialogChoose;

bindDicToDrp("ReduceType", "A7CD7C95-EA39-42A6-BBFB-DF0210C0E374", "", true);
bindDicToDrp("CertType", "8F746198-36E5-49B7-8929-6BFE6C51431B", "", true);
bindDicToDrp("Relationships", "4A6177F3-041F-45CA-AF29-4364DFA809D6", "", true);

RentReductionApplication = {
    ///提交租金减免申请信息
    SaveRentReduction: function () {
        if (!$("#RentReduction").form('validate')) {
            return;
        }
        if ($("#ValidityStartTime").val() == null || $("#ValidityStartTime").val() === "" || $("#ValidityStartTime").val() === undefined) {
            window.top.topeveryMessage.show("证件有效期起不能为空！");
            return;
        }
        if ($("#ValidityEndTime").val() == null || $("#ValidityEndTime").val() === "" || $("#ValidityEndTime").val() === undefined) {
            window.top.topeveryMessage.show("证件有效期止不能为空！");
            return;
        }
        if ($("input[name='fileDivIdhiddenFile']").val() == null || $("input[name='fileDivIdhiddenFile']").val() === "" || $("input[name='fileDivIdhiddenFile']").val() === undefined) {
            window.top.topeveryMessage.show("请上传相关减免证件！");
            return;
        }
        var array = topevery.form2Json("RentReduction");
        array.Relationship = $("#Relationships").combobox("getText");
        array.FileDivIdhiddenFile = $("input[name='fileDivIdhiddenFile']").val();
        topevery.ajax({
            type: "POST",
            url: "api/services/app/RentRemissionApplyW/AddRentRemissionApplyAsync",
            contentType: "application/json",
            data: topevery.extend(array, topevery.form2Json("Exemption"))
        }, function (data) {
            if (data.success) {
                if (data.result.isSuccess) {
                    var id = data.result.id;
                    window.top.topeveryMessage.show(data.result.message);
                    //  window.location = virtualDirName + 'Home/TodoLists';
                    window.open(virtualDirName + "PrintRelevant/RentReliefSheet?id=" + id);

                    window.top.$(".center-menu").find("li").eq(1).click();
                } else {
                    window.top.topeveryMessage.show(data.result.message);
                }
            } else {
                error();
            }
        }, true);
    },
    AddRepairPlan: function () {
        dialogChoose = ezg.modalDialog({
            width: 1100,
            height: 450,
            title: '租赁合同选择',
            url: virtualDirName + 'ContractMent/ContractChoice',
            buttons: [
            ]
        });
    }
}
///回写合同选择带出的信息
function SaveHouse(data) {
    $("#RentReduction").form("load", data);
    $("#ContractId").val(data.id);
    if ($("#ReduceType").combobox('getText') === "减半") {
        if (data.monthMoney !== null && data.monthMoney !== "") {
            $("#ReduceMoney").textbox('setValue', parseFloat(data.monthMoney * 0.5));
            $("#CollectMonthMoney").textbox('setValue', parseFloat(data.monthMoney * 0.5));
        }
    } else if ($("#ReduceType").combobox('getText') === "") {
        $("#CollectMonthMoney").textbox('setValue', data.monthMoney);
    } else if ($('#ReduceType').combobox('getText') === "八成") {
        $("#ReduceMoney").textbox('setValue', parseFloat(data.monthMoney * 0.8).toFixed(2));
        $("#CollectMonthMoney").textbox('setValue', parseFloat(data.monthMoney * 0.2).toFixed(2));
    } else if ($('#ReduceType').combobox('getText') === "七成") {
        $("#ReduceMoney").textbox('setValue', parseFloat(data.monthMoney * 0.7).toFixed(2));
        $("#CollectMonthMoney").textbox('setValue', parseFloat(data.monthMoney * 0.3).toFixed(2));
    } else if ($('#ReduceType').combobox('getText') === "六成") {
        $("#ReduceMoney").textbox('setValue', parseFloat(data.monthMoney * 0.6).toFixed(2));
        $("#CollectMonthMoney").textbox('setValue', parseFloat(data.monthMoney * 0.4).toFixed(2));
    }
    topevery.ajax({
        type: "POST",
        url: "api/services/app/RentRemissionApplyR/GetRentRemissionHisByContractIdAsync?contractId=" + data.id,
        contentType: "application/json"
    }, function (row) {
        if (row.success) {
            if (row.result != null) {
                var array = {};
                for (var i in row.result) {
                    if (row.result.hasOwnProperty(i)) {
                        array["" + UpperFirstLetter(i) + ""] = row.result[i];
                    }
                };
                $("#Exemption").form("load", array);
                $("#ValidityEndTime").val(topevery.dataTimeFormat(array.ValidityEndTime));
                $("#ValidityStartTime").val(topevery.dataTimeFormat(array.ValidityStartTime));
                $("#CollectMonthMoney").textbox("setValue", parseFloat(data.monthMoney - array.ReduceMoney).toFixed(2));
                $("#Relationships").combobox("setText", array.Relationship);
                if (array.CertType===null) $("#CertType").combobox("setValue", array.CreditCard);
                if (array.CertNo === null) $("#CertNo").textbox("setValue", array.CreditCardNumber);
            } else {
                $("#Exemption").form('clear');
            }
        } else {
            error();
        }
    }, true);


}

function rentcheng() {
    var monthMoney = $("#monthMoney").textbox('getValue');
    //if ($('#ReduceType').combobox('getText') !== "半免") {
    //    $("#ReduceMoney").textbox('setValue', monthMoney);
    //    $("#CollectMonthMoney").textbox('setValue', 0);
    //} else {
    //    $("#ReduceMoney").textbox('setValue', monthMoney * 0.5);
    //    $("#CollectMonthMoney").textbox('setValue', monthMoney * 0.5);
    //}
    if ($('#ReduceType').combobox('getText') === "减半") {
        $("#ReduceMoney").textbox('setValue', parseFloat(monthMoney * 0.5));
        $("#CollectMonthMoney").textbox('setValue', parseFloat(monthMoney * 0.5));
    } else if ($('#ReduceType').combobox('getText') === "--请选择--") {
        $("#ReduceMoney").textbox('setValue', 0);
        $("#CollectMonthMoney").textbox('setValue', monthMoney);
        $("#ReduceEndTime").val("");
        $("#ReduceStartTime").val("");
    } else if ($('#ReduceType').combobox('getText') === "八成") {
        $("#ReduceMoney").textbox('setValue', parseFloat(monthMoney * 0.8).toFixed(2));
        $("#CollectMonthMoney").textbox('setValue', parseFloat(monthMoney * 0.2).toFixed(2));
    } else if ($('#ReduceType').combobox('getText') === "七成") {
        $("#ReduceMoney").textbox('setValue', parseFloat(monthMoney * 0.7).toFixed(2));
        $("#CollectMonthMoney").textbox('setValue', parseFloat(monthMoney * 0.3).toFixed(2));
    } else if ($('#ReduceType').combobox('getText') === "六成") {
        $("#ReduceMoney").textbox('setValue', parseFloat(monthMoney * 0.6).toFixed(2));
        $("#CollectMonthMoney").textbox('setValue', parseFloat(monthMoney * 0.4).toFixed(2));
    } else {
        $("#ReduceMoney").textbox('setValue', monthMoney);
        $("#CollectMonthMoney").textbox('setValue', 0);
    }
}
/**
 * 初始化
 */
$(function () {
    $('#ReduceType').combobox({
        onChange: function () {
            rentcheng();
        }
    });
    $("#ContractNo").textbox({
        required: true,
        editable: false,
        icons: [
            {
                iconCls: "icon-search",
                handler: function () {
                    RentReductionApplication.AddRepairPlan();
                }
            }
        ]
    });
    $("#CertType").combobox({
        onChange: function (newValue, oldValue) {
            var t = $.trim($(this).combobox("getText"));
            if (t === "身份证") {
                $("#CertNo").textbox({
                    validType: 'idCode'
                });
            } else {
                $("#CertNo").textbox({
                    validType: ''
                });
            }
        }
    });
});
///首字母转大写
function UpperFirstLetter(str) {
    return str.replace(/\b\w+\b/g, function (word) {
        return word.substring(0, 1).toUpperCase() + word.substring(1);
    });
}