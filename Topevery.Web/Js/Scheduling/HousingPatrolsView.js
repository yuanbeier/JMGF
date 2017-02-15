var grid;
var ids;
///初始化
$(function () {
    $(document).queue("datagrid0101", function () { housingPatrolsView.Initialize1(); });
    $(document).queue("datagrid0102", function () { housingPatrolsView.Initialize2(); });
    $(document).dequeue("datagrid0101");
});
housingPatrolsView = {
    Initialize1: function () {
        if ($("#WorkstationDropDown").val()) {
            bindDropDown("HouseManageId", "Common/GetWorkstationBind", "--工作站--", false, false);
        } else {
            bindDropDown("HouseManageId", "Common/GetWorkstationBind", "--工作站--", false, true);
            $("#HouseManageId").combobox("readonly");
        }
        $(document).dequeue("datagrid0102");
    },
    ///加载列表数据-
    Initialize2: function () {
        grid = $('#SchedulingTable').datagrid({
            columns: [
                [
                    { field: "id", checkbox: true },
                    { field: "userDeptName", title: "工作站", width: 60, align: "center" },
                    { field: "housekeepName", title: "房管员", width: 100, align: "center" },
                ]
            ],
            height: 400,
            idField: "housekeepId",
            striped: true,
            fitColumns: true,
            // fit: true,
            rownumbers: true, //行号
            pagination: true, //分页控件
            pageSize: 10,
            pageList: [10, 20, 50, 100],
            showFooter: true,
            toolbar: "#housingPatrolsView",
            onLoadSuccess: function (data) {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
            },
            loader: function (param, success, error) {
                topevery.ajax({
                    type: "POST",
                    url: "api/services/app/HouseBanR/GetHouseKeeperPageList",
                    contentType: "application/json",
                    data: topevery.extend(null, {
                        PageIndex: param.page,
                        PageCount: param.rows,
                        HousekeepName: $("#HousekeepName").textbox('getValue'),
                        UserDeptId: $("#HouseManageId").combobox('getValue')
                    })
                }, function (data) {
                    if (data.success) {
                        success(data.result);
                        $(document).dequeue("datagrid0103");
                    } else {
                        error();
                    }
                }, true);
            }
        });
    },
    //搜索
    loadInfo: function () {
        $('#SchedulingTable').datagrid('load',null); //点击搜索
    },
    //重置
    Clear: function () {
        $("#HousekeepName").textbox('setValue', '');
        housingPatrolsView.loadInfo();
    },
    ///保存
    Save: function () {
        var arrRows = $('#SchedulingTable').datagrid('getChecked');
        var userIds = "";
        if (arrRows.length === 0) {
            topeveryMessage.show("请选择任务指定人员!");
            return;
        }
        if ($("#TaskType").combobox('getValue')==="") {
            topeveryMessage.show("任务类型不能为空!");
            return;
        }
        if ($("#TaskContent").textbox('getValue') === "") {
            topeveryMessage.show("任务内容不能为空!");
            return;
        }
        for (var i = 0; i < arrRows.length; i++) {
            if (arrRows[i] !== "housekeepId") {
                userIds += arrRows[i].id + ",";
            }
        }
        var url = "api/services/app/InspectTaskW/AddAsync";
        if ($("#housingPatrolsView").form('validate') === false) {
            return;
        } else {
            topevery.ajax({
                type: "POST",
                url: url,
                contentType: "application/json",
                data: topevery.extend(null, { Accepters: userIds, TaskType: $("#TaskType").combobox('getValue'), TaskContent: $("#TaskContent").textbox('getValue') })
            }, function (data) {
                if (data.success) {
                    try {
                        window.top.topeveryMessage.show("新增成功!");
                    } catch (e) {

                    } 
                    window.location.href = virtualDirName + "Scheduling/HousingPatrols";
                } else {
                    error();
                }
            }, true);
        }
    }
}
