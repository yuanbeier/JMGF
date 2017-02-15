//将表单数据转为json
var grid;
var tenantTypelist;
var dialogHouseRentApply;
function loadData(param, success, error) {
    topevery.ajax({
        type: "POST",
        url: "api/services/app/RefundMarginApplyR/GetRefundMarginManageListAsync",
        contentType: "application/json",
        data: topevery.extend(topevery.form2Json("selectFrom"), {
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

SecurityManagementIndex = {
    ///加载列表数据-
    Initialize: function () {
        grid = $('#SecurityManagementTable').datagrid({
            height: 580,
            idField: "id",
            striped: true,
            fitColumns: true,
            fit:true,
            singleSelect: true,
            checkOnSelect: true,
            nowrap: false,
            rownumbers: true, //行号
            pagination: true, //分页控件
            pageSize: 10,
            pageList: [10, 20, 50, 100],
            showFooter: true,
            loader: loadData,
            onLoadSuccess: function() {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
            },
            columns: [
                [
                    { width: '8%', checkbox: true, field: 'id' },
                    { width: '10%', title: '申请单号', field: 'applyNo', align: 'center', sortable: true },
                    { title: '申请日期', field: 'applyTime', width: '9%', align: 'center', formatter: function (data) { return topevery.dataTimeFormat(data); }, sortable: true },
                    {
                        width: '10%', title: '合同编号', field: 'contractNo', align: 'center', formatter: function (value, row, index) {
                            if (value != null) {
                                return "<a href='#' onclick='objectExtend.dbClick(" + row.contractId + ")'>" + value + "</a>";
                            }
                        }, sortable: true
                    },
                    {
                        width: '8%', title: '房屋编号', field: 'houseNo', align: 'center', formatter: function (value, row, index) {
                            if (value != null) {
                                return "<a href='#' onclick='objectExtend.HouseBan(" + row.houseId + ")'>" + value + "</a>";
                            }
                        }, sortable: true
                    },
                    { width: '7%', title: '单元名称', field: 'unitName', align: 'center', sortable: true },
                    { width: '13%', title: '租用地址', field: 'houseDoorplate', align: 'center', sortable: true },
                    {
                        width: '7%', title: '租户名称', field: 'name', align: 'center', formatter: function (value, row, index) {
                            if (value != null) {
                                return "<a href='#' onclick='objectExtend.LesseeInfoOpen(" + row.lesseeId + ")'>" + value + "</a>";
                            }
                        }, sortable: true
                    },
                    { width: '8%', title: '委办人姓名', field: 'agentName', align: 'center', sortable: true },
                    { width: '7%', title: '申请金额', field: 'refundMoney', align: 'center', sortable: true },
                    { width: '16%', title: '申请内容', field: 'applyContent', align: 'center', sortable: true }
                ]
            ],
            toolbar: '#toolbarWrap',
            onDblClickRow: SecurityManagementIndex.dbClick
        });
        for (var i = 0; i < $(".easyui-textbox").length; i++) {
            $("#" + $('.easyui-textbox').eq(i)[0].id + "").textbox({
                inputEvents: $.extend({}, $.fn.textbox.defaults.inputEvents, {
                    keyup: function (event) {
                        if (event.keyCode === 13) {
                            SecurityManagementIndex.loadInfo();
                        }
                    }
                })
            });
        }
    },
    ToView: function () {
        var id = $('#SecurityManagementTable').datagrid('getSelections')[0];
        if (id == undefined) {
            $.messager.alert('提示', '请选择一条退保证金申请记录!', 'info');
        } else {
            dialogHouseRentApply = ezg.modalDialog({
                width: 1205,
                height: 320,
                title: '退保证金申请查看',
                url: virtualDirName + 'DepositRefund/SecurityToView?id=' + id.id
            });
        }
    },
    dbClick: function (index, data) {
        dialogHouseRentApply = ezg.modalDialog({
            width: 1205,
            height: 480,
            title: '退保证金查看',
            url: virtualDirName + 'DepositRefund/SecurityApplyToView?workFlowInstanceId=' + data.flowInstanceId + '&fromInstanceId=' + data.id
        });
    },
    print:function() {
        if ($('#SecurityManagementTable').datagrid('getSelections')[0] == undefined) {
            $.messager.alert('提示', '请选择一条退保证金申请记录!', 'info');
        } else {
            window.open(virtualDirName + "PrintRelevant/DepositBackSheet?id=" + $('#SecurityManagementTable').datagrid('getSelections')[0].id);
        }
    },
    ///搜索
    loadInfo: function () {
        $('#SecurityManagementTable').datagrid('load', { input: topevery.form2Json("selectFrom") }); //点击搜索
    }
}
///初始化
$(function () {
    $(document).queue("datagrid0101", function () { SecurityManagementIndex.Initialize();  });
    $(document).dequeue("datagrid0101");
});
