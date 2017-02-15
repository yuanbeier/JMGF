//将表单数据转为json
var grid;

function loadData(param, success, error) {
    topevery.ajax({
        type: "POST",
        url: "api/services/app/HouseRentApplyR/GetWorkflowInstanceInfo",
        contentType: "application/json",
        data: JSON.stringify({
            FlowInstanceId: $("#workFlowInstanceId").val(),
            ModuleType: 1
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
            nowrap: false,
            loader: loadData,
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
    loadDatathis: function () {
        topevery.ajax({
            type: "POST",
            url: "api/services/app/HouseRentApplyR/GetHousingAndTenantInfoAsync",
            contentType: "application/json",
            data: JSON.stringify({ id: $("#fromInstanceId").val() })
        }, function (row) {
            if (row.success) {
                var data = row.result;
                //$("#LesseeId").val(data.id);
                //$("#Name").html(data.name);
                $("#Name").html("<a href='#' onclick='objectExtend.LesseeInfoOpen(" + data.lesseeId + ")'>" + data.name + "</a>");
                $("#Sex").html(data.sexName);
                $("#CertNo").html(data.certNo);
                $("#ContactAddress").html(data.contactAddress);
                $("#ContactNumber").html(data.contactNumber);
                $("#Remark").html(data.remark);
                $("#WorkUnits").html(data.workUnits);
                $("#familyMembersCount").html(data.familyMembersCount);
                $("#DateBirth").html(topevery.dataTimeFormat(data.dateBirth));
                //$("#HouseNo").html(data.houseNo);
                $("#HouseNo").html("<a href='#' onclick='objectExtend.HouseBan(" + data.houseId + ")'>" + data.houseNo + "</a>");
                $("#RentRange").html(data.rentRange);
                $("#BuildStructureName").html(data.buildStructureName);
                $("#UsePropertyId").html(data.usePropertyName);
                $("#BuildStructureId").html(data.buildStructureId);
                $("#HouseDoorplate").html(data.houseDoorplate);
                $("#MetRentArea").html(data.metRentArea);
                $("#PayType").html(data.payTypeName);
                $("#BankCardNo").html(data.bankCardNo);
                $("#MonthMoney").html(data.monthMoney);
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
    TenantsSelectIndex.loadDatathis();
});
