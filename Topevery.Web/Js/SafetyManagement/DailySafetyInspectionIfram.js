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
            url: virtualDirName + 'House/TenantInformationSecurity?usePropertyId=1'
        });
    },
    ///房屋信息赋值方法
    setValueHouse: function (data) {
        var array = {};
        for (var i in data) {
            array["" + UpperFirstLetter(i) + ""] = data[i];
        };
        $("#HouseUnitId").val(array.Id);
        $("#DailySafetyInspectionAdd").form("load", array);
    },
    cancel: function () {
        window.location = virtualDirName + 'SafetyManagement/DailySafetyInspectionManagement?menuName=SafetyManagement';
    },
    ///保存
    SaveLA: function () {
        var array = ezg.serializeObject($('form'));
        var dailySafetyType = new Array();
        $.each(array, function (key, val) {
            if (key.split('_')[0] == "input") {
                var checkProjectId = key.split('_')[1];
                var projectId = $("#hidden_" + key.split('_')[1] + "").val();
                var checkResult = $("#id_" + key.split('_')[1] + "").is(":checked");
                var checkThat = $("#input_" + key.split('_')[1] + "").val();
                var attachmentId = $("input[name='Id" + key.split('_')[1] + "hiddenFile']").val();
                dailySafetyType.push({ ProjectId: projectId, CheckProjectId: checkProjectId, CheckResult: checkResult, CheckThat: checkThat, AttachmentId: attachmentId });
            }

        });
        if ($("#DailySafetyInspectionAdd").form('validate') === false) {
            return;
        } else {
            topevery.ajax({
                type: "POST",
                url: "api/services/app/SafetyW/AddDailySafetyAsync",
                contentType: "application/json",
                data: topevery.extend(array, { FileId: $("input[name='IdhiddenFile']").val(), DailySafetyType: dailySafetyType })
            }, function (data) {
                if (data.success) {
                    if (data.result.isSuccess) {
                        window.top.topeveryMessage.show(data.result.message);
                        window.location = virtualDirName + 'SafetyManagement/DailySafetyInspectionManagement?menuName=SafetyManagement';
                    } else {
                        window.top.topeveryMessage.show(data.result.message);
                    }
                } else {
                    error();
                }
            }, true);
        }
    }
    //Initialize: function() {
    //    topevery.ajax({
    //        type: "POST",
    //        url: "Common/GetCheckProject?guid=" + "78684B40-296E-4E62-A39A-E910A186F8A7,6DAC694C-7AA7-44A3-A18A-1E1FB6A84065,D9DB48B5-A1F7-4637-8698-E292DEAC6B10",
    //        contentType: "application/json"
    //    }, function (data) {
    //        var html = "";
    //        for (var i = 0; i < data.length; i++) {
    //            html += "<p><laber style=\"width:120px;margin-left:10px;\">" + data[i].NamespaceName + ":</laber><p/>";
    //            for (var j = 0; j < data[i].Dictionary.length; j++) {
    //                if (j%2===0) {
    //                    html += "<p><input class=\"easyui-checkboxbutton\" style=\"width: 80px;\" type=\"checkbox\" name=\"id_" + data[i].Dictionary[j].Id + "\" id=\"id_" + data[i].Dictionary[j].Id + "\" /><laber for=\"id_" + data[i].Dictionary[j].Id + "\" class=\"laber_check\">" + data[i].Dictionary[j].DictionaryName +
    //                    "</laber><input name=\"input_" + data[i].Dictionary[j].Id + "\" id=\"input_" + data[i].Dictionary[j].Id + "\" class=\"input_check\" type=\"text\"/> <input  id=\"hidden_" + data[i].Dictionary[j].Id + "\" value=\"" + data[i].NamespaceId+ "\"  type=\"hidden\"/>";
    //                } else {
    //                    html += "<input class=\"easyui-checkboxbutton\" style=\"width: 80px;\" type=\"checkbox\" name=\"id_" + data[i].Dictionary[j].Id + "\" id=\"id_" + data[i].Dictionary[j].Id + "\" /><laber for=\"id_" + data[i].Dictionary[j].Id + "\" class=\"laber_check\">" + data[i].Dictionary[j].DictionaryName +
    //                    "</laber><input name=\"input_" + data[i].Dictionary[j].Id + "\" id=\"input_" + data[i].Dictionary[j].Id + "\" class=\"input_check\" type=\"text\" /><input  id=\"hidden_" + data[i].Dictionary[j].Id + "\" value=\"" + data[i].NamespaceId + "\"  type=\"hidden\"/></p>";
    //                }
    //            }
    //        }
    //        $("#TheSecurityCheckProject").after(html);
    //    }, true);
    //}
}
