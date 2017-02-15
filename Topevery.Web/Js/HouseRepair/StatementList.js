var grid;
StatementList = {
    ///加载列表数据
    loadData: function(param, success, error) {
        topevery.ajax({
            type: "POST",
            url: "api/services/app/RepairTaskR/GetStatementListAsync",
            contentType: "application/json",
            data: topevery.extend(topevery.form2Json("selectForm"), {
                PageIndex: param.page,
                PageCount: param.rows,
                Order: param.order,
                Sort: param.sort
            })
        }, function(data) {
            if (data.success) {
                success(data.result);
            } else {
                error();
            }
        }, false);
    },
    ///导入
    Import:function() {
        var dialog = ezg.modalDialog({
            width: 730,
            height: 260,
            title: '导入结算单',
            url: virtualDirName + 'HouseRepair/StatementImport'
        });
    },
    ///删除
    Delete: function () {
        var arrRows = $('#EngineeringProjectTable').datagrid('getSelections');
        if (arrRows.length === 0) {
            $.messager.alert('提示', '请选择一条需要删除的记录!', 'info');
        } else {
            var ids = [];
            var url = virtualDirName + 'api/services/app/lesseeInfoW/DeleteLessInfoListAsync';
            $.each(arrRows, function () {
                ids.push(this.id);
            });
            deleteAjax(ids.join(), "EngineeringProjectTable", url);
        }
    },
    ///初始化列表
    Initialize: function() {
        grid = $('#EngineeringProjectTable').datagrid({
            height: 480,
            idField: "id",
            striped: true,
            fitColumns: true,
            fit:true,
            singleSelect: false,
            nowrap: false,
            loader: StatementList.loadData,
            rownumbers: false, //行号
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
                     { field: "taskName", title: "任务单类型", align: "center", width: "10%" },
                    { field: "repairTaskNo", title: "任务单号", align: "center", width: "10%", sortable: true },
                    { field: "houseManage", title: "区域", align: "center", width: "8%", sortable: true },
                    { field: "quotaNo", title: "定额号", align: "center", width: "6%", sortable: true },
                    { field: "repairCate", title: "工程小类", align: "center", width: "18%", sortable: true },
                    { field: "repairType", title: "工程大类", align: "center", width: "10%", sortable: true },
                    { field: "unit", title: "单位", align: "center", width: "4%", sortable: true },
                    { field: "num", title: "数量", align: "center", width: "4%", sortable: true },
                    { field: "unitPriceY", title: "单价", align: "center", width: "8%", sortable: true },
                    { field: "price", title: "综合总价（元）", align: "center", width: "10%", sortable: true },
                     {
                         field: "creationTime", title: "创建时间", align: "center", width: "10%", formatter: function (value) {
                             return topevery.dataTimeFormatTT(value);
                         }, sortable: true
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
                            StatementList.loadInfo();
                        }
                    }
                })
            });
        }
    },
    ///查询功能
    loadInfo:function() {
        $('#EngineeringProjectTable').datagrid('load', { input: topevery.form2Json("selectForm") }); //点击搜索
    }
}
///初始化加载方法
$(function() {
    StatementList.Initialize();
    bindDropDown("HouseManageId", "Common/GetWorkstationBind", "--工作站--");
})