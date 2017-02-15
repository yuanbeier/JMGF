///初始化


var grid;
var dialog10;
var tenantTypelist;

$(function () {
    EngineerUnitMentIndex.Initialize();

    bindDicToDrp("UnitType", "9228E3DB-C5D4-4E24-BACF-F4E6DE1FD2A4", "", false);
});


function loadData(param, success, error) {
    topevery.ajax({
        type: "POST",
        url: "api/services/app/EngineerUnitR/GetEngineerUnitList",
        contentType: "application/json",
        data: topevery.extend(topevery.form2Json("selectForm"), {
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
    }, false);
}


EngineerUnitMentIndex = {
    ///加载列表数据-
    Initialize: function () {
        grid = $('#EngineerUnitTable').datagrid({
            height: 480,
            idField: "id",
            striped: true,
            fitColumns: true,
            fit:true,
            singleSelect: false,
            nowrap: false,
            rownumbers: false, //行号
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
                    { field: "unitName", title: "单位名称", align: "left", width: 120, sortable: true },
                    { field: "unitAddress", title: "单位地址", align: "left", width: 220, sortable: true },
                    { field: "unitTypeName", title: "类型", align: "center", width: 40 },
                    { field: "unitTelePhone", title: "单位电话", align: "center", width: 60, sortable: true },
                    { field: "unitprincipal", title: "单位负责人", align: "center", width: 40, sortable: true },
                    { field: "remark", title: "备注", align: "center", width: 160, sortable: true },
                    {
                        title: '操作',
                        field: 'Action',
                        align: 'center',
                        width: 80,
                        formatter: function (value, row, index) {
                            var a = $("#EngineerUnitMentIndexEdit").val() ? "<a href='#' class='easyui-modifyoperate' onclick='EngineerUnitMentIndex.Edit(" + row.id + " )'>修改<a/>&nbsp;" : "";
                            var b = $("#EngineerUnitMentIndexDeleted").val() ? "<a href='#' class='easyui-oldoperate' onclick='EngineerUnitMentIndex.singleDelete(" + row.id + ")'>删除<a/>" : "";
                            return a + b;
                        }
                    }
                ]
            ],
            toolbar: '#toolbarWrap',
            loader: loadData
        });
        for (var i = 0; i < $(".easyui-textbox").length; i++) {
            $("#" + $('.easyui-textbox').eq(i)[0].id + "").textbox({
                inputEvents: $.extend({}, $.fn.textbox.defaults.inputEvents, {
                    keyup: function (event) {
                        if (event.keyCode === 13) {
                            EngineerUnitMentIndex.Select();
                        }
                    }
                })
            });
        }
    },
    Add: function () {
        var dialog = ezg.modalDialog({
            width: 750,
            height: 370,
            title: '工程单位档案新增',
            url: virtualDirName + "HouseRepair/EngineerUnitAdd",
            buttons: [
                {
                    text: '确认',
                    iconCls: 'icon-ok',
                    handler: function () {
                        dialog.find('iframe').get(0).contentWindow.submitFormAdd(dialog, grid, this);
                    }

                }
            ]
        });
    },
    //编辑
    Edit: function (id) {
        var dialog = ezg.modalDialog({
            width: 750,
            height: 370,
            title: '工程单位档案修改',
            url: virtualDirName + "HouseRepair/EngineerUnitEdit?id=" + id,
            buttons: [
                {
                    text: '确认',
                    iconCls: 'icon-ok',
                    handler: function () {
                        dialog.find('iframe').get(0).contentWindow.submitFormEdit(dialog, grid);
                    }
                }
            ]
        });
    },
    //查询
    Select: function () {

        $('#EngineerUnitTable').datagrid('load', { input: topevery.form2Json("selectForm") }); //点击搜索

    },
    //   清空查询条件
    Clear: function () {
        $('#UnitName').textbox('setValue', '');
        $("#UnitType").combobox('setValue', '');
        $('#EngineerUnitTable').datagrid('reload');

    },
    //删除一个或多个工程单位（批量删除）
    batchDelete: function () {
        var arrRows = $('#EngineerUnitTable').datagrid('getSelections');
        if (arrRows.length === 0) {
            $.messager.alert('提示', '请选择一条需要删除的记录!', 'info');
        } else {
            var ids = [];
            var url = virtualDirName + 'api/services/app/EngineerUnitW/DeleteEngineerUnitAsync';
            $.each(arrRows, function () {
                ids.push(this.id);
            })
            deleteAjax(ids.join(), "EngineerUnitTable", url);
        }
    },
    //列表行内删除单个工程单位（单个删除）
    singleDelete: function (id) {
        var url = virtualDirName + 'api/services/app/EngineerUnitW/DeleteEngineerUnitAsync';
        deleteAjax(id, "EngineerUnitTable", url);
    }
}
