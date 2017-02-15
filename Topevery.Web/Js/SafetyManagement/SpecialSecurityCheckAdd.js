$(function () {
    bindDicToDrp("SecurityLevelId", "834D7912-4FBC-401B-A546-1B7831A86048", "", true);
    //   LeasingApplication.Initialize();
    $("#HouseNo").textbox({
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

});
var dialog1;
var LeasingApplication = {
    ///弹出选择房屋窗口
    openName: function () {
        dialog1 = ezg.modalDialog({
            width: 1000,
            height: 450,
            title: '房屋信息选择',
            url: virtualDirName + 'House/TenantInformationSecurity'
        });
    },
    ///房屋信息赋值方法
    setValueHouse: function (data) {
        var array = {};
        for (var i in data) {
            array["" + UpperFirstLetter(i) + ""] = data[i];
        };
        $("#HouseUnitId").val(array.Id);
        $("#SpecialSecurityCheckAdd").form("load", array);
    },
    cancel: function () {
        window.location = virtualDirName + 'SafetyManagement/SpecialSecurityCheckManagement?menuName=SafetyManagement';
    },
    ///保存
    SaveLA: function () {
        var array = ezg.serializeObject($('form'));
        var specialSafetyType = new Array();
        $.each(array, function (key, val) {
            if (key.split('_')[0] == "input") {
                var checkProjectId = key.split('_')[1];
                var projectId = $("#hidden_" + key.split('_')[1] + "").val();
                var checkResult = $("#id_" + key.split('_')[1] + "").is(":checked");
                var checkThat = $("#input_" + key.split('_')[1] + "").val();
                var attachmentId = $("input[name='Id" + key.split('_')[1] + "hiddenFile']").val();
                specialSafetyType.push({ ProjectId: projectId, CheckProjectId: checkProjectId, CheckResult: checkResult, CheckThat: checkThat, AttachmentId: attachmentId });
            }

        });
        if ($("#SpecialSecurityCheckAdd").form('validate') === false) {
            return;
        } else {
            topevery.ajax({
                type: "POST",
                url: "api/services/app/SafetyW/AddSpecialSafetyAsync",
                contentType: "application/json",
                data: topevery.extend(array, { FileId: $("input[name='IdhiddenFile']").val(), SpecialSafetyType: specialSafetyType })
            }, function (data) {
                if (data.success) {
                    if (data.result.isSuccess) {
                        window.top.topeveryMessage.show(data.result.message);
                        window.location = virtualDirName + 'SafetyManagement/SpecialSecurityCheckManagement?menuName=SafetyManagement';
                    } else {
                        window.top.topeveryMessage.show(data.result.message);
                    }
                } else {
                    error();
                }
            }, true);
        }
    }
}
