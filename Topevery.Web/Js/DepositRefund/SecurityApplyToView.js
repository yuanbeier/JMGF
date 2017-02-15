//将表单数据转为json
var grid;
var workFlowInstanceId = $("#workFlowInstanceId").val();
var ActivityInstanceId = $("#actInstanceId").val();
var RepairTaskId = $("#fromInstanceId").val();

function loadData(param, success, error) {
    topevery.ajax({
        type: "POST",
        url: "api/services/app/HouseRentApplyR/GetWorkflowInstanceInfo",
        contentType: "application/json",
        data: JSON.stringify({
            FlowInstanceId: workFlowInstanceId,
            ModuleType: 7
        })
    }, function (data) {
        if (data.success) {
            success(data.result);
        } else {
            error();
        }
    }, false);
};

TenantsSelectIndex = {
    ///加载列表数据-
    Initialize: function () {
        grid = $('#ProcessViewTable').datagrid({
            height: 300,
            striped: true,
            fitColumns: true,
            loadMsg: false,
            singleSelect: true,
            nowrap: true,
            loader: loadData,
            //rownumbers: true, //行号
            //pagination: true, //分页控件
            //pageSize: 10,
            //pageList: [1, 10, 20, 50],
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
    loadData: function () {
        topevery.ajax({
            type: "POST",
            url: "api/services/app/RefundMarginApplyR/GetMarginBasicInfoAsync",
            contentType: "application/json",
            data: JSON.stringify({ id: RepairTaskId })
        }, function (row) {
            if (row.success) {
                var data = row.result;
                $("#ApplyContent").html(data.applyContent);
                //$("#ContractNo").html(data.contractNo);
                $("#ContractNo").html("<a href='#' onclick='objectExtend.dbClick(" + data.contractId + ")'>" + data.contractNo + "</a>");
                //$("#HouseDoorplate").html(data.houseDoorplate);
                $("#HouseDoorplate").html("<a href='#' onclick='objectExtend.HouseBan(" + data.houseId + ")'>" + data.houseDoorplate + "</a>");
                $("#MonthMoney").html(data.monthMoney);
                //$("#Name").html(data.name);
                $("#Name").html("<a href='#' onclick='objectExtend.LesseeInfoOpen(" + data.lesseeId + ")'>" + data.name + "</a>");
                $("#OldOweRentSum").html(data.oldOweRentSum);
                $("#RentEndTime").html(topevery.dataTimeFormat(data.rentEndTime));
                $("#RentStartTime").html(topevery.dataTimeFormat(data.rentStartTime));
                $("#RentRange").html(data.rentRange);
                $("#UsePropertyName").html(data.usePropertyName);
                $("#AgentName").html(data.agentName);
                $("#RefundMoney").html(data.refundMoney);
                try {
                    topevery.initmap({
                        mapid: "allmap",
                        searchbtn: "btnMapSearch",
                        searchkey: "suggestId",
                        y: data.latitude,
                        x: data.longitude,
                        islook: true
                    });
                } catch (e) {

                } 
                
            } else {
                error();
            }
        }, true);
    }
};
$(function () {
    /*初始化*/
    TenantsSelectIndex.Initialize();
    TenantsSelectIndex.loadData();
});
