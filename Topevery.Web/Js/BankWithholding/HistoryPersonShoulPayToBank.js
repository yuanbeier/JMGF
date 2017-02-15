var grid;
var dialog;
HistoryPersonShoulPayToBank = {
    ///加载列表数据
    loadData: function (param, success, error) {
        topevery.ajax({
            type: "POST",
            url: "api/services/app/BankCheckingFileR/GetBankCheckingDetailsListByFileIdAsync",
            contentType: "application/json",
            data: topevery.extend(topevery.form2Json("selectForm"), {
                PageIndex: param.page,
                PageCount: param.rows,
                JurisdictUnitType: 2
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
        var length = $('#HistoryPersonShoulPayToBank').datagrid('getRows').length;
        if (length > 0) {
            window.top.topeveryMessage.show("请先更新或删除导入数据在进行更新！");
        } else {
            dialog = ezg.modalDialog({
                width: 470,
                height: 225,
                title: '导入历史街区银行代扣数据',
                url: virtualDirName + 'BankWithholding/HistoryPersonShoulPayToBankImport'
            });
        }
    },
    ///更新导入数据
    Update: function () {
        var length = $('#HistoryPersonShoulPayToBank').datagrid('getRows').length;
        if (length > 0) {
            topevery.ajax({
                type: "POST",
                url: "api/services/app/BankCheckingFileW/UpdateBankChekingDetailsAsync",
                data: topevery.extend({ JurisdictUnitType: 2 }),
                contentType: "application/json"
            }, function (data) {
                if (data.success) {
                    HistoryPersonShoulPayToBank.loadInfo();
                    window.top.topeveryMessage.show("更新成功！");
                } else {
                    error();
                }
            }, true);
        } else {
            window.top.topeveryMessage.show("请选择数据在进行更新！");
        }
    },
    ///删除导入数据
    Delete: function () {
        var length = $('#HistoryPersonShoulPayToBank').datagrid('getRows').length;
        if (length > 0) {
            topeveryMessage.confirm(function(r) {
                if (r) {
                    topevery.ajax({
                        type: "POST",
                        url: "api/services/app/BankCheckingFileW/DeleteBankCheckingDetailsAsync",
                        data: topevery.extend({ JurisdictUnitType: 2 }),
                        contentType: "application/json"
                    }, function(data) {
                        if (data.success) {
                            HistoryPersonShoulPayToBank.loadInfo();
                            window.top.topeveryMessage.show("删除成功！");
                        } else {
                            error();
                        }
                    }, true);
                }
            });
        }
    },
    ///初始化列表
    Initialize: function () {
        grid = $('#HistoryPersonShoulPayToBank').datagrid({
            height: 480,
            idField: "id",
            striped: true,
            fitColumns: true,
            fit: true,
            singleSelect: false,
            nowrap: false,
            loader: HistoryPersonShoulPayToBank.loadData,
            rownumbers: false, //行号
            pagination: true, //分页控件
            pageSize: 100,
            pageList: [100, 1000, 10000, 20000],
            showFooter: true,
            onLoadSuccess: function(data) {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
            },
            columns: [
                [
                    { field: "contractNo", title: "合同编号", align: "center", width: "12%" },
                    { field: "cardNo", title: "银行账号", align: "center", width: "15%" },
                    { field: "customerName", title: "客户名称", align: "center", width: "10%" },
                    { field: "sameMonNetReceipt", title: "实收租金", align: "center", width: "10%" },
                    {
                        field: "isSuccess",
                        title: "是否交款成功",
                        align: "center",
                        width: "10%",
                        formatter: function(value) {
                            if (value) {
                                return "是";
                            } else {
                                return "否";
                            }
                        }
                    },
                    {
                        field: "isUpdate",
                        title: "是否更新额金",
                        align: "center",
                        width: "15%",
                        formatter: function(value) {
                            if (value) {
                                return "是";
                            } else {
                                return "否";
                            }
                        }
                    },
                    { field: "message", title: "失败原因", align: "center", width: "25%" }
                ]
            ],
            toolbar: '#toolbarWrap'
        });
        for (var i = 0; i < $(".easyui-textbox").length; i++) {
            $("#" + $('.easyui-textbox').eq(i)[0].id + "").textbox({
                inputEvents: $.extend({}, $.fn.textbox.defaults.inputEvents, {
                    keyup: function (event) {
                        if (event.keyCode === 13) {
                            HistoryPersonShoulPayToBank.loadInfo();
                        }
                    }
                })
            });
        }
    },
    ///查询功能
    loadInfo: function () {
        $('#HistoryPersonShoulPayToBank').datagrid('load', { input: topevery.form2Json("selectForm") }); //点击搜索
    }
}
///初始化加载方法
$(function () {
    HistoryPersonShoulPayToBank.Initialize();
    //bindDicToDrp("UsePropertyId", "28519BAC-0C61-4921-A7C1-80F3CEB80AC0", "", false);//使用性质
})