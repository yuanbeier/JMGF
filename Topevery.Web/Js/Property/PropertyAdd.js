submitFormAdd = function (dialog, grid, that) {
    if (!$("#propertAdd").form("validate")) {
        return;
    }
    var array = ezg.serializeObject($("form"));
    that.onclick = function () {
        window.top.topeveryMessage.show("请不要重复提交");
    }
    topevery.ajax({
        type: "POST",
        url: "api/services/app/PropertyW/AddPropertyAsync",
        contentType: "application/json",
        data: topevery.extend(array)
    }, function (data) {
        if (data.success) {
            grid.datagrid('reload');
            dialog.dialog('destroy');
        }
    }, true);
};
submitFormEdit = function (dialog, grid, that) {
    if (!$("#propertAdd").form("validate")) {
        return;
    }
    var array = ezg.serializeObject($("form"));
    that.onclick = function () {
        window.top.topeveryMessage.show("请不要重复提交");
    }
    topevery.ajax({
        type: "POST",
        url: "api/services/app/PropertyW/EditPropertyAsync",
        contentType: "application/json",
        data: topevery.extend(array)
    }, function (data) {
        if (data.success) {
            grid.datagrid('reload');
            dialog.dialog('destroy');
        }
    }, true);
};
$(function () {
    bindDropDown("houseManageId", "Common/GetWorkstationBind", "", true, false);
    var proPertyId=$("#proPertyId").val();
    if (proPertyId) {
        topevery.ajax({
            type: "POST",
            url: "api/services/app/PropertyR/GetPropertyByIdAsync",
            contentType: "application/json",
            data: topevery.extend({id:proPertyId})
        }, function (data) {
            if (data.success) {
                $("#propertAdd").form("load", data.result);
            }
        }, true);
    }
});