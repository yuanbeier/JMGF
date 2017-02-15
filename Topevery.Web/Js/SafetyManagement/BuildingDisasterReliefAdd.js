var id = topevery.getQuery("Id");
var type = topevery.getQuery("type");
$(function () {
    if (type === "查看") {
        $("#ToView").hide();
        $("#IdFile").hide();
        $(".delete").hide();
        $("#RelatedAccessories").show();
        $(".uploadImg").hide();
    }
    if (id != null && id !== "") {
        topevery.ajax({
            type: "POST",
            url: "api/services/app/RescueRecordR/GetRescueRecordOneAsync",
            contentType: "application/json",
            data: topevery.extend({ Id: id })
        }, function (data) {
            if (data.success) {
                var row = data.result;
                topevery.PicturesShow(data.result.id, 28, "Attachment");
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
    if ($("#WorkstationDropDown").val()) {
        bindDropDown("HouseManageId", "Common/GetWorkstationBind", "--工作站--", false, false);
    } else {
        bindDropDown("HouseManageId", "Common/GetWorkstationBind", "--工作站--", false, true);
        $("#HouseManageId").combobox("readonly");
    }
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
        $("#HouseId").val(array.Id);
        $("#BuildingDisasterReliefAdd").form("load", array);
    },
    cancel: function () {
        window.location = virtualDirName + 'SafetyManagement/BuildingDisasterReliefManagement?menuName=BuildingDisasterReliefManagement';
    },
    ///保存
    SaveLA: function () {
        var array = ezg.serializeObject($('form'));
        var url;
        if (id != null && id !== "") {
            url = "api/services/app/RescueRecordW/EditRescueRecordAsync";
        } else {
            url = "api/services/app/RescueRecordW/AddRescueRecordAsync";
        }
        if ($("#BuildingDisasterReliefAdd").form('validate') === false) {
            return;
        } else {
            topevery.ajax({
                type: "POST",
                url: url,
                contentType: "application/json",
                data: topevery.extend(array, { FileId: $("input[name='IdFilehiddenFile']").val() })
            }, function (data) {
                if (data.success) {
                    window.top.topeveryMessage.show("保存成功");
                    window.location = virtualDirName + 'SafetyManagement/BuildingDisasterReliefManagement?menuName=BuildingDisasterReliefManagement';
                } else {
                    error();
                }
            }, true);
        }
    }
}
