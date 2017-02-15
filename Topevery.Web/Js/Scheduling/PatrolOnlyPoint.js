//将表单数据转为json
var grid;
var dialog1;
var tenantTypelist;
function loadData(param, success, error) {
    topevery.ajax({
        type: "POST",
        url: "api/services/app/ClockPointsR/GetAsync",
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

PatrolOnlyPoint = {
    ///加载列表数据-
    Initialize: function () {
        grid = $('#PatrolOnlyPointTable').datagrid({
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
                      { title: '工作站名称', field: 'houseManageName', width: 80, align: 'center' },
                    { title: '班次名称', field: 'shiftName', width: 100, sortable: true, align: 'center' },
                    {
                        title: '开始时间', field: 'startTime', width: 80, align: 'center',
                        formatter: function (value) {
                            return topevery.dataTimeFormat1(value);
                        }
                    },
                    {
                        title: '结束时间', field: 'endTime', width: 80, align: 'center',
                        formatter: function (value) {
                            return topevery.dataTimeFormat1(value);
                        }
                    },
                    { title: '巡查路线', field: 'essentialPointsRecord', width: 80, align: 'center' },
                    { title: '备注', field: 'remark', width: 150, align: 'center', sortable: true },
                    {
                        title: '操作', field: 'Action', width: '12%', align: 'center',
                        formatter: function (value, row, index) {
                            var d = $("#hiddenPatrolOnlyPointDelete").val() ? '<a href="#"   class="easyui-oldoperate"  onclick="PatrolOnlyPoint.deleterow(' + row.id + ')">删除</a>' : "";
                            return d;
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
                            PatrolOnlyPoint.loadInfo();
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
        $('#PatrolOnlyPointTable').datagrid('load', { input: topevery.form2Json("selectFrom") }); //点击搜索
    },
    Add: function () {
        window.location.href = virtualDirName + "Scheduling/PatrolOnlyPointView?type=新增";
    },
    ///删除一条数据
    deleterow: function (id) {
        topeveryMessage.confirm(function (r) {
            if (r) {
                $.ajax({
                    type: 'POST',
                    url: virtualDirName + 'api/services/app/ClockPointsW/DeleteClockPointsAsync',
                    data: JSON.stringify({ "id": id }),
                    contentType: "application/json",
                    Type: "JSON",
                    success: function (row) {
                        if (row.success) {
                            $("#PatrolOnlyPointTable").datagrid('reload');
                            topeveryMessage.show("删除成功");
                        } else {
                            topeveryMessage.show(row.result.message);
                        }
                    }
                });
            }
        });
    }
}
///初始化
$(function () {
    $(document).queue("datagrid0101", function () { PatrolOnlyPoint.Initialize(); });
    $(document).dequeue("datagrid0101");
});
