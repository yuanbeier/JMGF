//将表单数据转为json
var j = 0;
var grid;
var dialog10;
var tenantTypelist;
function loadData(param, success, error) {
    topevery.ajax({
        type: "POST",
        url: "api/services/app/RepairTaskR/GetEngineerProjectQueryListAsync",
        contentType: "application/json",
        data: topevery.extend(topevery.form2Json("sumbitFrom"), {
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
    }, false);
};
EngineeringProject = {
    ///加载列表数据-
    Initialize: function () {
        grid = $('#EngineeringProjectTable').datagrid({
            idField: "id",
            striped: true,
            fitColumns: true,
            fit: true,
            singleSelect: true,
            nowrap: false,
            height: 480,
            loader: loadData,
            rownumbers: true, //行号
            pagination: true, //分页控件
            pageSize: 10,
            pageList: [10, 20, 50, 100],
            showFooter: true,
            onLoadSuccess: function(data) {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
            },
            columns: [
                [
                    { field: "id", checkbox: true },
                    {
                        field: "taskName",
                        title: "任务单类型",
                        align: "center",
                        width: 40,
                        formatter: function(value, row, index) {
                            if (value == "大中修工程申请") {
                                return "<a href='#' onclick='EngineeringProject.dbClick(" + index + ")'>" + value + "</a>";
                            } else if (value == "小修工程申请") {
                                return "<a href='#' onclick='EngineeringProject.dbClick(" + index + ")'>" + value + "</a>";
                            }
                        }
                    },
                    {
                        field: "taskListNo",
                        title: "任务单编号",
                        width: 30,
                        align: "center",
                        sortable: true,
                    },
                    {
                        field: "houseNo",
                        title: "房屋编号",
                        width: 30,
                        align: "center",
                        formatter: function(value, row, index) {
                            return "<a href='#' onclick='objectExtend.HouseBan(" + row.houseId + ")'>" + value + "</a>";
                        },
                        sortable: true
                    },
                    { field: "houseDoorplate", title: "现房屋门牌", width: 30, align: "center", sortable: true },
                    { field: "houseManageName", title: "工作站", width: 30, align: "center" },
                    { field: "propertyName", title: "产权", width: 30, align: "center" },
                    { field: "buildStructureName", title: "结构", width: 30, align: "center" },
                    { field: "userName", title: "申请人", width: 30, align: "center", sortable: true },
                    {
                        field: "creationTime",
                        title: "申请日期",
                        width: 30,
                        align: "center",
                        formatter: function(value) {
                            return topevery.dataTimeFormat(value);
                        },
                        sortable: true
                    }
                ]
            ],
            onDblClickRow: EngineeringProject.dbClick,
            toolbar: '#toolbarWrap'
        });
        for (var i = 0; i < $(".easyui-textbox").length; i++) {
            $("#" + $('.easyui-textbox').eq(i)[0].id + "").textbox({
                inputEvents: $.extend({}, $.fn.textbox.defaults.inputEvents, {
                    keyup: function (event) {
                        if (event.keyCode === 13) {
                            EngineeringProject.loadInfo80();
                        }
                    }
                })
            });
        };
        $("#completed-search-btn").on("click", function () {
            $("#completed-search-list").slideToggle();
            j = j + 1;
            if (j % 2 !== 0) {
                $("#completed-search-btn").html("收起∧");
            } else {
                $("#completed-search-btn").html("更多∨");
            }
        });
        $(document).dequeue("datagrid0102");
    },
    ///小修工程修缮流程查看
    dbClick: function (index, data) {
        if (data === undefined) {
            data = $('#EngineeringProjectTable').datagrid('getRows')[index];
        }
        if (data.taskType === 1) {
            EngineeringProject.open(1005, 525, "小修工程修缮流程查看", virtualDirName + 'HouseRepair/MinorRepairEngineeringToView?workFlowInstanceId=' + data.flowInstanceId + '&fromInstanceId=' + data.id);
        } else if (data.taskType === 2) {
            EngineeringProject.open(1000, 420, "大中修工程修缮流程查看", virtualDirName + 'BigHouseRepair/DaZhongXiuEngineeringApplyToView?workFlowInstanceId=' + data.flowInstanceId + '&fromInstanceId=' + data.id);
        }
    },
    open: function (width, height, title, url) {
        var dialog = ezg.modalDialog({
            width: width,
            height: height,
            title: title,
            url: url
        });
    },
    ///查看小修工程修缮申请
    ToView: function () {
        var data = $('#EngineeringProjectTable').datagrid('getSelections')[0];
        if (data == undefined) {
            $.messager.alert('提示', '请选择一条工程修缮申请记录!', 'info');
        } else {
            if (data.taskType === 1) {
                EngineeringProject.open(1000, 500, "小修工程修缮申请查看", virtualDirName + 'HouseRepair/MinorRepairEngineeringApplyToView?id=' + data.id);
            } else if (data.taskType === 2) {
                EngineeringProject.open(1000, 480, "大中修工程修缮流程查看", virtualDirName + 'BigHouseRepair/DaZhongXiuEngineeringToView?id=' + data.id);
            }

        }
    },
    print: function () {
        if ($('#EngineeringProjectTable').datagrid('getSelections')[0] == undefined || $('#EngineeringProjectTable').datagrid('getSelections')[0].taskName === "大中修工程申请") {
            $.messager.alert('提示', '请选择一条小修工程修缮申请记录!', 'info');
        } else {
            window.open(virtualDirName + "PrintRelevant/ConstructTaskSheet?id=" + $('#EngineeringProjectTable').datagrid('getSelections')[0].id);
        }
    },
    ///搜索
    loadInfo80: function () {
        $('#EngineeringProjectTable').datagrid('load', { input: topevery.form2Json("sumbitFrom") }); //点击搜索
    },
    ///
    bangdingxialai: function () {
        bindDicToDrp("propertyId", "B34CFE85-FB80-4817-B660-B8DF27F8DC76", "产权属性", false);
        bindDicToDrp("BuildStructureId", "29A43A34-8D05-4F9A-B0FA-EFB8A38F7F98", "建筑结构", false);
        bindDropDown("HouseManageId", "Common/GetWorkstationBind", "工作站", false);
    }
}
///初始化
$(function () {
    $(document).queue("datagrid0101", function () { EngineeringProject.Initialize(); });
    $(document).queue("datagrid0102", function () { EngineeringProject.bangdingxialai(); });
    $(document).dequeue("datagrid0101");
});
