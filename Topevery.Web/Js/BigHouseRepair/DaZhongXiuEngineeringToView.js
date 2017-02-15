var RepairTaskId = $("#fromInstanceId").val();
var grid;
MinorRepairEngineeringTransaction = {
    Initialize: function() {
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
                if (data.hbBasicInfoOutPutDtos != null) {
                    for (var i = 0; i < data.hbBasicInfoOutPutDtos.length; i++) {
                        $('#householdTable').datagrid('insertRow', { index: i, row: data.hbBasicInfoOutPutDtos[i] });
                    }
                    topevery.PicturesShow(getRequest("id"), 21, "Attachment");
                }
            } else {
                error();
            }
        }, true);
    }
}

///初始化数据
$(function () {
    MinorRepairEngineeringTransaction.Initialize();
    MinorRepairEngineeringTransaction.EssentialInformation();
});