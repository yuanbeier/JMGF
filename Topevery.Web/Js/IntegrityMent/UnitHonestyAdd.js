var dialog;
var LeasingApplication = {
    ///弹出选择租户窗口
    openName: function() {
        dialog = ezg.modalDialog({
            width: 1000,
            height: 530,
            title: '租户信息选择',
            url: virtualDirName + 'IntegrityMent/EngineerUnitSelect'
        });
    },
    ///租户信息赋值方法
    setValueName: function (data) {
        $("#CompanyID").val(data.id);
        $("#CompanyName").textbox('setValue', data.unitName);

    },
    ///保存
    SaveLA: function() {
    if ($("#UnitHonestyAdd").form('validate') === false) {
        return;
    } else {
        topevery.ajax({
            type: "POST",
            url: "api/services/app/UnitHonestyMangmentW/AddUnitHonestyMangmentAsync",
            contentType: "application/json",
            data: JSON.stringify(ezg.serializeObject($('form'))
            )
        }, function(data) {
            if (data.success) {
                window.top.topeveryMessage.show("保存成功");
                window.location = virtualDirName + 'IntegrityMent/UnitHonestyMantIndex';
            } else {
                error();
            }
        }, true);
    }
   }
}

$("#IsDiscipline").combobox({ panelHeight: 40 });
$("#CompanyName").textbox({
    required: true,
    editable: false,
    icons: [
        {
            iconCls: "icon-search",
            handler: function () {
                LeasingApplication.openName();
            }
        }
    ]
});