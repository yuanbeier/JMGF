$(function () {
    bindDropDown("userDeptId", "Common/GetWorkstationBind", "--工作站--", false);
    bindDicToDrp("PropertyId", "B34CFE85-FB80-4817-B660-B8DF27F8DC76", "--产权属性--", false);
    HouseBanIndex.Initialize();
});
var grid;
var HouseBanIndex = {
    Initialize: function () {
        grid = $("#houseBanDataGrid").datagrid({
            height: 500,
            idField: "id",
            fitColumns: true,
            fit: true,
            nowrap: false,
            rownumbers: true, //行号
            pagination: true, //分页控件
            striped: true,
            toolbar: "#toolbarWrap",
            columns: [
                [
                    { field: "id", checkbox: true },
                    { field: "houseNo", title: "房屋编号", width: 85, align: "center", sortable: true, },
                    { field: "houseDoorplate", title: "现房屋门牌", width: 100, align: "center" },
                    { field: "streetName", title: "街道", width: 140, align: "center" },
                    { field: "groundNo", title: "地号", width: 100, align: "center" },
                    { field: "buildStructureName", title: "建筑结构", width: 80, align: "center" },
                    { field: "areaIdName", title: "所属区域", width: 60, align: "center" },
                    { field: "propertyIdName", title: "产权属性", width: 100, align: "center" },
                    { field: "landNatureName", title: "用地性质", width: 100, align: "center" },
                    { field: "buildArea", title: "建筑面积(㎡)", width: 85, align: "center", sortable: true },
                    { field: "metRentArea", title: "计租面积(㎡)", width: 85, align: "center", sortable: true }
                ]
            ],
            onLoadSuccess: function(data) {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
                $(this).datagrid("clearSelections").datagrid("clearChecked");
            },
            loader: function(param, success, error) {
                topevery.ajax({
                    type: "POST",
                    url: "api/services/app/HouseBanR/GetListHouseBanPageList",
                    contentType: "application/json",
                    data: topevery.extend(topevery.form2Json("selectFrom"), {
                        PageIndex: param.page,
                        PageCount: param.rows,
                        Sort: param.sort,
                        Order: param.order,
                        Id: getRequest("id")
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
        $("#houseBanDataGrid").datagrid("reload");
    }
};