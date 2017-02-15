var grid;
DiskDataGenerated = {
    ///加载列表数据
    loadData: function (param, success, error) {
        topevery.ajax({
            type: "POST",
            url: "api/services/app/ContractR/GetPersonShouldPayToBankDtoAsync",
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
        var isResidential = $("#UsePropertyId").combobox('getValue');
        var customerName = $("#CustomerName").textbox('getValue');
        var contractNo = $("#ContractNo").textbox('getValue');
        var houseDoorplate = $("#HouseDoorplate").textbox('getValue');
        var dialog = ezg.modalDialog({
            width: 350,
            height: 170,
            title: '下载磁盘数据',
            url: virtualDirName + 'BankWithholding/BankWithholImport?UsePropertyId=' + isResidential + "&customerName=" + customerName + "&contractNo=" + contractNo + "&houseDoorplate=" + houseDoorplate
        });
    },
    ///初始化列表
    Initialize: function() {
        grid = $('#DiskDataGeneratedTable').datagrid({
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
                    { field: "year", title: "年", align: "center", width: "5%" },
                    { field: "month", title: "月", align: "center", width: "5%" },
                    { field: "space", title: "合同编号", align: "center", width: "8%" },
                    { field: "customerName", title: "客户名称", align: "center", width: "6%" },
                    { field: "houseDoorplate", title: "房屋门牌号", align: "center", width: "8%" },
                    { field: "usePropertName", title: "使用性质", align: "center", width: "8%" },
                    { field: "customerCard", title: "客户身份证", align: "center", width: "15%" },
                    { field: "payMoney", title: "欠租金额", align: "center", width: "7%" },
                    { field: "recordFlag", title: "记录标志", align: "center", width: "5%" },
                    { field: "businessNo", title: "代理业务编号", align: "center", width: "7%" },
                    { field: "businessKind", title: "代理业务种类", align: "center", width: "7%" },
                    { field: "cardNo", title: "银行卡号", align: "center", width: "13%" },
                    //{ field: "cardFlag", title: "账号使用标志", align: "center", width: "8%" },
                    { field: "SerialNumber", title: "顺序号", align: "center", width: "5%", hidden: true },
                    { field: "payCount", title: "应付笔数", align: "center", width: "13%" },
                    { field: "borrowingFlag", title: "借贷标志", align: "center", width: "8%" }
                    //{ field: "fill", title: "填充字段", align: "center", width: "10%" },
                    //{ field: "summary", title: "摘要", align: "center", width: "10%" }
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
        $('#DiskDataGeneratedTable').datagrid('load', { input: topevery.form2Json("selectForm") }); //点击搜索
    }
}
///初始化加载方法
$(function () {
    DiskDataGenerated.Initialize();
    bindDicToDrp("UsePropertyId", "28519BAC-0C61-4921-A7C1-80F3CEB80AC0", "", false, true);//使用性质
})