var grid;
var gridProcess;
var dialogAdd;
var gridRepairPlanTable;
var IsRepair;

var ContentAndDemand;///项目主要内容及要求
var PassTime; ///派发任务单时间
var ConstructionUnit; //施工单位
var IsFinished;///是否完工
var Remark;///备注

var IsPassed = 1;///修缮方案是否通过
var isExamination = 1;///是否显示审核
var Acceptance = 1;///是否显示验收


var workFlowInstanceId =  $("#workFlowInstanceId").val();
var ActivityInstanceId = $("#actInstanceId").val();
var RepairTaskId = $("#fromInstanceId").val();
MinorRepairEngineeringTransaction = {
    Initialize: function () {
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
            onLoadSuccess: function (data) {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
            },
            columns: [
                [
                    { title: '分户编号', field: 'houseUnitId', width: '100', align: 'center' },
                    { title: '单元名称', field: 'unitName', width: '100', align: 'center' },
                    { title: '承租人', field: 'name', width: '100', align: 'center' },
                    { title: '联系电话', field: 'contactNumber', width: '100', align: 'center' }
                ]
            ]
        });
    },
    ///获取流程办理信息
    loadData: function (param, success, error) {
        topevery.ajax({
            type: "POST",
            url: "api/services/app/HouseRentApplyR/GetWorkflowInstanceInfo",
            contentType: "application/json",
            data: JSON.stringify({
                FlowInstanceId: workFlowInstanceId,//$("#workFlowInstanceId").val(),
                ModuleType: 3
            })
        }, function (data) {
            if (data.success) {
                success(data.result);
             
            } else {
                error();
            }
        }, false);
    },
    ///加载列表数据-
    ProcessInitialize: function () {
        gridProcess = $('#ProcessViewTable').datagrid({
            height: 300,
            striped: true,
            fitColumns: true,
            loadMsg: false,
            singleSelect: true,
            nowrap: false,
            loader: MinorRepairEngineeringTransaction.loadData,
            rownumbers: true, //行号
            pageSize: 10,
            pageList: [10, 20, 50, 100],
            showFooter: true,
            onLoadSuccess: function (data) {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
            },
            columns: [
               [
                   { title: '环节名称', field: 'linkName', width: '150', align: 'center' },
                   { title: '经办人', field: 'agent', width: '120', align: 'center' },
                   {
                       title: '办理时间',
                       field: 'handleTime',
                       width: '150',
                       align: 'center',
                       formatter: function (value) {
                           return topevery.dataTimeFormatTT(value);
                       }
                   },
                   { title: '办理意见', field: 'handleOpinion', width: '150', align: 'center' },
                   {
                       title: '相关附件',
                       field: 'fileRDto',
                       width: '350',
                       align: 'center',
                       formatter: function (data, row, index) {
                           return topevery.ProcessAttachment(data);
                       }
                   }
               ]
            ]
        });
    },
    ///获取基本信息，赋值到文本框
    EssentialInformation: function () {
        topevery.ajax({
            type: "POST",
            url: "api/services/app/RepairTaskR/GetHouseTenantHandleInfoAsync",
            contentType: "application/json",
            data: JSON.stringify({ id: RepairTaskId })//$("#RepairTaskId").val() })
        }, function (row) {
            if (row.success) {
                var data = row.result;
                //$("#HouseNo").html(data.houseNo);
                $("#HouseNo").html("<a href='#' onclick='objectExtend.HouseBan(" + data.houseId + ")'>" + data.houseNo + "</a>");
                $("#BuildStructureName").html(data.buildStructureName);
                $("#HouseDoorplate").html(data.houseDoorplate);
                $("#MetRentArea").html(data.metRentArea);
                $("#PropertyName").html(data.propertyName);
                $("#TotalFloors").html(data.totalFloors);
                $("#UsePropertyName").html(data.usePropertyName);
                if (data.houseUnitInfos!=null) {
                    for (var i = 0; i < data.houseUnitInfos.length; i++) {
                        $('#householdTable').datagrid('insertRow', { index: i, row: data.houseUnitInfos[i] });
                    }
                }
                try {
                    topevery.initmap({
                        mapid: "allmap",
                        searchbtn: "btnMapSearch",
                        searchkey: "suggestId",
                        y: data.latitude,
                        x: data.longitude,
                        left: 150,
                        top: 150,
                        islook: true
                    });
                } catch (e) {

                } 
                
            } else {
                error();
            }
        }, true);
    },

    ///加载修缮方案列表
    InitializeRepairPlan: function () {
        gridRepairPlanTable = $('#RepairPlanTable').datagrid({
            height: 300,
            width: 700,
            striped: true,
            fitColumns: true,
            loadMsg: false,
            singleSelect: true,
            nowrap: false,
            rownumbers: true, //行号
            pageSize: 10,
            pageList: [10, 20, 50, 100],
            showFooter: true,
            onLoadSuccess: function (data) {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
            },
            loader: MinorRepairEngineeringTransaction.loadDataRepairPlan,
            columns: [
                [
                    { field: "id", title: '编号', hidden: true },
                    { title: '定额号', field: 'quotaNo', width: '60', align: 'center' },
                    { title: '工程小类', field: 'repairCate', width: '120', align: 'center' },
                    { title: '工程大类', field: 'repairTypeId', width: '80', align: 'center', hidden: true },
                     { title: '工程大类', field: 'repairTypeName', width: '80', align: 'center' },
                    { title: '单位', field: 'unit', width: '40', align: 'center' },
                    { title: '综合单价(有住户)', field: 'unitPriceY', width: '100', align: 'center' },
                    { title: '综合单价(空置房)', field: 'unitPriceN', width: '100', align: 'center' },
                ]
            ]
        });
    },
    ///获取修缮项目
    loadDataRepairPlan: function (param, success, error) {
        topevery.ajax({
            type: "POST",
            url: "api/services/app/RepairTaskR/GetRepairTaskRepItemInfoAsync",
            contentType: "application/json",
            data: JSON.stringify({
                id: RepairTaskId//$("#FromInstanceId").val()
            })
        }, function (data) {
            if (data.success) {
                $("#BudgetMoney").textbox('setValue', data.result.budgetMoney);
                $("#StartTime").datebox('setValue', data.result.startTime);
                $("#EndTime").datebox('setValue', data.result.endTime);
                $("#PassTime").datebox('setValue', data.result.passTime);
                $("#ConstructionUnit").combobox('setValue', data.result.constructionUnit);
                $("#IsFinished").combobox('setValue', data.result.isFinished);
                $("#ContentAndDemand").textbox('setValue', data.result.contentAndDemand);
                $("#Remark").textbox('setValue', data.result.remark);
                success(data.result.repairItemList);
            } else {
                error();
            }
        }, false);
    }
}
///初始化数据
$(function () {
    MinorRepairEngineeringTransaction.Initialize();
    MinorRepairEngineeringTransaction.EssentialInformation();
    MinorRepairEngineeringTransaction.ProcessInitialize();
    MinorRepairEngineeringTransaction.InitializeRepairPlan();
    bindDropDown("ConstructionUnit", "Common/GetEngineerUnitAllAsync", "", true);
});