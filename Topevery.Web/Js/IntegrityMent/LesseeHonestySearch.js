$(function () {

    bindDicToDrp("HonestyType", "DD5E2AAC-50E7-4652-8F5C-C850813ADA52", "--请选择--");
    topevery.ajax({
        type: "POST",
        url: "api/services/app/LesseeHonestyMangmentR/GetLesseeHonestyMangmentDetailAsync",
        contentType: "application/json",
        data: JSON.stringify({ id: $("#hideId").val() })
    }, function (data) {
        if (data.success) {
            $("#LesseeHonestySearch").form("load", data.result);
            topevery.PicturesShow(data.result.id, 6, "Attachment", 30);
        } else {
            error();
        }
    }, true);

     
    $("#Name").textbox("readonly", "readonly");
    $("#HonestyType").combobox("readonly");
    $("#ReduceScore").textbox("readonly", "readonly");
    $("#AuditTime").datebox("readonly", "readonly");
    $("#Description").datebox("readonly", "readonly");
    
});