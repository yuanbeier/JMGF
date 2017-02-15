var grid;
var ids;
var schedulinId = topevery.getQuery('schedulinId');
var dateTime = topevery.getQuery('dateTime');
var houseManageId = topevery.getQuery('houseManageId');
///初始化
$(function () {
    $(document).queue("datagrid0101", function() { schedulingView.Initialize1(); });
    $(document).queue("datagrid0102", function () { schedulingView.Initialize2(); });
    $(document).queue("datagrid0103", function () { schedulingView.Initialize3(); });
    $(document).dequeue("datagrid0101");
});
schedulingView = {
    Initialize1: function () {
        if ($("#WorkstationDropDown").val()) {
            bindDropDown("HouseManageId", "Common/GetWorkstationBind", "--工作站--", false, false);
        } else {
            bindDropDown("HouseManageId", "Common/GetWorkstationBind", "--工作站--", false, true);
            $("#HouseManageId").combobox("readonly");
        }
        $("#HouseManageId").combobox('setValue', houseManageId);
        $(document).dequeue("datagrid0102");
    },
    ///加载列表数据-
    Initialize2: function() {
        grid = $('#SchedulingTable').datagrid({
            columns: [
                [
                    { field: "id", checkbox: true },
                    { field: "userDeptName", title: "工作站", width: 60, align: "center" },
                    { field: "housekeepName", title: "房管员", width: 100, align: "center" },
                ]
            ],
            height: 500,
            idField: "housekeepId",
            striped: true,
            fitColumns: true,
            // fit: true,
            rownumbers: true, //行号
            pagination: true, //分页控件
            pageSize: 10,
            pageList: [10, 20, 50, 100],
            showFooter: true,
            toolbar: "#SchedulingView",
            onLoadSuccess: function(data) {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
                if (ids !== undefined) {
                    for (var i = 0; i < ids.length; i++) {
                        var rowIndexk = $('#SchedulingTable').datagrid('getRowIndex', ids[i].id);
                        $('#SchedulingTable').datagrid('selectRow', rowIndexk);
                        $('#SchedulingTable').datagrid('checkRow', rowIndexk);
                    }
                }
            },
            loader: function(param, success, error) {
                topevery.ajax({
                    type: "POST",
                    url: "api/services/app/HouseBanR/GetHouseKeeperPageList",
                    contentType: "application/json",
                    data: topevery.extend(null, {
                        PageIndex: param.page,
                        PageCount: param.rows,
                        HousekeepName:$("#HousekeepName").textbox('getValue'),
                        UserDeptId:$("#HouseManageId").combobox('getValue')
                    })
                }, function(data) {
                    if (data.success) {
                        success(data.result);
                        $(document).dequeue("datagrid0103");
                    } else {
                        error();
                    }
                }, true);
            }
        });
    },
    Initialize3: function() {
        topevery.ajax({
            type: "POST",
            url: "api/services/app/SchedulingR/GetHousekeepNameListAsync",
            contentType: "application/json",
            data: topevery.extend(null, {
                SchedulinId: schedulinId,
                Date: dateTime
            })
        }, function(data) {
            if (data.success) {
                var row = data.result;
                for (var i = 0; i < row.length; i++) {
                    var rowIndexk = $('#SchedulingTable').datagrid('getRowIndex', row[i].id);
                    $('#SchedulingTable').datagrid('selectRow', rowIndexk);
                    $('#SchedulingTable').datagrid('checkRow', rowIndexk);
                }
                ids = row;
            } else {
                error();
            }
        }, true);
    },
    //搜索
    loadInfo:function() {
        $('#SchedulingTable').datagrid('load', { input: topevery.form2Json("SchedulingView") }); //点击搜索
    },
    //重置
    Clear:function() {
        $("#HouseManageId").combobox('setValue', houseManageId);
        $("#HousekeepName").textbox('setValue', '');
        schedulingView.loadInfo();
    },
    ///保存
    Save: function () {
        var arrRows = $('#SchedulingTable').datagrid('getChecked');
        var userIds = "";
        for (var i = 0; i < arrRows.length; i++) {
            if (arrRows[i] !== "housekeepId") {
                userIds += arrRows[i].id + ",";
            }
        }
        var url = "api/services/app/SchedulingW/AddSchedulingAsync";
        if ($("#SchedulingView").form('validate') === false) {
            return;
        } else {
            topevery.ajax({
                type: "POST",
                url: url,
                contentType: "application/json",
                data: topevery.extend(null, { UserIds: userIds, ShiftMaintenanceId: schedulinId, Date: dateTime })
            }, function(data) {
                if (data.success) {
                    if (data.result.isSuccess) {
                        try {
                            frameHelper.getDialogParentIframe().dialog10.dialog('close');
                        } catch (e) {

                        }
                        try {
                            window.top.topeveryMessage.show(data.result.message);
                        }  catch (e) {

                        }
                        try {
                            frameHelper.getDialogParentIframe().Scheduling.loadInfo();
                        } catch (e) {

                        }
                    } else {
                        window.top.topeveryMessage.show(data.result.message);
                    }
                } else {
                    error();
                }
            }, true);
        }
    }
}
window.onload=function() {
   
}
