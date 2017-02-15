var grid;
ExportRentInfoForLottery = {
    ///加载列表数据
    loadData: function (param, success, error) {
        topevery.ajax({
            type: "POST",
            url: "api/services/app/RepairTaskR/GetStatementListAsync",
            contentType: "application/json",
            data: topevery.extend(topevery.form2Json("selectForm"), {
                PageIndex: param.page,
                PageCount: param.rows
            })
        }, function (data) {
            if (data.success) {
                success(data.result);
            } else {
                error();
            }
        }, false);
    },
    ///导入
    Import: function () {
        var dialog = ezg.modalDialog({
            width: 730,
            height: 550,
            title: '导入实物配租登记表',
            url: virtualDirName + 'ContractMent/ExportRentInfoForLotteryOpen'
        });
    },
    ///删除
    Delete: function () {
        var arrRows = $('#ExportRentInfoForLotteryTable').datagrid('getSelections');
        if (arrRows.length === 0) {
            $.messager.alert('提示', '请选择一条需要删除的记录!', 'info');
        } else {
            var ids = [];
            var url = virtualDirName + 'api/services/app/lesseeInfoW/DeleteLessInfoListAsync';
            $.each(arrRows, function () {
                ids.push(this.id);
            });
            deleteAjax(ids.join(), "ExportRentInfoForLotteryTable", url);
        }
    },
    ///初始化列表
    Initialize: function () {
        grid = $('#ExportRentInfoForLotteryTable').datagrid({
            height: 480,
            idField: "id",
            striped: true,
            fitColumns: true,
            fit: true,
            singleSelect: false,
            nowrap: false,
            loader: ExportRentInfoForLottery.loadData,
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
                    { field: "repairTaskNo", title: "任务单号", align: "center", width: "10%" },
                    { field: "houseManage", title: "区域", align: "center", width: "10%" },
                    { field: "quotaNo", title: "定额号", align: "center", width: "10%" },
                    { field: "repairCate", title: "工程小类", align: "center", width: "18%" },
                    { field: "repairType", title: "工程大类", align: "center", width: "10%" },
                    { field: "unit", title: "单位", align: "center", width: "5%" },
                    { field: "num", title: "数量", align: "center", width: "5%" },
                    { field: "price", title: "单价", align: "center", width: "10%" },
                    { field: "unitPriceY", title: "综合总价（元）", align: "center", width: "10%" },
                     {
                         field: "creationTime", title: "创建时间", align: "center", width: "10%", formatter: function (value) {
                             return topevery.dataTimeFormatTT(value);
                         }
                     }
                ]
            ],
            toolbar: '#toolbarWrap'
        });
    },
    ///查询功能
    loadInfo: function () {
        $('#ExportRentInfoForLotteryTable').datagrid('load', { input: topevery.form2Json("selectForm") }); //点击搜索
    }
}
///初始化加载方法
$(function () {
    ExportRentInfoForLottery.Initialize();
    bindDropDown("HouseManageId", "Common/GetWorkstationBind", "--工作站--");
})