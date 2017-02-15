$(function () {
    topevery.ajax({
        type: "POST",
        url: "api/services/app/RefundHouseApplyR/GetRefundHouseApplyBaseInfoAsync",
        contentType: "application/json",
        data: topevery.extend({
            id: $("#id").val()
        })
    }, function (data) {
        if (data.success) {
            $("#selectForm").form("load", data.result);
            $("#rentStartTime").textbox("setText", data.result.reduceStartTimeCapital + "至" + data.result.rentEndTimeCapital);
            topevery.PicturesShow(data.result.id, 8, "Attachment");
        }
    }, true);
});
var submitFormEdit = function (dialog, grid) {
    if (!$("#selectForm").form("validate")) {
        return;
    }
    var array = ezg.serializeObject($("form"));
    topevery.ajax({
        type: "POST",
        url: "api/services/app/RefundHouseApplyW/EditRefundHouseApplyAsync",
        contentType: "application/json",
        data: topevery.extend(array)
    }, function (data) {
        if (data.success) {
            grid.datagrid('reload');
            dialog.dialog('destroy');
        }
    }, false);
};