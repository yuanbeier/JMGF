//将表单数据转为json
var grid;
var dialog1;
var tenantTypelist;
function loadData(param, success, error) {
    topevery.ajax({
        type: "POST",
        url: "api/services/app/RescueRecordR/GetRescueRecordListAsync",
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

BuildingDisasterRelief = {
    ///加载列表数据-
    Initialize: function () {
        grid = $('#BuildingDisasterReliefTable').datagrid({
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
            //showFooter: true,
            onLoadSuccess: function (data) {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
            },
            columns: [
                [
                    { field: "id", checkbox: true },
                     {
                         title: '房屋编号', field: 'houseNo', sortable: true, width: 80, align: 'center', formatter: function (value, row, index) {
                             if (row.houseId !== 0) {
                                 return "<a href='#' onclick='objectExtend.HouseBan(" + row.houseId + ")'>" + value + "</a>";
                             } else {
                                 return value;
                             }
                         }
                     },
                    { width: 100, title: '现房屋门牌', sortable: true, field: 'houseDoorplate', align: 'center' },
                    { width: 100, title: '建筑面积', field: 'buildArea', align: 'center', sortable: true },
                    { title: '建筑结构', field: 'buildStructureName', width: 80, align: 'center' },
                    { width: 80, title: '总层数', field: 'totalFloors', align: 'center', sortable: true },
                    { width: 80, title: '建成年份', field: 'completYear', align: 'center', sortable: true },
                    { title: '安全等级', field: 'securityLevelName', width: 100, align: 'center' },
                      { title: '物资使用情况', field: 'materialSituation', width: 100, align: 'center' },
                    { title: '抢险情况', field: 'rescueSituation', width: 100, align: 'center' },
                    { title: '地点', field: 'location', width: 100, align: 'center' },
                    { title: '参与人员', field: 'participants', width: 100, align: 'center' },
                     { title: '抢险时间', field: 'rescueTime', width: 150, align: 'center', formatter: function (value) { return topevery.dataTimeFormatTT(value); }, sortable: true },
                    {
                        title: '操作', field: 'Action', width: '12%', align: 'center',
                        formatter: function (value, row, index) {
                            var f = '<a href="#"   class="easyui-modifyoperate"  onclick="BuildingDisasterRelief.dbClick(' + index + ')">查看</a>';
                            var d = $("#hiddenBuildingDisasterReliefDelete").val() ?  '  <a href="#"   class="easyui-oldoperate"  onclick="BuildingDisasterRelief.deleterow(' + row.id + ')">删除</a>' : "";
                            var c = $("#hiddenBuildingDisasterReliefUpdate").val() ? '<a href="#"   class="easyui-modifyoperate"  onclick="BuildingDisasterRelief.Update(' + row.id + ')">修改</a>' : "";
                            return f +  d +  c;
                        }
                    }
                ]
            ],
            toolbar: '#toolbarWrap',
            onDblClickRow: BuildingDisasterRelief.dbClick
        });
        if ($("#WorkstationDropDown").val()) {
            bindDropDown("HouseManageId", "Common/GetWorkstationBind", "--工作站--", false, false);
        } else {
            bindDropDown("HouseManageId", "Common/GetWorkstationBind", "--工作站--", false, true);
            $("#HouseManageId").combobox("readonly");
        }
        for (var i = 0; i < $(".easyui-textbox").length; i++) {
            $("#" + $('.easyui-textbox').eq(i)[0].id + "").textbox({
                inputEvents: $.extend({}, $.fn.textbox.defaults.inputEvents, {
                    keyup: function (event) {
                        if (event.keyCode === 13) {
                            BuildingDisasterRelief.loadInfo();
                        }
                    }
                })
            });
        }
    },
    ///搜索
    loadInfo: function () {
        $('#BuildingDisasterReliefTable').datagrid('load', { input: topevery.form2Json("selectFrom") }); //点击搜索
    },
    Add: function () {
        window.location.href = virtualDirName + "SafetyManagement/BuildingDisasterReliefAdd?type=新增";
    },
    Update: function (id) {
        window.location.href = virtualDirName + "SafetyManagement/BuildingDisasterReliefAdd?id=" + id + "&type=修改";
    },
    Export: function () {
        var input = topevery.form2Json("selectFrom");
        var url = topevery.ExportUrl(input);
        window.location.href = virtualDirName + "SafetyExport/ExpBuildingDisasterReliefFile" + url;
    },
    dbClick: function (index, data) {
        if (data === undefined) {
            data = $('#BuildingDisasterReliefTable').datagrid('getRows')[index];
        }
        ///弹出选择查看窗口
        dialog1 = ezg.modalDialog({
            width: 1200,
            height: 418,
            title: '查看抢险救灾记录',
            url: virtualDirName + 'SafetyManagement/BuildingDisasterReliefAdd?id=' + data.id + "&type=查看"
        });
    },
    ///删除一条数据
    deleterow: function (id) {
        topeveryMessage.confirm(function (r) {
            if (r) {
                $.ajax({
                    type: 'POST',
                    url: virtualDirName + 'api/services/app/RescueRecordW/DeleteRescueRecordAsync',
                    data: JSON.stringify({ "ids": id }),
                    contentType: "application/json",
                    Type: "JSON",
                    success: function (row) {
                        if (row.success) {
                            $("#BuildingDisasterReliefTable").datagrid('reload');
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
        var arrRows = $('#BuildingDisasterReliefTable').datagrid('getChecked');
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
                    url: virtualDirName + 'api/services/app/RescueRecordW/DeleteRescueRecordAsync',
                    data: JSON.stringify({ "ids": ids.join() }),
                    contentType: "application/json",
                    Type: "JSON",
                    success: function (row) {
                        if (row.success) {
                            $("#BuildingDisasterReliefTable").datagrid('reload');
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
    $(document).queue("datagrid0101", function () { BuildingDisasterRelief.Initialize(); });
    $(document).dequeue("datagrid0101");
});
