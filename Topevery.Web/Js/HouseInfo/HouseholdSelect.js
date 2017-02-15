$(function () {
    HouseBanIndex.Initialize();
    HouseBanIndex.ListHouseholdInitialize();
});
var grid;
var HouseBanIndex = {
    ///加载楼栋信息
    Initialize: function() {
        grid = $("#HouseholdSelectTable").datagrid({
            columns: [
                [
                    { field: "id", checkbox: true },
                    { field: "houseNo", title: "房屋编号", width: 60, align: "center" },
                    { field: "houseDoorplate", title: "现房屋门牌", width: 100, align: "center" },
                    { field: "streetName", title: "街道", width: 100, align: "center" }
                ]
            ],
            singleSelect: true,
            height: 520,
            idField: "id",
            striped: true,
            fitColumns: true,
            nowrap: false,
            rownumbers: true,
            pagination: true,
            showFooter: true,
            toolbar: "#toolbar",
            pageSize: 10,
            pageList: [10, 20, 50, 100],
            onLoadSuccess: function (data) {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
            },
            loader: function(param, success, error) {
                topevery.ajax({
                    type: "POST",
                    url: "api/services/app/HouseBanR/GetListHouseBanPageList",
                    contentType: "application/json",
                    data: topevery.extend(topevery.form2Json("selectFrom"), {
                        PageIndex: param.page,
                        PageCount: param.rows,
                        GetInfoType:1
                    })
                }, function(data) {
                    if (data.success) {
                        success(data.result);
                    } else {
                        error();
                    }
                }, false);
            },
            onClickRow: HouseBanIndex.dbClick
            //onDblClickRow: HouseBanIndex.dbClick
        });
        for (var i = 0; i < $("#selectFrom").find("input").length; i++) {
            $("#" + $("#selectFrom").find("input").eq(i)[0].id + "").textbox({
                inputEvents: $.extend({}, $.fn.textbox.defaults.inputEvents, {
                    keyup: function(event) {
                        if (event.keyCode === 13) {
                            HouseBanIndex.Select();
                        }
                    }
                })
            });
        };
        for (var j = 0; j < $("#selectFromListHousehold").find("input").length; j++) {
            $("#" + $("#selectFromListHousehold").find("input").eq(j)[0].id + "").textbox({
                inputEvents: $.extend({}, $.fn.textbox.defaults.inputEvents, {
                    keyup: function (event) {
                        if (event.keyCode === 13) {
                            HouseBanIndex.ListHouseholdSelect();
                        }
                    }
                })
            });
        };
    },
    ///双击过滤分户信息
    dbClick: function (data, row) {
        $("#HouseNos").textbox('setValue', row.houseNo);
        $("#HouseId").textbox('setValue', row.houseNo);
        var array = topevery.form2Json("selectFromListHousehold");
        $('#ListHouseholdTable').datagrid('load',array); //点击搜索
    },
    ///楼栋信息查询
    Select: function() {
        $('#HouseholdSelectTable').datagrid('load', { input: topevery.form2Json("selectFrom") }); //点击搜索
    },
    ///分户信息查询
    ListHouseholdSelect: function() {
        $('#ListHouseholdTable').datagrid('load', { input: topevery.form2Json("selectFromListHousehold") }); //点击搜索
    },
    ///绑定分户信息grid
    ListHouseholdInitialize: function() {
        grid = $("#ListHouseholdTable").datagrid({
            columns: [
                [
                    { field: "id", checkbox: true },
                    { field: "houseNo", title: "房屋编号", width: 60, align: "center" },
                    { field: "unitName", title: "单元名称", width: 60, align: "center" },
                    { field: "name", title: "承租人", width: 100, align: "center" },
                    //{ field: "residPopNum", title: "常驻人口", width: 100, align: "center" },
                    //{ field: "buildArea", title: "建筑面积", width: 100, align: "center" },
                    //{ field: "metRentArea", title: "计租面积", width: 100, align: "center" },
                    { field: "contactNumber", title: "联系电话", width: 100, align: "center" }
                ]
            ],
            height: 520,
            idField: "id",
            striped: true,
            fitColumns: true,
            nowrap: false,
            rownumbers: true,
            pagination: true,
            showFooter: true,
            toolbar: "#ListHousehold",
            pageSize: 10,
            pageList: [10, 20, 50, 100],
            onLoadSuccess: function (data) {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
            },
            loader: function(param, success, error) {
                topevery.ajax({
                    type: "POST",
                    url: "api/services/app/HouseUnitR/GetHouseUnitListAsync",
                    contentType: "application/json",
                    data: topevery.extend(topevery.form2Json("selectFromListHousehold"), {
                        PageIndex: param.page,
                        PageCount: param.rows
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
    ///保存数据到修缮申请页面
    HousehoSave: function() {
        var householdSelectArray = $('#HouseholdSelectTable').datagrid('getSelections');
        var listHouseholdArray = $('#ListHouseholdTable').datagrid('getSelections');
        if (householdSelectArray.length === 0) {
            $.messager.alert('提示', '至少选择一条楼栋信息!', 'info');
        } else {
          
            frameHelper.getDialogParentIframe().MinorRepairEngineeringApply.SaveMinorRepair(householdSelectArray, listHouseholdArray);
            frameHelper.getDialogParentIframe().dialog10.dialog('close');
        }
    }
};


