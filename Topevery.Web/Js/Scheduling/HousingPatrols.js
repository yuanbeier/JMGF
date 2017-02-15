//将表单数据转为json
var grid;
var dialog1;
var tenantTypelist;
function loadData(param, success, error) {
    var isAccept = "";
    if ($("#IsAccept").combobox("getValue") !== "")
        isAccept=$("#IsAccept").combobox("getValue") === "0" ? true : false;
    topevery.ajax({
        type: "POST",
        url: "api/services/app/InspectTaskR/GetListAsync",
        contentType: "application/json",
        data: topevery.extend(topevery.form2Json("selectFrom"), {
            PageIndex: param.page,
            PageCount: param.rows,
            Order: param.order,
            Sort: param.sort,
            IsAccept: isAccept,
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

HousingPatrols = {
    ///加载列表数据-
    Initialize: function () {
        grid = $('#HousingPatrolsTable').datagrid({
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
                    { width: 100, title: '任务类型名称', field: 'taskTypeName', align: 'center' },
                    { width: 100, title: '工作站', field: 'userDeptName', align: 'center' },
                    { width: 100, title: '接受人', field: 'accepterName', align: 'center' },
                    { width: 80, title: '任务内容', field: 'taskContent', align: 'center' },
                    {
                        width: 80, title: '是否已经接收', field: 'isAccept', align: 'center'
                        , formatter: function (value) {
                            if (value) {
                                return "已经接收";
                            } else {
                                return "未接收";
                            }
                        }
                    },
                     { title: '创建时间', field: 'creationTime', width: 150, align: 'center', formatter: function (value) { return topevery.dataTimeFormatTT(value); }, sortable: true },
                    {
                        title: '操作', field: 'Action', width: '12%', align: 'center',
                        formatter: function (value, row, index) {
                            var d = $("#hiddenHousingPatrolsDelete").val() ? '<a href="#"   class="easyui-oldoperate"  onclick="HousingPatrols.deleterow(' + row.id + ')">删除</a>' : "";
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

      //  bindDropDown("IsNeedAccepter", "Common/GetNeedAccepterBind", "--房管员--");
    },
    ///搜索
    loadInfo: function () {
        $('#HousingPatrolsTable').datagrid('load', { input: topevery.form2Json("selectFrom") }); //点击搜索
    },
    Add: function () {
        window.location.href = virtualDirName + "Scheduling/HousingPatrolsView?type=新增";
    },
    ///删除一条数据
    deleterow: function (id) {
        topeveryMessage.confirm(function (r) {
            if (r) {
                $.ajax({
                    type: 'POST',
                    url: virtualDirName + 'api/services/app/InspectTaskW/DeleteAsync',
                    data: JSON.stringify({ "ids": id }),
                    contentType: "application/json",
                    Type: "JSON",
                    success: function (row) {
                        if (row.success) {
                            $("#HousingPatrolsTable").datagrid('reload');
                            topeveryMessage.show("删除成功");
                        } else {
                            topeveryMessage.show(row.result.message);
                        }
                    }
                });
            }
        });
    },
    Delete: function () {
        var arrRows = $('#HousingPatrolsTable').datagrid('getChecked');
        if (arrRows.length === 0) {
            window.top.topeveryMessage.show("请选择一条需要删除的记录!", "提示");
            return;
        }
        var ids = [];
        $.each(arrRows, function () {
            ids.push(this.id);
        });
        topeveryMessage.confirm(function (r) {
            if (r) {
                $.ajax({
                    type: 'POST',
                    url: virtualDirName + 'api/services/app/InspectTaskW/DeleteAsync',
                    data: JSON.stringify({ "ids": ids.join() }),
                    contentType: "application/json",
                    Type: "JSON",
                    success: function (row) {
                        if (row.success) {
                            $("#HousingPatrolsTable").datagrid('reload');
                            topeveryMessage.show("删除成功");
                        } else {
                            topeveryMessage.show("删除失败");
                        }
                    }
                });
            }
        });
    }
}
///初始化
$(function () {
    $(document).queue("datagrid0101", function () { HousingPatrols.Initialize(); });
    $(document).dequeue("datagrid0101");
});

$('#WorkStationId').combobox({
    onChange: function () {
        rentcheng();
    }
});
function rentcheng() {
    if ($("#WorkStationId").combobox('getValue') != null && $("#WorkStationId").combobox('getValue') !== "") {
        bindDropDown("IsNeedAccepter", "Common/GetNeedAccepterBind?userDeptId=" + $("#WorkStationId").combobox('getValue'), "--房管员--");
    }
}
