$(function () {
    $(document).queue("datagrid0101", function () {
        if ($("#WorkstationDropDown").val()) {
            bindDropDown("userDeptId", "Common/GetWorkstationBind", "--工作站--", false, false);
        } else {
            bindDropDown("userDeptId", "Common/GetWorkstationBind", "--工作站--", false, true);
            $("#userDeptId").combobox("readonly");
        }
    });
    $(document).queue("datagrid0102", function () { HouseKeeper.Initialize(); });
    $(document).dequeue("datagrid0101");
});
///扩展方法
function bindDropDown(btnid, url, defaultText, required, lastDefault) {
    $("#" + btnid).combobox({
        editable: false,
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
            }; $(document).dequeue("datagrid0102");
            // 添加空行
            if (defaultText !== "") {
                if ($.isArray(data)) {
                    data.splice(0, 0, { value: "", text: defaultText });
                }
            }
            return data;
        },
        required: required ? true : false
    });
}
var HouseKeeper = {
    Initialize: function () {
        $("#HouseKeeperDataGrid").datagrid({
            columns: [
                [
                    { field: "userDeptName", title: "工作站", width: 60, align: "center" },
                    { field: "housekeepName", title: "房管员", width: 100, align: "center" },
                    {
                        field: "number", title: "楼栋数量", width: 100, align: "center", formatter: function (value, row, index) {
                            return "<a href=\"#\" onclick=\"HouseKeeper.dbHouseban('" + row.housekeepId + "');\">" + value + "</a>";
                        }, sortable: true
                    },
                    {
                        field: "unitNumber", title: "分户数量", width: 100, align: "center", formatter: function (value,row, index ) {
                            return "<a href=\"#\" onclick=\"HouseKeeper.dbClick('" + row.housekeepId + "');\">" + value + "</a>";
                        }, sortable: true
                    },
                    {
                        field: "Null",
                        title: "操作",
                        width: 100,
                        align: "center",
                        formatter: function (value, row, index) {
                            var a;
                            a = $("#hiddenAssignHouseKeeper").val() ? "<a href='#' class='easyui-modifyoperate' onclick='HouseKeeper.Add(" + row.id + "," + row.userDeptId + ")'>分配楼栋<a/>" : "";
                            return a;
                        }
                    }
                ]
            ],
            height: 500,
            idField: "housekeepId",
            striped: true,
            fitColumns: true,
            fit:true,
            rownumbers: true,
            pagination: true, 
            showFooter: true,
            toolbar: "#toolbarWrap",
            onLoadSuccess: function (data) {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
            },
            loader: function (param, success, error) {
                topevery.ajax({
                    type: "POST",
                    url: "api/services/app/HouseBanR/GetHouseKeeperPageList",
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
                }, false);
            }
        });
        for (var i = 0; i < $(".easyui-textbox").length; i++) {
            $("#" + $('.easyui-textbox').eq(i)[0].id + "").textbox({
                inputEvents: $.extend({}, $.fn.textbox.defaults.inputEvents, {
                    keyup: function (event) {
                        if (event.keyCode === 13) {
                            HouseKeeper.Select();
                        }
                    }
                })
            });
        }
    },
    Add: function (id, UserDeptId) {
        var dialog = ezg.modalDialog({
            width: 1200,
            height: 570,
            title: '分派房管理员',
            url: virtualDirName + "House/HouseKeeperAllot?id=" + id + "&UserDeptId=" + UserDeptId
    });
    },
    //查看分户信息
    dbClick:function(id) {
        var dialog = ezg.modalDialog({
            width: 1200,
            height: 570,
            title: '查看分户信息',
            url: virtualDirName + "House/ListHousehold?id=" + id
        });
    },
    //查看楼栋详细信息
    dbHouseban: function (id) {
        var dialog = ezg.modalDialog({
            width: 1200,
            height: 575,
            title: '查看楼栋信息',
            url: virtualDirName + "House/ListHouseban?id=" + id
        });
    },
    Select:function() {
        $("#HouseKeeperDataGrid").datagrid("reload");
    },
    empty: function() {
        $("#housekeepName").textbox("setValue", "");
        $("#HouseKeeperDataGrid").datagrid("reload");
    }
};