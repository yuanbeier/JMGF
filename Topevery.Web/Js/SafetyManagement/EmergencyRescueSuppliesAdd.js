var id = topevery.getQuery("Id");
var type = topevery.getQuery("type");
$(function () {
    if ($("#WorkstationDropDown").val()) {
        bindDropDown("HouseManageId", "Common/GetWorkstationBind", "--工作站--", false, false);
    } else {
        bindDropDown("HouseManageId", "Common/GetWorkstationBind", "--工作站--", false, true);
        $("#HouseManageId").combobox("readonly");
    }
    var date = new Date();
    $("#Year").val(date.getFullYear());
    if (type === "查看") {
        $("#ToView").hide();
        $("#IdFile").hide();
        $(".delete").hide();
    }
    if (id != null && id !== "") {
        topevery.ajax({
            type: "POST",
            url: "api/services/app/RescueGoodsR/GetRescueGoodsOneAsync",
            contentType: "application/json",
            data: topevery.extend({ Id: id })
        }, function (data) {
            if (data.success) {
                var row = data.result;
                LeasingApplication.setValueHouse(row);
            } else {
                error();
            }
        }, true);
        $("#HouseNo").textbox({
            required: true,
            editable: false
        });
    } else {
        $("#HouseNo").textbox({
            required: true,
            editable: false,
            icons: [
                {
                    iconCls: "icon-search",
                    handler: function () {
                        LeasingApplication.openName();
                    }
                }
            ]
        });
    }
    //bindDropDown("HouseManageId", "Common/GetWorkstationBind", " ", true, true);
});
var dialog1;
var LeasingApplication = {
    ///弹出选择房屋窗口
    openName: function () {
        dialog1 = ezg.modalDialog({
            width: 900,
            height: 480,
            title: '房屋信息选择',
            url: virtualDirName + 'House/BuildingSelection'
        });
    },
    ///房屋信息赋值方法
    setValueHouse: function (data) {
        var array = {};
        for (var i in data) {
            array["" + UpperFirstLetter(i) + ""] = data[i];
        };
        $("#EmergencyRescueSuppliesAdd").form("load", array);
    },
    cancel: function () {
        window.location = virtualDirName + 'SafetyManagement/EmergencyRescueSupplies?menuName=EmergencyRescueSupplies';
    },
    ///保存
    SaveLA: function () {
        var array = ezg.serializeObject($('form'));
        var url;
        if (id != null && id !== "") {
            url = "api/services/app/RescueGoodsW/EditRescueGoodsAsync";
        } else {
            url = "api/services/app/RescueGoodsW/AddRescueGoodsAsync";
        }
        if ($("#EmergencyRescueSuppliesAdd").form('validate') === false) {
            return;
        } else {
            topevery.ajax({
                type: "POST",
                url: url,
                contentType: "application/json",
                data: JSON.stringify(array)
            }, function (data) {
                if (data.success) {
                    frameHelper.getDialogParentIframe().EmergencyRescueSupplies.loadInfo();
                    frameHelper.getDialogParentIframe().dialog1.dialog('close');
                    window.top.topeveryMessage.show("保存成功");
                } else {
                    error();
                }
            }, true);
        }
    }
}
