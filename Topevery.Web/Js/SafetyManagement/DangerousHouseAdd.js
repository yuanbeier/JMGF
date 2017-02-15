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
            url: "api/services/app/DangerousHouseR/GetDangerousHouseOneAsync",
            contentType: "application/json",
            data: topevery.extend({ Id: id })
        }, function (data) {
            if (data.success) {
                var row = data.result;
                topevery.PicturesShow(data.result.id, 26, "Attachment");
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
    bindDicToDrp("DangerousSituation", "834D7912-4FBC-401B-A546-1B7831A86048", "", true);
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
        $("#DangerousHouseAdd").form("load", array);
    },
    cancel: function () {
        window.location = virtualDirName + 'SafetyManagement/DangerousHouseManagement?menuName=OrderManagement';
    },
    ///保存
    SaveLA: function () {
        var array = ezg.serializeObject($('form'));
        var url;
        if (id != null && id !== "") {
            url = "api/services/app/DangerousHouseW/UpdateDangerousHouseAsync";
        } else {
            url = "api/services/app/DangerousHouseW/AddDangerousHouseAsync";
        }
        if ($("#DangerousHouseAdd").form('validate') === false) {
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
                    window.location = virtualDirName + 'SafetyManagement/DangerousHouseManagement?menuName=OrderManagement';
                } else {
                    error();
                }
            }, true);
        }
    }
}
