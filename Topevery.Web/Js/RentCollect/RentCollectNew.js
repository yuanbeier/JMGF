var SameMonthRentId;
var ContractNo;
//闭包函数
var RentCollectNew = {
    Initialize: function () {
        $("#RentCollectNewTable").datagrid({
            columns: [
                [
                    {
                        field: "contractNo", title: "合同编号", width: 150, align: "center", sortable: true,
                        formatter: function (value, row, index) {
                            if (row.contractId !== 0) {
                                return "<a href='#' onclick='objectExtend.dbClick(" + row.contractId + ")'>" + value + "</a>";
                            } else {
                                return value;
                            }
                        }
                    },
                    {
                        field: "lesseeName", title: "承租人", width: 100, align: "center", sortable: true, formatter: function (value, row, index) {
                            if (row.lesseeId !== 0) {
                                return "<a href='#' onclick='objectExtend.LesseeInfoOpen(" + row.lesseeId + ")'>" + value + "</a>";
                            } else {
                                return value;
                            }
                        }
                    },
                    {
                        field: "houseDoorplate", title: "房屋门牌", width: 100, align: "center", sortable: true, formatter: function (value, row, index) {
                            if (row.houseBanId !== 0){
                                return "<a href='#' onclick='objectExtend.HouseBan(" + row.houseBanId + ")'>" + value + "</a>";
                            } else {
                                return value;
                            }
                        }
                    },
                    { field: "rentRange", title: "租用范围", width: 100, align: "center", sortable: true },
                    { field: "payType", title: "交租方式", width: 100, align: "center" },
                    {
                        field: "rentStartTime",
                        title: "租赁期限起",
                        width: 100,
                        align: "center",
                        formatter: function (value) {
                            return topevery.dataTimeFormat(value);
                        }, sortable: true
                    },
                    {
                        field: "rentEndTime",
                        title: "租赁期限止",
                        width: 100,
                        align: "center",
                        formatter: function (value) {
                            return topevery.dataTimeFormat(value);
                        }, sortable: true
                    }
                ]
            ],
            height: 350,
            //width: 800,
            idField: "contractId",
            fitColumns: true,
            rownumbers: true,
            toolbar: '#toolbar-area',
            singleSelect: true,
            pagination: true,
            onLoadSuccess: function (data) {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
                //$(this).datagrid("clearSelections").datagrid("clearChecked");
                var lenght = $("#RentCollectNewTable").datagrid("getRows").length;
                if (lenght > 0) {
                    var rowData = $("#RentCollectNewTable").datagrid("getRows")[0];
                    $('#RentCollectNewTable').datagrid('selectRow', 0);
                    RentCollectNew.fuzhi(0, rowData.rentCollectId, rowData.contractNo);
                }
            },
            loader: function (param, success, error) {
                var years;
                var months;
                var startMonth = $("#startMonth").val();
                if (startMonth != null && startMonth !== "") {
                    years = startMonth.split('-')[0];
                    months = startMonth.split('-')[1];
                }
                topevery.ajax({
                    type: "POST",
                    url: "api/services/app/RentCollectR/GetContractAndRentCollectPageListAsync",
                    contentType: "application/json",
                    data: topevery.extend(topevery.form2Json("selectForm"), {
                        PageIndex: param.page,
                        PageCount: param.rows,
                        Year: years,
                        Month: months,
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
            },
            onClickRow: function (rowIndex, rowData) {
                $("#sumbitForm").form('clear');
                $("#RentCollectNewTable1").datagrid('load');
                var date = new Date();
                $("#recordTime").datebox('setValue', date.getFullYear() + "-" + (date.getMonth() + 1));
                $("#paymentId").combobox("setValue", "500037");
                $("#sameMonNetReceipt1").attr("checked", 'checked');
                $("input[name='rentForm']").get(0).checked = true;
                RentCollectNew.fuzhi(rowIndex, rowData.rentCollectId, rowData.contractNo);
            }
        });
        ///当前选择合同的当月收缴信息
        $("#RentCollectNewTable1").datagrid({
            columns: [
                [
                    {
                        field: "recordTime", title: "收款日期", width: 100, align: "center", formatter: function (value) {
                            return topevery.dataTimeFormatTT(value);
                        }
                    },
                    { field: "monthlyIncome", title: "实收金额", width: 100, align: "center" },
                    { field: "rentRange", title: "租用范围", width: 100, align: "center" },
                    { field: "lesseeName", title: "交租人", width: 100, align: "center" },
                    { field: "payeeName", title: "收款人", width: 100, align: "center" }
                ]
            ],
            height: 150,
            //width: 800,
            idField: "contractId",
            fitColumns: true,
            //rownumbers: true,
            singleSelect: true,
            //pagination: true,
            onLoadSuccess: function (data) {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
                $(this).datagrid("clearSelections").datagrid("clearChecked");
            },
            loader: function (param, success, error) {
                topevery.ajax({
                    type: "POST",
                    url: "api/services/app/RentCollectR/GetRentCollectCashOne",
                    contentType: "application/json",
                    data: topevery.extend(topevery.form2Json("sumbitForm"), {
                        PageIndex: param.page,
                        PageCount: param.rows,
                        ContractNo: ContractNo
                    })
                }, function (data) {
                    if (data.success) {
                        success(data.result);
                    } else {
                        error();
                    }
                }, false);
            }
        });
        for (var i = 0; i < $(".easyui-textbox").length; i++) {
            $("#" + $('.easyui-textbox').eq(i)[0].id + "").textbox({
                inputEvents: $.extend({}, $.fn.textbox.defaults.inputEvents, {
                    keyup: function (event) {
                        if (event.keyCode === 13) {
                            RentCollectNew.Select();
                        }
                    }
                })
            });
        }
    },
    ///查询
    Select: function () {
        $("#RentCollectNewTable").datagrid("load");

    },
    Clear: function () {
        $("#selectForm").form('clear');
        var date = new Date();
        $("#startMonth").val(date.getFullYear() + "-" + (date.getMonth() + 1));
        $("#RentCollectNewTable").datagrid('load');
    },
    fuzhi: function (rowIndex, rentCollectId, contractNo) {
        topevery.ajax({
            type: "POST",
            url: "api/services/app/RentCollectR/GetSameMonthReceivableRent",
            contentType: "application/json",
            async: true,
            data: JSON.stringify({ RentCollectId: rentCollectId })
        }, function (data) {
            if (data.success) {
                SameMonthRentId = rentCollectId;
                ContractNo = contractNo;
                $("#sumbitForm").form("load", data.result);
                $("#RentCollectNewTable1").datagrid("load");
                $('#btn-add').removeAttr("disabled");
                $("#btn-add").attr("style", "background-color: #0068b7");
                $("#sameMonNetReceipt1").attr("checked", 'checked');

            }
        }, true);
    },
    ///交租新增
    Add: function () {
        var type = $("input[name='rentForm']:checked").val();
        var money = $("#monthlyIncome").numberbox('getValue');
        if (!$("#sumbitForm").form("validate")) {
            return;
        }
        if (type === "2") {
            if ($("#oldOweRentSum").textbox("getValue") * 1 < money * 1 && $("#oldOweRentSum").textbox("getValue") * 1 !== money * 1) {
                window.top.topeveryMessage.show("缴纳金额不能大于当前旧欠金额！");
                return;
            }

        } else if (type === "1") {
            if ($("#rentArrearsSum").textbox("getValue") * 1 < money * 1 && $("#rentArrearsSum").textbox("getValue") * 1 !== money * 1) {
                window.top.topeveryMessage.show("缴纳金额不能大于当前新欠金额！");
                return;
            }
        }
        var array = topevery.form2Json("sumbitForm");
        topevery.ajax({
            type: "POST",
            url: "api/services/app/RentCollectW/AddRentCollectRecordAsync",
            contentType: "application/json",
            async: true,
            data: JSON.stringify(array)
        }, function (data) {
            if (data.success) {
                window.top.topeveryMessage.show("交款成功！");
                $("#sumbitForm").form('clear');
                $("#RentCollectNewTable1").datagrid('load');
                var date = new Date();
                $("#recordTime").datebox('setValue', date.getFullYear() + "-" + (date.getMonth() + 1));
                $("#paymentId").combobox("setValue", "500037");
                $("#sameMonNetReceipt1").attr("checked", 'checked');
                $("input[name='rentForm']").get(0).checked = true;
                ContractNo = array.contractNo;
                RentCollectNew.fuzhi(0, SameMonthRentId, ContractNo);
            }
        }, true);
    },
    Modif: function () {
        topevery.ajax({
            type: "POST",
            url: "api/services/app/RentCollectW/UpdateSameMonthReceivableRentAsync",
            contentType: "application/json",
            async: true,
            data: JSON.stringify({
                SameMonthRentId: SameMonthRentId,
                SameMonNewRent: $("#sameMonNewRent").textbox("getValue"),
                OldOweRentSum: $("#oldOweRentSum").textbox("getValue"),
                RentArrearsSum: $("#rentArrearsSum").textbox("getValue")
            })
        }, function (data) {
            if (data.success) {
               // $("#sameMonthAdvance").textbox('setValue', data.result);
                RentCollectNew.fuzhi(0, SameMonthRentId, ContractNo);
                window.top.topeveryMessage.show("修改成功！");
            }
        }, true);
    },
    //删除单次交租记录
    BatchDelete: function () {
        var arrRows = $('#RentCollectNewTable1').datagrid('getChecked');
        var getRows = $('#RentCollectNewTable1').datagrid('getRows')[0];
        if (arrRows !== undefined && getRows !== undefined && arrRows.length>0) {
            if (arrRows[0].id !== getRows.id) {
                window.top.topeveryMessage.show("请先删除最新的一条交款记录才能删除其他的交款数据!", "提示");
                return;
            }
        }
        if (arrRows.length === 0) {
            window.top.topeveryMessage.show("请选择一条需要删除的记录!", "提示");
        } else {
            var url = 'api/services/app/RentCollectW/DeleteRentCollectRecordAsync';
            topevery.ajax({
                type: "POST",
                url: url,
                contentType: "application/json",
                async: true,
                data: JSON.stringify({ ids: arrRows[0].id })
            }, function (data) {
                if (data.success) {
                    $("#sumbitForm").form('clear');
                    $("#RentCollectNewTable1").datagrid('load');
                    var date = new Date();
                    $("#recordTime").datebox('setValue', date.getFullYear() + "-" + (date.getMonth() + 1));
                    $("#paymentId").combobox("setValue", "500037");
                    $("#btn-add").attr("style", "background-color: #838386");
                    $("#btn-add").attr("disabled", true);
                    $("#sameMonNetReceipt1").attr("checked", 'checked');
                    $("input[name='rentForm']").get(0).checked = true;
                    ContractNo = arrRows[0].contractNo;
                    RentCollectNew.fuzhi(0, SameMonthRentId, ContractNo);
                    window.top.topeveryMessage.show("删除成功！");
                }
            });
        }
    }
};
//初始化数据
$(function () {
    var date = new Date();
    $("#startMonth").val(date.getFullYear() + "-" + (date.getMonth() + 1));
    $("#recordTime").datebox('setValue', date.getFullYear() + "-" + (date.getMonth() + 1) + " " + date.getMonth());
    $("#startMonth").attr("disabled", "disabled");
    $("#btn-add").attr("style", "background-color: #838386");
    $("#btn-add").attr("disabled", true);
    $("#sameMonNetReceipt1").attr("checked", 'checked');
    RentCollectNew.Initialize();

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