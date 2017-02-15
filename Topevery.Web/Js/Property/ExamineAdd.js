submitFormAdd = function (dialog, grid, that,ids) {
    if (!$("#propertAdd").form("validate")) {
        return;
    }
    var array = ezg.serializeObject($("form"));
    array.facilityIds = ids;
    that.onclick = function () {
        window.top.topeveryMessage.show("请不要重复提交");
    }
    topevery.ajax({
        type: "POST",
        url: "api/services/app/FacilityExamineW/AddFacilityExamineAsync",
        contentType: "application/json",
        data: topevery.extend(array)
    }, function (data) {
        if (data.success) {
            grid.datagrid('reload');
            dialog.dialog('destroy');
        }
    }, true);
};

LeasingApplication = {
    setValueName: function (data) {
        $("#engineerName").textbox("setValue", data.unitName);
        $("#engineerId").val(data.id);
    }
};

$(function () {
    bindDicToDrp("examineType", "3758E6C2-D5BA-41F1-8686-0E791A9C2438", "",true)//巡检类型;
    bindDicToDrp("examineResult", "B4A9912F-77B8-4DFB-95A6-CE973A420A0B", "", true)//巡检结果
    $("#engineerName").textbox({
        width: 150,
        height: 30,
        required: true,
        editable: false,
        icons: [
            {
                iconCls: "icon-search",
                handler: function () {
                    dialog = ezg.modalDialog({
                        width: 1000,
                        height: 530,
                        title: '单位信息选择',
                        url: virtualDirName + 'IntegrityMent/EngineerUnitSelect'
                    });
                }
            }
        ]
    });
});