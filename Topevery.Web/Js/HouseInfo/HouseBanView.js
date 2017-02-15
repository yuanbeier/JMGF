var houseBanId = getRequest("id");
$(function () {
    bindAreaToDrp("areaId");
    bindDeptToDrp({ btnid: "jurisdictUnitId", btnid2: "houseManageId" });
    bindValueTextDrp({bindId: "communityId",url: "api/services/app/PropertyR/GetPropertyFacilityAsync"});
    bindDicToDrp("houseType", "62FDA8DE-08C6-4819-AA6F-1043ED56CE26", "--请选择--", false, !houseBanId);//房屋类别
    bindDicToDrp("propertyId", "B34CFE85-FB80-4817-B660-B8DF27F8DC76", "", true, !houseBanId);//产权属性
    bindDicToDrp("usePropertyId", "28519BAC-0C61-4921-A7C1-80F3CEB80AC0", "--请选择--", false, !houseBanId);//使用性质
    bindDicToDrp("buildStructureId", "29A43A34-8D05-4F9A-B0FA-EFB8A38F7F98", "--请选择--", false, !houseBanId);//建筑结构
    bindDicToDrp("securityLevelId", "834D7912-4FBC-401B-A546-1B7831A86048", "--请选择--", false, !houseBanId);//安全等级
    bindDicToDrp("eastWallRelegId,#southWallRelegId,#westWallRelegId,#northWallRelegId",
        "5428C189-4EE3-43FE-923B-9F775655CEB7", "--请选择--");
    bindDicToDrp("landNature", "FECF100F-2A2D-4A47-B2F0-4995339DD58C", "--请选择--", false, !houseBanId);//用地性质
    if (houseBanId) {
        topevery.ajax({
            type: "POST",
            url: "api/services/app/HouseBanR/GetHouseBanDetailAsync",
            contentType: "application/json",
            data: topevery.extend({
                id: houseBanId
            })},function (data) {
                if (data.success) {
                    try {
                        topevery.initmap({
                            mapid: "allmap",
                            searchbtn: "btnMapSearch",
                            y: data.result.latitude,
                            x: data.result.longitude,
                            islook: true
                        });
                    } catch (e) {

                    } 
                $("#BaiduMap").val(data.result.longitude + "," + data.result.latitude);
                $("#HouseBanInfoAdd").form("load", data.result);
                $("#imgUrl").attr("src",data.result.qrCodeUrl + "&w=400&h=400");
            }
        }, true);
    } else {
        try {
            topevery.initmap({
                mapid: "allmap",
                searchbtn: "btnMapSearch",
                islook: true
            });
        } catch (e) {

        } 
        
    }
    $("#viewTabs").tabs("add", {
            title: "房屋平面图纸",
            selected: false,
            href: virtualDirName + "House/HouseBanDrawing?id=" + houseBanId,
            onLoad: function () {
                $.getScript(virtualDirName + "Js/HouseInfo/HouseBanDrawing.js");
            }
    });
    $("#viewTabs").tabs("add", {
        title: "楼栋图片",
        selected: false,
        href: virtualDirName + "House/BuildingImages?id=" + houseBanId,
        onLoad: function () {
            $.getScript(virtualDirName + "Js/HouseInfo/BuildingImages.js");
        }
    });
    $("#viewTabs").tabs("add", {
            title: "分户情况",
            selected: false,
            href: virtualDirName + "House/HouseUnitDataGrid?id=" + houseBanId,
            onLoad: function () {
                $.getScript(virtualDirName + "Js/HouseInfo/HouseUnitDataGrid.js");
            }
    });
    $("#viewTabs").tabs("add", {
            title: "字段修改记录",
            selected: false,
            href: virtualDirName + "Common/ModifyRecord?id=" + houseBanId,
            onLoad: function () {
                $.getScript(virtualDirName + "Js/Common/ModifyRecord.js");
            }
        });
});