$(function() {
    bindDicToDrp("UnitType", "9228E3DB-C5D4-4E24-BACF-F4E6DE1FD2A4", "--请选择--");
    topevery.ajax({
        type: "POST",
        url: "api/services/app/EngineerUnitR/GetEngineerUnitDetailAsync",
        contentType: "application/json",
        data: JSON.stringify({ id: $("#hideId").val() })
    }, function(data) {
        if (data.success) {
            $("#EngineerUnitEdit").form("load", data.result);
        } else {
            error();
        }
    }, true);
});

var submitFormEdit = function (dialog, grid, that) {

    if (!$("#HouseRepairEdit").form('validate')) {
        return;
    }
    var array = ezg.serializeObject($('form'));

    topevery.ajax({
        type: "POST",
        url: "api/services/app/EngineerUnitW/EditEngineerUnitAsync",
        contentType: "application/json",
        data: JSON.stringify(array)
    }, function (data) {
        if (data.success) {
            grid.datagrid('reload');
            dialog.dialog('destroy');
        }
    }, false);
};