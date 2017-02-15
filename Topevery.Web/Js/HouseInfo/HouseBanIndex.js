var pageNumber;//首次加载时需要加载的页数
$(function () {
    if ($("#WorkstationDropDown").val()) {
        bindDropDown("userDeptId", "Common/GetWorkstationBind", "--工作站--", false, false);
    } else {
        bindDropDown("userDeptId", "Common/GetWorkstationBind", "--工作站--", false, true);
        $("#userDeptId").attr("readonly", "readonly");
        $("#userDeptId").combobox("readonly");
    }

    bindDicToDrp("PropertyId", "B34CFE85-FB80-4817-B660-B8DF27F8DC76", "--产权属性--", false);
    bindDicToDrp("BuildStructureId", "29A43A34-8D05-4F9A-B0FA-EFB8A38F7F98", "--建筑结构--", false);
    bindDicToDrp("SecurityLevelId", "834D7912-4FBC-401B-A546-1B7831A86048", "--安全等级--", false);
    var t = getRequest("pageNumber");
    pageNumber = t == null ? "1" : t;
    HouseBanIndex.Initialize();
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
var grid;
var HouseBanIndex = {
    Initialize: function () {
        grid = $("#houseBanDataGrid").datagrid({
            height: 500,
            idField: "id",
            //fitColumns: true,
            fit: true,
            nowrap: false,
            rownumbers: true, //行号
            pagination: true, //分页控件
            striped: true,
            toolbar: "#toolbarWrap",
            showFooter: true,
            pageNumber: pageNumber - 0,
            frozenColumns: [
                [
                    {
                        field: "nsbp",
                        title: "操作",
                        width: 140,
                        align: "center",
                        formatter: function (value, row, index) {
                            if (row.id !== -1) {
                                var a, b;
                                a = $("#hideEdit").val() ? "<a href='#' class='easyui-modifyoperate' onclick='HouseBanIndex.Edit(" + row.id + ")'>修改</a>&nbsp;" : "";
                                b = $("#hideUnit").val() ? "<a href='#' class='easyui-oldoperate' onclick='HouseBanIndex.HouseUnit(" + row.id + ",\"" + row.houseNo + "\")'>公房分户</a>" : "";
                                return a + b;
                            } else {
                                return "统计";
                            }
                        }
                    }
                ]
            ],
            columns: [
                [
                    { field: "id", checkbox: true },
                    {
                        field: "houseNo",
                        title: "房屋编号",
                        width: 85,
                        align: "center",
                        sortable: true,
                        formatter: function (value, row, index) {
                            if (row.id !== -1) {
                                return "<a href='#' onclick='objectExtend.HouseBan(" + row.id + ")'>" + value + "</a>";
                            } else {
                                return value;
                            }
                        }
                    },
                    { field: "houseDoorplate", title: "现房屋门牌", width: 100, align: "center" },
                    { field: "totalFloors", title: "总层数", width: 85, align: "center" },
                    { field: "buildStructureName", title: "建筑结构", width: 80, align: "center" },
                    { field: "propertyIdName", title: "产权属性", width: 100, align: "center" },
                    { field: "propertyRange", title: "产权范围", width: 100, align: "center" },
                    { field: "buildArea", title: "建筑面积(㎡)", width: 85, align: "center", sortable: true },
                    { field: "metRentArea", title: "计租面积(㎡)", width: 85, align: "center", sortable: true },
                    { field: "completYear", title: "建成年份", width: 85, align: "center" },
                    { field: "securityLevelName", title: "安全等级", width: 85, align: "center" },
                    { field: "areaIdName", title: "所属区域", width: 100, align: "center" },
                    { field: "groundNo", title: "地号", width: 100, align: "center" },
                    { field: "landNatureName", title: "用地性质", width: 100, align: "center" },
                    { field: "landArea", title: "用地面积(㎡)", width: 100, align: "center" },
                    { field: "substrateArea", title: "基底面积(㎡)", width: 100, align: "center" },
                    { field: "immovableNo", title: "不动产证号", width: 100, align: "center" },
                    { field: "houseManageName", title: "所属房管员", width: 120, align: "center" }
                ]
            ],
            onLoadSuccess: function (data) {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
                $(this).datagrid("clearSelections").datagrid("clearChecked");
            },
            loader: function (param, success, error) {
                topevery.ajax({
                    type: "POST",
                    url: "api/services/app/HouseBanR/GetHouseBanPageList",
                    contentType: "application/json",
                    data: topevery.extend(topevery.form2Json("selectFrom"), {
                        PageIndex: param.page,
                        PageCount: param.rows,
                        Sort: param.sort,
                        Order: param.order
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
                            HouseBanIndex.Select();
                        }
                    }
                })
            });
        }
    },
    Select: function () {
        $("#houseBanDataGrid").datagrid("reload");
    },
    Add: function () {
        var dialog = ezg.modalDialog({
            width: 1200,
            height: 460,
            title: '房屋新增',
            url: virtualDirName + "House/HouseBanAdd",
            buttons: [
                {
                    text: '确认',
                    iconCls: 'icon-ok',
                    handler: function () {
                        dialog.find('iframe').get(0).contentWindow.submitFormAdd(dialog, grid, this);
                    }
                }
            ]
        });
    },
    Edit: function (id) {
        var dialog = ezg.modalDialog({
            width: 1200,
            height: 460,
            title: '房屋修改',
            url: virtualDirName + "House/HouseBanAdd?id=" + id,
            buttons: [
                {
                    text: '确认',
                    iconCls: 'icon-ok',
                    handler: function () {
                        dialog.find('iframe').get(0).contentWindow.submitFormEdit(dialog, grid, this);
                    }
                }
            ]
        });
    },
    //公房分户
    HouseUnit: function (id, houseNo) {
        var pn = $("#houseBanDataGrid").datagrid("options").pageNumber;
        window.location = virtualDirName + "House/HouseUnitIndex?houseId=" + id + "&houseNo=" + houseNo + "&pageNumber=" + pn;
    },
    //批量删除
    batchDelete: function () {
        var arrRows = $('#houseBanDataGrid').datagrid('getChecked');
        if (arrRows.length === 0) {
            window.top.topeveryMessage.show("请选择一条需要删除的记录!", "提示");
            return;
        }
        var ids = [];
        var url = virtualDirName + 'api/services/app/HouseBanW/DeleteHouseBanAsync';
        $.each(arrRows, function () {
            ids.push(this.id);
        });
        deleteAjax(ids.join(), "houseBanDataGrid", url);
    },
    //单个删除
    singleDelete: function (id) {
        var url = virtualDirName + 'api/services/app/HouseBanW/DeleteHouseBanAsync';
        deleteAjax(id, "houseBanDataGrid", url);
    },
    HouseBanExp: function () {
        window.location.href = virtualDirName + "House/HouseBanExp" + GetUrlByform2Json();
    },
    Clear: function () {
        $("#selectFrom").form("reset");
        HouseBanIndex.Select();
    }
};
$('#userDeptId').combobox({
    onChange: function () {
        rentcheng();
    }
});
function rentcheng() {
    if ($("#userDeptId").combobox('getValue') != null && $("#userDeptId").combobox('getValue') !== "") {
        bindDropDown("ManageUserId", "Common/GetManageUserBind?userDeptId=" + $("#userDeptId").combobox('getValue'), "--房管员--");
    }
}

window.onload = function () {
    bindDropDown("ManageUserId", "Common/GetManageUserBind?userDeptId=" + $("#userDeptId").combobox('getValue'), "--房管员--");
}

//$("#txtIput").autocomplete(datas, {
//    formatItem: function (row, i, max) {
//        return "<table width='400px'><tr><td align='left'>" + row.Key + "</td><td align='right'><font style='color: #009933; font-family: 黑体; font-style: italic'>约" + row.Value + "个宝贝</font>&nbsp;&nbsp;</td></tr></table>";
//    },
//    formatMatch: function (row, i, max) {
//        return row.Key;
//    }
//});