var HouseUnitDataGrid = {
    Initialize:function() {
        $("#houseUnitDataGrid").datagrid({
            columns: [
                [
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
            idField: "id",
            height:370,
            striped: true,
            //fit:true,
            fitColumns: true,
            singleSelect: true,
            rownumbers: true,
            pagination: true,
            showFooter: true,
            onLoadSuccess: function (data) {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
            },
            loader: function (param, success, error) {
                topevery.ajax({
                    type: "POST",
                    url: "api/services/app/HouseUnitR/GetHouseUnitPageList",
                    contentType: "application/json",
                    data: topevery.extend({
                        PageIndex: param.page,
                        PageCount: param.rows,
                        HouseId:getRequest("id")
                    })
                }, function (data) {
                    if (data.success) {
                        success(data.result);
                    } else {
                        error();
                    }
                }, false);
            }
        });
    },
    DisabledCheckBox: function (value, row, index) {
        if (value === 1) return "<input type='checkbox' checked='checked' disabled='disabled' />";
        else if (value === 0) return "<input type='checkbox' disabled='disabled' />";
        else return "";
    }
};
HouseUnitDataGrid.Initialize();