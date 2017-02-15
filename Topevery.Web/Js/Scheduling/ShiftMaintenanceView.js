var id = topevery.getQuery("id");
var type = topevery.getQuery("type");
$(function () {
    if (id != null && id !== "") {
        if (type=="ToView") {
            $("#ToView").hide();
        }
        $("#Id").val(id);
        topevery.ajax({
            type: "POST",
            url: "api/services/app/ShiftMaintenanceR/GetShiftMaintenanceOneAsync",
            contentType: "application/json",
            data: topevery.extend({ Id: id })
        }, function (data) {
            if (data.success) {
                var row = data.result;
                shiftMaintenanceView.setValueHouse(row);
            } else {
                error();
            }
        }, true);
    }
    if ($("#WorkstationDropDown").val()) { 
        bindDropDown("HouseManageId", "Common/GetWorkstationBind", "--工作站--", false, false);
    } else {
        bindDropDown("HouseManageId", "Common/GetWorkstationBind", "--工作站--", false, true);
        $("#HouseManageId").combobox("readonly");
    }
});
shiftMaintenanceView = {
    ///房屋信息赋值方法
    setValueHouse: function (data) {
        var array = {};
        for (var i in data) {
            array["" + UpperFirstLetter(i) + ""] = data[i];
        };
        array.StartTime = topevery.dataTimeFormat1(array.StartTime);
        array.EndTime = topevery.dataTimeFormat1(array.EndTime);
        $("#ShiftMaintenanceView").form("load", array);
    },
    ///保存
    SaveLA: function () {
        var array = ezg.serializeObject($('form'));
        if (array.StartTime === "" || array.StartTime === null) {
            window.top.topeveryMessage.show("开始时间不能为空!");
            return;
        }
        if (array.EndTime === "" || array.EndTime === null) {
            window.top.topeveryMessage.show("结束时间不能为空!");
            return;
        }
        if (array.ShiftName === "" || array.ShiftName === null) {
            window.top.topeveryMessage.show("班次名称不能为空!");
            return;
        }
        if (array.HouseManageId === "" || array.HouseManageId === null) {
            window.top.topeveryMessage.show("工作站不能为空!");
            return;
        }
        var url;
        if (id != null && id !== "") {
            url = "api/services/app/ShiftMaintenanceW/EditShiftMaintenanceAsync";
        } else {
            url = "api/services/app/ShiftMaintenanceW/AddShiftMaintenanceAsync";
        }
        if ($("#BuildingDisasterReliefAdd").form('validate') === false) {
            return;
        } else {
            topevery.ajax({
                type: "POST",
                url: url,
                contentType: "application/json",
                data: topevery.extend(array)
            }, function (data) {
                if (data.success) {
                    try {
                        frameHelper.getDialogParentIframe().ShiftMaintenance.message();
                    } catch (e) {
                    }
                    window.top.topeveryMessage.show(data.result.message);
                } else {
                    error();
                }
            }, true);
        }
    }
}
