//将表单数据转为json
var grid;
var dialog;
function loadData(param, success, error) {
    topevery.ajax({
        type: "POST",
        url: "api/services/app/InspectCheckR/GetInspectCheckAsync",
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

InspectTheLog = {
    ///加载列表数据-
    Initialize: function () {
        grid = $('#InspectTheLogTable').datagrid({
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
            onLoadSuccess: function (data) {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
            },
            columns: [
                [
                    { field: "id", checkbox: true },
                    { width: 80, title: '巡查任务人员', field: 'userName', align: 'center' },
                     {
                         width: 80, title: '班次名称', field: 'shiftName', align: 'center',
                         formatter: function (value, row, index) {
                             return row.shiftName + "(" + topevery.dataTimeFormat1(row.startTime) + "-" + topevery.dataTimeFormat1(row.endTime) + ")";
                         }
                     },
                    { width: 100, title: '工作站名称', field: 'houseManageName', align: 'center' },
                    { width: 80, title: '班次日期', field: 'date', align: 'center', formatter: function (value) { return topevery.dataTimeFormat(value); } },
                    {
                        width: 80, title: '巡查状态', field: 'patrolStatue', align: 'center',
                        formatter: function (value) {
                            if (value === 1) {
                                return "完成";
                            } else if (value === 0) {
                                return '<a style="color:red;">未完成</a>';
                            } else {
                                return value;
                            }
                        }
                    },
                    { width: 100, title: '工作站编号', field: 'houseManageId', align: 'center', hidden: true },
                    {
                        title: '操作', field: 'Action', width: '12%', align: 'center',
                        formatter: function (value, row, index) {
                            var d = '<a href="#"   class="easyui-oldoperate"  onclick="InspectTheLog.ToView(' + row.id + ',' + row.clockPointsId + ')">查看巡查详细信息</a>';
                            return  d;
                        }
                    }
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
        $('#InspectTheLogTable').datagrid('load', { input: topevery.form2Json("selectFrom") }); //点击搜索
    },
    ToView: function (id, clockPointsId) {
        dialog = ezg.modalDialog({
            width: 730,
            height: 520,
            title: '查看巡查详细信息',
            url: virtualDirName + 'Scheduling/InspectTheLogView?Id=' + id + "&ClockPointsId="+clockPointsId,
        });
    }
}
///初始化
$(function () {
    $(document).queue("datagrid0101", function () { InspectTheLog.Initialize(); });
    $(document).dequeue("datagrid0101");
});

