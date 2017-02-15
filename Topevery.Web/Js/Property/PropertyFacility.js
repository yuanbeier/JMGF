PropertyFacility = {
    Select: function () {
        $("#facilityDataGrid").datagrid("load");
    },
    Add: function () {
        var dialog = ezg.modalDialog({
            width: 600,
            height: 400,
            title: '新增物业设备设施',
            url: virtualDirName + "Property/FacilityAdd?propertyId=" + $("#propertyId").val(),
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
    Edit:function(i){
        var dialog = ezg.modalDialog({
            width: 600,
            height: 400,
            title: '修改物业设备设施',
            url: virtualDirName + "Property/FacilityAdd?id=" + i,
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
    Deleted: function () {
        deleteAjax("", "facilityDataGrid", virtualDirName + 'api/services/app/PropertyFacilityW/DeletedPropertyFacilityAsync');
    },
    Initialize: function () {
        grid = $("#facilityDataGrid").datagrid({
            idField: "id",
            fitColumns: true,
            fit: true,
            nowrap: false,
            rownumbers: true, 
            pagination: true, 
            toolbar: "#toolbarWrap",
            singleSelect: true,
            columns: [[
                { field: "id", checkbox: true },
                { field: "propertyName", title: "小区名称", width: 100, align: "center" },
                { field: "facilityName", title: "设备名称", width: 100, align: "center" },
                { field: "facilityNo", title: "设备编号", width: 100, align: "center" },
                { field: "facilityTypeName", title: "设备类型", width: 100, align: "center" },
                { field: "location", title: "设备位置", width: 600, align: "center" },
                {
                    field: "null", title: "操作", width: 80, align: "center", formatter: function (value, row, index) {
                        return "<a class='easyui-modifyoperate' onclick='PropertyFacility.Edit(" + row.id + ")'>修改</a>";
                    }
                }
            ]],
            loader: function (param, success, error) {
                topevery.ajax({
                    type: "POST",
                    url: "api/services/app/PropertyFacilityR/GetPropertyFacilityPageList",
                    contentType: "application/json",
                    data: topevery.extend(topevery.form2Json("selectForm"), {
                        PageIndex: param.page,
                        PageCount: param.rows,
                        Sort: param.sort,
                        Order: param.order,
                        PropertyId: $("#propertyId").val()
                    })
                }, function (data) {
                    if (data.success) {
                        success(data.result);
                    } else {
                        error();
                    }
                }
                , false);
            }
        });
        for (var i = 0; i < $(".easyui-textbox").length; i++) {
            $("#" + $('.easyui-textbox').eq(i)[0].id + "").textbox({
                inputEvents: $.extend({}, $.fn.textbox.defaults.inputEvents, {
                    keyup: function (event) {
                        if (event.keyCode === 13) {
                            PropertyFacility.Select();
                        }
                    }
                })
            });
        }
    },
    PageReturn: function () {
        window.location.href = virtualDirName + "Property/PropertyIndex?pageNumber=" + getRequest("pageNumber");
    }
};
var grid;
$(function () {
    bindDicToDrp("facilityType", "A1FBDBF8-EA75-4E3A-810A-CEFFC3339DAB", "设备类型")//设备类型;
    PropertyFacility.Initialize();
});