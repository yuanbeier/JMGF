//将表单数据转为json
var gridTodo;
function loadData(param, success, error) {
    topevery.ajax({
        type: "POST",
        url: "api/services/app/ContractR/GetRentMarginList",
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
    }, true);
};

MarginManagementListTable = {
    ///加载列表数据-
    Initialize: function() {
        gridTodo = $('#MarginManagementListTable').datagrid({
            height: 480,
            idField: "id",
            striped: true,
            fitColumns: true,
            fit: true,
            loadMsg: false,
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
                    { title: '是否已退', field: 'isReturnMarginName', width: '6%', align: 'center' },
                    {
                        title: '已退日期',
                        field: 'rentMarginTime',
                        width: '8%',
                        align: 'center',
                        formatter: function(value) {
                            return topevery.dataTimeFormat(value);
                        }, sortable: true
                    },
                    {
                        title: '合同编号',
                        field: 'contractNo',
                        width: '10%',
                        align: 'center',
                        formatter: function(value, row, index) {
                            return "<a href='#' onclick='objectExtend.dbClick(" + row.id + ")'>" + value + "</a>";
                        }, sortable: true
                    },
                    {
                        title: '房屋编号',
                        field: 'houseNo',
                        width: '6%',
                        align: 'center',
                        formatter: function(value, row, index) {
                            if (row.houseId !== 0) {
                                return "<a href='#' onclick='objectExtend.HouseBan(" + row.houseId + ")'>" + value + "</a>";
                            } else {
                                return "";
                            }
                        }, sortable: true
                    },
                    { title: '现房屋门牌', field: 'houseDoorplate', width: '10%', align: 'center', sortable: true },
                    { title: '租用范围', field: 'rentRange', width: '10%', align: 'center', sortable: true },
                    {
                        title: '承租人',
                        field: 'lesseeName',
                        width: '6%',
                        align: 'center',
                        formatter: function(value, row, index) {
                            if (row.lesseeId !== 0) {
                                return "<a href='#' onclick='objectExtend.LesseeInfoOpen(" + row.lesseeId + ")'>" + value + "</a>";
                            } else {
                                return "";
                            }
                        }, sortable: true
                    },
                    {
                        title: '签订日期',
                        field: 'signDate',
                        width: '8%',
                        align: 'center',
                        formatter: function(value) {
                            return topevery.dataTimeFormat(value);
                        }, sortable: true
                    },
                    { title: '保证金', field: 'rentMargin', width: '6%', align: 'center', sortable: true },
                    { title: '租金基数', field: 'baseRent', width: '6%', align: 'center', sortable: true },
                    {
                        title: '租赁期限起',
                        field: 'rentStartTime',
                        width: '8%',
                        align: 'center',
                        formatter: function(value) {
                            return topevery.dataTimeFormat(value);
                        }, sortable: true
                    },
                    {
                        title: '租赁期限止',
                        field: 'rentEndTime',
                        width: '8%',
                        align: 'center',
                        formatter: function(value) {
                            return topevery.dataTimeFormat(value);
                        }, sortable: true
                    },
                    { title: '减免项目', field: 'reduceName', width: '10%', align: 'center' },
                    { title: '减免金额', field: 'reduceMoney', width: '6%', align: 'center', sortable: true },
                    //{ title: '证件名称', field: 'certName', width: '6%', align: 'center' },
                    //{ title: '证件号码', field: 'certNo', width: '10%', align: 'center' },
                    //{ title: '工作单位', field: 'workUnits', width: '6%', align: 'center' },
                    //{ title: '联系地址', field: 'contactAddress', width: '10%', align: 'center' },
                    //{ title: '联系电话', field: 'contactNumber', width: '10%', align: 'center' },
                    { title: '交租方式', field: 'payName', width: '6%', align: 'center', sortable: true },
                    { title: '银行帐号', field: 'bankCardNo', width: '10%', align: 'center', sortable: true },
                    
                ]
            ],
            toolbar: '#toolbarWrap'
        });
        for (var i = 0; i < $(".easyui-textbox").length; i++) {
            $("#" + $('.easyui-textbox').eq(i)[0].id + "").textbox({
                inputEvents: $.extend({}, $.fn.textbox.defaults.inputEvents, {
                    keyup: function (event) {
                        if (event.keyCode === 13) {
                            MarginManagementListTable.Select();
                        }
                    }
                })
            });
        }
    },
    Select:function() {
        $('#MarginManagementListTable').datagrid('load', { input: topevery.form2Json("selectForm") }); //点击搜索
    }
}
$(function() {
    MarginManagementListTable.Initialize();
})