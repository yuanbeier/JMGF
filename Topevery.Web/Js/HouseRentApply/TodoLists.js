//将表单数据转为json
var gridTodo;
var dialog4;
var dialog5;

function loadData(param, success, error) {
    topevery.ajax({
        type: "POST",
        url: "api/services/app/HouseBanR/GetTodoHandlesAsync",
        contentType: "application/json",
        data: topevery.extend(topevery.form2Json("selectFrom"), {
            PageIndex: param.page,
            PageCount: param.rows,
            Order: param.order,
            Sort: param.sort,
            FromInstanceType: $("#FromInstanceName").combobox('getText')
        })
    }, function(data) {
        if (data.success) {
            success(data.result);
        } else {
            error();
        }
    }, true);
};
TodoListsIndex = {
    ///加载列表数据-
    Initialize: function() {
        gridTodo = $('#TodoListsTable').datagrid({
            height: 500,
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
            pageSize: 20,
            pageList: [10, 20, 50, 100],
            showFooter: true,
            remotesort: true,
            onLoadSuccess: function(data) {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
            },
            columns: [
                [
                    { title: '环节实例Id', field: 'actInstanceId', width: '0', align: 'center', hidden: true },
                    { title: '业务实例Id', field: 'fromInstanceId', width: '0', align: 'center', hidden: true },
                    {
                        title: '状态',
                        field: 'lightType',
                        width: '5%',
                        align: 'center',
                        formatter: function(value) {
                            var html = "";
                            if (value === 10) {
                                html = "<a class=\"bulb-sign bulb-sign-orange bulb-sign-green\"/></a>";
                            }
                            if (value === 20) {
                                html = "<a class=\"bulb-sign bulb-sign-orange bulb-sign-orange\"/></a>";
                            }
                            if (value === 30) {
                                html = "<a class=\"bulb-sign bulb-sign-orange bulb-sign-red\"/></a>";
                            }
                            return html;
                        }, sortable: true
                    },
                    { title: '流程定义Id', field: 'workFlowId', width: '0', align: 'center', hidden: true },
                    { title: '流程实例Id', field: 'workFlowInstanceId', width: '0', align: 'center', hidden: true },
                    {
                        title: '申请单号',
                        field: 'applyNo',
                        width: '12%',
                        align: 'center',
                        formatter: function(value, index, row) {
                            return "<a href=\"#\" onmouseover=\"this.style.cssText='color:#1761a4; text-decoration:underline;'\" onmouseout=\"this.style.cssText='color:-webkit-link;text-decoration:none'\" onclick=\"TodoListsIndex.dbClick('" + row + "', 0);\">" + value + "</a>";
                        }, sortable: true
                    },
                    {
                        title: '合同编号',
                        field: 'contractNo',
                        width: '10%',
                        align: 'center',
                        formatter: function(value, row, index) {
                            if (row.contractId !== null && row.contractId !== 0 && row.contractId !== "") {
                                return "<a href=\"#\" onmouseover=\"this.style.cssText='color:#1761a4; text-decoration:underline;'\" onmouseout=\"this.style.cssText='color:-webkit-link;text-decoration:none'\" onclick=\"objectExtend.dbClick('" + row.contractId + "');\">" + value + "</a>";
                            } else {
                                return "";
                            }
                        }, sortable: true
                    },
                    { title: '业务类型', field: 'fromInstanceType', width: '12%', align: 'center', sortable: true },
                    {
                        title: '房屋编号',
                        field: 'houseNo',
                        width: '10%',
                        align: 'center',
                        formatter: function(value, row, index) {
                            if (row.houseId !== null && row.houseId !== 0 && row.houseId !== "") {
                                return "<a href='#' onclick='objectExtend.HouseBan(" + row.houseId + ")'>" + value + "</a>";
                            } else {
                                return "";
                            }
                        }, sortable: true
                    },
                    { title: '当前环节', field: 'activityName', width: '15%', align: 'center', sortable: true },
                    { title: '经办人', field: 'operatorName', width: '8%', align: 'center', hidden: true },
                    { title: '房屋Id', field: 'houseId', width: '8%', align: 'center', hidden: true },
                    { title: '经办人Id', field: 'operatorId', width: '8%', align: 'center', hidden: true },
                    {
                        title: '申请时间',
                        field: 'applyDateTime',
                        width: '12%',
                        align: 'center',
                        formatter: function(value) {
                            return topevery.dataTimeFormatTT(value);
                        }, sortable: true
                    },
                    {
                        title: '来件时间',
                        field: 'inDate',
                        width: '12%',
                        align: 'center',
                        formatter: function(value) {
                            return topevery.dataTimeFormatTT(value);
                        }, sortable: true
                    },
                    { title: '承租人Id', field: 'lesseeId', width: '0', align: 'center', hidden: true },
                    {
                        title: '承租人名称',
                        field: 'lesseeName',
                        width: '8%',
                        align: 'center',
                        formatter: function(value, row, index) {
                            if (row.lesseeId !== null && row.lesseeId !== 0 && row.lesseeId !== "") {
                                return "<a href='#' onclick='objectExtend.LesseeInfoOpen(" + row.lesseeId + ")'>" + value + "</a>";
                            } else {
                                return "";
                            }
                        }, sortable: true
                    }
                ]
            ],
            onDblClickRow: TodoListsIndex.dbClick,
            toolbar: '#toolbar'
        });
        for (var i = 0; i < $(".easyui-textbox").length; i++) {
            $("#" + $('.easyui-textbox').eq(i)[0].id + "").textbox({
                inputEvents: $.extend({}, $.fn.textbox.defaults.inputEvents, {
                    keyup: function(event) {
                        if (event.keyCode === 13) {
                            TodoListsIndex.loadInfo();
                        }
                    }
                })
            });
        }
    },
    ///弹出申请审核页面
    dbClick: function (index, data) {
        ///点击链接的时候获取指定行数据
        if (data === 0) {
            data = $("#TodoListsTable").datagrid('getData').rows[index];
        }
        ///根据业务类型弹出不同的办理页面
        var url = "?actInstanceId=" + data.actInstanceId + '&workFlowId=' + data.workFlowId + '&fromInstanceId=' + data.fromInstanceId + '&houseUnitId=' + data.houseUnitId + '&lesseeId=' + data.lesseeId + '&workFlowInstanceId=' + data.workFlowInstanceId + '&houseId=' + data.houseId;
        switch (data.fromInstanceType) {
            case "房屋租赁申请":
                window.location = virtualDirName + 'HouseRentApply/LeaseReview'+url;
                break;

            case "小修工程申请":
                window.location = virtualDirName + 'HouseRepair/MinorRepairEngineeringTransaction'+url;
                break;

            case "退租金申请":
                window.location = virtualDirName + "Contract/RefundRentApplyInfo"+url;
                break;

            case "租金减免申请":
                window.location = virtualDirName + "ContractMent/RentReductionTransaction"+url;
                break;

            case "退保证金申请":
                window.location = virtualDirName + "DepositRefund/SecurityTransaction"+url;
                break;
            case "退房申请":
                window.location.href = virtualDirName + "Contract/RefundHouseInfo" + url;
                break;
            case "大中修工程申请":
                window.location.href = virtualDirName + "BigHouseRepair/DaZhongXiuEngineeringTransaction" + url;
                break;
            default:
        }
    },
    ///跳转到租赁申请页面
    OpenHous: function () {
        window.location = virtualDirName + 'HouseRentApply/LeasingApplication';
    },
    ///跳转到小修申请页面
    MinorRepairEngineering: function () {
        window.location = virtualDirName + 'HouseRepair/MinorRepairEngineeringApply';
    },
    ///调到租金减免申请流程
    OpenRentReductionApplication:function() {
        window.location = virtualDirName + 'ContractMent/RentReductionApplication';
    },
    ///退租申请
    RefundRentApply: function() {
        window.location.href = virtualDirName + "HouseRepair/RefundRentApply";
    },
    ///退保证金申请
    RefundSecurityDeposit:function() {
        window.location.href = virtualDirName + "DepositRefund/SecurityApply";
    },
    ///退房申请
    AddRefundHouse: function () {
        window.location.href = virtualDirName + "Contract/AddRefundHouse";
    },
    loadInfo:function() {
        $('#TodoListsTable').datagrid('load', { input: topevery.form2Json("selectFrom") }); //点击搜索
    },
    Clear: function () {
        $("#ApplyNo").textbox("setValue", "");
        $("#ContractNo").textbox("setValue", "");
        $("#FromInstanceName").combobox("setValue", "");
        $("#HouseDoorplate").textbox("setValue", "");
        $("#LesseeName").textbox("setValue", "");
        $("#HouseNo").textbox("setValue", "");
        $("#ApplyDateTimeEnd").val("");
        $("#ApplyDateTimeStart").val("");
        $('#TodoListsTable').datagrid('load'); //点击搜索
    }
}
$(function () {
    var j = 0;
    /*初始化*/
    TodoListsIndex.Initialize();
    $("#completed-search-btn").on("click", function () {
        $("#completed-search-list").slideToggle();
        j = j + 1;
        if (j % 2 !== 0) {
            $("#completed-search-btn").html("收起∧");
        } else {
            $("#completed-search-btn").html("更多∨");
        }
    });
    bindDicToDrp("FromInstanceName", "3DB353D0-919E-4067-A4B9-7C2D00010851", "", false, "");
});


