//将表单数据转为json
var grid;
function loadData(param, success, error) {
    topevery.ajax({
        type: "POST",
        url: "api/services/app/SignR/GetSignAsync",
        contentType: "application/json",
        data: topevery.extend(topevery.form2Json("selectFrom"), {
            PageIndex: param.page,
            PageCount: param.rows,
            Order: param.order,
            Sort: param.sort,
            HouseManageId: $("#WorkStationId").combobox('getValue')
        })
    }, function (data) {
        if (data.success) {
            success(data.result);
        } else {
            error();
        }
    }, true);
};

ClockIn = {
    ///加载列表数据-
    Initialize: function () {
        grid = $('#ClockInTable').datagrid({
            height: 480,
            idField: "id",
            striped: true,
            fitColumns: true,
            fit: true,
            loadMsg: false,
            nowrap: false,
            loader: loadData,
            rownumbers: true, //行号
            pagination: true, //分页控件
            pageSize: 10,
            pageList: [10, 20, 50, 100],
            showFooter: true,
            onLoadSuccess: function(data) {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
            },
            columns: [
                [
                    { field: "id", checkbox: true },
                    { width: 90, title: '姓名', field: 'userName', align: 'center' },
                    { width: 100, title: '工作站名称', field: 'houseManageName', align: 'center' },
                    {
                        width: 110, title: '班次名称', field: 'shiftName', align: 'center',
                        formatter: function (value, row, index) {
                            return row.shiftName + "(" + topevery.dataTimeFormat1(row.startTime) + "-" + topevery.dataTimeFormat1(row.endTime) + ")";
                        }
                    },
                    { width: 80, title: '班次日期', field: 'date', align: 'center', formatter: function (value) { return topevery.dataTimeFormat(value); }},
                    { width: 80, title: '上班打卡时间', field: 'signDate', align: 'center', formatter: function (value) { return topevery.dataTimeFormat1(value); } },
                    {
                        width: 100, title: '上班打卡签到状态', field: 'signState', align: 'center',
                        formatter: function (value) {
                            if (value===1) {
                                return "有效";
                            } else if (value===0) {
                                return '<a style="color:red;">异常</a>';
                            } else {
                                return value;
                            }
                        }
                    },
                    {
                        width: 100, title: '上班打卡迟到时间', field: 'signTime', align: 'center', formatter: function (value, row) {
                            if (row.signState === 0 || row.signState == null) {
                                return '<a style="color:red;">' + value + '</a>';
                            }
                            return 0;
                        }
                    },
                    { width: 100, title: '下班打卡时间', field: 'afterDate', align: 'center', formatter: function (value) { return topevery.dataTimeFormat1(value); }, },
                    {
                        width: 100, title: '下班打卡签到状态', field: 'afterState', align: 'center',
                            formatter: function (value) {
                                if (value===1) {
                                    return "有效";
                                } else if (value===0) {
                                    return '<a style="color:red;">异常</a>';
                                } else {
                                    return value;
                                }
                            }
                    },
                    {
                        width: 100, title: '下班打卡早退时间', field: 'afterTime', align: 'center', formatter: function (value, row) {
                            if (row.afterState ===0 ) {
                                return '<a style="color:red;">' + value + '</a>';
                            } else if(row.afterState ===1 )
                            {
                                return 0;
                            } else {
                                return '';
                            }
                        }
                    },
                    { width: 100, title: '工作站编号', field: 'houseManageId', align: 'center',hidden:true },
                    { width: 100, title: '备注', field: 'remark', align: 'center' }
                ]
            ],
            toolbar: '#toolbarWrap',
        });
        for (var i = 0; i < $(".easyui-textbox").length; i++) {
            $("#" + $('.easyui-textbox').eq(i)[0].id + "").textbox({
                inputEvents: $.extend({}, $.fn.textbox.defaults.inputEvents, {
                    keyup: function (event) {
                        if (event.keyCode === 13) {
                            HousingPatrols.loadInfo();
                        }
                    }
                })
            });
        };
        if ($("#WorkstationDropDown").val()) {
            bindDropDown("WorkStationId", "Common/GetWorkstationBind", "--工作站--", false, false);
        } else {
            bindDropDown("WorkStationId", "Common/GetWorkstationBind", "--工作站--", false, true);
            $("#WorkStationId").combobox("readonly");
        }
    },
    ///搜索
    loadInfo: function () {
        $('#ClockInTable').datagrid('load', { input: topevery.form2Json("selectFrom") }); //点击搜索
    }
}
///初始化
$(function () {
    $(document).queue("datagrid0101", function () { ClockIn.Initialize(); });
    $(document).dequeue("datagrid0101");
});

