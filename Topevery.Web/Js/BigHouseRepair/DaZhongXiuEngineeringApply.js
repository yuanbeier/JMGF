//将表单数据转为json
var grid;
var dialog10;
var tenantTypelist;

DaZhongXiuEngineeringApply= {
    ///加载列表数据-
    Initialize: function () {
        grid = $('#DaZhongXiuEngineeringApplyDataGrid').datagrid({
            height: 380,
            idField: "id",
            striped: true,
            fitColumns: true,
           // fit: true,
            singleSelect: false,
            nowrap: false,
            //rownumbers: false, //行号
            //pagination: true, //分页控件
            //pageSize: 10,
            //pageList: [10, 20, 50, 100],
            showFooter: true,
            onLoadSuccess: function (data) {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
            },
            columns: [
                [
                    { field: "id", checkbox: true },
                     { field: "houseBanId", title: "房屋Id", hidden: true },
                     { field: "unitId", title: "分户Id", hidden: true },
                    { field: "houseNo", title: "房屋编号", align: "center", width: '10%' },
                    { field: "houseDoorplate", title: "现房屋门牌", align: "left", width: '10%' },
                     { field: "streetName", title: "街道名称", align: "center", width: '10%' },
                    { field: "unitName", title: "单元名称", align: "center", width: '10%' },
                   // { field: "unitDoorplate", title: "单元门牌", align: "center", width: '10%' },
                    { field: "rentRange", title: "租赁范围", align: "center", width: '10%' },
                    { field: "name", title: "承租人", align: "center", width: '10%' },
                    { field: "contactNumber", title: "联系电话", align: "center", width: '10%' },
                    {
                        title: '操作',
                        field: 'Action',
                        align: 'center',
                        width: 60,
                        formatter: function (value, row, index) {
                            var a = "<a href='#' class='easyui-oldoperate' onclick='DaZhongXiuEngineeringApply.DeleteRow(" + index + ")'>删除<a/>";
                            return  a;
                        }
                    }
                ]
            ],
            toolbar: '#toolbarWrap'
        });
        DaZhongXiuEngineeringApply.init();
    },
    //楼栋信息分户选择
    BuildingChoice: function (mapHouseNo) {
        if (mapHouseNo===undefined) {
            mapHouseNo = "";
        }
        var list = $('#DaZhongXiuEngineeringApplyDataGrid').datagrid('getRows');
        var ids = "";
        var idsunit = "";
        for (var i = 0; i < list.length; i++) {
            if (list[i].unitId === 0) {
                ids += list[i].houseBanId + ",";
            }
        }
        for (var h = 0; h < list.length; h++) {
            if (list[h].unitId!==0) {
                idsunit += list[h].unitId + ",";
            }
        }
        dialog10 = ezg.modalDialog({
            width: 1190,
            height: 565,
            title: '楼栋信息分户选择',
            url: virtualDirName + "BigHouseRepair/HouseholdSelect?ids=" + ids + "&idsunit=" + idsunit + "&mapHouseNo=" + mapHouseNo
        });
    },
    //根据行编号删除一列
    DeleteRow: function (index) {
        $('#DaZhongXiuEngineeringApplyDataGrid').datagrid('deleteRow', index);
        var list = $('#DaZhongXiuEngineeringApplyDataGrid').datagrid('getRows');
        $('#DaZhongXiuEngineeringApplyDataGrid').datagrid('loadData', { total: 0, rows: [] });
        for (var i = 0; i < list.length; i++) {
            $('#DaZhongXiuEngineeringApplyDataGrid').datagrid('insertRow', { index: i, row: list[i] });
        }
    },
    ///保存弹出窗口回传信息
    SaveMinorRepair: function (listHouseholdArray, householdSelectArray) {
        $('#DaZhongXiuEngineeringApplyDataGrid').datagrid('loadData', { total: 0, rows: [] });
        for (var i = 0; i < listHouseholdArray.length; i++) {
            if (listHouseholdArray[i] !== "id") {
                $('#DaZhongXiuEngineeringApplyDataGrid').datagrid('insertRow', {
                    index: i,
                    row: {
                        id: i,
                        houseBanId: listHouseholdArray[i].id,
                        houseNo: listHouseholdArray[i].houseNo,
                        houseDoorplate: listHouseholdArray[i].houseDoorplate,
                        unitName: listHouseholdArray[i].unitName,
                        unitId: 0,
                      //  unitDoorplate: "",
                        rentRange: "",
                        name: "",
                        contactNumber: ""
                    }
                });
            }
        }
        for (var j = 0; j < householdSelectArray.length; j++) {
            if (householdSelectArray[j] !== "unitId") {
                var number = j + listHouseholdArray.length;
                $('#DaZhongXiuEngineeringApplyDataGrid').datagrid('insertRow', {
                    index: number, row: {
                        id: number,
                        houseBanId: householdSelectArray[j].id,
                        houseNo: householdSelectArray[j].houseNo,
                        unitId: householdSelectArray[j].unitId,
                        houseDoorplate: householdSelectArray[j].houseDoorplate,
                        unitName: householdSelectArray[j].unitName,
                      //  unitDoorplate: householdSelectArray[j].unitDoorplate,
                        rentRange: householdSelectArray[j].rentRange,
                        name: householdSelectArray[j].name,
                        contactNumber: householdSelectArray[j].contactNumber
                    }
                });
            }
        }
    },
    Save: function () {
        var data = $('#DaZhongXiuEngineeringApplyDataGrid').datagrid('getRows');
        if (data.length === 0) {
            $.messager.alert('提示', '至少选择一条楼栋,或者一条分户信息!', 'info');
        } else {
            var ids = "";
            for (var i = 0; i < data.length; i++) {
                ids += data[i].houseBanId + "," + data[i].unitId + ";";
            }
            if ($("#ApplyReason").textbox("getValue") == null || $("#ApplyReason").textbox("getValue") === "" || $("#ApplyReason").textbox("getValue") == undefined) {
                window.top.topeveryMessage.show("请输入申请原因！");
                return;
            }
            if ($("input[name='fileDivIdhiddenFile']").val() == null || $("input[name='fileDivIdhiddenFile']").val() === "" || $("input[name='fileDivIdhiddenFile']").val() == undefined) {
                window.top.topeveryMessage.show("请上传房屋图片、完损鉴定等文件！");
                return;
            }
            topevery.ajax({
                type: "POST",
                url: "api/services/app/RepairTaskW/AddRepairLargeAndMediumAsync",
                contentType: "application/json",
                data: JSON.stringify({
                    HouseIdAndUnitId: ids,
                    FileId: $("input[name='fileDivIdhiddenFile']").val(),
                    ApplyReason: $("#ApplyReason").textbox("getValue")
                })
            }, function (data) {
                if (data.success) {
                    if (data.result.isSuccess) {
                        window.top.topeveryMessage.show(data.result.message);
                        window.top.$(".center-menu").find("li").eq(1).click();
                    } else {
                        topeveryMessage.show(data.result.message);
                    }
                } else {
                    error();
                }
            }, false);
        }
    },
    init: function () {
        if ($("#mapHouseNo").val() != null && $("#mapHouseNo").val() !== "") {
            DaZhongXiuEngineeringApply.BuildingChoice($("#mapHouseNo").val());
        }
    }
}
///初始化
$(function () {
    $(document).queue("datagrid0101", function () { DaZhongXiuEngineeringApply.Initialize(); });
    $(document).dequeue("datagrid0101");
});


