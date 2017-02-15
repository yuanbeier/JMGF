var CashRentMonthReport = {
    Initialize: function() {
        $("#HouseRentReportDataGrid").datagrid({
            columns: [
                [
                    {
                        field: "houseDoorplate",
                        title: "现房屋门牌",
                        width: 100,
                        align: "center",
                        formatter: function(value, row, index) {
                            if (row.id !== -1) {
                                return "<a href='#' onclick='objectExtend.HouseBan(" + row.id + ")'>" + value + "</a>";
                            } else {
                                return value;
                            }
                        }
                    },
                    { field: "rentRange", title: "租用范围", width: 100, align: "center" },
                    { field: "sameMonNetReceipt", title: "当月实收", width: 100, align: "center" },
                    { field: "newNetReceipt", title: "新欠实收", width: 100, align: "center" },
                    { field: "oldNetReceipt", title: "旧欠实收", width: 100, align: "center" },
                    { field: "sameMonthAdvance", title: "预存款实收", width: 100, align: "center" },
                    { field: "totalMoney", title: "合计", width: 100, align: "center" },
                    { field: "invoiceNumber", title: "发票号", width: 100, align: "center" }
                ]
            ],
            height: 440,
            idField: "contractId",
            pagination: true, //分页控件
            pageSize: 10,
            pageList: [10, 20, 50, 100],
            showFooter: true,
            fitColumns: true,
            fit: true,
            toolbar: '#toolbarWrap',
            rownumbers: true,
            singleSelect: true,
            onLoadSuccess: function(data) {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
                $(this).datagrid("clearSelections").datagrid("clearChecked");
            },
            loader: function(param, success, error) {
                var submit = topevery.form2Json("selectForm");
                var array = $('#HouseManageId').combobox('getValues');
                var houseManageId = array.join();
                submit.houseManageId = houseManageId;
                if (submit.date) {
                    var temp = submit.date.split("-");
                    submit["year"] = temp[0];
                    submit["month"] = temp[1];
                }

                topevery.ajax({
                    type: "POST",
                    url: "api/services/app/ReportR/GetCashRentMonthReportAsync",
                    contentType: "application/json",
                    data: topevery.extend(submit, {
                        PageIndex: param.page,
                        PageCount: param.rows
                    })
                }, function(data) {
                    if (data.success) {
                        success(data.result);
                    } else {
                        error();
                    }
                }, false);
            }
        });
    },
    Select: function () {
        $("#HouseRentReportDataGrid").datagrid("load");
    },
    Clear: function () {
        var t = $("#date").val();
        $("#selectForm").form("reset");
        $("#date").val(t);
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
        var array = $('#HouseManageId').combobox('getValues');
        var houseManageId = "";
        for (var i = 0; i < array.length; i++) {
            houseManageId += array[i] + ",";
        }
        var housekeepId = $("#HousekeepId").combobox("getValue");
        var isHome = $("#IsHome").combobox("getValue");
        var flag = years + "&Month=" + months + "&houseManageId=" + houseManageId + "&housekeepId=" + housekeepId + "&isHome=" + isHome;
        window.location.href = virtualDirName + "Report/CashRentMonthReportExpAsync?Year=" + flag;
    }
};
$(function () {
    var date = new Date();
    if (date.getMonth()===0) {
        $("#date").val(date.getFullYear()-1 + "-" + (12));
    } else {
        $("#date").val(date.getFullYear() + "-" + (date.getMonth()));
    }
    bindDropDown("HouseManageId", "Common/GetWorkstationBind", "");
    bindDropDown("HousekeepId", "Common/GetManageUserBind", "--房管员--");
    $("#IsHome").combobox({
        editable: false,
        data: [
            {
                "value": " ",
                "text": "--是否住宅--",
                "selected": true
            },
            {
                "value": "0",
                "text": "是"
            }, {
                "value": "1",
                "text": "否"
            }
        ]
    });
    CashRentMonthReport.Initialize();
});