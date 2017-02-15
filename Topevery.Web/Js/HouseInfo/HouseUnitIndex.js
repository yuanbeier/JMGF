var grid;
var houseNo = getRequest("houseNo");
var HouseUnitIndex = {
    Initialize: function() {
        grid=$("#houseUnitDataGrid").datagrid({
            columns: [
                [
                    { field: "id", checkbox: true },
                    {
                        field: "unitName", title: "单元名称", width: 100, align: "center", formatter: function (value, row, index) {
                            if (value.indexOf("总数") === -1) {
                                return "<a href='#' onclick='HouseUnitIndex.Show(" + row.id + ")'>" + value + "</a>";
                                
                            } else {
                                return value;
                            }
                        }
                    },
                    { field: "houseDoorplate", title: "现房屋门牌", width: 100, align: "center" },
                    { field: "residPopNum", title: "常住人口", width: 100, align: "center" },
                    { field: "rentRange", title: "租用范围", width: 100, align: "center" },
                    { field: "buildArea", title: "建筑面积(㎡)", width: 100, align: "center" },
                    { field: "metRentArea", title: "计租面积(㎡)", width: 100, align: "center" },
                    { field: "baseRent", title: "租金基数(￥)", width: 100, align: "center" },
                    { field: "isRent", title: "房屋是否出租", width: 100, align: "center", formatter: this.DisabledCheckBox },
                    { field: "isRentable", title: "是否可出租", width: 100, align: "center", formatter: this.DisabledCheckBox },
                    { field: "isTao", title: "是否成套住宅", width: 100, align: "center", formatter: this.DisabledCheckBox },
                    { field: "isHome", title: "是否住宅", width: 100, align: "center", formatter: this.DisabledCheckBox },
                    { field: "isSwing", title: "是否周转房", width: 100, align: "center", formatter: this.DisabledCheckBox },
                     { field: "isPubRenHous", title: "是否公租房", width: 100, align: "center", formatter: this.DisabledCheckBox },
                    { field: "isLowRentHous", title: "是否廉租房", width: 100, align: "center", formatter: this.DisabledCheckBox }
                ]
            ],
            height: 364,
            idField: "id",
            fit:true,
            fitColumns: true,
            singleSelect: true,
            nowrap: false,
            rownumbers: true, //行号
            pagination: true, //分页控件
            showFooter: true,
            toolbar: "#toolbarWrap",
            onLoadSuccess: function (data) {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
                $(this).datagrid("clearSelections").datagrid("clearChecked");
            },
            loader: function(param, success, error) {
                topevery.ajax({
                    type: "POST",
                    url: "api/services/app/HouseUnitR/GetHouseUnitPageList",
                    contentType: "application/json",
                    data: topevery.extend(topevery.form2Json("selectFrom"),{
                        PageIndex: param.page,
                        PageCount: param.rows,
                        HouseId: getRequest("id")
                    })
                }, function(data) {
                    if (data.success) {
                        success(data.result);
                    } else {
                        error();
                    }
                }, false);
            }
        });
    },
    Select: function() {
        $("#houseUnitDataGrid").datagrid("reload");
    },
    Add: function () {
        var dialog = ezg.modalDialog({
            width: 900,
            height: 608,
            title: '新增分户',
            url: virtualDirName + "House/HouseUnitAdd?houseId=" + getRequest("houseId") + "&houseNo=" + getRequest("houseNo"),
            buttons: [
                {
                    text: '确认',
                    iconCls: 'icon-ok',
                    handler: function () {
                        dialog.find('iframe').get(0).contentWindow.HouseUnitAdd.Add(dialog, grid,this);
                    }
                }
            ]
        });
    },
    Edit: function () {
        var arrRows = $('#houseUnitDataGrid').datagrid('getChecked');
        if (arrRows.length === 0) {
            window.top.topeveryMessage.show("请选择一条需要修改的记录!", "提示");
            return;
        }
        var dialog = ezg.modalDialog({
            width: 900,
            height: 608,
            title: '修改分户',
            url: virtualDirName + "House/HouseUnitAdd?houseId=" + getRequest("houseId") + "&houseNo=" + getRequest("houseNo")+"&id="+arrRows[0].id,
            buttons: [
                {
                    text: '确认',
                    iconCls: 'icon-ok',
                    handler: function () {
                        dialog.find('iframe').get(0).contentWindow.HouseUnitAdd.Edit(dialog, grid,this);
                    }
                }
            ]
        });
    },
    Deleted: function () {
        var arrRows = $('#houseUnitDataGrid').datagrid('getChecked');
        if (arrRows.length === 0) {
            window.top.topeveryMessage.show("请选择一条需要删除的记录!", "提示");
            return;
        }
        var ids = [];
        var url = virtualDirName + 'api/services/app/HouseUnitW/DeleteHouseUnitAsync';
        $.each(arrRows, function () {
            ids.push(this.id);
        });
        deleteAjax(ids.join(), "houseUnitDataGrid", url);
    },
    DisabledCheckBox: function(value, row, index) {
        if (value === 1) return "<input type='checkbox' checked='checked' disabled='disabled' />";
        else if (value === 0) {
            return "<input type='checkbox' disabled='disabled' />";
        } else {
            return "";
        }
     
    },
    //房屋设施清单
    fnHouseFacility: function () {
        var arrRows = $('#houseUnitDataGrid').datagrid('getChecked');
        if (!(arrRows.length === 1)) {
            window.top.topeveryMessage.show("请选择有且只能一条记录!", "提示");
            return;
        }
        var dialog = ezg.modalDialog({
            width: 1200,
            height: 460,
            title: '房屋设施清单',
            url: virtualDirName + "House/HouseFacilityIndex?id=" + arrRows[0].id,
            buttons: [
                {
                    text: '确认',
                    iconCls: 'icon-ok',
                    handler: function () {
                        dialog.find('iframe').get(0).contentWindow.HouseFacilityIndexs.Add(dialog, grid);
                    }
                }
            ]
        });
    },
    Show: function (id) {
        var dialog = ezg.modalDialog({
            width: 650,
            height: 558,
            title: '详细信息',
            url: virtualDirName + "House/LeaseAndContractInfo?id=" + id+"&houseNo=" +houseNo
        });
    },
    HouseUnitExp: function () {
        window.location.href = virtualDirName + "House/HouseUnitExp" + GetUrlByform2Json();
    },
    PageReturn: function () {
        window.location.href = virtualDirName + "House/HouseBanIndex?pageNumber=" + getRequest("pageNumber");
    }
};
$(function () {
    HouseUnitIndex.Initialize();
});
