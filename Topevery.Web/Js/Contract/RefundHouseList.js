var grid;
var RefundHouseList = {
    Initialize: function () {
        grid = $("#RefundHouseListDataGrid").datagrid({
            columns: [
                [
                     { field: "applyNo", title: "申请单号", width: 80, align: "center", sortable: true },
                    {
                        field: "contractNo", title: "合同编号", width: 80, align: "center", formatter: function (value, row, index) {
                            if (value != null) {
                                return "<a href='#' onclick='objectExtend.dbClick(" + row.contractId + ")'>" + value + "</a>";
                            }
                        }, sortable: true
                    },
                    {
                        field: "houseDoorplate", title: "现房屋门牌", width: 80, align: "center",
                        formatter: function (value, row, index) {
                            if (value != null) {
                                return "<a href='#' onclick='objectExtend.HouseBan(" + row.houseId + ")'>" + value + "</a>";
                            }
                        }, sortable: true
                    },
                    { field: "rentRange", title: "租用范围", width: 80, align: "center" },
                    {
                        field: "name", title: "承租人", width: 80, align: "center",
                        formatter: function (value, row, index) {
                            if (value != null) {
                                return "<a href='#' onclick='objectExtend.LesseeInfoOpen(" + row.lesseeId + ")'>" + value + "</a>";
                            }
                        }, sortable: true
                    },
                    {
                        field: "rentStartTime",
                        title: "租赁期限起",
                        width: 80,
                        align: "center",
                        formatter: function(value) {
                            return topevery.dataTimeFormat(value);
                        }, sortable: true
                    },
                    {
                        field: "rentEndTime",
                        title: "租赁期限止",
                        width: 60,
                        align: "center",
                        formatter: function(value) {
                            return topevery.dataTimeFormat(value);
                        }, sortable: true
                    },
                    { field: "usePropertyName", title: "使用性质", width: 60, align: "center" },
                    { field: "removeReason", title: "解除合同原因", width: 60, align: "center", sortable: true }
                    //{
                    //    field: "null",
                    //    title: "操作",
                    //    width: 60,
                    //    align: "center",
                    //    formatter: function(value, row, index) {
                    //        return "<a href='#' class='easyui-modifyoperate' onclick='RefundHouseList.Edit(" + row.id + ")'>修改<a/>"
                    //    }
                    //}
                ]
            ],
            height: 480,
            idField: "id",
            fitColumns: true,
            nowrap: false,
            rownumbers: true,
            fit: true,
            pagination: true,
            singleSelect:true,
            toolbar: "#toolbar",
            onDblClickRow: RefundHouseList.dbClick,
            loader: function (param, success, error) {
                topevery.ajax({
                    type: "POST",
                    url: "api/services/app/RefundHouseApplyR/GetRefundHouseApplyPageListAsync",
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
            },
            onLoadSuccess: function () {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
                $(this).datagrid("clearSelections").datagrid("clearChecked");
            }
        });
        for (var i = 0; i < $(".easyui-textbox").length; i++) {
            $("#" + $('.easyui-textbox').eq(i)[0].id + "").textbox({
                inputEvents: $.extend({}, $.fn.textbox.defaults.inputEvents, {
                    keyup: function (event) {
                        if (event.keyCode === 13) {
                            RefundHouseList.Select();
                        }
                    }
                })
            });
        }
    },
    //清空
    Reset: function () {
        $("#selectForm").form("reset");
        $("#RefundHouseListDataGrid").datagrid("load");
    },
    ///查询
    Select: function () {
        $('#RefundHouseListDataGrid').datagrid('load', { input: topevery.form2Json("selectForm") }); //点击搜索
    },
    ///打印退房申请表
    PrintTheCheckOut:function() {
        if ($('#RefundHouseListDataGrid').datagrid('getSelections')[0] == undefined) {
            $.messager.alert('提示', '请选择一条退房申请记录!', 'info');
        } else {
            window.open(virtualDirName + "PrintRelevant/CancelContractSheet?id=" + $('#RefundHouseListDataGrid').datagrid('getSelections')[0].id);
        }
    },
    ///打印退还房屋现场勘验确认表
    PrintingHouseAnInquest:function() {
        if ($('#RefundHouseListDataGrid').datagrid('getSelections')[0] == undefined) {
            $.messager.alert('提示', '请选择一条退房申请记录!', 'info');
        } else {
            window.open(virtualDirName + "PrintRelevant/CheckOutSheet?id=" + $('#RefundHouseListDataGrid').datagrid('getSelections')[0].id);
        }
    },
    //退房流程查看
    dbClick: function (index, data) {
       var  dialog = ezg.modalDialog({
            width: 1205,
            height: 450,
            title: '退房流程查看',
            url: virtualDirName + 'Contract/RefundHouseInfoDone?workFlowInstanceId=' + data.flowInstanceId + '&fromInstanceId=' + data.id
        });
    },
    //查看退房申请信息
    Toview: function () {
        if ($('#RefundHouseListDataGrid').datagrid('getSelections')[0] == undefined) {
            $.messager.alert('提示', '请选择一条退房申请记录!', 'info');
        } else {
            var dialog = ezg.modalDialog({
                width: 800,
                height: 478,
                title: '退房申请查看',
                url: virtualDirName + "Contract/EditRefundHouse?id=" + $('#RefundHouseListDataGrid').datagrid('getSelections')[0].id
            });
        }
    },
    Edit: function (id) {
        var dialog = ezg.modalDialog({
            width: 1200,
            height: 300,
            title: '退房修改',
            url: virtualDirName + "Contract/EditRefundHouse?id=" + id,
            buttons: [
                {
                    text: '确认',
                    iconCls: 'icon-ok',
                    handler: function () {
                        dialog.find('iframe').get(0).contentWindow.submitFormEdit(dialog, grid);
                    }
                }
            ]
        });
    },
}
$(function () {
    bindDicToDrp("usePropertyId", "28519BAC-0C61-4921-A7C1-80F3CEB80AC0", "");//使用性质
    RefundHouseList.Initialize();
});