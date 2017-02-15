var grid;
DiskDataGenerated = {
    ///加载列表数据
    loadData: function (param, success, error) {
        topevery.ajax({
            type: "POST",
            url: "api/services/app/ContractR/GetHistorBlocksPayToBankDtoAsync",
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
    ///导出
    Import: function () {
        var usePropertyId = $("#UsePropertyId").combobox('getValue');
        var customerName = $("#CustomerName").textbox("getValue");
        var contractNo = $("#ContractNo").textbox('getValue');
        var houseDoorplate = $("#HouseDoorplate").textbox('getValue');
        var flag = usePropertyId + "&customerName=" + customerName + "&contractNo=" + contractNo + "&houseDoorplate=" + houseDoorplate;
        window.location.href = virtualDirName + "File/ExpHistoryBlockFile?usePropertyId=" + flag;
    },
    ///初始化列表
    Initialize: function () {
        grid = $('#HistoryDiskDataGenerated').datagrid({
            height: 480,
            idField: "id",
            striped: true,
            fitColumns: true,
            fit: true,
            singleSelect: false,
            nowrap: false,
            loader: DiskDataGenerated.loadData,
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
                    { field: "contractNo", title: "合同编号", align: "center", width: "12%" },
                    { field: "customerName", title: "客户名称", align: "center", width: "12%" },
                    { field: "payMoney", title: "欠租金额", align: "center", width: "12%" },
                    { field: "cardNo", title: "银行卡号", align: "center", width: "15%" },
                    { field: "summary", title: "摘要", align: "center", width: "25%" }
                ]
            ],
            toolbar: '#toolbarWrap'
        });
        for (var i = 0; i < $(".easyui-textbox").length; i++) {
            $("#" + $('.easyui-textbox').eq(i)[0].id + "").textbox({
                inputEvents: $.extend({}, $.fn.textbox.defaults.inputEvents, {
                    keyup: function (event) {
                        if (event.keyCode === 13) {
                            DiskDataGenerated.loadInfo();
                        }
                    }
                })
            });
        }
    },
    ///查询功能
    loadInfo: function () {
        $('#HistoryDiskDataGenerated').datagrid('load', { input: topevery.form2Json("selectForm") }); //点击搜索
    }
}
///初始化加载方法
$(function () {
    DiskDataGenerated.Initialize();
    bindDicToDrp("UsePropertyId", "28519BAC-0C61-4921-A7C1-80F3CEB80AC0", "", false, true);//使用性质
})