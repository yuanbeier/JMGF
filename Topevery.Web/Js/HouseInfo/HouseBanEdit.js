$(function () {
    bindDicToDrp("jurisdictUnitId", "9228E3DB-C5D4-4E24-BACF-F4E6DE1FD2A4", "--请选择--");//房屋管辖单位
    bindAreaToDrp("areaId");
    bindDropDown("houseManageId", "Common/GetWorkstationBind", "--请选择--");
    bindDicToDrp("houseType", "62FDA8DE-08C6-4819-AA6F-1043ED56CE26", "--请选择--");//房屋类别
    bindDicToDrp("propertyId", "B34CFE85-FB80-4817-B660-B8DF27F8DC76", "", true);//产权属性
    bindDicToDrp("usePropertyId", "28519BAC-0C61-4921-A7C1-80F3CEB80AC0", "--请选择--");
    bindDicToDrp("buildStructureId", "29A43A34-8D05-4F9A-B0FA-EFB8A38F7F98", "--请选择--");
    bindDicToDrp("securityLevelId", "834D7912-4FBC-401B-A546-1B7831A86048", "--请选择--");
    bindDicToDrp("eastWallRelegId,#southWallRelegId,#westWallRelegId,#northWallRelegId",
        "5428C189-4EE3-43FE-923B-9F775655CEB7", "--请选择--");
    bindDicToDrp("landNature", "FECF100F-2A2D-4A47-B2F0-4995339DD58C", "--请选择--");//用地性质
    topevery.ajax({
        type: "POST",
        url: "api/services/app/HouseBanR/GetHouseBanDetailAsync",
        contentType: "application/json",
        data: topevery.extend({
            id: $("#hideId").val()
        })
    }, function (data) {
        if (data.success) {
            $("#HouseBanInfoEdit").form("load", data.result);
        }
    }, true);
});
var submitFormEdit = function (dialog, grid, that) {
    if (!$("#HouseBanInfoEdit").form('validate')) {
        return;
    }
    var array = ezg.serializeObject($('form'));
    topevery.ajax({
        type: "POST",
        url: "api/services/app/houseBanW/EditHouseBanAsync",
        contentType: "application/json",
        data: JSON.stringify(array)
    }, function (data) {
        if (data.success) {
            grid.datagrid('reload');
            dialog.dialog('destroy');
        }
    }, false);
};