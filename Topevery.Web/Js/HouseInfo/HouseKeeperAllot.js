var HouseKeeperAllot = {
    Initialize: function () {
        $("#HouseKeeperAllotDataGrid").datagrid({
            columns: [
                [
                    { field: "id", checkbox:true },
                    { field: "houseNo", title: "房屋编号", width: 60, align: "center" },
                    { field: "houseDoorplate", title: "房屋门牌", width: 100, align: "center" },
                    { field: "propertyIdName", title: "产权属性", width: 60, align: "center" },
                    { field: "buildStructureName", title: "建筑结构", width: 60, align: "center" },
                    { field: "buildArea", title: "建筑面积(㎡)", width: 80, align: "center" }
                    //{ field: "houseManageName", title: "房管员", width: 100, align: "center" }
                ]
            ],
            height: 520,
            idField: "id",
            striped: true,
            fitColumns: true,
            rownumbers: true,
            pagination: true,
            toolbar: "#toolbar",
            showFooter: true,
            singleSelect: false,
            pageSize: 100,
            pageList: [20, 50, 100, 250],
            onLoadSuccess: function (data) {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
                $(this).datagrid("clearSelections").datagrid("clearChecked");
            },
            loader: function (param, success, error) {
                topevery.ajax({
                    type: "POST",
                    url: "api/services/app/HouseBanR/GetDistributionControllerList",
                    contentType: "application/json",
                    data: topevery.extend(topevery.form2Json("selectFrom"), {
                        PageIndex: param.page,
                        PageCount: param.rows,
                        id: "",
                        isAssign: $("#isAssign").combobox('getValue'),
                        GetInfoType:1,UserDeptId: getRequest("UserDeptId")})
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
    Initialize1: function () {
        $("#HouseKeeperAllotDataGrid1").datagrid({
            columns: [
                [
                    { field: "id", checkbox: true },
                    { field: "houseNo", title: "房屋编号", width: 60, align: "center" },
                    { field: "houseDoorplate", title: "房屋门牌", width: 100, align: "center" },
                    { field: "propertyIdName", title: "产权属性", width: 60, align: "center" },
                    { field: "buildStructureName", title: "建筑结构", width: 60, align: "center" },
                    { field: "buildArea", title: "建筑面积(㎡)", width: 80, align: "center" },
                    { field: "houseManageName", title: "房管员", width: 100, align: "center" }
                ]
            ],
            height: 520,
            idField: "id",
            striped: true,
            fitColumns: true,
            rownumbers: true,
            toolbar: "#toolbar1",
            pagination: true,
            showFooter: true,
            singleSelect: false,
            pageSize: 100,
            pageList: [20, 50, 100, 250],
            onLoadSuccess: function (data) {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
                $(this).datagrid("clearSelections").datagrid("clearChecked");
            },
            loader: function (param, success, error) {
                topevery.ajax({
                    type: "POST",
                    url: "api/services/app/HouseBanR/GetDistributionControllerList",
                    contentType: "application/json",
                    data: topevery.extend(topevery.form2Json("selectFrom1"), {
                        PageIndex: param.page,
                        PageCount: param.rows,
                        ManageUserId: getRequest("id"),
                        isAssign:$("#isAssign1").combobox('getValue'),
                        UserDeptId: getRequest("UserDeptId"),
                        GetInfoType: 1})
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
    Select:function() {
        $("#HouseKeeperAllotDataGrid").datagrid("reload");
    },
    Select1: function () {
        $("#HouseKeeperAllotDataGrid1").datagrid("reload");
    },
    
    SaveUpdate: function () {
        var selectRow = $("#HouseKeeperAllotDataGrid").datagrid("getSelections");
        var ids = [];
        $.each(selectRow, function () {
            ids.push(this.id);
        });
        if (selectRow.length) {
            topeveryMessage.confirm(function(r) {
                if (r) {
                    var housekeepId = getRequest("id");
                    topevery.ajax({
                        type: "POST",
                        url: "api/services/app/HouseBanW/AssignHouseBanAsync",
                        contentType: "application/json",
                        data: topevery.extend({
                            HouseIds: ids.join(),
                            HousekeepId: housekeepId
                        })
                    }, function(data) {
                        if (data.success) {
                            $("#HouseKeeperAllotDataGrid").datagrid("reload");
                            $("#HouseKeeperAllotDataGrid1").datagrid("reload");
                            window.top.topeveryMessage.show("成功");
                        }
                    }, false);
                };
            });
        } else {
            window.top.topeveryMessage.show("请选择一条数据");
        }
    },
    SaveUpdate1: function () {
        var selectRow = $("#HouseKeeperAllotDataGrid1").datagrid("getSelections");
        var ids = [];
        $.each(selectRow, function () {
            ids.push(this.id);
        });
        if (selectRow.length) {
            topeveryMessage.confirm(function(r) {
                if (r) {
                    var housekeepId = "";
                    topevery.ajax({
                        type: "POST",
                        url: "api/services/app/HouseBanW/AssignHouseBanAsync",
                        contentType: "application/json",
                        data: topevery.extend({
                            HouseIds: ids.join(),
                            HousekeepId: housekeepId
                        })
                    }, function(data) {
                        if (data.success) {
                            $("#HouseKeeperAllotDataGrid").datagrid("reload");
                            $("#HouseKeeperAllotDataGrid1").datagrid("reload");
                            window.top.topeveryMessage.show("成功");
                        }
                    }, false);
                };
            });
        } else {
            window.top.topeveryMessage.show("请选择一条数据");
        }
    }
};
$(function () {
    $("#isAssign").combobox({
        onChange:function() {
            HouseKeeperAllot.Initialize("load");
        }
    });
    $("#isAssign1").combobox({
        onChange: function () {
            HouseKeeperAllot.Initialize1("load");
        }
    });
    HouseKeeperAllot.Initialize();
    HouseKeeperAllot.Initialize1();
});

function empty() {
    $("#houseNo").textbox("setValue", "");
    $("#houseDoorplate").textbox("setValue", "");
    $("#HouseKeeperAllotDataGrid").datagrid("reload");
};
function empty1() {
    $("#houseNo1").textbox("setValue", "");
    $("#houseDoorplate1").textbox("setValue", "");
    $("#HouseKeeperAllotDataGrid1").datagrid("reload");
};