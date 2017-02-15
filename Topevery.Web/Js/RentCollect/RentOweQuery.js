var RentOweQuery = {
    Initialize: function () {
        $("#RentOweQueryDataGrid").datagrid({
            frozenColumns: [[
                 { field: "id", checkbox: true },
                    {
                        field: "contractNo", title: "合同编号", width: 100, align: "center", formatter: function (value, row, index) {
                            if (value.indexOf("总数") === -1) {
                                return "<a href='#' onclick='objectExtend.dbClick(" + row.contractId + ")'>" + value + "</a>";
                            } else {
                                return value;
                            }
                        }, sortable: true
                    },
                    {
                        field: "houseDoorplate", title: "现房屋门牌", width: 100, align: "center", formatter: function (value, row, index) {
                            if (value != null)
                            return "<a href='#' onclick='objectExtend.HouseBan(" + row.houseBanId + ")'>" + value + "</a>";
                        }, sortable: true
                    },
                    { field: "rentRange", title: "租用范围", width: 100, align: "center", sortable: true },
                    {
                        field: "lesseeName", title: "承租人", width: 100, align: "center", formatter: function (value, row, index) {
                            if (value != null) return "<a href='#' onclick='objectExtend.LesseeInfoOpen(" + row.lesseeId + ")'>" + value + "</a>";
                        }, sortable: true
                    },
            ]],
            columns: [
                [
                { field: "houseManageName", title: "工作站", width: 100, align: "center", sortable: true },
                    { field: "year", title: "年份", width: 100, align: "center", sortable: true },
                    { field: "month", title: "月份", width: 100, align: "center", sortable: true },
                    { field: "oweRentSum", title: "欠租总额", width: 100, align: "center", sortable: true },
                    { field: "sameMonNewRent", title: "本月欠租", width: 100, align: "center", sortable: true },
                    { field: "rentArrearsSum", title: "新欠租金", width: 100, align: "center", sortable: true },
                    { field: "oldOweRentSum", title: "旧欠租金", width: 100, align: "center", sortable: true },
                    { field: "paytypeName", title: "使用性质", width: 100, align: "center" },
                    { field: "propertyName", title: "产权属性", width: 70, align: "center" },
                    { field: "contactNumber", title: "联系电话", width: 100, align: "center", sortable: true }
                ]
            ],
            height: 480,
            idField: "id",
           // fitColumns: true,
            fit:true,
            rownumbers: true,
            pagination: true,
            showFooter: true,
            singleSelect: true,
            toolbar: "#toolbarWrap",
            loader: function(param, success, error) {
                var houseManageId = $('#houseManageId').combobox('getValues').join(',');
                topevery.ajax({
                    type: "POST",
                    url: "api/services/app/RentCollectR/GetOweRentPageListAsync",
                    contentType: "application/json",
                    data: topevery.extend(topevery.form2Json("selectForm"), {
                        PageIndex: param.page,
                        PageCount: param.rows,
                        Order: param.order,
                        Sort: param.sort,
                        HouseManageId: houseManageId
                    })
                }, function(data) {
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
            },
            //onLoadSuccess: function () {
            //    $(this).datagrid("clearSelections").datagrid("clearChecked");
            //}

        });
        for (var i = 0; i < $(".easyui-textbox").length; i++) {
            $("#" + $('.easyui-textbox').eq(i)[0].id + "").textbox({
                inputEvents: $.extend({}, $.fn.textbox.defaults.inputEvents, {
                    keyup: function (event) {
                        if (event.keyCode === 13) {
                            RentOweQuery.Select();
                        }
                    }
                })
            });
        }
    },
    Select: function () {
        $("#RentOweQueryDataGrid").datagrid("load");
     
    },
    Reset: function () {
        $("#contractNo").textbox("setValue", "");
        $("#houseDoorplate").textbox("setValue", "");
        $("#lesseeName").textbox("setValue", "");
        $("#propertyId").combobox("setValue", "");
        $("#IsHome").combobox("setValue", " ");
        //$("#selectForm").form("reset");
        $("#RentOweQueryDataGrid").datagrid("load");
    },
    dbClick: function (id) {
        ezg.modalDialog({
            width: 1200,
            height: 600,
            title: '合同查看',
            url: virtualDirName + 'ContractMent/ContractToView?Id=' + id,
        });
    },
    HouseBan: function (id) {
        ezg.modalDialog({
            width: 1200,
            height: 460,
            title: '房屋楼栋信息',
            url: virtualDirName + "House/HouseBanAdd?view=1&id=" + id
        });
    },
    Lessee: function (id) {
        ezg.modalDialog({
            width: 730,
            height: 540,
            title: '查看租户明细',
            url: virtualDirName + 'LesseeInfo/ToView?id=' + id
        });
    },
    RentExp: function () {
        var contractNo = $("#contractNo").textbox('getValue');
        var houseDoorplate = $("#houseDoorplate").textbox('getValue');
        var lesseeName = $("#lesseeName").textbox('getValue');
        var startMonth = $("#startMonth").val();
        var endMonth = $("#endMonth").val();
        var propertyId = $("#propertyId").combobox('getValue');
        var flag = contractNo + "&houseDoorplate=" + houseDoorplate + "&lesseeName="
            + lesseeName + "&propertyId=" + propertyId + "&startMonth=" + startMonth + "&endMonth=" + endMonth;
        window.location.href = virtualDirName + "RentCollect/RentOweQueryExp?contractNo=" + flag;
    }
};
$(function () {
    var date = new Date();
    $("#startMonth").val(date.getFullYear() + "-" + (date.getMonth() + 1));
    $("#endMonth").val(date.getFullYear() + "-" + (date.getMonth() + 1));
    //bindDropDown("houseManageId", "Common/GetWorkstationBind", "--工作站--", false, false);
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

    if ($("#WorkstationDropDown").val()) {
        bindDropDown("houseManageId", "Common/GetWorkstationBind", "--工作站--", false, false);
    } else {
        bindDropDown("houseManageId", "Common/GetWorkstationBind", "--工作站--", false, true);
        $("#houseManageId").combobox("readonly");
    }
    bindDicToDrp("propertyId", "B34CFE85-FB80-4817-B660-B8DF27F8DC76", "--产权属性--", false, false);//产权属性
    RentOweQuery.Initialize();
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