var CurrencyExchangeRp = {
    Initialize: function () {
        $("#CurrencyExchangeRpDataGrid").datagrid({
            columns: [
                [

 					{ field: "propertyName", title: "产权", width: 100, align: "center" },
                    { field: "monthlyIncome", title: "网银划收", width: 100, align: "center" },
                    { field: "sameMonthlyIncome", title: "银行托收", width: 100, align: "center" },
                    { field: "newNetReceipt", title: "门面收入", width: 100, align: "center" },
                    { field: "sameMonthAdvance", title: "小计", width: 100, align: "center", hidden: true },
                    { field: "subtotal", title: "留守代缴", width: 100, align: "center",hidden:true },
                    { field: "oldNetReceipt", title: "合计", width: 100, align: "center" },
                    //{ field: "total", title: "合计", width: 100, align: "center" }
                ]
            ],
            height: 440,
            idField: "contractId",
            fitColumns: true,
            fit: true,
            toolbar: '#toolbarWrap',
            rownumbers: true,
            singleSelect: true,
            onLoadSuccess: function (data) {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
                $(this).datagrid("clearSelections").datagrid("clearChecked");
            },
            loader: function (param, success, error) {
                var submit = topevery.form2Json("selectForm");
                if (submit.date) {
                    var temp = submit.date.split("-");
                    submit["year"] = temp[0];
                    submit["month"] = temp[1];
                }
                topevery.ajax({
                    type: "POST",
                    url: "api/services/app/ReportR/GetHouseRentMonthReportAsync",
                    contentType: "application/json",
                    data: topevery.extend(submit, {
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
                frameHelper.getDialogParentIframe().RentCollect.loadRentInfo(rowData);
                frameHelper.getDialogParentIframe().dialog.dialog('close');
            }
        });
    },
    Select: function () {
        $("#CurrencyExchangeRpDataGrid").datagrid("load");
    }
};
$(function () {
    var date = new Date();
    if (date.getMonth() === 0) {
        $("#date").val(date.getFullYear() - 1 + "-" + (12));
    } else {
        $("#date").val(date.getFullYear() + "-" + (date.getMonth()));
    }
    bindDropDown("userDeptId", "Common/GetWorkstationBind", "工作站");
    CurrencyExchangeRp.Initialize();
});