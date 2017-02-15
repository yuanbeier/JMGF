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
            onLoadSuccess: function(data) {
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
    loadData: function() {
        topevery.ajax({
            type: "POST",
            url: "api/services/app/RefundRentApplyR/GetBasicInformationInfoAsync",
            contentType: "application/json",
            data: JSON.stringify({ id: $("#fromInstanceId").val() })
        }, function(row) {
            if (row.success) {
                var data = row.result;
                //$("#contractNo").html(data.contractNo);
                $("#contractNo").html("<a href='#' onclick='objectExtend.dbClick(" + data.contractId + ")'>" + data.contractNo + "</a>");
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
    TenantsSelectIndex.loadData();
});
