var grid;
var grid1;
var ids = getRequest("ids").split(',');
//var idsConstant = getRequest("ids").split(',');

var idsunit = getRequest("idsunit").split(',');
//var idsunitConstant = getRequest("idsunit").split(',');

var CacheData = "";
var CacheArray = new Array();

var CacheidsunitData = "";
var CacheidsunitArray = getRequest("idsunit").split(',');
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
            checkOnSelect: false,
            selectOnCheck: false,
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
                CacheData = "";
                for (var kk = 0; kk < ids.length - 1; kk++) {
                    var rowIndexk = $('#HouseholdSelectTable').datagrid('getRowIndex', ids[kk]);
                    $('#HouseholdSelectTable').datagrid('checkRow', rowIndexk);
                    if (rowIndexk === -1) {
                        CacheData += ids[kk] + ",";
                    }
                }
                if (CacheData != null && CacheData !== "") {
                    CacheArray = CacheData.split(',');
                } else {
                    CacheArray = new Array();
                }
                ids = CacheArray;
            },
            loader: function(param, success, error) {
                topevery.ajax({
                    type: "POST",
                    url: "api/services/app/HouseBanR/GetListHouseRepairsList",
                    contentType: "application/json",
                    data: topevery.extend(topevery.form2Json("selectFrom"), {
                        PageIndex: param.page,
                        PageCount: param.rows,
                        GetInfoType:1
                    })
                }, function(data) {
                    if (data.success) {
                        success(data.result);
                        $(document).dequeue("datagrid0102");
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
        grid1 = $("#ListHouseholdTable").datagrid({
            columns: [
                [
                    { field: "unitId", checkbox: true },
                    { field: "houseNo", title: "房屋编号", width: 60, align: "center" },
                    { field: "unitName", title: "单元名称", width: 60, align: "center" },
                    { field: "name", title: "承租人", width: 100, align: "center" },
                    { field: "contactNumber", title: "联系电话", width: 100, align: "center" }
                ]
            ],
            height: 520,
            idField: "unitId",
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
                CacheidsunitData = "";
                for (var kk = 0; kk < idsunit.length - 1; kk++) {
                    var rowIndexk = $('#ListHouseholdTable').datagrid('getRowIndex', idsunit[kk]);
                    $('#ListHouseholdTable').datagrid('checkRow', rowIndexk);
                    if (rowIndexk === -1) {
                        CacheidsunitData += idsunit[kk] + ",";
                    }
                }
                if (CacheidsunitData != null && CacheidsunitData !== "") {
                    CacheidsunitArray = CacheidsunitData.split(',');
                } else {
                    CacheidsunitArray = new Array();
                }
                idsunit = CacheidsunitArray;
            },
            loader: function(param, success, error) {
                topevery.ajax({
                    type: "POST",
                    url: "api/services/app/HouseUnitR/GetHouseRepairUnitListAsync",
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
    HousehoSave: function () {
        var householdSelectArray = $('#HouseholdSelectTable').datagrid('getChecked');
        var listHouseholdArray = $('#ListHouseholdTable').datagrid('getChecked');
        var listHousehold;
        if (frameHelper.getDialogParentIframe().grid !== undefined) {
            listHousehold = frameHelper.getDialogParentIframe().grid.datagrid('getRows');
        }
        var k;
        var j;
        for (j = 0; j < CacheidsunitArray.length; j++) {
            for (k = 0; k < listHousehold.length; k++) {
                if (listHousehold[k].unitId !== 0) {
                    if (CacheidsunitArray[j] == listHousehold[k].unitId) {
                        listHouseholdArray.push(listHousehold[k]);
                    }
                }
            }
        }
        debugger;
        for (j = 0; j < CacheArray.length; j++) {
            for (k = 0; k < listHousehold.length; k++) {
                if (CacheArray[j] == listHousehold[k].houseBanId && listHousehold[k].unitId===0) {
                    var array = {
                        houseDoorplate: listHousehold[k].houseDoorplate,
                        houseNo: listHousehold[k].houseNo,
                        id: listHousehold[k].houseBanId,
                        streetName: listHousehold[k].streetName
                    }
                  householdSelectArray.push(array);
                }
            }
        }
        if (householdSelectArray.length + listHouseholdArray.length === 0) {
            $.messager.alert('提示', '至少选择一条楼栋,或者一条分户信息!', 'info');
        } else {
            frameHelper.getDialogParentIframe().DaZhongXiuEngineeringApply.SaveMinorRepair(householdSelectArray, listHouseholdArray);
            frameHelper.getDialogParentIframe().dialog10.dialog('close');
        }
    }
};
///初始化
$(function () {
    $(document).queue("datagrid0101", function () { HouseBanIndex.Initialize(); });
    $(document).queue("datagrid0102", function () { HouseBanIndex.ListHouseholdInitialize(); });
    $(document).dequeue("datagrid0101");
});


