var pageNumber;//首次加载时需要加载的页数
Property = {
    Select: function () {
        $("#propertyDataGrid").datagrid("load");
    },
    Facility: function (i) {
        var pn = $("#propertyDataGrid").datagrid("options").pageNumber;
        window.location = virtualDirName + "Property/PropertyFacility?propertyId=" + i + "&pageNumber=" + pn;
    },
    Add: function () {
        var dialog = ezg.modalDialog({
            width: 600,
            height: 280,
            title: '小区新增',
            url: virtualDirName + "Property/PropertyAdd",
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
            height: 280,
            title: '小区修改',
            url: virtualDirName + "Property/PropertyAdd?id="+i,
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
        deleteAjax("", "propertyDataGrid", virtualDirName + 'api/services/app/PropertyW/DeletedPropertyAsync');
    },
    Initialize: function () {
        grid= $("#propertyDataGrid").datagrid({
            height: 500,
            idField: "id",
            fitColumns: true,
            fit: true,
            nowrap: false,
            rownumbers: true, //行号
            pagination: true, //分页控件
            toolbar: "#toolbarWrap",
            singleSelect: true,
            pageNumber:pageNumber-0,
            columns: [[
                { field: "id", checkbox: true },
                { field: "propertyName", title: "物业小区名称", width: 100, align: "center" },
                { field: "houseManageName", title: "所属工作站", width: 100, align: "center" },
                { field: "location", title: "地址", width: 600, align: "center" },
                {
                    field: "null", title: "操作", width: 120, align: "center", formatter: function (value, row, index) {
                        return "<a class='easyui-modifyoperate' onclick='Property.Edit(" + row.id + ")'>修改</a>&nbsp;" +
                            "<a class='easyui-oldoperate' onclick='Property.Facility(" + row.id + ")'>设备设施</a>";
                    }
                }
            ]],
            loader: function (param, success, error) {
                topevery.ajax({
                    type: "POST",
                    url: "api/services/app/PropertyR/GetPropertyPageList",
                    contentType: "application/json",
                    data: topevery.extend(topevery.form2Json("selectForm"), {
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
                }
                , false);
            }
        });
        for (var i = 0; i < $(".easyui-textbox").length; i++) {
            $("#" + $('.easyui-textbox').eq(i)[0].id + "").textbox({
                inputEvents: $.extend({}, $.fn.textbox.defaults.inputEvents, {
                    keyup: function (event) {
                        if (event.keyCode === 13) {
                            Property.Select();
                        }
                    }
                })
            });
        }
    }
};
var grid;
$(function () {
    bindDropDown("houseManageId", "Common/GetWorkstationBind", "所属工作站", false, false);
    var t = getRequest("pageNumber");
    pageNumber = t == null ? "1" : t;
    Property.Initialize();
});