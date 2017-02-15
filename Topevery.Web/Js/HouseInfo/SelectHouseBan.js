$(function () {
    HouseBanIndex.Initialize();
});
var grid;
var HouseBanIndex = {
    Initialize: function() {
        grid = $("#houseBanDataGrid").datagrid({
            height: 400,
            fitColumns: true,
            singleSelect: false,
            nowrap: false,
            checkOnSelect:false,
            rownumbers: true, //行号
            pagination: true, //分页控件
            //toolbar: "#area",
            columns: [
                [
                    { field: "houseNo", title: "房屋编号", width: 100, align: "center" },
                    { field: "houseDoorplate", title: "现房屋门牌", width: 150, align: "center" },
                    { field: "unitName", title: "单元名称", width: 100, align: "center" },
                    { field: "buildArea", title: "建筑面积", width: 80, align: "center" },
                    { field: "rentRange", title: "租用范围", width: 60, align: "center" },
                    { field: "residPopNum", title: "常驻人口", width: 100, align: "center" }
                ]
            ],
            onLoadSuccess: function (data) {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
                $(this).datagrid("clearSelections").datagrid("clearChecked");
            },
            loader: function (param, success, error) {
                topevery.ajax({
                    type: "POST",
                    url: "api/services/app/HousingLossR/GetHouseBanInfoAsync",
                    contentType: "application/json",
                    data: topevery.extend(topevery.form2Json("selectFrom"), {
                        PageIndex: param.page,
                        PageCount: param.rows
                    })
                }, function (data) {
                    if (data.success) {
                            success(data.result);
                    } else {
                        error();
                    }
                    }
                ,false);
            },
            onDblClickRow: function (index, row) {
                frameHelper.getDialogParentIframe().LoadHouseInfo(row);
                frameHelper.getDialogParentIframe().dialog.dialog('close');
            }
        });
    },
    Select: function() {
        $("#houseBanDataGrid").datagrid("reload");
    }
};