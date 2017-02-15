var RentCollectQuery = {
    Initialize: function () {
        $("#RentCollectQueryDataGrid").datagrid({
            frozenColumns: [
                [
                    {
                        field: "contractNo",
                        title: "合同编号",
                        width: 100,
                        align: "center",
                        formatter: function (value, row, index) {
                            if (value.indexOf("总数") === -1) {
                                return "<a href='#' onclick='objectExtend.dbClick(" + row.contractId + ")'>" + value + "</a>";
                            } else {
                                return value;
                            }
                        },
                        sortable: true
                    },
                    {
                        field: "houseDoorplate",
                        title: "现房屋门牌",
                        width: 100,
                        align: "center",
                        formatter: function (value, row, index) {
                            if (value != null)
                                return "<a href='#' onclick='objectExtend.HouseBan(" + row.houseBanId + ")'>" + value + "</a>";
                        },
                        sortable: true
                    },
                    { field: "rentRange", title: "租用范围", width: 100, align: "center", sortable: true },
                    {
                        field: "lesseeName",
                        title: "承租人",
                        width: 100,
                        align: "center",
                        formatter: function (value, row, index) {
                            if (value != null)
                                return "<a href='#' onclick='objectExtend.LesseeInfoOpen(" + row.lesseeId + ")'>" + value + "</a>";
                        },
                        sortable: true
                    },
                ]
            ],
            columns: [
                [
                    { field: "year", title: "年", width: 50, align: "center", sortable: true },
                    { field: "month", title: "月", width: 50, align: "center", sortable: true },
                    { field: "rent", title: "租金基数", width: 100, align: "center", sortable: true },
                    { field: "payableRent", title: "当月租金", width: 100, align: "center", sortable: true },
                    { field: "rentArrearsSum", title: "新欠租金", width: 100, align: "center", sortable: true },
                    { field: "oldOweRentSum", title: "旧欠租金", width: 100, align: "center", sortable: true },
                    { field: "sameMonNetReceipt", title: "实收租金", width: 100, align: "center", sortable: true },
                    { field: "newNetReceipt", title: "新欠实收", width: 100, align: "center", sortable: true },
                    { field: "oldNetReceipt", title: "旧欠实收", width: 100, align: "center", sortable: true },
                    { field: "sameMonthAdvanceReceipt", title: "当月预交款", width: 100, align: "center", sortable: true },
                    { field: "beforeReceiptRent", title: "以前收本月", width: 100, align: "center", sortable: true },
                    { field: "propertyName", title: "产权属性", width: 70, align: "center" },
                    { field: "isHome", title: "是否住宅", width: 100, align: "center" },
                    { field: "bankCardNO", title: "银行账号", width: 100, align: "center", sortable: true }
                ]
            ],
            height: 480,
            idField: "contractId",
            // fitColumns: true,
            fit: true,
            rownumbers: true,
            pagination: true,
            singleSelect: true,
            showFooter: true,
            toolbar: "#toolbarWrap",
            loader: function (param, success, error) {
                topevery.ajax({
                    type: "POST",
                    url: "api/services/app/RentCollectR/GetPayInPageListAsync",
                    contentType: "application/json",
                    data: topevery.extend(topevery.form2Json("selectForm"), {
                        PageIndex: param.page,
                        PageCount: param.rows,
                        Order: param.order,
                        Sort: param.sort,
                        IsRemove:1
                    })
                }, function (data) {
                    if (data.success) {
                        success(data.result);
                    } else {
                        error();
                    }
                }, false);
            },
            onLoadSuccess: function (data) {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
                $(this).datagrid("clearSelections").datagrid("clearChecked");
            }
        });
        for (var i = 0; i < $(".easyui-textbox").length; i++) {
            $("#" + $('.easyui-textbox').eq(i)[0].id + "").textbox({
                inputEvents: $.extend({}, $.fn.textbox.defaults.inputEvents, {
                    keyup: function (event) {
                        if (event.keyCode === 13) {
                            RentCollectQuery.Select();
                        }
                    }
                })
            });
        }
    },
    Select: function () {
        $("#RentCollectQueryDataGrid").datagrid("load");
    },
    Reset: function () {
        $("#contractNo").textbox("setValue", "");
        $("#houseDoorplate").textbox("setValue", "");
        $("#lesseeName").textbox("setValue", "");
        $("#propertyId").combobox("setValue", "");
        $("#IsHome").combobox("setValue", " ");
        $("#paymentId").combobox("setValue", "");
        $("#RentType").combobox("setValue", "");
        //  $("#selectForm").form("reset");
        $("#RentCollectQueryDataGrid").datagrid("load");
    },
    RentExp: function () {
        var startMonth = $("#startMonth").val();
        var endMonth = $("#startMonth").val();
        var contractNo = $("#contractNo").textbox('getValue');
        var houseDoorplate = $("#houseDoorplate").textbox("getValue");
        var lesseeName = $("#lesseeName").textbox("getValue");
        var houseManageId = $("#houseManageId").combobox('getValue');
        var propertyId = $("#propertyId").combobox('getValue');
        var rentType = $("#RentType").combobox('getValue');
        var isHome = $("#IsHome").combobox('getValue');
        var flag = startMonth + "&contractNo="
            + contractNo + "&houseDoorplate=" + houseDoorplate + "&lesseeName=" + lesseeName + "&houseManageId=" + houseManageId + "&endMonth=" + endMonth + "&propertyId=" + propertyId + "&rentType=" + rentType + "&isHome=" + isHome;
        window.location.href = virtualDirName + "RentCollect/RentCollectQueryExp?startMonth=" + flag;
    }
};
$(function () {
    var date = new Date();
    $("#startMonth").val(date.getFullYear() + "-" + (date.getMonth() + 1));
    $("#endMonth").val(date.getFullYear() + "-" + (date.getMonth() + 1));
    if ($("#WorkstationDropDown").val()) {
        bindDropDown("houseManageId", "Common/GetWorkstationBind", "--工作站--", false, false);
    } else {
        bindDropDown("houseManageId", "Common/GetWorkstationBind", "--工作站--", false, true);
        $("#houseManageId").combobox("readonly");
    }
    bindDicToDrp("payType", "AD33D5B6-42C0-4129-B501-BE6D748F6F7E", "--交租方式--");
    bindDicToDrp("propertyId", "B34CFE85-FB80-4817-B660-B8DF27F8DC76", "--产权属性--", false, false);//产权属性
    bindDicToDrp("RentType", "497E9547-0CBD-49EB-B556-BED08F4B5CF0", "--租金类型--");
    $("#IsHome").combobox({
        editable: false, panelHeight: 'auto',
        //设置第一个值为默认值
        data: [
            {
                "value": " ",
                "text": "--使用性质--",
                "selected": true
            },
            {
                "value": "1",
                "text": "住宅"
            }, {
                "value": "0",
                "text": "非住宅"
            }
        ]
    });
    RentCollectQuery.Initialize();
    var j = 0;
    /*初始化*/
    $("#completed-search-btn").on("click", function () {
        $("#completed-search-list").slideToggle();
        j = j + 1;
        if (j % 2 !== 0) {
            $("#completed-search-btn").html("收起∧");
        } else {
            $("#completed-search-btn").html("更多∨");
        }
    });
});