//将表单数据转为json
var grid;
var workFlowInstanceId =$("#workFlowInstanceId").val();
var ActivityInstanceId =  $("#actInstanceId").val();
var RepairTaskId =$("#fromInstanceId").val();

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
            rownumbers: true, //行号
            showFooter: true,
            onLoadSuccess: function (data) {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
            },
            columns: [
                [
                    { title: '环节名称', field: 'linkName', width: '120', align: 'center' },
                    { title: '经办人', field: 'agent', width: '100', align: 'center' },
                    {
                        title: '办理时间', field: 'handleTime', width: '150', align: 'center',
                        formatter: function (value) {
                            return topevery.dataTimeFormatTT(value);
                        }
                    },
                   { title: '办理意见', field: 'handleOpinion', width: '100', align: 'center' },
                    {
                        title: '相关附件',
                        field: 'fileRDto',
                        width: '150',
                        align: 'center',
                        formatter: function (data, row, index) {
                            return topevery.ProcessAttachment(data);
                        }
                    }
                ]
            ]
        });
    },
    ///办理提交
    LeaseReviewSave: function () {
        if ($("input[name='IdhiddenFile']").val() === "") {
            window.top.topeveryMessage.show("请上传退保证金审批表！");
            return;
        }
        topevery.ajax({
            type: "POST",
            url: "api/services/app/RefundMarginApplyW/AddWfInstanceLinkAsync",
            contentType: "application/json",
            data: JSON.stringify({
                ActivityInstanceId: ActivityInstanceId,
                Content: $("#Content").val(),
                FileId: $("input[name='IdhiddenFile']").val(),
                FromInstanceId: RepairTaskId
            })
        }, function (data) {
            if (data.success) {
                window.top.topeveryMessage.show("办理成功");
                window.location = virtualDirName + 'Home/TodoLists';
            } else {
                error();
            }
        }, true);
    },
    //作废
    Cancellation: function () {
        topeveryMessage.confirm(function (r) {
            if (r) {
                topevery.ajax({
                    type: "POST",
                    url: "api/services/app/RefundMarginApplyW/AddWfInstanceLinkAsync",
                    contentType: "application/json",
                    data: JSON.stringify({
                        ActivityInstanceId: ActivityInstanceId,
                        Content: $("#Content").val(),
                        FileId: $("input[name='IdhiddenFile']").val(),
                        FromInstanceId: RepairTaskId,
                        Obsolete: true
                    })
                }, function (data) {
                    if (data.success) {
                        window.top.topeveryMessage.show("操作成功!");
                        window.location = virtualDirName + 'Home/TodoLists';
                    } else {
                        error();
                    }
                }, true);
            }
        }, "", "您确认作废当前业务吗?");
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
                $("#ContractNo").html(data.contractNo);
                $("#HouseDoorplate").html(data.houseDoorplate);
                $("#MonthMoney").html(data.monthMoney);
                $("#Name").html(data.name);
                $("#OldOweRentSum").html(data.oldOweRentSum);
                $("#RentEndTime").html(topevery.dataTimeFormat(data.rentEndTime));
                $("#RentStartTime").html(topevery.dataTimeFormat(data.rentStartTime));
                $("#RentRange").html(data.rentRange);
                $("#UsePropertyName").html(data.usePropertyName);
                $("#AgentName").html(data.agentName);
                $("#RefundMoney").html(data.refundMoney);

                $("#ContractNo").click(function () {
                    if (data.contractId != null && data.contractId !== "") {
                        objectExtend.dbClick(data.contractId);
                    }
                });
                $("#Name").click(function () {
                    if (data.lesseeId != null && data.lesseeId !== "") {
                        objectExtend.LesseeInfoOpen(data.lesseeId);
                    }
                });
                $("#HouseDoorplate").click(function () {
                    if (data.houseId != null && data.houseId !== "") {
                        objectExtend.HouseBan(data.houseId);
                    }
                });
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
    Initializecc();
    TenantsSelectIndex.loadData();
});
///获取办理信息
function Initializecc() {
    topevery.ajax({
        type: "POST",
        url: "api/services/app/HouseRentApplyR/GetHouseRentApplyInfo",
        contentType: "application/json",
        data: JSON.stringify({
            "ActivityInstanceId": ActivityInstanceId,
            "HouseRentApplyId": "",
            "FlowInstanceId": ""
        })
    }, function (data) {
        if (data.success) {
            ListOfAssignment(data.result);
        } else {
            error();
        }
    }, false);
}
///给办理信息赋值
function ListOfAssignment(data) {
    $("#InUserName").html("[" + data.inUserName + "]" + topevery.dataTimeFormatTT(data.inDate));
    $("#ComponentOpinion").html(data.componentOpinion);
    $("#CurrentLink").html(data.currentLink);
    $("#NextLink").html(data.nextLink);
    $("#ReceiveObject").html(data.receiveObject);
    $("#Timeout").html(data.timeout);
    if (data.isPrint !== false) {
        $("#print").show();
    }
    if (data.handleAuthority !== false) {
        $("#HandleAuthority").show();
    }
}