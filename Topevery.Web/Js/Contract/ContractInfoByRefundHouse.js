var ContractInfo = {
    Initialize: function () {
        $("#ContractInfoByRefundHouseDataGrid").datagrid({
            columns: [
                [
                    { field: "id", checkbox: true },
                    { field: "contractNo", title: "合同编号", width: 100, align: "center" },
                    { field: "houseDoorplate", title: "房屋门牌", width: 100, align: "center" },
                    { field: "rentRange", title: "租用范围", width: 100, align: "center" },
                    { field: "name", title: "承租人", width: 100, align: "center" },
                    { field: "usePropertyName", title: "用途", width: 100, align: "center" },
                    {
                        field: "reduceStartTime", title: "租赁开始时间", width: 100, align: "center", formatter: topevery.dataTimeFormat
                    },
                    { field: "rentEndTime", title: "租赁停止时间", width: 100, align: "center", formatter: topevery.dataTimeFormat },
                    { field: "monthMoney", title: "月应收租金", width: 100, align: "center" },
                    { field: "oweMoney", title: "欠租", width: 100, align: "center" }
                ]
            ],
            height: 440,
            idField: "id",
            fitColumns: true,
            rownumbers: true,
            singleSelect:true,
            pagination: true,
            loader: function (param, success, error) {
                topevery.ajax({
                    type: "POST",
                    url: "api/services/app/RefundHouseApplyR/GetContractPageListAsync",
                    contentType: "application/json",
                    data: topevery.extend(topevery.form2Json("selectForm"), {
                        PageIndex: param.page,
                        PageCount: param.rows
                    })
                }, function (data) {
                    if (data.success) {
                        success(data.result);
                    } else {
                        error();
                    }
                }
                , false);
            },
            onDblClickRow: function (rowIndex, rowData) {
                frameHelper.getDialogParentIframe().RefundRentApply.LoadRentInfo(rowData);
                frameHelper.getDialogParentIframe().dialog.dialog('close');
            },
            onLoadSuccess: function (data) {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
                $(this).datagrid("clearSelections").datagrid("clearChecked");
            },
            //onLoadSuccess: function () {
            //    $(this).datagrid("clearSelections").datagrid("clearChecked");
            //}
        });
        for (var i = 0; i < $(".easyui-textbox").length; i++) {
            $("#" + $('.easyui-textbox').eq(i)[0].id + "").textbox({
                inputEvents: $.extend({}, $.fn.textbox.defaults.inputEvents, {
                    keyup: function (event) {
                        if (event.keyCode === 13) {
                            ContractInfo.Select();
                        }
                    }
                })
            });
        }
    },
    Select:function() {
        $("#ContractInfoByRefundHouseDataGrid").datagrid("load");
    },
    onDblClickRow: function (rowIndex, rowData) {
        frameHelper.getDialogParentIframe().RefundRentApply.LoadRentInfo(rowData);
        frameHelper.getDialogParentIframe().dialog.dialog('close');
    }
};
$(function() {
    ContractInfo.Initialize();
});