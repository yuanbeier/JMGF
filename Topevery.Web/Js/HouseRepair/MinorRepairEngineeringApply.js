var grid;
var dialog10;
var MinorRepairEngineeringApply;
MinorRepairEngineeringApply = {
    ///初始化分户信息列表
    HouseholdInitialize: function() {
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
            onLoadSuccess: function(data) {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
            },
            columns: [
                [
                    { title: '分户编号', field: 'id', width: '150', align: 'center' },
                    { title: '单元名称', field: 'unitName', width: '150', align: 'center' },
                    { title: '承租人', field: 'name', width: '100', align: 'center' },
                    { title: '联系电话', field: 'contactNumber', width: '200', align: 'center' },
                    {
                        title: '操作',
                        field: 'Action',
                        width: '120',
                        align: 'center',
                        formatter: function(value, row, index) {
                            var e = '<a href="#" class="easyui-modifyoperate" onclick="frameHelper.getDialogParentIframe().MinorRepairEngineeringApply.Delete(' + index + ')">删除</a> ';
                            return e;
                        }
                    }
                ]
            ]
        });
        bindDicToDrp("PropertyId", "B34CFE85-FB80-4817-B660-B8DF27F8DC76", "");
        bindDicToDrp("UsePropertyId", "28519BAC-0C61-4921-A7C1-80F3CEB80AC0", "");
        bindDicToDrp("BuildStructureId", "29A43A34-8D05-4F9A-B0FA-EFB8A38F7F98", "");
        $("#HouseNo").textbox({
            required: true,
            editable: false,
            icons: [
                {
                    iconCls: "icon-search",
                    handler: function() {
                        MinorRepairEngineeringApply.openName();
                    }
                }
            ]
        });
        MinorRepairEngineeringApply.init();
        $(document).dequeue("datagrid0102");
    },
    ///弹出房屋分户选择窗口
    openName: function() {
        dialog10 = ezg.modalDialog({
            width: 1100,
            height: 575,
            title: '楼栋信息分户选择',
            url: virtualDirName + "House/HouseholdSelect?mapHouseNo=" + $("#mapHouseNo").val(),
            buttons: [
            ]
        });
    },
    ///保存弹出窗口回传信息
    SaveMinorRepair: function (householdSelectArray, listHouseholdArray) {
        $('#householdTable').datagrid('loadData', { total: 0, rows: [] });
        $("#MinorRepairEngineeringApply").form("load", householdSelectArray[0]);
        $("#HouseId").val(householdSelectArray[0].id);
        var metRentArea = 0;
        for (var i = 0; i < listHouseholdArray.length; i++) {
           // metRentArea += listHouseholdArray[i].metRentArea;//总面积
            $('#householdTable').datagrid('insertRow', { index: i, row: listHouseholdArray[i] });
        }
        //$("#MetRentArea").numberbox("setText", metRentArea);
    },
    ///删除选择的分户信息
    Delete: function(id) {
        $('#householdTable').datagrid('deleteRow', id);
        var list = $('#householdTable').datagrid('getRows');
        $('#householdTable').datagrid('loadData', { total: 0, rows: [] });
        for (var i = 0; i < list.length; i++) {
            $('#householdTable').datagrid('insertRow', { index: i, row: list[i] });
        }
    },
    ///提交申请数据
    Save: function() {
        var array = ezg.serializeObject($('form'));
        var list = $('#householdTable').datagrid('getRows');
        var idList = "";
        for (var i = 0; i < list.length; i++) {
            idList += list[i].id + ",";
        }
        if (!$("#MinorRepairEngineeringApply").form('validate')) {
            return;
        }

        if ($("#ApplyReason").textbox("getValue") == null || $("#ApplyReason").textbox("getValue") === "" || $("#ApplyReason").textbox("getValue")==undefined) {
            window.top.topeveryMessage.show("请输入申请原因！");
            return;
        }
        topevery.ajax({
            type: "POST",
            url: "api/services/app/RepairTaskW/AddRepairTaskAsync",
            contentType: "application/json",
            data: topevery.extend(array, { HouseUnitId: idList, FileId: $("input[name='fileDivIdhiddenFile']").val() })
        }, function(row) {
            if (row.success) {
                if (row.result.isSuccess) {
                    var id = row.result.id;
                    window.top.topeveryMessage.show(row.result.message);
                    //  window.location = virtualDirName + 'Home/TodoLists';
                //    window.open(virtualDirName + "PrintRelevant/ProjectApprovalSheet?id=" + id);

                    window.top.$(".center-menu").find("li").eq(1).click();
                } else {
                    topeveryMessage.show(row.result.message);
                }
            } else {
                error();
            }
        }, true);
    },
    init: function () {
        if ($("#mapHouseNo").val() != null && $("#mapHouseNo").val() !== "") {
            MinorRepairEngineeringApply.openName();
        }
    }
}


///初始化数据
$(function () {
    $(document).queue("datagrid0101", function () { MinorRepairEngineeringApply.HouseholdInitialize(); });
    $(document).dequeue("datagrid0101");

});