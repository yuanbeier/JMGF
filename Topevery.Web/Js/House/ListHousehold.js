var grid;
var ListHousehold = {
    Initialize: function() {
        grid = $("#ListHouseholdDataGrid").datagrid({
            columns: [
                [
                    { field: "id", checkbox: true },
                    {
                        field: "unitName", title: "单元名称", width: 100, align: "center"
                    //, formatter: function (value, row, index) {
                        //    return "<a href='#' onclick='HouseUnitIndex.Show(" + row.id + ")'>" + value + "</a>";
                        //}
                    },
                    { field: "houseDoorplate", title: "现房屋门牌", width: 100, align: "center" },
                    { field: "residPopNum", title: "常住人口", width: 100, align: "center" },
                    { field: "rentRange", title: "租用范围", width: 100, align: "center" },
                    { field: "buildArea", title: "建筑面积(㎡)", width: 100, align: "center" },
                    { field: "metRentArea", title: "计租面积(㎡)", width: 100, align: "center" },
                    { field: "baseRent", title: "租金基数(￥)", width: 100, align: "center" },
                    { field: "isRent", title: "房屋是否出租", width: 100, align: "center", formatter: this.DisabledCheckBox },
                    { field: "isRentable", title: "是否可出租", width: 100, align: "center", formatter: this.DisabledCheckBox },
                    { field: "isTao", title: "是否成套住宅", width: 100, align: "center", formatter: this.DisabledCheckBox },
                    { field: "isHome", title: "是否住宅", width: 100, align: "center", formatter: this.DisabledCheckBox },
                    { field: "isSwing", title: "是否周转房", width: 100, align: "center", formatter: this.DisabledCheckBox },
                     { field: "isPubRenHous", title: "是否公租房", width: 100, align: "center", formatter: this.DisabledCheckBox },
                    { field: "isLowRentHous", title: "是否廉租房", width: 100, align: "center", formatter: this.DisabledCheckBox }
                ]
            ],
            height: 364,
            idField: "id",
            fit: true,
            fitColumns: true,
            singleSelect: true,
            nowrap: false,
            rownumbers: true, //行号
            pagination: true, //分页控件
            showFooter: true,
            toolbar: "#toolbarWrap",
            onLoadSuccess: function(data) {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
                $(this).datagrid("clearSelections").datagrid("clearChecked");
            },
            loader: function(param, success, error) {
                topevery.ajax({
                    type: "POST",
                    url: "api/services/app/HouseUnitR/GetHouseUnitList",
                    contentType: "application/json",
                    data: topevery.extend(topevery.form2Json("selectFrom"), {
                        PageIndex: param.page,
                        PageCount: param.rows,
                        HousekeepId: getRequest("id")
                    })
                }, function(data) {
                    if (data.success) {
                        success(data.result);
                    } else {
                        error();
                    }
                }, false);
            }
        });
    },
    Select: function () {
        $("#ListHouseholdDataGrid").datagrid("reload");
    },
    DisabledCheckBox: function (value, row, index) {
        if (value === 1) return "<input type='checkbox' checked='checked' disabled='disabled' />";
        else if (value === 0) return "<input type='checkbox' disabled='disabled' />";
        else return "<input type='checkbox' disabled='disabled' />";
    }
};
$(function () {
    ListHousehold.Initialize();
});
