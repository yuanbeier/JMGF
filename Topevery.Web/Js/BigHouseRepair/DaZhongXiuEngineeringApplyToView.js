var grid;
var gridProcess;
var dialogAdd;
var dialogAddChange;
var gridRepairPlanTable;
var gridRepairPlanTableChange;
var IsRepair;
var dialogPrice;
var HomeMap = null;

var ComponentOpinion;
var AcceptanceResult;///项目主要内容及要求
var PassTime; ///派发任务单时间
var ConstructionUnit; //施工单位
var IsFinished;///是否完工
var Remark;///备注

var istaskNo = 1;
var isChangeRepairPlan = 1;///最后一步（修缮结果验收）必须上传验收图片，不上传图片不能进行办理
var IsPassed = 1;///修缮方案是否通过
var isExamination = 1;///是否显示审核
var Acceptance = 1;///是否显示验收


var workFlowInstanceId = $("#workFlowInstanceId").val();
var ActivityInstanceId = $("#actInstanceId").val();
var RepairTaskId = $("#fromInstanceId").val();
var houseId = $("#houseId").val();
MinorRepairEngineeringTransaction = {
    Initialize: function () {
        grid = $('#householdTable').datagrid({
            height: 250,
            striped: true,
            fitColumns: true,
            loadMsg: false,
            singleSelect: true,
            title: "楼栋、分户信息",
            nowrap: false,
            rownumbers: true, //行号
            pageSize: 50,
            pageList: [10, 20, 50, 100],
            showFooter: true,
            columns: [
                [
                     { field: "houseBanId", title: "房屋Id", hidden: true },
                     { field: "unitId", title: "分户Id", hidden: true },
                    { field: "houseNo", title: "房屋编号", align: "center", width: '10%' },
                    { field: "houseDoorplate", title: "现房屋门牌", align: "left", width: '15%' },
                     { field: "streetName", title: "街道名称", align: "center", width: '10%' },
                    { field: "unitName", title: "单元名称", align: "center", width: '15%' },
                   // { field: "unitDoorplate", title: "单元门牌", align: "center", width: '10%' },
                    { field: "rentRange", title: "租赁范围", align: "center", width: '10%' },
                    { field: "name", title: "承租人", align: "center", width: '10%' },
                    { field: "contactNumber", title: "联系电话", align: "center", width: '15%' }
                ]
            ]
        });
    },
    Map: null,
    Init: function (args) {
        if (HomeMap != null)
            return;

        HomeMap = new BMap.Map(args.mapid); // 创建Map实例
        HomeMap.addControl(new BMap.NavigationControl()); // 添加平移缩放控件
        HomeMap.addControl(new BMap.ScaleControl()); // 添加比例尺控件
        HomeMap.enableScrollWheelZoom(); //启用滚轮放大缩小
        HomeMap.centerAndZoom(new BMap.Point(113.0418, 22.3550), 11); // 初始化地图,设置中心点坐标和地图级别
        HomeMap.panBy(300, 380);
        HomeMap.setCurrentCity("江门");
    },
    ///获取流程办理信息
    loadData: function (param, success, error) {
        topevery.ajax({
            type: "POST",
            url: "api/services/app/HouseRentApplyR/GetWorkflowInstanceInfo",
            contentType: "application/json",
            data: JSON.stringify({
                FlowInstanceId: workFlowInstanceId,
                ModuleType: 21
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
            pageSize: 50,
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
            url: "api/services/app/RepairTaskR/GetHouseTenantBasicInfo",
            contentType: "application/json",
            data: JSON.stringify({ id: RepairTaskId }) //$("#RepairTaskId").val() })
        }, function (row) {
            if (row.success) {
                var data = row.result;
                $("#ApplyReason").textbox("setValue", data.applyReason);
                var param = { mapid: "allmap" };
                MinorRepairEngineeringTransaction.Init(param);
                if (data.hbBasicInfoOutPutDtos != null) {
                    for (var i = 0; i < data.hbBasicInfoOutPutDtos.length; i++) {
                        $('#householdTable').datagrid('insertRow', { index: i, row: data.hbBasicInfoOutPutDtos[i] });
                        var point = new BMap.Point(parseFloat(data.hbBasicInfoOutPutDtos[i].longitude), parseFloat(data.hbBasicInfoOutPutDtos[i].latitude));
                        var marker = new BMap.Marker(point); // 创建标注
                        HomeMap.addOverlay(marker); // 将标注添加到地图中
                    }
                }
            } else {
                error();
            }
        }, true);
    }
}

///初始化数据
$(function () {
    //由于存在下拉赋值不了的问题，所以这里用的序列
    $(document).queue("datagrid0101", function () { InitializeZZ()});
    $(document).dequeue("datagrid0101");
});

function InitializeZZ() {
    MinorRepairEngineeringTransaction.Initialize();
    MinorRepairEngineeringTransaction.EssentialInformation();
    MinorRepairEngineeringTransaction.ProcessInitialize();
}