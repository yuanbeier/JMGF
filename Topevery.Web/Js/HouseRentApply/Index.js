var dialogHouseRentApply;
var grid;
var dialogModif;
function loadData(param, success, error) {
    topevery.ajax({
        type: "POST",
        url: "api/services/app/HouseRentApplyR/GetHouseRentApplyPageList",
        contentType: "application/json",
        data: topevery.extend(topevery.form2Json("HouseRentApplyFrom"), {
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
HouseRentApplyIndex = {
    ///加载列表数据-
    Initialize: function() {
        grid = $('#HouseRentApplyId').datagrid({
            height: 480,
            idField: "id",
            striped: true,
            fitColumns: true,
            fit: true,
            singleSelect: true,
            nowrap: false,
            loader: loadData,
            rownumbers: true, //行号
            pagination: true, //分页控件
            pageSize: 10,
            pageList: [10, 20, 50, 100],
            showFooter: true,
            onLoadSuccess: function(data) {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
            },
            columns: [
                [
                    { title: '编号', field: 'id', checkbox: true },
                    {
                        title: '申请日期',
                        field: 'applyTime',
                        width: '120',
                        align: 'center',
                        formatter: function(data) {
                            return topevery.dataTimeFormat(data);
                        }, sortable: true
                    },
                    { title: '状态', field: '', width: '50', align: 'center', hidden: true },
                    { title: '申请单号', field: 'applyNo', width: '150', align: 'center', sortable: true },
                    {
                        title: '合同编号', field: 'contractNo', width: '120', align: 'center', formatter: function (value, row, index) {
                            if (row.contractId !== null && row.contractId !== 0 && row.contractId !== "") {
                                return "<a href=\"#\" onmouseover=\"this.style.cssText='color:#1761a4; text-decoration:underline;'\" onmouseout=\"this.style.cssText='color:-webkit-link;text-decoration:none'\" onclick=\"objectExtend.dbClick('" + row.contractId + "');\">" + value + "</a>";
                            } else {
                                return "";
                            }
                        }, sortable: true
                    },
                    { title: '现房屋门牌', field: 'houseDoorplate', width: '120', align: 'center', sortable: true },
                    {
                        title: '房屋编号',
                        field: 'houseNo',
                        width: '120',
                        align: 'center',
                        formatter: function (value, row, index) {
                            if (value != null) {
                                return "<a href='#' onclick='objectExtend.HouseBan(" + row.houseId + ")'>" + value + "</a>";
                            }
                        }, sortable: true
                    },
                    {
                        title: '租户名称',
                        field: 'lesseeName',
                        width: '120',
                        align: 'center',
                        formatter: function (value, row, index) {
                            if (value != null) {
                                return "<a href='#' onclick='objectExtend.LesseeInfoOpen(" + row.lesseeId + ")'>" + value + "</a>";
                            }
                        }, sortable: true
                    },
                    { title: '月租金', field: 'monthMoney', width: '120', align: 'center', sortable: true },
                    { title: '交租方式', field: 'payType', width: '120', align: 'center' },
                    { title: '银行卡号', field: 'bankCardNo', width: '120', align: 'center', sortable: true }

                    //{title: '操作',field: 'Action',width: '120',align: 'center',
                    //    formatter: function (value, row, index) {
                    //        var e = '<a href="#" class="easyui-modifyoperate" onclick="HouseRentApplyIndex.editrow(' + row.id + ')">修改</a> ';
                    //        return e;
                    //    }
                    //}
                ]
            ],
            onDblClickRow: HouseRentApplyIndex.dbClick,
            toolbar: '#toolbarWrap'
        });
        for (var i = 0; i < $(".easyui-textbox").length; i++) {
            $("#" + $('.easyui-textbox').eq(i)[0].id + "").textbox({
                inputEvents: $.extend({}, $.fn.textbox.defaults.inputEvents, {
                    keyup: function(event) {
                        if (event.keyCode === 13) {
                            HouseRentApplyIndex.loadInfo80();
                        }
                    }
                })
            });
        }
    },
    ///打印
    Print: function () {
        if ($('#HouseRentApplyId').datagrid('getSelections')[0] == undefined) {
            $.messager.alert('提示', '请选择一条租赁申请记录!', 'info');
        } else {
            window.open(virtualDirName + "PrintRelevant/LeaseSheet?id=" + $('#HouseRentApplyId').datagrid('getSelections')[0].id);
        }
    },
    ///搜索
    loadInfo80: function () {
        $('#HouseRentApplyId').datagrid('load', { input: topevery.form2Json("HouseRentApplyFrom") }); //点击搜索
    },
    dbClick: function (index, data) {
        dialogHouseRentApply = ezg.modalDialog({
            width: 1205,
            height: 570,
            title: '租赁申请流程查看',
            url: virtualDirName + 'HouseRentApply/LeaseReviewDone?workFlowInstanceId=' + data.flowInstanceId + '&fromInstanceId=' + data.id
        });
    },
    ///查看
    ToView:function() {
        var id = $('#HouseRentApplyId').datagrid('getSelections')[0];
        if (id == undefined) {
            $.messager.alert('提示', '请选择一条租赁申请记录!', 'info');
        } else {
            dialogHouseRentApply = ezg.modalDialog({
                width: 1205,
                height: 620,
                title: '租赁申请查看',
                url: virtualDirName + 'HouseRentApply/LeasingView?id=' + id.id
            });
        }
    },
    editrow: function (id) {
        dialogModif = ezg.modalDialog({
            width: 1205,
            height: 570,
            title: '租赁申请修改',
            url: virtualDirName + 'HouseRentApply/LeasingModif?id=' + id,
            buttons: [
            ]
        });
    }
}
$(function () {
    /*初始化*/
    HouseRentApplyIndex.Initialize();
});