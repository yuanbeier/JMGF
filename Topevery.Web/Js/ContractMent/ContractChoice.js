var dialog6;
var dialog5;

var ContractIndex = {
    ///初始化列表数据
    Initialize: function () {
        $("#contractDataGrid").datagrid({
            columns: [
                [
                    {
                        field: "contractNo", title: "合同编号", width: 100, align: "center",
                        formatter: function(value, row, index) {
                            return "<a href='#' onclick='HouseBanIndex.Show(" + row.id + ")'>" + value + "</a>";
                        }
                    },
                    { field: "houseDoorplate", title: "现房屋门牌", width: 100, align: "center" },
                    { field: "rentRange", title: "租用范围", width: 100, align: "center" },
                    { field: "name", title: "承租人", width: 60, align: "center" },
                    { field: "rentMargin", title: "保证金金额", width: 70, align: "center" },
                    { field: "baseRent", title: "租金基数", width: 60, align: "center" },
                    {
                        field: "rentStartTime", title: "租赁期限起", width: 80, align: "center",
                        formatter: function (value) {
                            return topevery.dataTimeFormat(value);
                        }
                    },
                    {
                        field: "rentEndTime", title: "租赁期限止", width: 80, align: "center",
                        formatter: function (value) {
                            return topevery.dataTimeFormat(value);
                        }
                    },
                    { field: "reduceMoney", title: "减免金额", width: 60, align: "center" },
                    { field: "monthMoney", title: "月租金", width: 100, align: "center" },
                    {
                        field: "reduceStartTime", title: "减免日期起", width: 80, align: "center",
                        formatter: function (value) {
                            return topevery.dataTimeFormat(value);
                        }
                    },
                    {
                        field: "reduceEndTime", title: "减免日期止", width: 80, align: "center",
                        formatter: function (value) {
                            return topevery.dataTimeFormat(value);
                        }
                    },
                    { field: "bankCardNo", title: "银行帐号", width: 80, align: "center" }
                ]
            ],
            height: 370,
            idField: "id",
            striped: true,
            fitColumns: true,
            nowrap: false,
            rownumbers: true,
            pagination: true,
            showFooter: true,
            toolbar: "#toolbar",
            onLoadSuccess: function (data) {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
                $(this).datagrid("clearSelections").datagrid("clearChecked");
            },
            loader: function (param, success, error) {
                topevery.ajax({
                    type: "POST",
                    url: "api/services/app/ContractR/GetConteactReduction",
                    contentType: "application/json",
                    data: topevery.extend(topevery.form2Json("selectForm"), {
                        PageIndex: param.page,
                        PageCount: param.rows,
                        QueryType:4
                    })
                }, function (data) {
                    if (data.success) {
                        success(data.result);
                    } else {
                        error();
                    }
                }, false);
            },
            //onLoadSuccess: function () {
            //    $(this).datagrid("clearSelections").datagrid("clearChecked");
            //},
            onDblClickRow: ContractIndex.dbClick
        });
        for (var i = 0; i < $(".easyui-textbox").length; i++) {
            $("#" + $('.easyui-textbox').eq(i)[0].id + "").textbox({
                inputEvents: $.extend({}, $.fn.textbox.defaults.inputEvents, {
                    keyup: function (event) {
                        if (event.keyCode === 13) {
                            ContractIndex.Select();
                        }
                    }
                })
            });
        };
    },
    Reset: function () {
        $("#selectForm").form("reset");
        $("#contractDataGrid").datagrid("reload");
    },
    Select: function () {
        $("#contractDataGrid").datagrid("reload");
    },
    dbClick: function (index, rows) {
        frameHelper.getDialogParentIframe().SaveHouse(rows);
        frameHelper.getDialogParentIframe().dialogChoose.dialog('close');
    }
}
///初始化
$(function () {
    ContractIndex.Initialize();
});