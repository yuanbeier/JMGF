var grid;
PropertyFacility = {
    Select: function () {
        $("#ExamineIndexDataGrid").datagrid("load");
    },
    Initialize: function () {
        grid = $("#ExamineIndexDataGrid").datagrid({
            idField: "id",
            fitColumns: true,
            fit: true,
            nowrap: false,
            rownumbers: true, 
            pagination: true, 
            toolbar: "#toolbarWrap",
            singleSelect: true,
            columns: [[
                { field: "facilityName", title: "设备名称", width: 200, align: "center" },
                { field: "unitName", title: "巡查单位", width: 200, align: "center" },
                {
                    field: "examineTime", title: "巡查时间", width: 100, align: "center", formatter: function (value) {
                        return topevery.dataTimeFormat(value);
                    }
                },
                { field: "examineTypeName", title: "巡查类型", width: 100, align: "center" },
                { field: "examineResultName", title: "巡查结果", width: 100, align: "center" },
                { field: "examineContent", title: "巡检内容", width: 600, align: "center" }
            ]],
            loader: function (param, success, error) {
                topevery.ajax({
                    type: "POST",
                    url: "api/services/app/FacilityExamineR/GetFacilityExaminePageList",
                    contentType: "application/json",
                    data: topevery.extend(topevery.form2Json("selectForm"), {
                        PageIndex: param.page,
                        PageCount: param.rows,
                        Sort: param.sort,
                        Order: param.order,
                        facilityId: $("#facilityId").val()
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
    bindDicToDrp("examineType", "3758E6C2-D5BA-41F1-8686-0E791A9C2438", "巡检类型");
    bindDicToDrp("examineResult", "B4A9912F-77B8-4DFB-95A6-CE973A420A0B", "巡检结果");
    PropertyFacility.Initialize();
});