var dialog6;
var dialog5;
var dialog7;
var grid;
$(function () {
    bindDicToDrp("payType", "AD33D5B6-42C0-4129-B501-BE6D748F6F7E", "--交租方式--", true, false);
    bindDropDown("houseManageId", "Common/GetWorkstationBind", "--工作站--", false, false);
    ContractIndex.Initialize();
    //下拉 切换
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
ContractIndex = {
    Initialize: function() {
        grid= $("#contractDataGrid").datagrid({
            frozenColumns: [
                [
                         { field: "id", checkbox: true },
                    {
                        title: '操作',
                        field: 'Action',
                        width: '60',
                        align: 'center',
                        formatter: function (value, row, index) {
                            if (row.id !== -1) {
                                var e = $("#hiddenContractEdit").val() ? '<a href="#" class="easyui-modifyoperate" onclick="ContractIndex.ModifContract(' + row.id + ')">修改</a> ' : "";
                                return e;
                            }
                            return "统计";
                        }
                    },
                     { field: "isRemove", title: "结束", width: 40, align: "center", formatter: topevery.checkFormat },
                    {
                        field: "contractNo",
                        title: "合同编号",
                        width: 110,
                        align: "center",
                        formatter: function (value, row, index) {
                            if (value.indexOf('总数') === -1) {
                                return "<a href='#' onclick='objectExtend.dbClick(" + row.id + ")'>" + value + "</a>";
                            } else {
                                return value;
                            }
                        },
                        sortable: true
                    },
                    {
                        field: "houseDoorplate",
                        title: "房屋门牌",
                        width: 120,
                        align: "center",
                        formatter: function (value, row, index) {
                            if (value !== null) {
                                return "<a href='#' onclick='objectExtend.HouseBan(" + row.houseId + ")'>" + value + "</a>";
                            }
                            return "";
                        }
                    },
                    { field: "rentRange", title: "租用范围", width: 120, align: "center" },
                    {
                        field: "name",
                        title: "承租人",
                        width: 80,
                        align: "center",
                        formatter: function (value, row, index) {
                            if (value !== null) {
                                return "<a href='#' onclick='objectExtend.LesseeInfoOpen(" + row.lesseeId + ")'>" + value + "</a>";
                            }
                            return value;
                        }
                    }
                ]
            ],
            columns: [
                [
                    { field: "baseRent", title: "租金基数", width: 80, align: "center", sortable: true },
                    { field: "buildArea", title: "建筑面积", width: 80, align: "center", sortable: true },
                    { field: "metRentArea", title: "计租面积", width: 80, align: "center", sortable: true },
                    { field: "contactNumber", title: "联系电话", width: 90, align: "center", sortable: true },
                    {
                        field: "rentStartTime",
                        title: "租赁期限起",
                        width: 80,
                        align: "center",
                        formatter: function(value) {
                            return topevery.dataTimeFormat(value);
                        },
                        sortable: true
                    },
                    {
                        field: "rentEndTime",
                        title: "租赁期限止",
                        width: 80,
                        align: "center",
                        formatter: function(value) {
                            return topevery.dataTimeFormat(value);
                        },
                        sortable: true
                    },
                    { field: "reduceTypeName", title: "减免项目", width: 80, align: "center" },
                    { field: "reduceMoney", title: "减免金额", width: 60, align: "center", sortable: true },
                    { field: "collectMoney", title: "应收租金", width: 100, align: "center", sortable: true },
                    { field: "usePropertyName", title: "是否住宅", width: 70, align: "center" },
                    {
                        field: "isLowRentHousName", title: "是否廉租房", width: 70, align: "center",
                    }
                ]
            ],
            height: 480,
            idField: "id",
            striped: true,
            fitColumns: false,
            fit: true,
            nowrap: false,
            singleSelect: true,
            rownumbers: true,
            pagination: true,
            toolbar: "#toolbarWrap",
            showFooter: true,
            onLoadSuccess: function(data) {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
                $(this).datagrid("clearSelections").datagrid("clearChecked");
            },
            loader: function(param, success, error) {
                var rentStartTime = $("#RentStartTime").val();
                var rentEndTime = $("#RentEndTime").val();
                $("#hidOrder").val(param.order);
                $("#hidSort").val(param.sort);
                topevery.ajax({
                    type: "POST",
                    url: "api/services/app/ContractR/GetContractExList",
                    contentType: "application/json",
                    data: topevery.extend(topevery.form2Json("selectForm"), {
                        PageIndex: param.page,
                        PageCount: param.rows,
                        queryType: 3,
                        Order: param.order,
                        Sort: param.sort,
                        RentStartTime: rentStartTime,
                        RentEndTime: rentEndTime
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
                            ContractIndex.Select();
                        }
                    }
                })
            });
        }
    },
    Reset: function () {
        try {
            $("#selectForm").form("reset");
        }
        finally {
            $("#contractDataGrid").datagrid("reload");
        }
    },
    Select: function() {
        $("#contractDataGrid").datagrid("reload");
    },
    ///弹出合同查看页面
    dbClick: function(id) {
        dialog5 = ezg.modalDialog({
            width: 1200,
            height: 600,
            title: '合同查看',
            url: virtualDirName + 'ContractMent/ContractToView?Id=' + id,
            buttons: [
            ]
        });
    },
    ///弹出合同修改页面
    ModifContract: function(id) {
        dialog6 = ezg.modalDialog({
            width: 1200,
            height: 600,
            title: '合同修改',
            url: virtualDirName + 'ContractMent/ContractModif?Id=' + id,
            buttons: [
            ]
        });
    },
    ModifyBankCardNmber: function () {
        var data = $('#contractDataGrid').datagrid('getSelections')[0];
        if (data === undefined) {
            $.messager.alert('提示', '请选择一条合同信息!', 'info');
        } else {
            dialog7 = ezg.modalDialog({
                width: 480,
                height: 150,
                title: '修改银行卡号',
                url: virtualDirName + 'ContractMent/ModifyBankCardNmber?Id=' + data.id + "&BankCardNo=" + data.bankCardNo
            });
        }
    },
    ContractExp: function() {
        var contractNo = $("#contractNo").textbox('getValue');
        var houseDoorplate = $("#HouseDoorplate").textbox('getValue');
        var rentRange = $("#rentRange").textbox('getValue');
        var name = $("#Name").textbox('getValue');
        var rentStartTime = $("#RentStartTime").val();
        var rentEndTime = $("#RentEndTime").val();
        var usePropertyId = $("#UsePropertyId").combobox('getValue');
        var isRemove = $("#IsRemove").combobox('getValue');
        var hidOrder = $("#hidOrder").val();
        var hidSort = $("#hidSort").val();
        var payType = $("#payType").combobox('getValue');
        var flag = contractNo + "&houseDoorplate=" + houseDoorplate + "&rentRange=" + rentRange + "&name="
            + name + "&rentStartTime=" + rentStartTime + "&rentEndTime=" + rentEndTime + "&usePropertyId=" + usePropertyId
            + "&isRemove=" + isRemove + "&orderName=" + hidOrder + "&sort=" + hidSort + "&payType=" + payType;
        window.location.href = virtualDirName + "Contract/ContractExp?contractNo=" + flag;
    }
}