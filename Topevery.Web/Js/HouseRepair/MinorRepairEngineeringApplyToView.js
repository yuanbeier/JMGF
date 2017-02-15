var grid;
$(function () {
    $(document).queue("datagrid0101", function () { MinorRepairEngineeringApplyToView.Initialize(); });
    $(document).queue("datagrid0102", function () { MinorRepairEngineeringApplyToView.huoqushuju(); });
    $(document).dequeue("datagrid0101");

});
MinorRepairEngineeringApplyToView = {
    Initialize: function () {
        grid = $('#householdTable').datagrid({
            height: 200,
            striped: true,
            fitColumns: true,
            loadMsg: false,
            singleSelect: true,
            title: "分户信息",
            nowrap: false,
            rownumbers: true, //行号
            pageSize: 10,
            pageList: [10, 20, 50, 100],
            showFooter: true,
            columns: [
                [
                    { title: '分户编号', field: 'houseUnitId', width: '100', align: 'center' },
                    { title: '单元名称', field: 'unitName', width: '100', align: 'center' },
                    { title: '承租人', field: 'name', width: '100', align: 'center' },
                    { title: '联系电话', field: 'contactNumber', width: '100', align: 'center' }
                ]
            ]
        });
        $(document).dequeue("datagrid0102");
    },
    ///获取数据
    huoqushuju: function () {
        topevery.ajax({
            type: "POST",
            url: "api/services/app/RepairTaskR/GetHouseTenantHandleInfoAsync",
            contentType: "application/json",
            data: JSON.stringify({ id: getRequest("id") })
        }, function (row) {
            if (row.success) {
                var data = row.result;
                if (data.houseUnitInfos!=null) {
                    for (var i = 0; i < data.houseUnitInfos.length; i++) {
                        $('#householdTable').datagrid('insertRow', { index: i, row: data.houseUnitInfos[i] });
                    }
                }
                var array = {};
                for (var j in data) {
                    array["" + UpperFirstLetter(j) + ""] = data[j];
                };
                topevery.PicturesShow(getRequest("id"), 3, "Attachment");
                $("#MinorRepairEngineeringApplyToView").form("load", array);
            } else {
                error();
            }
        }, true);
    }
}
///首字母转大写
function UpperFirstLetter(str) {
    return str.replace(/\b\w+\b/g, function (word) {
        return word.substring(0, 1).toUpperCase() + word.substring(1);
    });
}