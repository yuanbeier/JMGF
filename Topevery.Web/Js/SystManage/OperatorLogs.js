var modulelist;
var operatorTypelist;
var DirectoryManageList;
$(function () {
    DirectoryManageList = TopeveryBase.extend({

    });
    for (var i = 0; i < $(".easyui-textbox").length; i++) {
        $("#" + $('.easyui-textbox').eq(i)[0].id + "").textbox({
            inputEvents: $.extend({}, $.fn.textbox.defaults.inputEvents, {
                keyup: function (event) {
                    if (event.keyCode === 13) {
                        new DirectoryManageList().initGrid({});
                    }
                }
            })
        });
    }
    new DirectoryManageList().initGrid({});
    bindDropDownEunm("OperatorType", "Common/OperatorType", "--操作类型--", false);
    bindDropDownEunm("ModuleType", "Common/ModuleList", "--模块名称--", false);
    var j = 0;
    $("#completed-search-btn").on("click", function () {
        $("#completed-search-list").slideToggle();
        j = j + 1;
        if (j % 2 !== 0) {
            $("#completed-search-btn").html("收起∧");
        } else {
            $("#completed-search-btn").html("更多∨");
        }
    });
});


