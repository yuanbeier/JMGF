//将表单数据转为json
var grid;
var dialog1;
var tenantTypelist;
var dialogImport;
function loadData(param, success, error) {
    topevery.ajax({
        type: "POST",
        url: "api/services/app/DamagedHousesR/GetDamagedHousesListAsync",
        contentType: "application/json",
        data: topevery.extend(topevery.form2Json("selectFrom"), {
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

BuildingDamagedCondition = {
    ///加载列表数据-
    Initialize: function () {
        grid = $('#BuildingDamagedConditionTable').datagrid({
            height: 480,
            idField: "id",
            striped: true,
            fitColumns: true,
            fit: true,
            loadMsg: false,
            nowrap: false,
            loader: loadData,
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
                    { field: "id", checkbox: true },
                    {
                        title: '房屋编号',
                        field: 'houseNo',
                        sortable: true,
                        width: 80,
                        align: 'center',
                        formatter: function (value, row, index) {
                            if (row.houseId !== 0) {
                                return "<a href='#' onclick='objectExtend.HouseBan(" + row.houseId + ")'>" + value + "</a>";
                            } else {
                                return value;
                            }
                        }
                    },
                    { width: 100, title: '现房屋门牌', sortable: true, field: 'houseDoorplate', align: 'center' },
                    { title: '产权性质', field: 'propertyName', width: 80, align: 'center' },
                    { title: '建筑结构', field: 'buildStructureName', width: 80, align: 'center' },
                    { width: 80, title: '总层数', field: 'totalFloors', align: 'center', sortable: true },
                    { width: 100, title: '建筑面积', field: 'buildArea', align: 'center', sortable: true },
                    //{ width: 80, title: '建成年份', field: 'completYear', align: 'center', sortable: true },
                    //{ title: '安全等级', field: 'securityLevelName', width: 100, align: 'center' },
                    { title: '检查结果', field: 'checkResult', width: 100, align: 'center' },
                    { title: '鉴定结论', field: 'conclusion', width: 100, align: 'center' },
                    { title: '处理意见', field: 'processingOpinion', width: 100, align: 'center' },
                    //{ title: '登记日期', field: 'registerDate', width: 150, align: 'center', formatter: function (value) { return topevery.dataTimeFormatTT(value); }, sortable: true },
                    {
                        title: '操作',
                        field: 'Action',
                        width: '12%',
                        align: 'center',
                        formatter: function (value, row, index) {
                            if (row.id !== -1) {
                                var f = '<a href="#"   class="easyui-modifyoperate"  onclick="BuildingDamagedCondition.dbClick(' + index + ')">查看</a> ';
                                var d = $("#hiddenBuildingDamagedConditionDelete").val() ? '<a href="#"   class="easyui-oldoperate"  onclick="BuildingDamagedCondition.deleterow(' + row.id + ')">删除</a> ' : "";
                                var c = $("#hiddenBuildingDamagedConditionUpdate").val() ? ' <a href="#"   class="easyui-modifyoperate"  onclick="BuildingDamagedCondition.Update(' + row.id + ')">修改</a>' : "";
                                return f + c + " " + d;
                            } else {
                                return "";
                            }

                        }
                    }
                ]
            ],
            toolbar: '#toolbarWrap',
            onDblClickRow: BuildingDamagedCondition.dbClick
        });
        if ($("#WorkstationDropDown").val()) {
            bindDropDown("HouseManageId", "Common/GetWorkstationBind", "--工作站--", false, false);
        } else {
            bindDropDown("HouseManageId", "Common/GetWorkstationBind", "--工作站--", false, true);
            $("#HouseManageId").combobox("readonly");
        }
        bindDicToDrp("ConclusionId", "CCA188CC-DA84-49BE-BCA6-D9C06B8C0A36", "--检查结论--", false);
        for (var i = 0; i < $(".easyui-textbox").length; i++) {
            $("#" + $('.easyui-textbox').eq(i)[0].id + "").textbox({
                inputEvents: $.extend({}, $.fn.textbox.defaults.inputEvents, {
                    keyup: function (event) {
                        if (event.keyCode === 13) {
                            BuildingDamagedCondition.loadInfo();
                        }
                    }
                })
            });
        }
    },
    ///搜索
    loadInfo: function () {
        $('#BuildingDamagedConditionTable').datagrid('load', { input: topevery.form2Json("selectFrom") }); //点击搜索
    },
    Add: function () {
        window.location.href = virtualDirName + "SafetyManagement/BuildingDamagedConditionAdd?type=新增";
    },
    Update: function (id) {
        window.location.href = virtualDirName + "SafetyManagement/BuildingDamagedConditionAdd?id=" + id + "&type=修改";
    },
    Export: function () {
        var houseNo = $('#HouseNo').textbox('getValue');
        var houseDoorplate = $('#HouseDoorplate').textbox('getValue');
        var conclusionId = $("#ConclusionId").combobox("getValue");
        var houseManageId = $("#HouseManageId").combobox("getValue");
        var flag = houseNo + "&HouseDoorplate=" + houseDoorplate + "&ConclusionId=" + conclusionId + "&HouseManageId=" + houseManageId;
        window.location.href = virtualDirName + "SafetyExport/ExpDamagedHousesFile?houseNo=" + flag;
    },
    //导入房屋完损状况
    Import: function () {
        dialogImport = ezg.modalDialog({
            width: 450,
            height: 200,
            title: '导入房屋完损状况',
            url: virtualDirName + 'SafetyManagement/BuildingDamagedConditionImport'
        });
    },
    dbClick: function (index, data) {
        if (data === undefined) {
            data = $('#BuildingDamagedConditionTable').datagrid('getRows')[index];
        }
        ///弹出选择查看窗口
        dialog1 = ezg.modalDialog({
            width: 1200,
            height: 328,
            title: '查看房屋完损状况',
            url: virtualDirName + 'SafetyManagement/BuildingDamagedConditionAdd?id=' + data.id + "&type=查看"
        });
    },
    show: function () {
        window.top.topeveryMessage.show("导入成功");
        BuildingDamagedCondition.loadInfo();
        dialogImport.dialog('close');
    },
    ///删除一条数据
    deleterow: function (id) {
        topeveryMessage.confirm(function (r) {
            if (r) {
                $.ajax({
                    type: 'POST',
                    url: virtualDirName + 'api/services/app/DamagedHousesW/DeleteDamagedHousesAsync',
                    data: JSON.stringify({ "ids": id }),
                    contentType: "application/json",
                    Type: "JSON",
                    success: function (row) {
                        if (row.success) {
                            $("#BuildingDamagedConditionTable").datagrid('reload');
                            topeveryMessage.show("删除成功");
                        } else {
                            topeveryMessage.show(row.result.message);
                        }
                    }
                });
            }
        });
    },
    Delete: function () {
        var arrRows = $('#BuildingDamagedConditionTable').datagrid('getChecked');
        if (arrRows.length === 0) {
            window.top.topeveryMessage.show("请选择一条需要删除的记录!", "提示");
            return;
        }
        var ids = [];
        $.each(arrRows, function () {
            ids.push(this.id);
        });
        topeveryMessage.confirm(function (r) {
            if (r) {
                $.ajax({
                    type: 'POST',
                    url: virtualDirName + 'api/services/app/DamagedHousesW/DeleteDamagedHousesAsync',
                    data: JSON.stringify({ "ids": ids.join() }),
                    contentType: "application/json",
                    Type: "JSON",
                    success: function (row) {
                        if (row.success) {
                            $("#BuildingDamagedConditionTable").datagrid('reload');
                            topeveryMessage.show("删除成功");
                        } else {
                            topeveryMessage.show("删除失败");
                        }
                    }
                });
            }
        });
    }
}
///初始化
$(function () {
    $(document).queue("datagrid0101", function () { BuildingDamagedCondition.Initialize(); });
    $(document).dequeue("datagrid0101");
});
