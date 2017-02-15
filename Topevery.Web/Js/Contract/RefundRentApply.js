var grid;
var RefundRentApply = {
    Initialize: function () {
        grid = $("#RefundRentApplyDataGrid").datagrid({
            columns: [
                [
                    { field: "applyNo", title: "申请单号", width: '9%', align: "center", sortable: true },
                    { title: '申请日期', field: 'applyTime', width: '9%', align: 'center', formatter: function (data) { return topevery.dataTimeFormat(data); }, sortable: true },
                    {
                        field: "contractNo", title: "合同编号", width: '12%', align: "center",
                        formatter: function(value, row, index) {
                            if (value != null)
                                return "<a href='#' onclick='objectExtend.dbClick(" + row.contractId + ")'>" + value + "</a>";
                        }, sortable: true
                    },
                    { field: "propertyName", title: "产权", width: '9%', align: "center" },
                    {
                        field: "houseDoorplate", title: "现房屋门牌", width: '20%', align: "center", formatter: function (value, row, index) {
                            if (value != null) {
                                return "<a href='#' onclick='objectExtend.HouseBan(" + row.houseId + ")'>" + value + "</a>";
                            }
                        }, sortable: true
                    },
                    {
                        field: "name", title: "承租人姓名", width: '12%', align: "center", formatter: function (value, row, index) {
                            if (value != null)
                                return "<a href='#' onclick='objectExtend.LesseeInfoOpen(" + row.lesseeId + ")'>" + value + "</a>";
                        }, sortable: true
                    },
                    { field: "usePropertyName", title: "使用性质", width: '9%', align: "center" },
                    { field: "collectMonthMoney", title: "应收月租金", width: '9%', align: "center", sortable: true }
                    //{
                    //    field: "null", title: "操作", width: 60, align: "center", formatter: function (value, row, index) {
                    //        return "<a href='#' class='easyui-modifyoperate' onclick='RefundRentApply.Edit(" + row.id + ")'>修改<a/>";
                    //    }
                    //}
                ]
            ],
            height: 480,
            idField: "id",
            fitColumns: true,
            fit: true,
            nowrap: false,
            rownumbers: true,
            pagination: true,
            singleSelect: true,
            toolbar: "#toolbarWrap",
            onDblClickRow: RefundRentApply.dbClick,
            loader: function (param, success, error) {
                topevery.ajax({
                    type: "POST",
                    url: "api/services/app/RefundRentApplyR/GetRefundRentManageListAsync",
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
                            RefundRentApply.Select();
                        }
                    }
                })
            });
        }
    },
    Reset: function () {
        $("#selectForm").form("reset");
        $("#RefundRentApplyDataGrid").datagrid("load");
    },
    Select: function () {
        $("#RefundRentApplyDataGrid").datagrid("load");
    },
    ///查看退租金申请信息
    ToView: function (id) {
        if ($('#RefundRentApplyDataGrid').datagrid('getSelections')[0] == undefined) {
            $.messager.alert('提示', '请选择一条退租金申请记录!', 'info');
        } else {
            var dialog = ezg.modalDialog({
                width: 1000,
                height: 350,
                title: '退租查看',
                url: virtualDirName + "HouseRepair/RefundRentApplyToView?id=" + $('#RefundRentApplyDataGrid').datagrid('getSelections')[0].id
            });
        }
    },
    Edit: function (id) {
        var dialog = ezg.modalDialog({
            width: 1000,
            height: 500,
            title: '退租修改',
            url: virtualDirName + "HouseRepair/RefundRentApply?id=" + id,
            buttons: [
                {
                    text: '确认',
                    iconCls: 'icon-ok',
                    handler: function () {
                        dialog.find('iframe').get(0).contentWindow.RefundRentApply.Edit(dialog, grid);
                    }
                }
            ]
        });
    },
    dbClick: function (index, data) {
        var dialogHouseRentApply = ezg.modalDialog({
            width: 950,
            height: 410,
            title: '退租金流程查看',
            url: virtualDirName + 'Contract/RefundRentApplyInfoDone?workFlowInstanceId=' + data.flowInstanceId + '&fromInstanceId=' + data.id
        });
    },
    print: function () {
        if ($('#RefundRentApplyDataGrid').datagrid('getSelections')[0] == undefined) {
            $.messager.alert('提示', '请选择一条退租金申请记录!', 'info');
        } else {
            window.open(virtualDirName + "PrintRelevant/RentBackSheet?id=" + $('#RefundRentApplyDataGrid').datagrid('getSelections')[0].id);
        }
    }
}
$(function () {
    bindDicToDrp("propertyId", "B34CFE85-FB80-4817-B660-B8DF27F8DC76", "");//产权属性
    bindDicToDrp("usePropertyId", "28519BAC-0C61-4921-A7C1-80F3CEB80AC0", "");//使用性质
    RefundRentApply.Initialize();
});