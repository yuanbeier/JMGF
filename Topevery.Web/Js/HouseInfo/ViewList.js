$(function () {
    var id = getRequest("id");
    $("#viewTabs").tabs("add", {
        title: "房屋信息",
        href: virtualDirName + "House/HouseBanEdit?id=" + id,
        onLoad: function () {
            $("#HouseBanInfoEdit").form("enableDisabled");
            $.getScript(virtualDirName+"Js/HouseInfo/HouseBanEdit.js");
        }
    });
    $("#viewTabs").tabs("add", {
        title: "分户情况",
        selected: false,
        href: virtualDirName + "House/HouseUnitDataGrid?id=" + id,
        onLoad:function() {
            $.getScript(virtualDirName + "Js/HouseInfo/HouseUnitDataGrid.js");
        }
    });
    $("#viewTabs").tabs("add", {
        title: "图片列表",
        selected: false
    });

    $("#viewTabs").tabs("add", {
        title: "二维码信息",
        selected: false
    });

});