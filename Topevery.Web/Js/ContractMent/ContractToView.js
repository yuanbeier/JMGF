$(function () {
    $(document).queue("datagrid0101", function () { ContractModif.Initialize(); });
    $(document).queue("datagrid0102", function () { ContractModif.huoqushuju(); });
    $(document).queue("datagrid0103", function () { ContractModif.Initializezujin(); });
    $(document).queue("datagrid0104", function () { ContractModif.FieldChangeInitialize(); });
    $(document).dequeue("datagrid0101");

});
ContractModif = {
    Initialize: function () {
        bindDicToDrp("Sex", "C8CEFBB2-6F98-4F70-8A47-932B9487FC37", "");
        //bindDicToDrp("UsePropertyId", "28519BAC-0C61-4921-A7C1-80F3CEB80AC0", "");
        bindDicToDrp("BuildStructureId", "29A43A34-8D05-4F9A-B0FA-EFB8A38F7F98", "");
        bindDicToDrp("PayType", "AD33D5B6-42C0-4129-B501-BE6D748F6F7E", "--请选择--");
        bindDicToDrp("ReduceType", "A7CD7C95-EA39-42A6-BBFB-DF0210C0E374", "--请选择--");
        bindDicToDrp("RentType", "497E9547-0CBD-49EB-B556-BED08F4B5CF0", "--请选择--");
        bindDicToDrp("ExpireHandle", "EC39DF03-EFAE-4F59-9ED7-A210F3F1913A", "--请选择--");
        bindDicToDrp("CreditCard", "8F746198-36E5-49B7-8929-6BFE6C51431B", "", false);
        $(document).dequeue("datagrid0102");
    },
    ///获取数据
    huoqushuju: function () {
        topevery.ajax({
            type: "POST",
            url: "api/services/app/ContractR/GetContractInfoAsync",
            contentType: "application/json",
            data: JSON.stringify({ id: $("#Id").val() })
        }, function (row) {
            if (row.success) {
                var data = row.result;
                ContractModif.bangdingshuju(data);
                ContractModif.InitializePermanents(data.lesseeId);
            } else {
                error();
            }
        }, true);
    },
    ///绑定数据到文本
    bangdingshuju: function (data) {
        $("#ContractSigningAdd").form("load", data);
        $("#Remark").textbox('setValue', data.remark);
        $("#SignDate").html(topevery.dataTimeFormat(data.signDate));
        $("#img").attr("src", data.qrCodeUrl);
        if (data.automaticRenew !== null) {
            $("#AutomaticRenew").combobox('setValue', data.automaticRenew.toString());
        }
        $("#ContractNo1").textbox('setValue', data.contractNo);
        $("#LesseeName1").textbox('setValue', data.lesseeName);
        $("#HouseDoorplate1").textbox('setValue', data.houseDoorplate);
        $("#RentMargin1").textbox('setValue', data.rentMargin);
        $("#CreatorUserName").textbox('setValue', data.creatorUserName);
        $("#RentMarginNo").textbox('setValue', data.rentMarginNo);
        $("#ContractNo").html(data.contractNo);
        $("#RentRanges").textbox('setValue', data.rentRange);
        if (data.isPubRenHous === 1 || data.isLowRentHous === 1) {
            $("#dzht").html("<iframe src=\"" + virtualDirName + "PrintRelevant/LowRentHousingContract?id=" + $("#Id").val() + "\" width=\"1200\" height=\"2000\"><a href=\"" + virtualDirName + "/PrintRelevant/LowRentHousingContract\">你的浏览器不支持iframe页面嵌套，请点击这里访问页面内容。</a></iframe>");
        } else {
            if (data.usePropertyId == 1) {
                $("#dzht").html("<iframe src=\"" + virtualDirName + "PrintRelevant/HousingContract?id=" + $("#Id").val() + "\" width=\"1200\" height=\"2000\"><a href=\"" + virtualDirName + "PrintRelevant/HousingContract\">你的浏览器不支持iframe页面嵌套，请点击这里访问页面内容。</a></iframe>");
            } else {
                $("#dzht").html("<iframe src=\"" + virtualDirName + "PrintRelevant/RegardsTheContract?id=" + $("#Id").val() + "\" width=\"1200\" height=\"2000\"><a href=\"" + virtualDirName + "PrintRelevant/RegardsTheContract\">你的浏览器不支持iframe页面嵌套，请点击这里访问页面内容。</a></iframe>");
            }
        }
        $(document).dequeue("datagrid0103");
    },
    Initializezujin: function() {
        $("#RentCollectQueryDataGrid").datagrid({
            columns: [
                [
                    { field: "year", title: "年", width: 50, align: "center", sortable: true },
                    { field: "month", title: "月", width: 50, align: "center", sortable: true },
                    {
                        field: "contractNo",
                        title: "合同编号",
                        width: 100,
                        align: "center",
                    },
                    {
                        field: "houseDoorplate",
                        title: "现房屋门牌",
                        width: 100,
                        align: "center",
                    },
                    { field: "rentRange", title: "租用范围", width: 100, align: "center", sortable: true },
                    {
                        field: "lesseeName",
                        title: "承租人",
                        width: 70,
                        align: "center",
                    },
                    { field: "sameMonthAdvance", title: "预存款", width: 100, align: "center", sortable: true },
                    { field: "currentRealRent", title: "当月缴费金额", width: 100, align: "center", sortable: true },
                    { field: "sameMonNetReceipt", title: "实收月租(当月)", width: 100, align: "center", sortable: true },
                    { field: "sameMonNewRent", title: "欠月租（当月）", width: 100, align: "center", sortable: true },
                    //{ field: "payMoney", title: "总交款金额", width: 100, align: "center" },
                    { field: "payType", title: "交款类型", width: 100, align: "center" },
                    // { field: "monthReceipt", title: "当月实收", width: 100, align: "center" },
                    { field: "newNetReceipt", title: "新欠实收", width: 70, align: "center", sortable: true },
                    { field: "oldNetReceipt", title: "旧欠实收", width: 70, align: "center", sortable: true },
                    // { field: "sameMonthAdvance", title: "预交款金额", width: 100, align: "center" },
                    //{ field: "payType", title: "交款方式", width: 100, align: "center" },
                    { field: "isHome", title: "是否住宅", width: 100, align: "center" },
                    { field: "bankCardNO", title: "银行账号", width: 100, align: "center", sortable: true }
                ]
            ],
            height: 480,
            idField: "id",
            striped: true,
            fitColumns: true,
            loadMsg: false,
            singleSelect: true,
            nowrap: false,
            rownumbers: true, //行号
            pagination: true, //分页控件
            pageSize: 50,
            pageList: [10, 20, 50, 100],
            showFooter: true,
            loader: function(param, success, error) {
                topevery.ajax({
                    type: "POST",
                    url: "api/services/app/RentCollectR/GetPayInPageListAsync",
                    contentType: "application/json",
                    data: topevery.extend(null, {
                        PageIndex: param.page,
                        PageCount: param.rows,
                        ContractNo: $("#ContractNo").html()
                    })
                }, function(data) {
                    if (data.success) {
                        success(data.result);
                    } else {
                        error();
                    }
                }, false);
            },
            onLoadSuccess: function(data) {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
                $(this).datagrid("clearSelections").datagrid("clearChecked");
            }
        });
        $(document).dequeue("datagrid0104");
    },
    ///加载列表数据-
    InitializePermanents: function (id) {
    var grid = $('#PermanentStaffTable').datagrid({
        height: 480,
        idField: "id",
        striped: true,
        fitColumns: true,
        loadMsg: false,
        singleSelect: true,
        nowrap: false,
        loader: function(param, success, error) {
            topevery.ajax({
                type: "POST",
                url: "api/services/app/PermanentStaffR/GetPermanentStaffList",
                contentType: "application/json",
                data: JSON.stringify({
                    id: id
                })
            }, function(data) {
                if (data.success) {
                    success(data.result);
                } else {
                    error();
                }
            }, false);
        },
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
                {
                    width: '50',
                    title: '编号',
                    field: 'id',
                    align: 'center'
                },
                {
                    width: '80',
                    title: '姓名',
                    field: 'name',
                    align: 'center'
                },
                {
                    width: '50',
                    title: '性别',
                    field: 'sexName',
                    align: 'center'
                },
                {
                    width: '120',
                    title: '出生年月',
                    field: 'dateBirth',
                    align: 'center',
                    formatter: function (value) {
                        return topevery.dataTimeFormat(value);
                    }
                },
                {
                    title: '年龄',
                    field: 'age',
                    width: '80',
                    align: 'center'

                },
                {
                    title: '和租户关系',
                    field: 'relationship',
                    width: '80',
                    align: 'center'
                },
                {
                    title: '身份证号码',
                    field: 'idCardNo',
                    width: '180',
                    align: 'center'
                },
                {
                    title: '工作单位',
                    field: 'workUnits',
                    width: '120',
                    align: 'center'
                },
                {
                    title: '联系电话',
                    field: 'contactNumber',
                    width: '120',
                    align: 'center'
                }
            ]
        ]
    });
    },
    ///加载列表数据-
    FieldChangeInitialize: function(id) {
        var grid = $('#ModifTable').datagrid({
            idField: "id",
            striped: true,
            fitColumns: true,
            singleSelect: true,
            nowrap: false,
            height: 420,
            loader: function(param, success, error) {
                topevery.ajax({
                    type: "POST",
                    url: "api/services/app/LesseeInfoR/GetModifyRecordList",
                    contentType: "application/json",
                    data: topevery.extend(null, {
                        EntityId:  $("#Id").val(),
                        EntityType: "Contract",
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
                            return topevery.dataTimeFormatTT(value);
                        }
                    },
                    { field: "Remark", title: "备注", width: 60, align: "center" }
                ]
            ]
        });
    },
}