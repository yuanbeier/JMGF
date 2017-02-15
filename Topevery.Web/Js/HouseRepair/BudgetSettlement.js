var gridRepairPlanTable;
var gridRepairPlanTableChange;
var RepairTaskId = topevery.getQuery("id");
var taskListNo = topevery.getQuery("taskListNo");
BudgetSettlement = {
    ///加载修缮方案列表
    InitializeRepairPlan: function() {
        gridRepairPlanTable = $('#RepairPlanTable').datagrid({
            height: 350,
            striped: true,
            fitColumns: true,
            loadMsg: false,
            singleSelect: true,
            nowrap: false,
            rownumbers: true, //行号
            pageSize: 50,
            pageList: [10, 20, 50, 100],
            showFooter: true,
            onLoadSuccess: function(data) {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
            },
            ///获取修缮项目
            loader:  function(param, success, error) {
                topevery.ajax({
                    type: "POST",
                    url: "api/services/app/RepairTaskR/GetRepairTaskRepItemInfoAsync",
                    contentType: "application/json",
                    data: JSON.stringify({
                        id: RepairTaskId //$("#FromInstanceId").val()
                    })
                }, function(data) {
                    if (data.success) {
                        success(data.result.repairItemList);
                    } else {
                        error();
                    }
                }, false);
            },
            columns: [
                [
                    { field: "id", title: '编号', hidden: true },
                    { title: '定额号', field: 'quotaNo', width: '10%', align: 'center' },
                    { title: '工程小类', field: 'repairCate', width: '12%', align: 'center' },
                    { title: '工程大类', field: 'repairTypeId', width: '18%', align: 'center', hidden: true },
                    { title: '工程大类', field: 'repairTypeName', width: '18%', align: 'center' },
                    { title: '单位', field: 'unit', width: '7%', align: 'center' },
                    { title: '单价(有住户)', field: 'unitPriceY', width: '12%', align: 'center' },
                    { title: '住宅数量', field: 'number', width: '8%', align: 'center' },
                    { title: '单价(空置房)', field: 'unitPriceN', width: '12%', align: 'center' },
                    { title: '空置房数量', field: 'unitNumN', width: '12%', align: 'center' }
                ]
            ]
        });
    },
    ///加载修缮变更方案列表
    InitializeRepairPlanChange: function() {
        gridRepairPlanTableChange = $('#RepairPlanTableChange').datagrid({
            height: 350,
            striped: true,
            fitColumns: true,
            loadMsg: false,
            singleSelect: true,
            nowrap: false,
            rownumbers: true, //行号
            pageSize: 10,
            pageList: [10, 20, 50, 100],
            showFooter: true,
            pagination: true, //分页控件
            loader: function(param, success, error) {
                topevery.ajax({
                    type: "POST",
                    url: "api/services/app/RepairTaskR/GetTaskChangeListAsync",
                    contentType: "application/json",
                    data: JSON.stringify({
                        RepairTaskNo: taskListNo,
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
            },
            onLoadSuccess: function(data) {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
            },
            columns: [
                [
                    { field: "id", title: '编号', hidden: true },
                    { title: '定额号', field: 'quotaNo', width: '10%', align: 'center' },
                    { title: '工程小类', field: 'repairCate', width: '18%', align: 'center' },
                    { title: '工程大类', field: 'repairType', width: '15%', align: 'center' },
                    { title: '单位', field: 'unit', width: '7%', align: 'center' },
                    { title: '数量', field: 'num', width: '8%', align: 'center' },
                    { title: '单价', field: 'unitPriceY', width: '12%', align: 'center' },
                    { title: '综合单价', field: 'price', width: '12%', align: 'center' },
                ]
            ]
        });
    },
}
$(function () {
    BudgetSettlement.InitializeRepairPlan();
    BudgetSettlement.InitializeRepairPlanChange();
});
