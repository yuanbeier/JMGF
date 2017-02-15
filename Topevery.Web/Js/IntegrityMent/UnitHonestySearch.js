

$(function () {

   // bindDicToDrp("HonestyType", "DD5E2AAC-50E7-4652-8F5C-C850813ADA52", "--请选择--");
    topevery.ajax({
        type: "POST",
        url: "api/services/app/UnitHonestyMangmentR/GetUnitHonestyMangmentDetailAsync",
        contentType: "application/json",
        data: JSON.stringify({ id: $("#hideId").val() })
    }, function (data) {
        if (data.success) {
            $("#UnitHonestySearch").form("load", data.result);
        } else {
            error();
        }
    }, true);


    $("#CompanyName").textbox("readonly", "readonly");
    $("#ReduceScore").textbox("readonly", "readonly");
    $("#IsDiscipline").combobox("readonly");
    $("#AuditTime").datebox("readonly", "readonly");
    $("#DisciplineNote").datebox("readonly", "readonly");
    $("#Description").datebox("readonly", "readonly");
    
});