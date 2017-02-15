//将表单数据转为json
var dialogHouseRentApply;
var grid;
var dialog10;
var tenantTypelist;
function loadData(param, success, error) {
    topevery.ajax({
        type: "POST",
        url: "api/services/app/RentRemissionApplyR/GetRentRemissionApplyListAsync",
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
};
RentReduction = {
    ///加载列表数据-
    Initialize: function () {
        grid = $('#RentReductionTable').datagrid({
            height: 480,
            idField: "id",
            striped: true,
            fitColumns: true,
            fit:true,
            singleSelect: true,
            nowrap: false,
            loader: loadData,
            rownumbers: true, //行号
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
                    { field: "applyNo", title: "申请单号", align: "center", width: 140, sortable: true },
                    {
                        title: '申请日期',
                        field: 'applyTime',
                        width: '120',
                        align: 'center',
                        formatter: function(data) {
                            return topevery.dataTimeFormat(data);
                        }, sortable: true
                    },
                    {
                        field: "contractNo", title: "合同编号", align: "center", width: 120, formatter: function (value, row, index) {
                            if (value != null) {
                                return "<a href='#' onclick='objectExtend.dbClick(" + row.contractId + ")'>" + value + "</a>";
                            }
                        }, sortable: true
                    },
                    {
                        field: "lesseeName", title: "申请人姓名", align: "center", width: 90, formatter: function (value, row, index) {
                            if (value != null) {
                                return "<a href='#' onclick='objectExtend.LesseeInfoOpen(" + row.lesseeId + ")'>" + value + "</a>";
                            }
                        }, sortable: true
                    },
                    {
                        field: "houseDoorplate", title: "现房屋门牌", align: "center", width: 120, formatter: function (value, row, index) {
                            if(value!=null){
                                return "<a href='#' onclick='objectExtend.HouseBan(" + row.houseId + ")'>" + value + "</a>";
                            }
                        }, sortable: true
                    },
                    { field: "holder", title: "持优惠证人", align: "center", width: 90, sortable: true },
                    { field: "relationship", title: "与承租人关系", align: "center", width: 90 },
                    { field: "certName", title: "证件名称", align: "center", width: 90 },
                    { field: "certNo", title: "证件号码", align: "center", width: 120, sortable: true },
                    {
                        field: "validityStartTime",
                        title: "证件有效期起",
                        align: "center",
                        width: 120,
                        formatter: function(value) {
                            return topevery.dataTimeFormat(value);
                        }, sortable: true
                    },
                    {
                        field: "validityEndTime",
                        title: "证件有效期止",
                        align: "center",
                        width: 120,
                        formatter: function(value) {
                            return topevery.dataTimeFormat(value);
                        }, sortable: true
                    }
                ]
            ],
            onDblClickRow: RentReduction.dbClick,
            toolbar: '#toolbarWrap'
        });
        for (var i = 0; i < $(".easyui-textbox").length; i++) {
            $("#" + $('.easyui-textbox').eq(i)[0].id + "").textbox({
                inputEvents: $.extend({}, $.fn.textbox.defaults.inputEvents, {
                    keyup: function (event) {
                        if (event.keyCode === 13) {
                            RentReduction.loadInfo80();
                        }
                    }
                })
            });
        };
        $(document).dequeue("datagrid0102");
    },
    ///搜索
    loadInfo80: function () {
        $('#RentReductionTable').datagrid('load', { input: topevery.form2Json("selectForm") }); //点击搜索
    },
    ToView: function () {
        var id = $('#RentReductionTable').datagrid('getSelections')[0];
        if (id == undefined) {
            $.messager.alert('提示', '请选择一条租金减免申请记录!', 'info');
        } else {
            dialogHouseRentApply = ezg.modalDialog({
                width: 1205,
                height: 510,
                title: '租金减免申请查看',
                url: virtualDirName + 'ContractMent/RentReductionApplicationToView?id=' + id.id
            });
        }
    },
    dbClick: function (index, data) {
       var  dialog = ezg.modalDialog({
            width: 1205,
            height: 500,
            title: '租金减免流程查看',
            url: virtualDirName + 'ContractMent/RentReductionToView?workFlowInstanceId=' + data.flowInstanceId + '&fromInstanceId=' + data.id
        });
    },
    print:function() {
        if ($('#RentReductionTable').datagrid('getSelections')[0] == undefined) {
            $.messager.alert('提示', '请选择一条租金减免申请记录!', 'info');
        } else {
            window.open(virtualDirName + "PrintRelevant/RentReliefSheet?id=" + $('#RentReductionTable').datagrid('getSelections')[0].id);
        }
    }
}
///初始化
$(function () {
    $(document).queue("datagrid0101", function () { RentReduction.Initialize(); });
    $(document).dequeue("datagrid0101");
});
