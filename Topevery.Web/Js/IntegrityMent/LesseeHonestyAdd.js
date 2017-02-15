

$(function () {
    bindDicToDrp("HonestyType", "DD5E2AAC-50E7-4652-8F5C-C850813ADA52", "", true);
    $("#Name").textbox({
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
var dialog;
var LeasingApplication = {
    ///弹出选择租户窗口
    openName: function () {
        dialog = ezg.modalDialog({
            width: 900,
            height: 460,
            title: '租户信息选择',
            url: virtualDirName + 'LesseeInfo/TenantsSelect'
        });
    },
    ///租户信息赋值方法
    setValueName: function (data) {
        $("#LessId").val(data.id);
        $("#Name").textbox('setValue', data.name);
       
    },
    
    ///保存
    SaveLA: function() {
        var  array=ezg.serializeObject($('form'));
        if ($("#LesseeHonestyAdd").form('validate') === false) {
            return;
        } else {
            topevery.ajax({
                type: "POST",
                url: "api/services/app/LesseeHonestyMangmentW/AddLessesHonestyMangmentAsync",
                contentType: "application/json",
                data: topevery.extend(array,{FileId: $("input[name='IdhiddenFile']").val()})
            }, function(data) {
                if (data.success) {
                    window.top.topeveryMessage.show("保存成功");
                    window.location = virtualDirName + 'IntegrityMent/LesseeHonestyMantIndex?menuName=LesseeHonestyMantIndex';
                } else {
                    error();
                }
            }, true);
        }
    }
}

//var LesseeHonestAdd = {
//    Add: function () {
//        if ($("#LesseeHonestyAdd").form('validate') === false) {
//            return;
//        } else {
//            topevery.ajax({
//                type: "POST",
//                url: "api/services/app/LesseeHonestyMangmentW/AddLessesHonestyMangmentAsync",
//                contentType: "application/json",
//                data: JSON.stringify(array)
//            }, function (data) {
//                if (data.success) {
//                    window.top.topeveryMessage.show("提交成功");
//                  //  window.location = virtualDirName + 'Home/TodoLists';
//                } else {
//                    error();
//                }
//            }, true);

//        }
//    }
//}
