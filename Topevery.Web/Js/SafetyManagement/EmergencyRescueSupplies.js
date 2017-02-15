//将表单数据转为json
var grid;
var dialog1;
var tenantTypelist;
function loadData(param, success, error) {
    topevery.ajax({
        type: "POST",
        url: "api/services/app/RescueGoodsR/GetRescueGoodsListAsync",
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

EmergencyRescueSupplies = {
    ///加载列表数据-
    Initialize: function () {
        grid = $('#EmergencyRescueSuppliesTable').datagrid({
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
                    { width: 80, title: '年份', field: 'year', align: 'center', sortable: true },
                    { title: '物资名称', field: 'goodsName', sortable: true, width: 80, align: 'center' },
                       { width: 100, title: '数量', field: 'num', align: 'center', sortable: true },
                       { width: 80, title: '单位', field: 'unit', align: 'center', sortable: true },
                    { width: 100, title: '所属工作站', field: 'houseManageName', align: 'center' },
                     { title: '备注', field: 'remark', width: 80, align: 'center' },
                    {
                        title: '操作',
                        field: 'Action',
                        width: '12%',
                        align: 'center',
                        formatter: function(value, row, index) {
                            var f = '<a href="#"   class="easyui-modifyoperate"  onclick="EmergencyRescueSupplies.dbClick(' + index + ')">查看</a> ';
                            var d = $("#hiddenEmergencyRescueSuppliesDelete").val() ? '<a href="#"   class="easyui-oldoperate"  onclick="EmergencyRescueSupplies.deleterow(' + row.id + ')">删除</a>' : "";
                            var c = $("#hiddenEmergencyRescueSuppliesUpdate").val() ? '<a href="#"   class="easyui-modifyoperate"  onclick="EmergencyRescueSupplies.Update(' + row.id + ')">修改</a>' : "";
                            return f + d + c;
                        }
                    }
                ]
            ],
            toolbar: '#toolbarWrap',
            onDblClickRow: EmergencyRescueSupplies.dbClick
        });
        for (var i = 0; i < $(".easyui-textbox").length; i++) {
            $("#" + $('.easyui-textbox').eq(i)[0].id + "").textbox({
                inputEvents: $.extend({}, $.fn.textbox.defaults.inputEvents, {
                    keyup: function (event) {
                        if (event.keyCode === 13) {
                            EmergencyRescueSupplies.loadInfo();
                        }
                    }
                })
            });
        }
        if ($("#WorkstationDropDown").val()) {
            bindDropDown("HouseManageId", "Common/GetWorkstationBind", "--工作站--", false, false);
        } else {
            bindDropDown("HouseManageId", "Common/GetWorkstationBind", "--工作站--", false, true);
            $("#HouseManageId").combobox("readonly");
        }
        //var date = new Date();
        //$("#Year").val(date.getFullYear());
    },
    ///搜索
    loadInfo: function () {
        $('#EmergencyRescueSuppliesTable').datagrid('load', { input: topevery.form2Json("selectFrom") }); //点击搜索
    },
    Clear: function () {
        $("#selectFrom").form('clear');
        var date = new Date();
        $("#Year").val(date.getFullYear());
        $("#EmergencyRescueSuppliesTable").datagrid('load');
    },
    Add: function () {
        dialog1 = ezg.modalDialog({
            width: 850,
            height: 286,
            title: '新增应急抢险物资',
            url: virtualDirName + 'SafetyManagement/EmergencyRescueSuppliesAdd?type=新增'
        });
    },
    Update: function (id) {
        dialog1 = ezg.modalDialog({
            width: 850,
            height: 286,
            title: '修改应急抢险物资',
            url: virtualDirName + "SafetyManagement/EmergencyRescueSuppliesAdd?id=" + id + "&type=修改"
        });
    },
    Export: function () {
        var input = topevery.form2Json("selectFrom");
        var url = topevery.ExportUrl(input);
        window.location.href = virtualDirName + "SafetyExport/ExpEmergencyRescueSuppliesFile" + url;
    },
    dbClick: function (index, data) {
        if (data === undefined) {
            data = $('#EmergencyRescueSuppliesTable').datagrid('getRows')[index];
        }
        ///弹出选择查看窗口
        dialog1 = ezg.modalDialog({
            width: 850,
            height: 236,
            title: '查看应急抢险物资',
            url: virtualDirName + 'SafetyManagement/EmergencyRescueSuppliesAdd?id=' + data.id + "&type=查看"
        });
    },
    ///删除一条数据
    deleterow: function (id) {
        topeveryMessage.confirm(function (r) {
            if (r) {
                $.ajax({
                    type: 'POST',
                    url: virtualDirName + 'api/services/app/RescueGoodsW/DeleteRescueGoodsAsync',
                    data: JSON.stringify({ "ids": id }),
                    contentType: "application/json",
                    Type: "JSON",
                    success: function (row) {
                        if (row.success) {
                            $("#EmergencyRescueSuppliesTable").datagrid('reload');
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
        var arrRows = $('#EmergencyRescueSuppliesTable').datagrid('getChecked');
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
                    url: virtualDirName + 'api/services/app/RescueGoodsW/DeleteRescueGoodsAsync',
                    data: JSON.stringify({ "ids": ids.join() }),
                    contentType: "application/json",
                    Type: "JSON",
                    success: function (row) {
                        if (row.success) {
                            $("#EmergencyRescueSuppliesTable").datagrid('reload');
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
    $(document).queue("datagrid0101", function () { EmergencyRescueSupplies.Initialize(); });
    $(document).dequeue("datagrid0101");
});
