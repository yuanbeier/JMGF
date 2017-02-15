var HouseRentReport = {
    Initialize: function () {
        $("#HouseRentReportDataGrid").datagrid({
            columns: [
                [

 					{ field: "propertyName", title: "产权", width: 100, align: "center" },
                    { field: "monthlyIncome", title: "以前预收属本月租", width: 100, align: "center" },
                    { field: "sameMonthlyIncome", title: "当月实收", width: 100, align: "center" },
                    { field: "newNetReceipt", title: "新欠实收", width: 100, align: "center" },
                    { field: "sameMonthAdvance", title: "预交款", width: 100, align: "center" },
                    { field: "subtotal", title: "小计", width: 100, align: "center" },
                    { field: "oldNetReceipt", title: "旧欠实收", width: 100, align: "center" },
                    { field: "total", title: "合计", width: 100, align: "center" }
                ]
            ],
            height: 440,
            idField: "contractId",
            fitColumns: true,
            fit: true,
            toolbar: '#toolbarWrap',
            rownumbers: true,
            singleSelect: true,
            showFooter: true,
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
                        success(DataGridFooter(data));
                    } else {
                        error();
                    }
                }
                , false);
            },
            onDblClickRow: function (rowIndex, rowData) {
                frameHelper.getDialogParentIframe().RentCollect.loadRentInfo(rowData);
                frameHelper.getDialogParentIframe().dialog.dialog('close');
            },
        });
    },
    Select: function () {
        $("#HouseRentReportDataGrid").datagrid("load");
    },
    RentExp: function () {
        var years;
        var months;
        var startMonth = $("#date").val();
        if (startMonth) {
            years = startMonth.split('-')[0];
            months = startMonth.split('-')[1];
        }
        var flag = years + "&Month=" + months;
        window.location.href = virtualDirName + "Report/HouseRentMonthExpAsync?Year=" + flag;
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
    HouseRentReport.Initialize();
});