var grid;
ExportRentInfoForLotteryOpen = {
    ///加载列表数据
    loadData: function (param, success, error) {
        topevery.ajax({
            type: "POST",
            url: "api/services/app/ContractR/GetYaohaoRoomImpRecordAsync",
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
    },
    ///导入
    YaohaoImport: function () {
        var dialog = ezg.modalDialog({
            width: 570,
            height: 220,
            title: '导入摇号房屋信息',
            url: virtualDirName + 'ContractMent/ImpYaoHaoInfo'
        });
    },
    ///初始化列表
    Initialize: function () {
        grid = $('#EngineeringProjectTable').datagrid({
            height: 480,
            idField: "id",
            striped: true,
            fitColumns: true,
            fit: true,
            singleSelect: false,
            nowrap: false,
            loader: ExportRentInfoForLotteryOpen.loadData,
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
                    //{ field: "id", checkbox: true },
                    { field: "contractNo", title: "合同编号", align: "center", width: "8%" },
                    { field: "name", title: "承租人名", align: "center", width: "8%", sortable: true },
                    { field: "houseDoorplate", title: "现房屋门牌", align: "center", width: "10%", sortable: true },
                    { field: "streetName", title: "街道名称", align: "center", width: "8%", sortable: true },
                    { field: "rentRange", title: "租用范围", align: "center", width: "11%", sortable: true },
                    { field: "buildArea", title: "建筑面积", align: "center", width: "7%", sortable: true },
                    { field: "monthMoney", title: "月租金", align: "center", width: "7%", sortable: true },
                    { field: "rentMargin", title: "保证金", align: "center", width: "7%", sortable: true },
                    {
                        field: "rentStartTime", title: "租赁期限起", align: "center", width: "8%", sortable: true,
                        formatter: function (value) {
                            return topevery.dataTimeFormat(value);
                        }
                    },
                    {
                        field: "rentEndTime", title: "租赁期限止", align: "center", width: "8%", sortable: true,
                        formatter: function (value) {
                            return topevery.dataTimeFormat(value);
                        }
                    },
                    { field: "createUserName", title: "创建人", align: "center", width: "8%", sortable: true },
                    {
                        field: "creationTime",
                        title: "导入日期",
                        align: "center",
                        width: "10%",
                        formatter: function(value) {
                            return topevery.dataTimeFormat(value);
                        },
                        sortable: true
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
                            ExportRentInfoForLotteryOpen.loadInfo();
                        }
                    }
                })
            });
        }
    },
    ///查询功能
    loadInfo: function () {
        $('#EngineeringProjectTable').datagrid('load', { input: topevery.form2Json("selectForm") }); //点击搜索
    }
}
///初始化加载方法
$(function() {
    ExportRentInfoForLotteryOpen.Initialize();
    //bindDropDown("HouseManageId", "Common/GetWorkstationBind", "--工作站--");
});