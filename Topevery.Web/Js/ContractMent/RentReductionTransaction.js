//将表单数据转为json
var grid;
var workFlowInstanceId = $("#workFlowInstanceId").val();
var ActivityInstanceId = $("#actInstanceId").val();
var RepairTaskId = $("#fromInstanceId").val();
var scanningUpload = 1;

function loadData(param, success, error) {
    topevery.ajax({
        type: "POST",
        url: "api/services/app/HouseRentApplyR/GetWorkflowInstanceInfo",
        contentType: "application/json",
        data: JSON.stringify({
            FlowInstanceId: workFlowInstanceId,
            ModuleType: 2
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
            pageSize: 10,
            pageList: [10, 20, 50, 100],
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
        if (scanningUpload===0) {
            if ($("input[name='IdhiddenFile']").val() === "") {
                window.top.topeveryMessage.show("请上传租金减免审批表！");
                return;
            }
        }
        topevery.ajax({
            type: "POST",
            url: "api/services/app/RentRemissionApplyW/HandleRemissionApplyAsync",
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
                    url: "api/services/app/RentRemissionApplyW/HandleRemissionApplyAsync",
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
            url: "api/services/app/RentRemissionApplyR/GetRentRemissionApplyAsync",
            contentType: "application/json",
            data: JSON.stringify({ id: RepairTaskId })
        }, function (row) {
            if (row.success) {
                var data = row.result;

                $("#BaseRent").html(data.baseRent);
                $("#CertNo").html(data.certNo);
                $("#CertName").html(data.certName);
                $("#ContractNo").html(data.contractNo);
                $("#Holder").html(data.holder);
                $("#HouseDoorplate").html(data.houseDoorplate);
                $("#Name").html(data.lesseeName);
                $("#MonthMoney").html(data.monthMoney);
                $("#ReduceMoney").html(data.reduceMoney);
                $("#ReduceName").html(data.reduceName);
                $("#Relationship").html(data.relationship);
                $("#CollectMonthMoney").html(data.collectMonthMoney);
                $("#ValidityEndTime").html(topevery.dataTimeFormat(data.validityEndTime));
                $("#ValidityStartTime").html(topevery.dataTimeFormat(data.validityStartTime));

                $("#ContractNo").click(function () {
                    if (data.contractId != null && data.contractId!=="") {
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
                $("#RentReductionTransaction").form("load", data);
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
    Initializecc(ActivityInstanceId);
    TenantsSelectIndex.loadData();
});
///获取办理信息
function Initializecc(id) {
    topevery.ajax({
        type: "POST",
        url: "api/services/app/RentRemissionApplyR/GetHouseRentApplyInfo",
        contentType: "application/json",
        data: JSON.stringify({
            "ActivityInstanceId": id,
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
    if (data.scanningUpload !== false) {
        scanningUpload = 0;
        $("#attachment").show();
    } else {
        $("#attachment").hide();
    }
    if (data.isPrint !== false) {
        $("#print").show();
    }
    if (data.handleAuthority !== false) {
        $("#HandleAuthority").show();
    }
}