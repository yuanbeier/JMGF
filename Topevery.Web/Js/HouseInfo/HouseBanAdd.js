var submitFormAdd = function (dialog, grid, that) {
    if (!$("#HouseBanInfoAdd").form('validate')) {
        return;
    }
    var array = ezg.serializeObject($('form'));
    var amap = $("#BaiduMap").val().split(',');
    that.onclick = function () {
        window.top.topeveryMessage.show("请不要重复提交");
    }
    topevery.ajax({
        type: "POST",
        url: "api/services/app/houseBanW/AddHouseBanAsync",
        contentType: "application/json",
        data: topevery.extend(array, {
            Latitude: amap[1],
            Longitude: amap[0]
        }),
        error: function () {
            that.onclick = function () {
                return submitFormAdd(dialog, grid, that)();
            }
        }
    }, function (data) {
        if (data.success) {
            grid.datagrid('reload');
            dialog.dialog('destroy');
        }
    }, true);
};
var submitFormEdit = function (dialog, grid, that) {
    if (!$("#HouseBanInfoEdit").form('validate')) {
        return;
    }
    var array = ezg.serializeObject($('form'));
    array["id"] = houseBanId;
    var amap = $("#BaiduMap").val().split(',');
    that.onclick = function () {
        window.top.topeveryMessage.show("请不要重复提交");
    }
    topevery.ajax({
        type: "POST",
        url: "api/services/app/houseBanW/EditHouseBanAsync",
        contentType: "application/json",
        data:topevery.extend(array, {
            Latitude: amap[1],
            Longitude:amap[0]
        }),
        error: function () {
            that.onclick = function () {
                return submitFormEdit(dialog, grid, that)();
            }
        }
    }, function (data) {
        if (data.success) {
            grid.datagrid('reload');
            dialog.dialog('destroy');
        }
    }, true);
};
var houseBanId = getRequest("id");
$(function () {
    bindValueTextDrp({ bindId: "communityId", url: "api/services/app/PropertyR/GetPropertyFacilityAsync", defaultText:"--请选择--"});
    bindAreaToDrp("areaId");
    bindDeptToDrp({ btnid: "jurisdictUnitId", btnid2: "houseManageId" });
    bindDicToDrp("houseType", "62FDA8DE-08C6-4819-AA6F-1043ED56CE26", "--请选择--", false, !houseBanId);//房屋类别
    bindDicToDrp("propertyId", "B34CFE85-FB80-4817-B660-B8DF27F8DC76", "", true, !houseBanId);//产权属性
    bindDicToDrp("usePropertyId", "28519BAC-0C61-4921-A7C1-80F3CEB80AC0", "--请选择--", false, !houseBanId);//使用性质
    bindDicToDrp("buildStructureId", "29A43A34-8D05-4F9A-B0FA-EFB8A38F7F98", "--请选择--", false, !houseBanId);//建筑结构
    bindDicToDrp("securityLevelId", "834D7912-4FBC-401B-A546-1B7831A86048", "--请选择--", false, !houseBanId);//安全等级
    bindDicToDrp("eastWallRelegId,#southWallRelegId,#westWallRelegId,#northWallRelegId",
        "5428C189-4EE3-43FE-923B-9F775655CEB7", "--请选择--");
    bindDicToDrp("landNature", "FECF100F-2A2D-4A47-B2F0-4995339DD58C", "--请选择--", false, !houseBanId);//用地性质=
    if (houseBanId) {
        topevery.ajax({
            type: "POST",
            url: "api/services/app/HouseBanR/GetHouseBanDetailAsync",
            contentType: "application/json",
            data: topevery.extend({
                id: houseBanId
            })},function (data) {
            if (data.success) {
                $("#BaiduMap").val(data.result.longitude + "," + data.result.latitude);
                $("#HouseBanInfoAdd").form("load", data.result);
                $("#imgUrl").attr("src", data.result.qrCodeUrl + "&w=400&h=400");
                try {
                    topevery.initmap({
                        mapid: "allmap",
                        searchbtn: "btnMapSearch",
                        searchkey: "suggestId",
                        y: data.result.latitude,
                        x: data.result.longitude
                    });
                } catch (e) {
                }
            }
        }, true);
    } else {
        $("#viewTabs").tabs("close", "二维码信息");
        topevery.ajax({
            type: "POST",
            url: "api/services/app/HouseBanR/GetJurisdictUnitDefaultByUserDept",
            contentType: "application/json"
        }, function (data) {//根据当前用户的所属机构，默认带出是公房中心还是历史街区
            var result = $("#jurisdictUnitId").combobox("getData");
            for (var i in result) {
                if (result[i].value === data.result.jurisdictUnitId) {
                    $("#jurisdictUnitId").combobox("select", data.result.jurisdictUnitId);
                    $("#houseManageId").combobox("select", data.result.houseManageId);
                    break;
                }
            }
        }, false);
        try {
            topevery.initmap({
                mapid: "allmap",
                searchbtn: "btnMapSearch",
                searchkey: "suggestId"
            });
        } catch (e) {

        }
    }

});