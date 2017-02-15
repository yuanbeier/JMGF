$(function () {
  
    bindDicToDrp("RepairTypeId", "0ACFD5BD-D3DA-45CB-99B4-ED3009E08950", "--请选择--");
    topevery.ajax({
        type: "POST",
        url: "api/services/app/RepairItemR/GetRepairItemDetailAsync",
        contentType: "application/json",
        data: JSON.stringify({ id: $("#hideId").val() })
    }, function(data) {
        if (data.success) {
            var array = {};
            for (var j in data.result) {
                array["" + UpperFirstLetter(j) + ""] = data.result[j];
            };
            $("#HouseRepairEdit").form("load", array);
        } else {
            error();
        }
    }, true);
});

var submitFormEdit = function (dialog, grid, that) {
  
    if (!$("#HouseRepairEdit").form('validate')) {
        return;
    }
    var array = ezg.serializeObject($('form'));
   
    topevery.ajax({
        type: "POST",
        url: "api/services/app/RepairItemW/EditRepairItemAsync",
        contentType: "application/json",
        data: JSON.stringify(array)
    }, function (data) {
        if (data.success) {
            grid.datagrid('reload');
            dialog.dialog('destroy');
        }
    }, false);
};