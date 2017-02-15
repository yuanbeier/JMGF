var grid;
var leaseReviewObjet = null;
var handleGenContract;

function loadData(param, success, error) {
    topevery.ajax({
        type: "POST",
        url: "api/services/app/HouseRentApplyR/GetWorkflowInstanceInfo",
        contentType: "application/json",
        data: JSON.stringify({
            FlowInstanceId: $("#workFlowInstanceId").val(),
            ModuleType: 4
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
            window.top.topeveryMessage.show("请上传退租金审批表！");
            return;
        }
        topevery.ajax({
            type: "POST",
            url: "api/services/app/RefundRentApplyW/AddWfInstanceLink",
            contentType: "application/json",
            data: topevery.extend({
                ActivityInstanceId: $("#actInstanceId").val(),
                Content: $("#Content").val(),
                FileId: $("input[name='IdhiddenFile']").val(),
                FromInstanceId: $("#fromInstanceId").val()
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
                    url: "api/services/app/RefundRentApplyW/AddWfInstanceLink",
                    contentType: "application/json",
                    data: topevery.extend({
                        ActivityInstanceId: $("#actInstanceId").val(),
                        Content: $("#Content").val(),
                        FileId: $("input[name='IdhiddenFile']").val(),
                        FromInstanceId: $("#fromInstanceId").val(),
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
            url: "api/services/app/RefundRentApplyR/GetBasicInformationInfoAsync",
            contentType: "application/json",
            data: JSON.stringify({ id: $("#fromInstanceId").val() })
        }, function (row) {
            if (row.success) {
                var data = row.result;
                $("#contractNo").html(data.contractNo);
                $("#propertyName").html(data.propertyName);
                $("#houseDoorplate").html(data.houseDoorplate);
                $("#usePropertyName").html(data.usePropertyName);
                $("#name").html(data.name);
                $("#collectMonthMoney").html(data.collectMonthMoney);
                $("#moreRentTime").html(topevery.dataTimeFormat(data.moreRentTime));
                $("#refundRentMoney").html(data.refundRentMoney);
                $("#refundReason").html(data.refundReason);
                $("#contractNo").click(function () {
                    if (data.contractId != null && data.contractId !== "") {
                        objectExtend.dbClick(data.contractId);
                    }
                });
                $("#name").click(function () {
                    if (data.lesseeId != null && data.lesseeId !== "") {
                        objectExtend.LesseeInfoOpen(data.lesseeId);
                    }
                });
                $("#houseDoorplate").click(function () {
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
    }
};
$(function () {
    /*初始化*/
    TenantsSelectIndex.Initialize();
    Initializecc($("#actInstanceId").val());
    TenantsSelectIndex.loadData();
});
///获取办理信息
function Initializecc(id) {
    topevery.ajax({
        type: "POST",
        url: "api/services/app/HouseRentApplyR/GetHouseRentApplyInfo",
        contentType: "application/json",
        data: JSON.stringify({
            "ActivityInstanceId": id,
            "RefundRentApplyId": "",
            "FlowInstanceId": "",
            "HouseId": getRequest("houseId")
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
    $("#ComponentOpinion")[0].title = data.componentOpinion;
    $("#InUserName")[0].title = "[" + data.inUserName + "]" + topevery.dataTimeFormatTT(data.inDate);
    $("#CurrentLink")[0].title = data.currentLink;
    $("#NextLink")[0].title = data.nextLink;
    $("#ReceiveObject")[0].title = data.receiveObject;
    $("#Timeout")[0].title = data.timeout;
}