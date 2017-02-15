
//将表单数据转为json
var grid;
var dialog10;
var tenantTypelist;
function loadData(param, success, error) {  
    topevery.ajax({
        type: "POST",
        url: "api/services/app/RepairItemR/GetRepairItemList",
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

HouserRepairMentIndex = {
    ///加载列表数据-
    Initialize: function() {
        grid = $('#houseRepairDataGrid').datagrid({
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
                    { field: "quotaNo", title: "定额号", align: "center", width: 60, sortable: true },
                    { field: "repairCate", title: "工程小类", align: "left", width: 150, sortable: true },
                    { field: "repairTypeName", title: "工程大类", align: "center", width: 50},
                    { field: "unit", title: "单位", align: "center", width: 20, sortable: true },
                    { field: "unitPriceY", title: "综合单价（有住户）（元）", align: "center", width: 60, sortable: true },
                    { field: "unitPriceN", title: "综合单价（空置房）（元）", align: "center", width: 60, sortable: true },
                 
                    {
                        title: '操作',
                        field: 'Action',
                        align: 'center',
                        width: 60,
                        formatter: function(value, row, index) {
                            var a = $("#hiddenHouserRepairMentDeleted").val() ? "<a href='#' class='easyui-oldoperate' onclick='HouserRepairMentIndex.DeleteRow(" + row.id + ")'>删除<a/>" : "";
                            var b = $("#hiddenHouserRepairMentEdit").val()?"<a href='#' class='easyui-modifyoperate' onclick='HouserRepairMentIndex.Edit(" + row.id + ")'>修改<a/>&nbsp;" : "";
                            return b + a;
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
                            HouserRepairMentIndex.Select();
                        }
                    }
                })
            });
        }
    },

    //查询
    Select: function () {
        $('#houseRepairDataGrid').datagrid('load', { input: topevery.form2Json("selectForm") }); //点击搜索
      
    },
    //新增
    Add: function () {
        var dialog = ezg.modalDialog({
            width:650,
            height:330,
            title: '工程预算单价新增',
            url: virtualDirName + "HouseRepair/HouseRepairAdd",
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
            width: 650,
            height: 330,
            title: '工程预算单价修改',
            url: virtualDirName + "HouseRepair/HouseRepairEdit?id=" + id,
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
    ///导入
    Import: function () {
        var dialog = ezg.modalDialog({
            width: 730,
            height: 430,
            title: '导入工程预结算单价管理',
            url: virtualDirName + 'HouseRepair/EngineerUnitMentImport'
        });
    },
   //   清空查询条件
    Clear: function () {
        $('#QuotaNo').textbox('setValue', '');
        $("#RepairCate").textbox('setValue','');
        $("#RepairTypeId").combobox('setValue', '');
        $('#houseRepairDataGrid').datagrid('reload');
       
    },
    //批量删除小修工程修缮项目
    DeleteHouseRepairInfo: function () {
        var arrRows = $('#houseRepairDataGrid').datagrid('getChecked');
        if (arrRows.length === 0) {
            window.top.topeveryMessage.show("请选择一条需要删除的记录!", "提示");
            return;
        }
        var ids = [];
        var url = virtualDirName + 'api/services/app/RepairItemW/DeleteRepairItemInfoAsync';
        $.each(arrRows, function () {
            ids.push(this.id);
        });
        deleteAjax(ids.join(), "houseRepairDataGrid", url);
    },
    //
    //单条删除小修工程修缮项目
    DeleteRow: function (id) {
        var url = virtualDirName + 'api/services/app/RepairItemW/DeleteRepairItemInfoAsync';
        deleteAjax(id, "houseRepairDataGrid", url);
    }
}
///初始化
$(function () {
    $(document).queue("datagrid0101", function () { HouserRepairMentIndex.Initialize();  });
    $(document).dequeue("datagrid0101");

    bindDicToDrp("RepairTypeId", "0ACFD5BD-D3DA-45CB-99B4-ED3009E08950", "");
});


