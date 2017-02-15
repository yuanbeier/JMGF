//将表单数据转为json
var grid;
var dialog1;
var tenantTypelist;
var dialogImport;
function loadData(param, success, error) {
    topevery.ajax({
        type: "POST",
        url: "api/services/app/ShiftMaintenanceR/GetShiftMaintenanceListAsync",
        contentType: "application/json",
        data: topevery.extend(topevery.form2Json("selectFrom"), {
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
    }, true);
};

ShiftMaintenance = {
    ///加载列表数据-
    Initialize: function () {
        grid = $('#ShiftMaintenanceTable').datagrid({
            height: 480,
            idField: "id",
            striped: true,
            fitColumns: true,
            fit: true,
            loadMsg: false,
            nowrap: false,
            loader: loadData,
            singleSelect: true,
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
                    //{ field: "id", checkbox: true },
                    { title: '班次名称', field: 'shiftName', width: 100, sortable: true, align: 'center' },
                    {
                        title: '开始时间', field: 'startTime', width: 80, align: 'center',
                        formatter: function(value) {
                            return topevery.dataTimeFormat1(value);
                        }
                    },
                    {
                        title: '结束时间', field: 'endTime', width: 80, align: 'center',
                        formatter: function(value) {
                            return topevery.dataTimeFormat1(value);
                        }
                    },
                    { title: '工作站名称', field: 'houseManageName', width: 80, align: 'center'},
                    { title: '备注', field: 'remark', width: 150, align: 'center', sortable: true },
                    {
                        title: '操作',
                        field: 'Action',
                        width: '12%',
                        align: 'center',
                        formatter: function (value, row, index) {
                            if (row.id !== -1) {
                                var f = '<a href="#"   class="easyui-modifyoperate"  onclick="ShiftMaintenance.dbClick(' + index + ')">查看</a> ';
                                var d = $("#hiddenShiftMaintenanceDelete").val() ? '<a href="#"   class="easyui-oldoperate"  onclick="ShiftMaintenance.deleterow(' + row.id + ')">删除</a> ' : "";
                                var c = $("#hiddenShiftMaintenanceUpdate").val() ? ' <a href="#"   class="easyui-modifyoperate"  onclick="ShiftMaintenance.Update(' + row.id + ')">修改</a>' : "";
                                return f + c + " " + d;
                            } else {
                                return "";
                            }

                        }
                    }
                ]
            ],
            toolbar: '#toolbarWrap',
            onDblClickRow: ShiftMaintenance.dbClick
        });
        if ($("#WorkstationDropDown").val()) {
            bindDropDown("HouseManageId", "Common/GetWorkstationBind", "--工作站--", false, false);
        } else {
            bindDropDown("HouseManageId", "Common/GetWorkstationBind", "--工作站--", false, true);
            $("#HouseManageId").combobox("readonly");
        }
        for (var i = 0; i < $(".easyui-textbox").length; i++) {
            $("#" + $('.easyui-textbox').eq(i)[0].id + "").textbox({
                inputEvents: $.extend({}, $.fn.textbox.defaults.inputEvents, {
                    keyup: function (event) {
                        if (event.keyCode === 13) {
                            ShiftMaintenance.loadInfo();
                        }
                    }
                })
            });
        }
    },
    ///搜索
    loadInfo: function () {
        $('#ShiftMaintenanceTable').datagrid('load', { input: topevery.form2Json("selectFrom") }); //点击搜索
    },
    Add: function () {
        dialog1 = ezg.modalDialog({
            width: 400,
            height: 384,
            title: '新增排班',
            url: virtualDirName + 'Scheduling/ShiftMaintenanceView?type=Add',
            buttons: [
               {
                   text: '确认',
                   iconCls: 'icon-ok',
                   handler: function () {
                       dialog1.find('iframe').get(0).contentWindow.shiftMaintenanceView.SaveLA();
                   }
               }
            ]
        });
    },
    Update: function (id) {
        dialog1 = ezg.modalDialog({
            width: 400,
            height: 384,
            title: '修改排班',
            url: virtualDirName + 'Scheduling/ShiftMaintenanceView?id=' + id + "&type=Edit",
            buttons: [
              {
                  text: '确认',
                  iconCls: 'icon-ok',
                  handler: function () {
                      dialog1.find('iframe').get(0).contentWindow.shiftMaintenanceView.SaveLA();
                  }
              }
            ]
        });
    },
    dbClick: function (index, data) {
        if (data === undefined) {
            data = $('#ShiftMaintenanceTable').datagrid('getRows')[index];
        }
        dialog1 = ezg.modalDialog({
            width: 400,
            height: 344,
            title: '查看排班',
            url: virtualDirName + 'Scheduling/ShiftMaintenanceView?id=' + data.id + "&type=ToView"
        });
    },
    message: function () {
        try {
            ShiftMaintenance.loadInfo();
        }catch(e) {
            
        }
        dialog1.dialog('close');
    },
    ///删除一条数据
    deleterow: function (id) {
        topeveryMessage.confirm(function (r) {
            if (r) {
                $.ajax({
                    type: 'POST',
                    url: virtualDirName + 'api/services/app/ShiftMaintenanceW/DeleteShiftMaintenanceAsync',
                    data: JSON.stringify({ "ids": id }),
                    contentType: "application/json",
                    Type: "JSON",
                    success: function (row) {
                        if (row.result.isSuccess) {
                            $("#ShiftMaintenanceTable").datagrid('reload');
                            topeveryMessage.show(row.result.message);
                        } else {
                            topeveryMessage.show(row.result.message);
                        }
                    }
                });
            }
        });
    },
    Delete: function () {
        var arrRows = $('#ShiftMaintenanceTable').datagrid('getChecked');
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
                    url: virtualDirName + 'api/services/app/ShiftMaintenanceW/DeleteShiftMaintenanceAsync',
                    data: JSON.stringify({ "ids": ids.join() }),
                    contentType: "application/json",
                    Type: "JSON",
                    success: function (row) {
                        if (row.result.isSuccess) {
                            $("#ShiftMaintenanceTable").datagrid('reload');
                            topeveryMessage.show(row.result.message);
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
    $(document).queue("datagrid0101", function () { ShiftMaintenance.Initialize(); });
    $(document).dequeue("datagrid0101");
});
