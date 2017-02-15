var grid;
var dialog10;
var tenantTypelist;
$(function () {
    $(document).queue("datagrid0101", function () { UnitHonestyMantIndex.Initialize(); });
    $(document).dequeue("datagrid0101");
});

function loadData(param, success, error) {

    topevery.ajax({
        type: "POST",
        url: "api/services/app/UnitHonestyMangmentR/GetUnitHonestyList",
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
};
UnitHonestyMantIndex = {
    ///加载列表数据-
    Initialize: function () {
        grid = $('#UnitHonestyMantTabel').datagrid({
            height: 480,
            idField: "id",
            striped: true,
            fitColumns: true,
            fit:true,
            singleSelect: false,
            nowrap: false,
            loader: loadData,
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
                    { field: "companyName", title: "企业名称", align: "left", width: 120, sortable: true },
                    { field: "isDisciplineName", title: "是否违纪", align: "center", width: 40 },
                    { field: "disciplineNote", title: "违纪说明", align: "left", width: 100, sortable: true },
                    { field: "reduceScore", title: "扣分", align: "center", width: 20, sortable: true },
                    {
                        field: "auditTime",
                        title: "时间",
                        align: "center",
                        width: 60,
                        formatter: function (value) {
                            return topevery.dataTimeFormat(value);
                        }, sortable: true
                    },
                    { field: "description", title: "扣分描述", align: "left", width: 100 },
                    {
                        title: '操作',
                        field: 'Action',
                        align: 'center',
                        width: 80,
                        formatter: function (value, row, index) {
                            var a = $("#hiddenUnitHonestyMantIndexDeleted").val()?"<a href='#' class='easyui-oldoperate' onclick='UnitHonestyMantIndex.DeleteRow(" + row.id + ")'>删除<a/>":"";
                            return "<a href='#' class='easyui-modifyoperate' onclick='UnitHonestyMantIndex.Search(" + row.id + ")'>查看<a/>&nbsp;"
                                + a;
                        }
                    }
                ]
            ],
            toolbar: '#toolbarWrap'
        });
        for (var i = 0; i < $(".easyui-textbox").length; i++) {
            $("#" + $('.easyui-textbox').eq(i)[0].id + "").textbox({
                inputEvents: $.extend({}, $.fn.textbox.defaults.inputEvents, {
                    keyup: function (event) {
                        if (event.keyCode === 13) {
                            UnitHonestyMantIndex.Select();
                        }
                    }
                })
            });
        };
    },
    //查看
    Search: function (id) {
        var dialog = ezg.modalDialog({
            width: 550,
            height:460,
            title: '工程单位诚信信息查看',
            url: virtualDirName + "IntegrityMent/UnitHonestySearch?id=" + id
        });
    },

    //查询
    Select: function () {

        $('#UnitHonestyMantTabel').datagrid('load', { input: topevery.form2Json("selectForm") }); //点击搜索

    },
    Insert: function () {
        window.location.href = virtualDirName + "IntegrityMent/UnitHonestyAdd";
    },

    Clear: function () {
        $('#CompanyName').textbox('setValue', '');
     
        $('#UnitHonestyMantTabel').datagrid('reload');
    },
    //批量删除租诚信管理信息
    DeleteHouseRepairInfo: function () {
        topeveryMessage.confirm(function (count) {
            if (count) {
                var array = $('#UnitHonestyMantTabel').datagrid('getSelections');
                if (array.length === 0) {
                    $.messager.alert('提示', '请选择要删除的信息!', 'info');
                } else {
                    var ids = "";
                    for (var i = 0; i < array.length; i++) {
                        ids += array[i].id + ",";
                    }
                    $.ajax({
                        type: 'POST',
                        url: virtualDirName + 'api/services/app/UnitHonestyMangmentW/DeleteUnitHonestyMangmentInfoAsync?input=' + ids,
                        contentType: "application/json",
                        Type: "JSON",
                        success: function (row) {
                            $("#UnitHonestyMantTabel").datagrid('reload');
                            topeveryMessage.show("删除成功");
                        }
                    });
                }
            }
        });
    },

    //单条删除租户诚信信息
    DeleteRow: function (id) {
        topeveryMessage.confirm(function (r) {
            if (r) {
                $.ajax({
                    type: 'POST',
                    url: virtualDirName + 'api/services/app/UnitHonestyMangmentW/DeleteUnitHonestyMangmentAsync',
                    data: JSON.stringify({ "id": id }),
                    contentType: "application/json",
                    Type: "JSON",
                    success: function (row) {
                        $("#UnitHonestyMantTabel").datagrid('reload');
                        topeveryMessage.show("删除成功");
                    }
                });
            }
        });
    }
}