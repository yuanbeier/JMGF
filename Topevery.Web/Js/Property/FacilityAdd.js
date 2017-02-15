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
        url: "api/services/app/PropertyFacilityW/AddPropertyFacilityAsync",
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
        url: "api/services/app/PropertyFacilityW/EditPropertyFacilityAsync",
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
    bindDicToDrp("facilityType", "A1FBDBF8-EA75-4E3A-810A-CEFFC3339DAB", "--请选择--")//设备类型;
    var id = $("#id").val();
    if (id) {
        topevery.ajax({
            type: "POST",
            url: "api/services/app/PropertyFacilityR/GetPropertyFacilityByIdAsync",
            contentType: "application/json",
            data: topevery.extend({ id: id })
        }, function (data) {
            if (data.success) {
                $("#propertAdd").form("load", data.result);
            }
        }, true);
    }
});