$(function () {
    $(document).queue("datagrid0101", function () { ToViewAppIndex.Initialize(); });
    $(document).queue("datagrid0102", function () { ToViewAppIndex.huoqushuju(); });
    $(document).queue("datagrid0103", function () { ToViewAppIndex.FieldChangeInitialize(); });
    $(document).queue("datagrid0104", function () { ToViewAppIndex.HistoryContract(); });
    $(document).queue("datagrid0105", function () { ToViewAppIndex.IntegrityInformation(); });
    $(document).queue("datagrid0106", function () { ToViewAppIndex.PermanentStaff(); });
    $(document).queue("datagrid0107", function () { ToViewAppIndex.NewContract(); });
    $(document).dequeue("datagrid0101");

});
ToViewAppIndex = {
    Initialize: function() {
        bindDicToDrp("CertName", "D11CFDA8-992B-4A9A-81D3-7201BD4D6E4D", "", false);
        bindDicToDrp("Sex", "C8CEFBB2-6F98-4F70-8A47-932B9487FC37", "", false);
        bindDicToDrp("TenantType", "7705DB66-07EB-4F3E-86F5-51A79663DF6A", "", false);
        bindDropDown("HouseManageId", "Common/GetWorkstationBind", "", false);
        $(document).dequeue("datagrid0102");
    },
    ///获取数据
    huoqushuju: function() {
        topevery.ajax({
            type: "POST",
            url: "api/services/app/LesseeInfoR/GetLesseeInfOne",
            contentType: "application/json",
            data: JSON.stringify({ id: getRequest("id") })
        }, function(row) {
            if (row.success) {
                var data = row.result;
                if (data.tenantType !== 500049) {
                    $("#hidden2").hide();
                }
                var array = {};
                for (var i in data) {
                    array["" + UpperFirstLetter(i) + ""] = data[i];
                };
                $("#LesseeInfoToView").form("load", array);
                $("#imgUrl").attr("src", data.qrCodeUrl);
            } else {
                error();
            }
        }, true);
        $(document).dequeue("datagrid0103");
    },
    ///加载列表数据-
    FieldChangeInitialize: function() {
        var grid = $('#gridtable').datagrid({
            idField: "id",
            striped: true,
            fitColumns: true,
            singleSelect: true,
            nowrap: false,
            height: 420,
            loader: ToViewAppIndex.FieldChangeRecords,
            //rownumbers: true, //行号
            //pagination: true, //分页控件
            //pageSize: 50,
            //pageList: [10, 20, 50, 100],
            showFooter: true,
            onLoadSuccess: function(data) {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
            },
            columns: [
                [
                    { field: "columnName", title: "字段名称", width: 60, align: "center" },
                    { field: "oldValue", title: "旧值", width: 60, align: "center" },
                    {
                        field: "newValue", title: "新值", width: 60, align: "center",
                        formatter: function (value) {
                            return "<a style=\"color: red;\">" + value + "</a>";
                        }
                    },
                    { field: "ipAddress", title: "Ip地址", width: 60, align: "center" },
                    { field: "userName", title: "修改人名称", width: 60, align: "center" },
                    {
                        field: "createTime",
                        title: "修改时间",
                        width: 60,
                        align: "center",
                        formatter: function(value) {
                            return topevery.dataTimeFormat(value);
                        }
                    },
                    { field: "Remark", title: "备注", width: 60, align: "center" }
                ]
            ]
        });
        $(document).dequeue("datagrid0104");
    },
    HistoryContract: function() {
        $("#HistoryLease").datagrid({
            columns: [
                [
                    { field: "contractNo", title: "合同编号", width: 100, align: "center" },
                    { field: "houseDoorplate", title: "现房屋门牌", width: 120, align: "center" },
                    { field: "rentRange", title: "租用范围", width: 120, align: "center" },
                    { field: "rentMargin", title: "保证金金额", width: 80, align: "center" },
                    { field: "baseRent", title: "租金基数", width: 60, align: "center" },
                    {
                        field: "rentStartTime",
                        title: "租赁期限起",
                        width: 80,
                        align: "center",
                        formatter: function(value) {
                            return topevery.dataTimeFormat(value);
                        }
                    },
                    {
                        field: "rentEndTime",
                        title: "租赁期限止",
                        width: 80,
                        align: "center",
                        formatter: function(value) {
                            return topevery.dataTimeFormat(value);
                        }
                    },
                    { field: "monthMoney", title: "月租金", width: 60, align: "center" }
                ]
            ],
            height: 370,
            idField: "id",
            striped: true,
            fitColumns: true,
            nowrap: false,
            //rownumbers: true,
            //pagination: true,
            showFooter: true,
            toolbar: "#toolbar",
            onLoadSuccess: function(data) {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
                $(this).datagrid("clearSelections").datagrid("clearChecked");
            },
            loader: function(param, success, error) {
                topevery.ajax({
                    type: "POST",
                    url: "api/services/app/ContractR/GetHouseLeaseList",
                    contentType: "application/json",
                    data: JSON.stringify({ id: getRequest("id"), type: 1 })
                }, function(data) {
                    if (data.success) {
                        success(data.result);
                    } else {
                        error();
                    }
                }, false);
            }
        });
        $(document).dequeue("datagrid0105");
    },
    NewContract: function () {
        $("#NewLease").datagrid({
            columns: [
                [
                    { field: "contractNo", title: "合同编号", width: 100, align: "center" },
                    { field: "houseDoorplate", title: "现房屋门牌", width: 120, align: "center" },
                    { field: "rentRange", title: "租用范围", width: 120, align: "center" },
                    { field: "rentMargin", title: "保证金金额", width: 80, align: "center" },
                    { field: "baseRent", title: "租金基数", width: 60, align: "center" },
                    {
                        field: "rentStartTime",
                        title: "租赁期限起",
                        width: 80,
                        align: "center",
                        formatter: function (value) {
                            return topevery.dataTimeFormat(value);
                        }
                    },
                    {
                        field: "rentEndTime",
                        title: "租赁期限止",
                        width: 80,
                        align: "center",
                        formatter: function (value) {
                            return topevery.dataTimeFormat(value);
                        }
                    },
                    { field: "monthMoney", title: "月租金", width: 60, align: "center" }
                ]
            ],
            height: 370,
            idField: "id",
            striped: true,
            fitColumns: true,
            nowrap: false,
            //rownumbers: true,
            //pagination: true,
            showFooter: true,
            toolbar: "#toolbar",
            onLoadSuccess: function (data) {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
                $(this).datagrid("clearSelections").datagrid("clearChecked");
            },
            loader: function (param, success, error) {
                topevery.ajax({
                    type: "POST",
                    url: "api/services/app/ContractR/GetHouseLeaseList",
                    contentType: "application/json",
                    data: JSON.stringify({ id: getRequest("id") ,type:0})
                }, function (data) {
                    if (data.success) {
                        success(data.result);
                    } else {
                        error();
                    }
                }, false);
            }
        });
    },
    ///获取数据
    FieldChangeRecords: function(param, success, error) {
        topevery.ajax({
            type: "POST",
            url: "api/services/app/LesseeInfoR/GetModifyRecordList",
            contentType: "application/json",
            data: topevery.extend(null, { 
                EntityId: getRequest("id"), 
                EntityType: "Lesseeinfo" ,
                PageIndex: param.page,
                PageCount: param.rows
            })
        }, function(row) {
            if (row.success) {
                success(row.result);
            } else {
                error();
            }
        }, true);
    },
    IntegrityInformation: function() {
        var grid = $('#CreditRecord').datagrid({
            height: 370,
            idField: "id",
            striped: true,
            fitColumns: true,
            singleSelect: false,
            nowrap: false,
            //rownumbers: false, //行号
            //pagination: true, //分页控件
            pageSize: 50,
            pageList: [10, 20, 50, 100],
            showFooter: true,
            onLoadSuccess: function(data) {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
            },
            columns: [
                [
                    { field: "id", checkbox: true },
                    { field: "name", title: "承租人", align: "center", width: 80 },
                    { field: "honestyTypeName", title: "诚信分类", align: "left", width: 100 },
                    { field: "reduceScore", title: "扣分", align: "center", width: 100 },
                    {
                        field: "auditTime",
                        title: "时间",
                        align: "center",
                        width: 80,
                        formatter: function(value) {
                            return topevery.dataTimeFormat(value);
                        }
                    }
                ]
            ],
            loader: function(param, success, error) {
                topevery.ajax({
                    type: "POST",
                    url: "api/services/app/LesseeHonestyMangmentR/GetLesseeList",
                    contentType: "application/json",
                    data: JSON.stringify({ id: getRequest("id") })
            }, function (data) {
                    if (data.success) {
                        success(data.result);
                        $(document).dequeue("datagrid0106");
                    } else {
                        error();
                    }
                }, true);
            }
        });
    },
    PermanentStaff:function() {
        ///加载列表数据-
          var  grid1 = $('#PermanentStaffTable').datagrid({
              height: 370,
                idField: 'id',
                striped: true,
                fitColumns: true,
                loadMsg: "正在努力加载数据，请稍后...",
                singleSelect: true,
                nowrap: false,
                loader: function(param, success, error) {
                    topevery.ajax({
                        type: "POST",
                        url: "api/services/app/PermanentStaffR/GetPermanentStaffList",
                        contentType: "application/json",
                        data: JSON.stringify({ id: getRequest("id") })
                    }, function (data) {
                        if (data.success) {
                            success(data.result);
                            $(document).dequeue("datagrid0107");
                        } else {
                            error();
                        }
                    }, true);
                },
                showFooter: true,
                onLoadSuccess: function (data) {
                    $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
                },
                columns: [
                    [
                        {width: 50,title: '姓名',field: 'name',align: 'center'},
                        {width: 50,title: '性别',field: 'sexName',align: 'center',
                        },
                        {width: 81,title: '出生年月',field: 'dateBirth',align: 'center',
                            formatter: function (value) {
                                return topevery.dataTimeFormat(value);
                            }
                        },
                        {title: '年龄',field: 'age',width: 50,align: 'center'
                        },
                        {title: '和租户关系',field: 'relationship',width: 80,align: 'center'
                        },
                        {title: '身份证号码',field: 'idCardNo',width: 80,align: 'center'
                        },
                        {title: '工作单位',field: 'workUnits',width:80,align: 'center'
                        },
                        {title: '联系电话',field: 'contactNumber',width: 60,align: 'center'
                        }
                    ]
                ]
            });
    }
}
///首字母转大写
function UpperFirstLetter(str) {
    return str.replace(/\b\w+\b/g, function (word) {
        return word.substring(0, 1).toUpperCase() + word.substring(1);
    });
}