//将表单数据转为json
var gridTodo;
var dialog4;
var dialog5;
function loadData(param, success, error) {
    topevery.ajax({
        type: "POST",
        url: "api/services/app/HouseBanR/GetDoneHandlesAsync",
        contentType: "application/json",
        data: topevery.extend(topevery.form2Json("selectFrom"), {
            PageIndex: param.page,
            PageCount: param.rows,
            FromInstanceType: $("#FromInstanceName").combobox('getText'),
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

DonetListsIndex = {
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
                    //{
                    //    title: '状态',
                    //    field: 'lightType',
                    //    width: '5%',
                    //    align: 'center',
                    //    formatter: function (value) {
                    //        var html = "";
                    //        if (value === 10) {
                    //            html = "<a class=\"bulb-sign bulb-sign-orange bulb-sign-green\"/></a>";
                    //        }
                    //        if (value === 20) {
                    //            html = "<a class=\"bulb-sign bulb-sign-orange bulb-sign-orange\"/></a>";
                    //        }
                    //        if (value === 30) {
                    //            html = "<a class=\"bulb-sign bulb-sign-orange bulb-sign-red\"/></a>";
                    //        }
                    //        return html;
                    //    }
                    //},
                    { title: '流程定义Id', field: 'workFlowId', width: '0', align: 'center', hidden: true },
                    { title: '流程实例Id', field: 'workFlowInstanceId', width: '0', align: 'center', hidden: true },
                    {
                        title: '申请单号',
                        field: 'applyNo',
                        width: '13%',
                        align: 'center',
                        sortable: true,
                        formatter: function(value, index, row) {
                            return "<a href=\"#\" onmouseover=\"this.style.cssText='color:#1761a4; text-decoration:underline;'\" onmouseout=\"this.style.cssText='color:-webkit-link;text-decoration:none'\" onclick=\"DonetListsIndex.dbClick('" + row + "', 0);\">" + value + "</a>";
                        }
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
                    { title: '业务类型', field: 'fromInstanceType', width: '13%', align: 'center', sortable: true },
                    {
                        title: '房屋编号',
                        field: 'houseNo',
                        width: '10%',
                        align: 'center',
                        sortable: true,
                        formatter: function(value, row, index) {
                            if (row.houseId !== null && row.houseId !== 0 && row.houseId !== "") {
                                return "<a href='#'  onmouseover=\"this.style.cssText='color:#1761a4; text-decoration:underline;'\" onmouseout=\"this.style.cssText='color:-webkit-link;text-decoration:none'\" onclick='objectExtend.HouseBan(" + row.houseId + ")'>" + value + "</a>";
                            } else {
                                return "";
                            }
                        }
                    },
                    { title: '当前环节', field: 'activityName', width: '13%', align: 'center', sortable: true },
                    { title: '经办人', field: 'operatorName', width: '9%', align: 'center', sortable: true },
                    { title: '分户Id', field: 'houseUnitId', width: '0', align: 'center', hidden: true },
                    { title: '经办人Id', field: 'operatorId', width: '0', align: 'center', hidden: true },
                    {
                        title: '申请时间',
                        field: 'applyDateTime',
                        width: '13%',
                        align: 'center',
                        sortable: true,
                        formatter: function(value) {
                            return topevery.dataTimeFormatTT(value);
                        }
                    },
                    { title: '承租人Id', field: 'lesseeId', width: '0', align: 'center', hidden: true },
                    {
                        title: '承租人名称',
                        field: 'lesseeName',
                        width: '13%',
                        align: 'center',
                        sortable: true,
                        formatter: function(value, row, index) {
                            if (row.lesseeId !== null && row.lesseeId !== 0 && row.lesseeId !== "") {
                                return "<a href='#'  onmouseover=\"this.style.cssText='color:#1761a4; text-decoration:underline;'\" onmouseout=\"this.style.cssText='color:-webkit-link;text-decoration:none'\" onclick='objectExtend.LesseeInfoOpen(" + row.lesseeId + ")'>" + value + "</a>";
                            } else {
                                return "";
                            }
                        }
                    }
                ]
            ],
            onDblClickRow: DonetListsIndex.dbClick,
            toolbar: '#toolbar'
        });
        for (var i = 0; i < $(".easyui-textbox").length; i++) {
            $("#" + $('.easyui-textbox').eq(i)[0].id + "").textbox({
                inputEvents: $.extend({}, $.fn.textbox.defaults.inputEvents, {
                    keyup: function(event) {
                        if (event.keyCode === 13) {
                            DonetListsIndex.loadInfo();
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
        ///根据业务类型弹出不同的查看页面
        switch (data.fromInstanceType) {
            case "房屋租赁申请":
                DonetListsIndex.Popup(data, 'HouseRentApply/LeaseReviewDone', "房屋租赁申请", 1000, 600);
                break;
            case "小修工程申请":
                DonetListsIndex.Popup(data, 'HouseRepair/MinorRepairEngineeringToView', "小修工程申请", 1000, 500);
                break;
            case "退租金申请":
                DonetListsIndex.Popup(data, "Contract/RefundRentApplyInfoDone", "退租金申请", 1000, 500);
                break;
            case "租金减免申请":
                DonetListsIndex.Popup(data, "ContractMent/RentReductionToView", "租金减免申请", 1000, 550);
                break;
            case "退保证金申请":
                DonetListsIndex.Popup(data, "DepositRefund/SecurityApplyToView", "退保证金申请", 1000, 500);
                break;
            case "退房申请":
                DonetListsIndex.Popup(data, "Contract/RefundHouseInfoDone", "退房申请", 1000, 500);
                break;
            case "大中修工程申请":
                DonetListsIndex.Popup(data, "BigHouseRepair/DaZhongXiuEngineeringApplyToView", "大中修工程申请", 1000, 440);
                break;
            default:
        }
    },
    loadInfo: function () {
        $('#TodoListsTable').datagrid('load', { input: topevery.form2Json("selectFrom") }); //点击搜索
    },
    ///弹出租户添加窗口
    Popup: function (data, url, title, width, height) {
        if (data.houseUnitId == null) {
            data.houseUnitId = "";
        }
        if (data.lesseeId == null) {
            data.lesseeId = "";
        }
        var dialog = ezg.modalDialog({
            width: width,
            height: height,
            title: title,
            url: url + virtualDirName + '?actInstanceId=' + data.actInstanceId + '&workFlowId=' + data.workFlowId + '&fromInstanceId=' + data.fromInstanceId + '&houseUnitId=' + data.houseUnitId + '&lesseeId=' + data.lesseeId + '&workFlowInstanceId=' + data.workFlowInstanceId+ '&houseId=' + data.houseId
        });
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
    DonetListsIndex.Initialize();
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


