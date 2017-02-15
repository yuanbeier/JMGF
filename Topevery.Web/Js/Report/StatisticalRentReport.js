var StatisticalRentReport = {
    Initialize: function() {
        $("#StatisticalRentReportDataGrid").datagrid({
            columns: [
                [
                    {
                        field: "houseNo",
                        title: "房屋编号",
                        width: 120,
                        align: "center",
                        formatter: function(value, row, index) {
                            if (row.houseId !== 0) {
                                return "<a href='#' onclick='objectExtend.HouseBan(" + row.houseId + ")'>" + value + "</a>";
                            } else {
                                return value;
                            }
                        }
                    },
                    {
                        field: "houseDoorplate",
                        title: "现房屋门牌",
                        width: 100,
                        align: "center",
                        formatter: function(value, row, index) {
                            if (row.houseId !== 0) {
                                return "<a href='#' onclick='objectExtend.HouseBan(" + row.houseId + ")'>" + value + "</a>";
                            } else {
                                return value;
                            }
                        }
                    },
                    { field: "rentRange", title: "租赁范围", width: 100, align: "center" },
                    {
                        field: "contractNo",
                        title: "合同编号",
                        width: 100,
                        align: "center",
                        formatter: function(value, row, index) {
                            if (row.contractId !== 0) {
                                return "<a href='#' onclick='objectExtend.dbClick(" + row.contractId + ")'>" + value + "</a>";
                            } else {
                                return value;
                            }
                        }
                    },
                    {
                        field: "name",
                        title: "承租人",
                        width: 100,
                        align: "center",
                        formatter: function(value, row, index) {
                            if (row.lesseeId !== 0) {
                                return "<a href='#' onclick='objectExtend.LesseeInfoOpen(" + row.lesseeId + ")'>" + value + "</a>";
                            } else {
                                return value;
                            }
                        }
                    },
                    { field: "houseManageName", title: "工作站名称", width: 100, align: "center" },
                    { field: "housekeepName", title: "房管员", width: 100, align: "center" },
                    { field: "propertyName", title: "产权属性", width: 100, align: "center" },
                    { field: "baseRent", title: "租金基数", width: 100, align: "center" },
                    { field: "creditCardName", title: "减免情况", width: 100, align: "center" },
                    { field: "reduceMoney", title: "减免金额", width: 100, align: "center" },
                    { field: "collectMoney", title: "应收租金", width: 100, align: "center" },
                    { field: "buildArea", title: "建筑面积", width: 100, align: "center" },
                    { field: "metRentArea", title: "计租面积", width: 100, align: "center" },
                    { field: "contactNumber", title: "联系电话", width: 100, align: "center" },
                    { field: "usePropertyName", title: "使用性质", width: 100, align: "center" },
                    { field: "totalFloors", title: "总层数", width: 100, align: "center" },
                    { field: "completYear", title: "建成年份", width: 100, align: "center" },
                    { field: "buildStructureName", title: "建筑结构", width: 100, align: "center" },
                    { field: "isTaoName", title: "是否成套住宅", width: 100, align: "center" }
                ]
            ],
            checkOnSelect: true,
            //rownumbers: true, //行号
            //pagination: true, //分页控件
            height: 680,
            idField: "id",
            striped: true,
            singleSelect: true,
            fitColumns: false,
            fit: true,
            loadMsg: false,
            nowrap: false,
            toolbar: '#toolbarWrap',
            rownumbers: true, //行号
            pagination: true, //分页控件
            pageSize: 10,
            pageList: [10, 20, 50, 100],
            showFooter: true,
            onLoadSuccess: function(data) {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
                $(this).datagrid("clearSelections").datagrid("clearChecked");
            },
            loader: function(param, success, error) {
                var submit = topevery.form2Json("selectForm");
                topevery.ajax({
                    type: "POST",
                    url: "api/services/app/ReportR/GetStatisticalRentReportReportAsync",
                    contentType: "application/json",
                    data: topevery.extend(submit, {
                        PageIndex: param.page,
                        PageCount: param.rows
                    })
                }, function(data) {
                    if (data.success) {
                        success(data.result);
                    } else {
                        error();
                    }
                }, true);
            }
        });
        for (var i = 0; i < $(".easyui-textbox").length; i++) {
            $("#" + $('.easyui-textbox').eq(i)[0].id + "").textbox({
                inputEvents: $.extend({}, $.fn.textbox.defaults.inputEvents, {
                    keyup: function (event) {
                        if (event.keyCode === 13) {
                            StatisticalRentReport.Select();
                        }
                    }
                })
            });
        };
    },
    Select: function () {
        $("#StatisticalRentReportDataGrid").datagrid("load");
    },
    Reset: function () {
        $("#HouseNo").textbox("setValue", "");
        $("#ContractNo").textbox("setValue", "");
        $("#HouseDoorplate").textbox("setValue", "");
        $("#ContractNo").textbox("setValue", "");
        $("#Name").textbox("setValue", "");
        $("#HousekeepId").combobox("setValue", "");
        $("#CreditCard").combobox("setValue", "");
        $("#UsePropertyId").combobox("setValue", "");
        $("#RentRange").textbox("setValue", "");
        $("#StatisticalRentReportDataGrid").datagrid("load");
    },
    RentExp: function () {
        var submit = topevery.form2Json("selectForm");
        console.log(submit);
        window.location.href = virtualDirName + "Report/StatisticalRentReportExpAsync?HouseNo=" + submit.HouseNo + "&ContractNo=" + submit.ContractNo + "&HouseDoorplate=" + submit.HouseDoorplate + "&ContractNo=" + submit.HouseManageId + "&HouseManageId=" + submit.HouseManageId + "&HousekeepId=" + submit.HousekeepId + "&Name=" + submit.Name + "&CreditCard=" + submit.CreditCard + "&RentRange=" + submit.RentRange + "&UsePropertyId=" + submit.UsePropertyId;
    }
};
$(function () {
    function bindDeptToDrp(btnid, url, defaultText, required, lastDefault, btnid1) {
        $("#HouseManageId").combobox({
            editable: false, panelHeight: 'auto',
            url: virtualDirName + url,
            loadFilter: function (data) {
                var data = $.treeMap(data, function (row) {
                    return {
                        value: row.Data.Key,
                        text: row.Data.Value
                    };
                });
                if (lastDefault) {
                    data[0].selected = true;
                };
                // 添加空行
                if (defaultText !== "") {
                    if ($.isArray(data)) {
                        data.splice(0, 0, { value: "", text: defaultText });
                    }
                }
                return data;
            },
            required: required ? true : false,
            onChange: function (newValue, oldValue) {
                if (newValue) {
                    $("#" + btnid1).combobox({
                        required: false,
                        editable: false,
                        loader: function (param, success, error) {
                            topevery.ajax({
                                type: "POST",
                                url: "Common/GetManageUserBind",
                                contentType: "application/json",
                                data: JSON.stringify({ userDeptId: newValue })
                            }, function (data) {
                                var result = $.treeMap(data, function (row) {
                                    return {
                                        value: row.Data.Key,
                                        text: row.Data.Value
                                    };
                                });
                                success(result);
                            }, false);
                        }
                    });
                }
            }
        });
    }

    if ($("#WorkstationDropDown").val()) {
        bindDeptToDrp("HouseManageId", "Common/GetWorkstationBind", "--工作站--", false, false, "HousekeepId");
    } else {
        bindDeptToDrp("HouseManageId", "Common/GetWorkstationBind", "--工作站--", false, true, "HousekeepId");
        $("#HouseManageId").attr("readonly", "readonly");
        $("#HouseManageId").combobox("readonly");
    }

   // bindDeptToDrp("HouseManageId", "Common/GetWorkstationBind", "--工作站--", false, false, "HousekeepId");
    //  bindDropDown("HousekeepId", "Common/GetManageUserBind", "--房管员--");
    bindDicToDrp("CreditCard", "8F746198-36E5-49B7-8929-6BFE6C51431B", "--减免情况--");//使用性质
    bindDicToDrp("UsePropertyId", "28519BAC-0C61-4921-A7C1-80F3CEB80AC0", "--使用性质--");//使用性质
    StatisticalRentReport.Initialize();
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