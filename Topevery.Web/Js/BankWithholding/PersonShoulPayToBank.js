var grid;
var dialog;
PersonShoulPayToBank = {
    ///加载列表数据
    loadData: function (param, success, error) {
        topevery.ajax({
            type: "POST",
            url: "api/services/app/BankCheckingFileR/GetBankCheckingDetailsListByFileIdAsync",
            contentType: "application/json",
            data: topevery.extend(topevery.form2Json("selectForm"), {
                PageIndex: param.page,
                PageCount: param.rows
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
    Import: function () {
        var length = $('#PersonShoulPayToBankTable').datagrid('getRows').length;
        if (length > 0) {
            window.top.topeveryMessage.show("请先更新或删除导入数据在进行更新！");
        } else {
            dialog = ezg.modalDialog({
                width: 450,
                height: 225,
                title: '导入数据',
                url: virtualDirName + 'BankWithholding/PersonShoulPayToBankImport'
            });
        }
    },
    ///更新导入数据
    Update: function() {
        var length = $('#PersonShoulPayToBankTable').datagrid('getRows').length;
        if (length > 0) {
            topevery.ajax({
                type: "POST",
                url: "api/services/app/BankCheckingFileW/UpdateBankChekingDetailsAsync",
                contentType: "application/json",
                data: JSON.stringify({ jurisdictUnitType:1})
            }, function(data) {
                if (data.success) {
                    PersonShoulPayToBank.loadInfo();
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
        var length = $('#PersonShoulPayToBankTable').datagrid('getRows').length;
        if (length > 0) {
            topeveryMessage.confirm(function(r) {
                if (r) {
                    topevery.ajax({
                        type: "POST",
                        url: "api/services/app/BankCheckingFileW/DeleteBankCheckingDetailsAsync",
                        contentType: "application/json",
                        data: JSON.stringify({jurisdictUnitType:1})
                    }, function(data) {
                        if (data.success) {
                            PersonShoulPayToBank.loadInfo();
                            window.top.topeveryMessage.show("删除成功！");
                        } else {
                            error();
                        }
                    }, true);
                }
            },"提示","确认删除所有数据？");
        }
    },
    ///初始化列表
    Initialize: function () {
        grid = $('#PersonShoulPayToBankTable').datagrid({
            height: 480,
            idField: "id",
            striped: true,
            fitColumns: true,
            fit: true,
            singleSelect: false,
            nowrap: false,
            loader: PersonShoulPayToBank.loadData,
            rownumbers: false, //行号
            pagination: true, //分页控件
            pageSize: 100,
            pageList: [100, 1000, 10000, 20000],
            showFooter: true,
            onLoadSuccess: function (data) {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
            },
            columns: [
                [
                    { field: "bankCheckingFileId", title: "对账文件Id", align: "center", width: "10%", hidden: true },
                    { field: "contractNo", title: "合同编号", align: "center", width: "12%" },
                    { field: "payableRent", title: "应收租金", align: "center", width: "10%" },
                      { field: "sameMonNetReceipt", title: "实收租金", align: "center", width: "7%" },
                    { field: "houseManageName", title: "房管所名称", align: "center", width: "5%",hidden: true},
                    {
                        field: "isSuccess", title: "是否交款成功", align: "center", width: "10%",
                        formatter: function (value) {
                            if (value==null) {
                                return "";
                            } else if (value) {
                                return "是";
                            } else {
                                return "否";
                            }
                        }
                    },
                    {
                        field: "isUpdate", title: "是否更新额金", align: "center", width: "10%",
                        formatter: function (value) {
                            if (value == null) {
                                return "";
                            } else if (value) {
                                return "是";
                            } else {
                                return "否";
                            }
                        }
                    },
                    { field: "cardNo", title: "银行账号", align: "center", width: "18%" },
                    //{ field: "cardFlag", title: "账号使用标志", align: "center", width: "8%" },
                    { field: "customerName", title: "客户名称", align: "center", width: "10%" },
                    { field: "message", title: "失败原因", align: "center", width: "18%" }
                ]
            ],
            toolbar: '#toolbarWrap'
        });
        for (var i = 0; i < $(".easyui-textbox").length; i++) {
            $("#" + $('.easyui-textbox').eq(i)[0].id + "").textbox({
                inputEvents: $.extend({}, $.fn.textbox.defaults.inputEvents, {
                    keyup: function (event) {
                        if (event.keyCode === 13) {
                            PersonShoulPayToBank.loadInfo();
                        }
                    }
                })
            });
        }
    },
    ///查询功能
    loadInfo: function () {
        $('#PersonShoulPayToBankTable').datagrid('load', { input: topevery.form2Json("selectForm") }); //点击搜索
    }
}
///初始化加载方法
$(function () {
    PersonShoulPayToBank.Initialize();
    bindDicToDrp("UsePropertyId", "28519BAC-0C61-4921-A7C1-80F3CEB80AC0", "", false);//使用性质
})