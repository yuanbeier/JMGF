var grid;
var leaseReviewObjet = null;
var handleGenContract;

function loadData(param, success, error) {
    topevery.ajax({
        type: "POST",
        url: "api/services/app/HouseRentApplyR/GetWorkflowInstanceInfo",
        contentType: "application/json",
        data: JSON.stringify( {
            FlowInstanceId: $("#workFlowInstanceId").val(),
            ModuleType: 8
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
    Initialize: function() {
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
    ///办理提交
    ///获取基本信息，赋值到文本框
    loadData: function() {
        topevery.ajax({
            type: "POST",
            url: "api/services/app/RefundHouseApplyR/GetRefundHouseApplyBaseInfoAsync",
            contentType: "application/json",
            data: JSON.stringify({ id: $("#fromInstanceId").val() })
        }, function(row) {
            if (row.success) {
                var data = row.result;
                $("#contractNo").html("<a href='#' onclick='objectExtend.dbClick(" + data.contractId + ")'>" + data.contractNo + "</a>");
                $("#name").html("<a href='#' onclick='objectExtend.LesseeInfoOpen(" + data.lesseeId + ")'>" + data.name + "</a>");
                $("#houseDoorplate").html("<a href='#' onclick='objectExtend.HouseBan(" + data.houseId + ")'>" + data.houseDoorplate + "</a>");
                $("#rentRange").html(data.rentRange);
                $("#reduceTime").html(topevery.dataTimeFormat(data.reduceStartTime) + "至" + topevery.dataTimeFormat(data.rentEndTime));
                $("#monthMoney").html(data.monthMoney);
                $("#usePropertyId").html(data.usePropertyId);
                $("#oweMoney").html(data.oweMoney);
                $("#removeReason").html(data.removeReason);
                $("#usePropertyName").html(data.usePropertyName);
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
    TenantsSelectIndex.loadData();
});
