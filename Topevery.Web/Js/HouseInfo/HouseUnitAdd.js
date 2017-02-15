var HouseUnitAdd = {
    Add: function (dialog, grid,that) {
        if (!$("#housUnitform").form("validate")) {
            return;
        }
        var array = ezg.serializeObject($('form'));
        array["isHome"] = $("#isHome").is(":checked") ? 1 : 0;
        array["isTao"] = $("#isTao").is(":checked") ? 1 : 0;
        array["isRentable"] = $("#isRentable").is(":checked") ? 1 : 0;
        array["isSwing"] = $("#isSwing").is(":checked") ? 1 : 0;
        array["isPubRenHous"] = $("#isPubRenHous").is(":checked") ? 1 : 0;
        array["isLowRentHous"] = $("#isLowRentHous").is(":checked") ? 1 : 0;
        that.onclick = function () {
            window.top.topeveryMessage.show("请不要重复提交")
        }
        topevery.ajax({
            type: "POST",
            url: "api/services/app/HouseUnitW/AddHouseUnitAsync",
            contentType: "application/json",
            data: topevery.extend(array),
            error: function () {
                that.onclick = function () {
                    return HouseUnitAdd.Add(dialog, grid, that)();
                }
            }
        }, function(data) {
            if (data.success) {
                if (data.result.isSuccess) {
                    window.top.topeveryMessage.show(data.result.message);
                } else {
                    window.top.topeveryMessage.show(data.result.message);
                }
                grid.datagrid('reload');
                dialog.dialog('destroy');
            }
        }, true);
    },
    Edit: function (dialog, grid, that) {
        if (!$("#housUnitform").form("validate")) {
            return;
        }
        var array = ezg.serializeObject($('form'));
        array["isHome"] = $("#isHome").is(":checked") ? 1 : 0;
        array["isTao"] = $("#isTao").is(":checked") ? 1 : 0;
        array["isRentable"] = $("#isRentable").is(":checked") ? 1 : 0;
        array["isSwing"] = $("#isSwing").is(":checked") ? 1 : 0;
        array["isPubRenHous"] = $("#isPubRenHous").is(":checked") ? 1 : 0;
        array["isLowRentHous"] = $("#isLowRentHous").is(":checked") ? 1 : 0;
        that.onclick = function () {
            window.top.topeveryMessage.show("请不要重复提交")
        }
        topevery.ajax({
            type: "POST",
            url: "api/services/app/HouseUnitW/EditHouseUnitAsync",
            contentType: "application/json",
            data: topevery.extend(array),
            error: function () {
                that.onclick = function () {
                    return HouseUnitAdd.Edit(dialog, grid, that)();
                }
            }
        }, function (data) {
            if (data.success) {
                grid.datagrid('reload');
                dialog.dialog('destroy');
            } else {
                error();
            }
        }, true);
    }
};
$(function () {
    var id = $("#id").val();
    if (id) {

        $("#filesHide").show();
        topevery.ajax({
            type: "POST",
            url: "api/services/app/HouseUnitR/GetHouseUnitItemAsync",
            contentType: "application/json",
            data: topevery.extend({
                id: id
            })
        }, function (data) {
            if (data.success) {
                $("#housUnitform").form("load", data.result);
                topevery.PicturesShow(data.result.id,10 , "Attachment", 30);
                $("#imgUrl").attr("src", data.result.qrCodeUrl+"&h=400&w=400");
                data.result.isHome === 1 ? $("#isHome").prop("checked", true) : $("#isHome").prop("checked", false);
                data.result.isTao === 1 ? $("#isTao").prop("checked", true) : $("#isTao").prop("checked", false);
                data.result.isRentable === 1 ? $("#isRentable").prop("checked", true) : $("#isRentable").prop("checked", false);
                data.result.isSwing === 1 ? $("#isSwing").prop("checked", true) : $("#isSwing").prop("checked", false);
                data.result.isPubRenHous === 1 ? $("#isPubRenHous").prop("checked", true) : $("#isPubRenHous").prop("checked", false);
                data.result.isLowRentHous === 1 ? $("#isLowRentHous").prop("checked", true) : $("#isLowRentHous").prop("checked", false);
            } else {
                alert("失败");
            }
        }, false);
    }
})