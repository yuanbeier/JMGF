var submitFormAdd = function (dialog, grid, that) {
    if (!$("#LesseeInfoAdd").form("validate")) {
        return;
    }
    var array = ezg.serializeObject($("form"));
    topevery.ajax({
        type: "POST",
        url: "api/services/app/HousingLossW/AddHousingLossAsync",
        contentType: "application/json",
        data: topevery.extend(array)
    }, function (data) {
        if (data.success) {
            grid.datagrid('reload');
            dialog.dialog('destroy');
        }
    }, true);
};
var LoadHouseInfo = function (row) {
    $("#houseId").val(row.id);
    $("#LesseeInfoAdd").form("load", row);
};
var dialog;
var houseLossAdd = {
    SelectHouse: function () {
        dialog=ezg.modalDialog({
            width: 900,
            height: 520,
            title: '房屋楼栋选择',
            url: virtualDirName + "House/SelectHouseBan"
        });
    }
}
$(function () {
    bindDicToDrp("lossCategoryId", "32E99457-7802-4348-A99D-6E33363E93DE", "",true);
    $("#unitName").textbox({
        required: true,
        editable: false,
        icons: [
            {
                iconCls: "icon-search",
                handler: function () {
                    houseLossAdd.SelectHouse();
                }
            }
        ]
    });
});