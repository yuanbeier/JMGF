//将表单数据转为json
var grid;
var dialog10;
var tenantTypelist;
function loadData(param, success, error) {
    topevery.ajax({
        type: "POST",
        url: "api/services/app/RepairTaskR/GetRepairTaskListAsync",
        contentType: "application/json",
        data: topevery.extend(topevery.form2Json("selectForm"), {
            PageIndex: param.page,
            PageCount: param.rows,
            Order: param.order,
            Sort: param.sort
        })
    }, function (data) {
        if (data.success) {
            success(data.result);
        } else {
            error();
        }
    }, false);
};
MinorRepairEngineering = {
    ///加载列表数据-
    Initialize: function () {
        grid = $('#MinorRepairEngineeringTable').datagrid({
            height: 480,
            idField: "id",
            striped: true,
            fitColumns: true,
            fit: true,
            singleSelect: true,
            nowrap: false,
            loader: loadData,
            rownumbers: true, //行号
            pagination: true, //分页控件
            pageSize: 10,
            pageList: [10, 20, 50, 100],
            showFooter: true,
            onLoadSuccess: function (data) {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
            },
            columns: [
                [
                    { field: "id", checkbox: true },
                    {
                        field: "taskName", title: "任务单类型", align: "center", width: 120, formatter: function (value, row, index) {
                            if (value == "大中修工程申请") {
                                return "<a href='#' onclick='MinorRepairEngineering.dbClick(" + index + ")'>" + value + "</a>";
                            } else if (value == "小修工程申请") {
                                return "<a href='#' onclick='MinorRepairEngineering.dbClick(" + index + ")'>" + value + "</a>";
                            }
                        }, sortable: true
                    },
                    { field: "taskListNo", title: "任务单编号", align: "center", width: 120, sortable: true },
                    { field: "houseId", title: "房屋Id", align: "center", width: 120, hidden: true },
                    { field: "houseDoorplate", title: "房屋地址", align: "center", width: 120, sortable: true },
                    { field: "constUnitName", title: "施工单位名称", align: "center", width: 120 },
                    //{ field: "contentAndDemand", title: "项目主要内容及要求", align: "center", width: 120 },
                    {
                        field: "startTime", title: "计划开工日期", align: "center", width: 120, formatter: function (value) {
                            return topevery.dataTimeFormat(value);
                        }, sortable: true
                    },
                    {
                        field: "endTime", title: "计划完工日期", align: "center", width: 120, formatter: function (value) {
                            return topevery.dataTimeFormat(value);
                        }, sortable: true
                    },
                    {
                        field: "isFinished", title: "是否已完工", align: "center", width: 60, formatter: function (value) {
                            return value === 1 ? "是" : "否";
                        }, sortable: true
                    },
                    {
                        field: "passTime", title: "任务单派发日期", align: "center", width: 100, formatter: function (value) {
                            return topevery.dataTimeFormat(value);
                        }, sortable: true
                    },
                    { field: "settlementMoney", title: "结算", width: 60, align: "center", sortable: true },
                    {
                        field: "finishTime", title: "验收日期", width: 100, align: "center", formatter: function (value) {
                            return topevery.dataTimeFormat(value);
                        }, sortable: true
                    },
                    { field: "remark", title: "备注", align: "center", width: 120, sortable: true }
                ]
            ],
            toolbar: '#toolbarWrap'
        });
        for (var i = 0; i < $(".easyui-textbox").length; i++) {
            $("#" + $('.easyui-textbox').eq(i)[0].id + "").textbox({
                inputEvents: $.extend({}, $.fn.textbox.defaults.inputEvents, {
                    keyup: function (event) {
                        if (event.keyCode === 13) {
                            MinorRepairEngineering.loadInfo80();
                        }
                    }
                })
            });
        };
        var j = 0;
        $("#completed-search-btn").on("click", function () {
            $("#completed-search-list").slideToggle();
            j = j + 1;
            if (j % 2 !== 0) {
                $("#completed-search-btn").html("收起∧");
            } else {
                $("#completed-search-btn").html("更多∨");
            }
        });
        $(document).dequeue("datagrid0102");
    },
    ///搜索
    loadInfo80: function () {
        $('#MinorRepairEngineeringTable').datagrid('load', { input: topevery.form2Json("selectForm") }); //点击搜索
    },
    ///小修工程修缮流程查看
    dbClick: function (index) {
        var data = $('#MinorRepairEngineeringTable').datagrid('getRows')[index];
        if (data.taskType === 1) {
            MinorRepairEngineering.open(1005, 525, "小修工程修缮流程查看", virtualDirName + 'HouseRepair/MinorRepairEngineeringToView?workFlowInstanceId=' + data.flowInstanceId + '&fromInstanceId=' + data.id);
        } else if (data.taskType === 2) {
            MinorRepairEngineering.open(1000, 420, "大中修工程修缮流程查看", virtualDirName + 'BigHouseRepair/DaZhongXiuEngineeringApplyToView?workFlowInstanceId=' + data.flowInstanceId + '&fromInstanceId=' + data.id);
        }
    },
    open: function (width, height, title, url) {
        var dialog = ezg.modalDialog({
            width: width,
            height: height,
            title: title,
            url: url
        });
    },
    ToView: function () {
        var data = $('#MinorRepairEngineeringTable').datagrid('getSelections')[0];
        if (data == undefined) {
            $.messager.alert('提示', '请选择一条工程修缮申请记录!', 'info');
        } else {
            MinorRepairEngineering.open(800, 440, "查看预算,变更修缮方案", virtualDirName + 'HouseRepair/BudgetSettlement?id=' + data.id + "&taskListNo=" + data.taskListNo);

        }
    }
}
///初始化
$(function () {
    $(document).queue("datagrid0101", function () { MinorRepairEngineering.Initialize(); });
    $(document).dequeue("datagrid0101");
});
