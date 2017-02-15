//将表单数据转为json
var grid;
var tenantTypelist;
var dialogHouseRentApply;
var date = new Date();
if (date.getMonth() === 0) {
    data=date.getFullYear() - 1 + "-" + (12);
} else {
    data=date.getFullYear() + "-" + (date.getMonth());
}
function loadData(param, success, error) {
    topevery.ajax({
        type: "POST",
        url: "api/services/app/ReportR/GetRentIncomeReportAsync",
        contentType: "application/json",
        data: JSON.stringify({
            ReportDateTime: $("#dateTime").val(),
            WorkStationId: $("#WorkStationId").combobox('getValue'),
            ManageUserId: $("#ManageUserId").combobox('getValue'),
            UseNature: $("#UseNature").combobox('getValue')
})
    }, function (data) {
        if (data.success) {
            success(DataGridFooterList(data));
        } else {
            error();
        }
    }, false);
};

TenantIncomeReport = {
    ///加载列表数据-
    Initialize: function () {
        $("#dateTime").val(data);
        bindDropDown("WorkStationId", "Common/GetWorkstationBind", "--工作站--");
       
        grid = $('#TenantIncomeReportTable').datagrid({
            height: 580,
            idField: "id",
            striped: true,
            fitColumns: true,
            fit:true,
            toolbar: '#toolbarWrap',
            singleSelect: true,
            checkOnSelect: true,
            nowrap: true,
            //rownumbers: true, //行号
            //pagination: true, //分页控件
            pageSize: 500,
            pageList: [10, 20, 50, 500],
            showFooter: true,
            loader: loadData,
            onLoadSuccess: function () {

            },
            columns: [
                [
                    { title: '项目(产权)', field: 'propertyName', colspan: 1, width: '6%', align: 'center', rowspan: 2 },
                    { title: '面积', field: 'totalMetRentArea', width: '8%', align: 'center', rowspan: 2 },
                    { title: '租金基数', colspan: 2 },
                    { title: '历年旧欠租金(年初数)(3)', field: 'totalLastYearOldOweRentSum', width: '12%', align: 'center', rowspan: 2 },
                    { title: '以前预收属本月租金(4)', field: 'totalMonthBeforeReceiptRent', width: '12%', align: 'center', rowspan: 2 },
                    { title: '本月实收租金', colspan: 5 },
                    { title: '本年实收租金', colspan: 4 },
                    { title: '本月收租率(14)', field: 'monthRentRateString', width: '8%', align: 'center', rowspan: 2 },
                    { title: '累计收租率(15)', field: 'yearRentRateString', width: '8%', align: 'center', rowspan: 2 },
                    { title: '旧欠收租率(16)', field: 'oldRentRateString', width: '8%', align: 'center', rowspan: 2 },
                    { title: '本月底欠租金额', colspan: 2 }
                ],
                [
                    { width: '8%', title: '本月应收租金(1)', field: 'totalMonthPayableRent', align: 'center' },
                    { width: '8%', title: '累计(2)', field: 'totalPayableRent', align: 'center' },
                    { width: '8%', title: '当月租金(5)', field: 'totalMonthSameMonNetReceipt', align: 'center' },
                    { width: '8%', title: '新欠租金(6)', field: 'totalMonthNewNetReceipt', align: 'center' },
                    { width: '8%', title: '预收租金(7)', field: 'totalMonthSameAdvanceReceipt', align: 'center' },
                    { width: '8%', title: '旧欠租金(8)', field: 'totalMonthOldNetReceipt', align: 'center' },
                    { width: '8%', title: '合计(9)', field: 'totalMonth', align: 'center' },
                    { width: '8%', title: '当年租金(10)', field: 'totalYearSameMonNetReceipt', align: 'center' },
                    { width: '11%', title: '预收本月后租金(11)', field: 'totalYearBeforeReceiptRent', align: 'center' },
                    { width: '11%', title: '历年旧欠租金(12)', field: 'totalYearOldNetReceipt', align: 'center' },
                    { width: '8%', title: '累计(13)', field: 'totalYear', align: 'center' },
                    { width: '8%', title: '新欠(17)', field: 'totalRentArrearsSum', align: 'center' },
                    { width: '8%', title: '旧欠(18)', field: 'totalOldOweRentSum', align: 'center' }
                ]
            ]
        });
        for (var i = 0; i < $(".easyui-textbox").length; i++) {
            $("#" + $('.easyui-textbox').eq(i)[0].id + "").textbox({
                inputEvents: $.extend({}, $.fn.textbox.defaults.inputEvents, {
                    keyup: function(event) {
                        if (event.keyCode === 13) {
                            TenantIncomeReport.loadInfo();
                        }
                    }
                })
            });
        };
       
       
    },
    print: function () {

    },
    ///搜索
    loadInfo: function () {
        $('#TenantIncomeReportTable').datagrid('load', { input: topevery.form2Json("selectFrom") }); //点击搜索
    },
    RentExp: function () {
        var years;
        var months;
        var startMonth = $("#dateTime").val();
        if (startMonth) {
            years = startMonth.split('-')[0];
            months = startMonth.split('-')[1];
        }
        var workStationId = $("#WorkStationId").combobox("getValue");
        var manageUserId = $("#ManageUserId").textbox("getValue");
        var useNature = $("#UseNature").combobox('getValue');
        var flag = startMonth + "&workStationId=" + workStationId + "&manageUserId=" + manageUserId + "&useNature=" + useNature;
        window.location.href = virtualDirName + "Report/TenantIncomeReportExpAsync?ReportDateTime=" + flag;
    }
}
///初始化
$(function () {
    $(document).queue("datagrid0101", function () { TenantIncomeReport.Initialize(); });
    $(document).dequeue("datagrid0101");
});

$('#WorkStationId').combobox({
    onChange: function () {
        rentcheng();
    }
});
function rentcheng() {
    if ($("#WorkStationId").combobox('getValue') != null && $("#WorkStationId").combobox('getValue')!=="") {
        bindDropDown("ManageUserId", "Common/GetManageUserBind?userDeptId=" + $("#WorkStationId").combobox('getValue'), "--房管员--");
    }
}
