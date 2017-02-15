var RefundRentApply= {
    SelectContract: function() {
        dialog = ezg.modalDialog({
            width: 1000,
            height: 535,
            title: '选择合同',
            url: virtualDirName + "Contract/ContractInfoByRentCollect"
        });
    },
    LoadRentInfo: function(rowData) {
        $("#selectForm").form("load", rowData);
        $("#contractId").val(rowData["id"]);
    },
    Add: function() {
        if (!$("#selectForm").form("validate")) {
            return;
        }
        var array = ezg.serializeObject($("form"));
        array["QueryType"] = 1;
        topevery.ajax({
            type: "POST",
            url: "api/services/app/RefundRentApplyW/AddRefundRentApply",
            contentType: "application/json",
            data: topevery.extend(array, { FileId: $("input[name='fileDivIdhiddenFile']").val() })
        }, function(data) {
            if (data.success) {
                if (data.result.isSuccess) {
                    var id = data.result.id;
                    window.top.topeveryMessage.show(data.result.message);
                    //window.location = virtualDirName + 'Home/TodoLists';
                    window.open(virtualDirName + "PrintRelevant/RentBackSheet?id=" + id);

                    window.top.$(".center-menu").find("li").eq(1).click();
                   
                } else {
                    topeveryMessage.show(data.result.message);
                }
            }
        }, true);
    },
    Edit: function(dialog, grid) {
        if (!$("#selectForm").form("validate")) {
            return;
        }
        var array = ezg.serializeObject($("form"));
        array["id"] = Id;
        topevery.ajax({
            type: "POST",
            url: "api/services/app/RefundRentApplyW/EditRefundRentApply",
            contentType: "application/json",
            data: topevery.extend(array, { FileId: $("input[name='fileDivIdhiddenFile']").val() })
        }, function(data) {
            if (data.success) {
                grid.datagrid('reload');
                dialog.dialog('destroy');
            }
        }, false);
    },
    Cancel: function() {
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
        topevery.PicturesShow(getRequest("id"), 4, "Attachment");
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