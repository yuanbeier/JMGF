$(function(){
    /*单选框*/
    var radioBtn = $(".easyui-radiobutton input[type='radio']");
    radioBtn.on("click",function () {
        $.each(radioBtn,function(){
            var thisParent = $(this).parent();
            if($(this).prop("checked")){
                thisParent.addClass("easyui-selectedradio");
            }else{
                thisParent.removeClass("easyui-selectedradio");
            }
        });
    });

    /*复选框*/
    var checkboxBtn = $(".easyui-checkboxbutton input[type='checkbox']");
    checkboxBtn.on("click",function(){
        var thisParent = $(this).parent();
        if($(this).prop("checked")){
            thisParent.addClass("easyui-selectedcheckbox");
        }else{
            thisParent.removeClass("easyui-selectedcheckbox");
        }
    });

});