//将表单数据转为json
var grid;
var dialog1;
var tenantTypelist;
function loadData(param, success, error) {
    topevery.ajax({
        type: "POST",
        url: "api/services/app/SafetyR/GetSpecialSafetyListAsync",
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

SpecialSecurityCheckManagement = {
    ///加载列表数据-
    Initialize: function () {
        grid = $('#SpecialSecurityCheckManagementTable').datagrid({
            height: 480,
            idField: "id",
            striped: true,
            fitColumns: true,
            fit: true,
            loadMsg: false,
            nowrap: false,
            //singleSelect: true,
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
                    { title: '年份', field: 'year', sortable: true, width: '5%', align: 'center' },
                    { width: '4%', title: '季度', sortable: true, field: 'quarter', align: 'center' },
                    { width: '8%', title: 'DailySafetyId', field: 'dailySafetyId', align: 'center', hidden: true },
                    {
                        title: '房屋编号',
                        field: 'houseNo',
                        width: '8%',
                        align: 'center',
                        formatter: function (value, row, index) {
                            if (row.houseId !== 0) {
                                return "<a href='#' onclick='objectExtend.HouseBan(" + row.houseId + ")'>" + value + "</a>";
                            } else {
                                return value;
                            }
                        }
                    },
                    { width: '8%', title: '单元名称', field: 'unitName', align: 'center' },
                    { width: '6%', title: '租户名称', field: 'name', align: 'center' },
                    { width: '8%', title: '租户号码', field: 'contactNumber', align: 'center' },
                    { width: '8%', title: '使用性质', field: 'usePropertyName', align: 'center' },
                    { width: '8%', title: '检查日期', field: 'checkDate', align: 'center', formatter: function(value) { return topevery.dataTimeFormat(value); } },
                    { title: '检查人', field: 'checkName', width: '10%', align: 'center' },
                    { title: '处理情况', field: 'proceConditions', width: 100, align: 'center' },
                    { title: '跟踪处理情况', field: 'trackProceConditions', width: 100, align: 'center' },
                    {
                        title: '操作',
                        field: 'Action',
                        width: '18%',
                        align: 'center',
                        formatter: function(value, row, index) {
                            var f = '<a href="#"   class="easyui-modifyoperate"  onclick="SpecialSecurityCheckManagement.dbClick(' + index + ')">查看</a> ';
                            var d = $("#hiddenLesseeInfoDeleted").val() ? ' <a href="#"   class="easyui-oldoperate"  onclick="SpecialSecurityCheckManagement.deleterow(' + row.dailySafetyId + ')">删除</a>' : "";
                            return f + d;
                        }
                    }
                ]
            ],
            toolbar: '#toolbarWrap',
            onDblClickRow: SpecialSecurityCheckManagement.dbClick
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
                            SpecialSecurityCheckManagement.loadInfo();
                        }
                    }
                })
            });
        }
    },
    ///搜索
    loadInfo: function () {
        $('#SpecialSecurityCheckManagementTable').datagrid('load', { input: topevery.form2Json("selectFrom") }); //点击搜索
    },
    Add: function () {
        window.location.href = virtualDirName + "SafetyManagement/SpecialSecurityCheckAdd";
    },
    Export: function () {
        var input = topevery.form2Json("selectFrom");
        var url = topevery.ExportUrl(input);
        window.location.href = virtualDirName + "SafetyExport/ExpSpecialSafetyFile" + url;
    },
    Print: function () {
        var data = $('#SpecialSecurityCheckManagementTable').datagrid('getSelections')[0];
        if ($('#SpecialSecurityCheckManagementTable').datagrid('getSelections')[0] == undefined) {
            $.messager.alert('提示', '请选择一条需要打印的记录!', 'info');
        } else {
            if ($('#SpecialSecurityCheckManagementTable').datagrid('getSelections').length > 1) {
                $.messager.alert('提示', '只能选择一条打印的记录!', 'info');
            } else {
                window.open(virtualDirName + "PrintRelevant/Special?id=" + data.id + "&Year=" + data.year);
            }
        }
    },
    dbClick: function (index, data) {
        if (data === undefined) {
            data = $('#SpecialSecurityCheckManagementTable').datagrid('getRows')[index];
        }
        ///弹出选择查看窗口
        dialog1 = ezg.modalDialog({
            width: 1200,
            height: 480,
            title: '查看专项安全检查',
            url: virtualDirName + 'SafetyManagement/SpecialSecurityCheckToView?id=' + data.dailySafetyId
        });
    },
    ///删除一条数据
    deleterow: function (id) {
        topeveryMessage.confirm(function (r) {
            if (r) {
                $.ajax({
                    type: 'POST',
                    url: virtualDirName + 'api/services/app/SafetyW/DeleteSpecialSafetyAsync',
                    data: JSON.stringify({ "ids": id }),
                    contentType: "application/json",
                    Type: "JSON",
                    success: function (row) {
                        if (row.success) {
                            $("#SpecialSecurityCheckManagementTable").datagrid('reload');
                            $('#SpecialSecurityCheckManagementTable').datagrid('clearSelections');
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
        var arrRows = $('#SpecialSecurityCheckManagementTable').datagrid('getChecked');
        if (arrRows.length === 0) {
            window.top.topeveryMessage.show("请选择一条需要删除的记录!", "提示");
            return;
        }
        var ids = [];
        $.each(arrRows, function () {
            ids.push(this.dailySafetyId);
        });
        topeveryMessage.confirm(function (r) {
            if (r) {
                $.ajax({
                    type: 'POST',
                    url: virtualDirName + 'api/services/app/SafetyW/DeleteSpecialSafetyAsync',
                    data: JSON.stringify({ "ids": ids.join() }),
                    contentType: "application/json",
                    Type: "JSON",
                    success: function (row) {
                        if (row.success) {
                            $("#SpecialSecurityCheckManagementTable").datagrid('reload');
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
    $(document).queue("datagrid0101", function () { SpecialSecurityCheckManagement.Initialize(); });
    $(document).dequeue("datagrid0101");
});
