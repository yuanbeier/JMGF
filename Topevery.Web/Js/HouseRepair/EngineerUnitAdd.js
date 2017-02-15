$(function() {
    bindDicToDrp("UnitType", "9228E3DB-C5D4-4E24-BACF-F4E6DE1FD2A4", "", true, false);
});

var submitFormAdd = function (dialog, grid, that) {
    if (!$("#EngineerUnitAdd").form('validate')) {
        return;
    }
    var array = ezg.serializeObject($('form'));
    $(that).remove();
    topevery.ajax({
        type: "POST",
        url: "api/services/app/EngineerUnitW/AddEngineerUnitAsync",
        contentType: "application/json",
        data: JSON.stringify(array)
    }, function (data) {
        if (data.success) {



            grid.datagrid('reload');
            dialog.dialog('destroy');




        }
    }, true);
};