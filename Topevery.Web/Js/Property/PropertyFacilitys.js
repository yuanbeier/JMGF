var grid;
PropertyFacility = {
    Select: function () {
        $("#examineDataGrid").datagrid("load");
    },
    Add: function (i) {
        var selectRows= $("#examineDataGrid").datagrid("getSelections");
        if (selectRows < 1) {
            window.top.topeveryMessage.show("请选择小区设备");
            return;
        }
        var ids = [];
        for (var i in selectRows) {
            ids.push(selectRows[i].id);
        }
        var dialog = ezg.modalDialog({
            width: 600,
            height: 400,
            title: '巡检记录新增',
            url: virtualDirName + "Property/ExamineAdd?facilityId="+i,
            buttons: [
                {
                    text: '确认',
                    iconCls: 'icon-ok',
                    handler: function () {
                        dialog.find('iframe').get(0).contentWindow.submitFormAdd(dialog, grid, this, ids.join());
                    }
                }
            ]
        });
    },
    FacilityExamineView: function (i) {
        dialog = ezg.modalDialog({
            width: 1000,
            height: 530,
            title: '历史巡查记录',
            url: virtualDirName + 'Property/ExamineIndex?facilityId='+i
        });
    },
    Initialize: function () {
        grid = $("#examineDataGrid").datagrid({
            idField: "id",
            fitColumns: true,
            fit: true,
            nowrap: false,
            rownumbers: true, 
            pagination: true, 
            toolbar: "#toolbarWrap",
            //singleSelect: true,
            columns: [[
                { field: "id", checkbox: true },
                { field: "propertyName", title: "小区名称", width: 100, align: "center" },
                { field: "facilityName", title: "设备名称", width: 100, align: "center" },
                { field: "facilityNo", title: "设备编号", width: 100, align: "center" },
                { field: "facilityTypeName", title: "设备类型", width: 100, align: "center" },
                { field: "location", title: "设备位置", width: 600, align: "center" },
                {
                    field: "examineCount", title: "历史巡查记录", width: 100, align: "center", formatter: function (value, row, index) {
                        return "<a href='javascript:void(0)' onclick='PropertyFacility.FacilityExamineView(" + row.id + ")'>共" + value + "条</a>"
                    }
                }
            ]],
            loader: function (param, success, error) {
                topevery.ajax({
                    type: "POST",
                    url: "api/services/app/PropertyFacilityR/GetPropertyFacilityGroupByPageList",
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
                }
                , false);
            },
            onLoadSuccess: function (data) {
                $(this).datagrid("clearSelections").datagrid("clearChecked");
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
    }
};
$(function () {
    bindDicToDrp("facilityType", "A1FBDBF8-EA75-4E3A-810A-CEFFC3339DAB", "设备类型")//设备类型;
    PropertyFacility.Initialize();
});