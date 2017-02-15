var contractId;
var RefundRentApply = {
    SelectContract: function () {
        dialog = ezg.modalDialog({
            width: 1000,
            height: 535,
            title: '选择合同',
            url: virtualDirName + "Contract/ContractInfoByRefundHouse"
        });
    },
    LoadRentInfo: function (rowData) {
        $("#rentStartTime").textbox("setText", topevery.dataTimeFormat(rowData.reduceStartTime) + "至" + topevery.dataTimeFormat(rowData.rentEndTime));
        contractId=rowData.id;
        $("#selectForm").form("load", rowData);
    },
    Add: function () {
        if (!$("#selectForm").form("validate")) {
            return;
        }
        if ($("#removeReason").textbox("getValue") == null || $("#removeReason").textbox("getValue") === "" || $("#removeReason").textbox("getValue") == undefined) {
            window.top.topeveryMessage.show("请输入解除合同原因！");
            return;
        }
        var array = ezg.serializeObject($("form"));
        topevery.ajax({
            type: "POST",
            url: "api/services/app/refundHouseApplyW/AddRefundHouseApplyAsync",
            contentType: "application/json",
            data: topevery.extend(null,
                {
                    FileId: $("input[name='fileIdhiddenFile']").val(),
                    ContractId: contractId,
                    HouseUnitId: $("#houseUnitId").val(),
                    ContractNo: array.contractNo,
                    RemoveReason: array.removeReason
                })
        }, function (data) {
            if (data.success) {
                if (data.result.isSuccess) {
                    var id = data.result.id;
                    window.top.topeveryMessage.show(data.result.message);
                    //window.location = virtualDirName + 'Home/TodoLists';
                    window.open(virtualDirName + "PrintRelevant/CheckOutSheet?id=" + id);
                    window.open(virtualDirName + "PrintRelevant/CancelContractSheet?id=" + id);

                    window.top.$(".center-menu").find("li").eq(1).click();
                } else {
                    window.top.topeveryMessage.show(data.result.message);
                }
            }
        }, true);
    },
    Edit: function (dialog, grid) {
        if (!$("#selectForm").form("validate")) {
            return;
        }
        var array = ezg.serializeObject($("form"));
        array["id"] = Id;
        topevery.ajax({
            type: "POST",
            url: "api/services/app/RefundRentApplyW/EditRefundRentApply",
            contentType: "application/json",
            data: topevery.extend(array)
        }, function (data) {
            if (data.success) {
                grid.datagrid('reload');
                dialog.dialog('destroy');
            }
        }, false);
    },
    Cancel: function () {
        window.location.href = virtualDirName + "Home/TodoLists";
    }
}
var Id = getRequest("id");
$(function () {
    if (!Id) {
        $("#contractNo").textbox({
            required: true,
            editable: false,
            icons: [
                {
                    iconCls: "icon-search",
                    handler: function () {
                        RefundRentApply.SelectContract();
                    }
                }
            ]
        });
    }
    else {
        $("#contractNo").textbox({
            required: true,
            editable: false
        });
        topevery.ajax({
            type: "POST",
            url: "api/services/app/RefundRentApplyR/GetBasicInformationInfoAsync",
            contentType: "application/json",
            data: topevery.extend({
                id: Id
            })
        }, function (data) {
            if (data.success) {
                $("#selectForm").form("load", data.result);
            }
        }, true);
    }
});