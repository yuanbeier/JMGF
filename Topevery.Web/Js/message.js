/**
*  消息框弹出类
   by 袁贝尔 2016-08-17创建
*/
"use strict";
var topeveryMessage = {
    alert: function(title,message) {
        $.messager.alert(title, message, "alert");
    },
    error: function(title,message) {
        $.messager.alert(title, message, "error");
    },
    info: function (title, message) {
        $.messager.alert(title, message, "info");
    },
    question: function (title, message) {
        $.messager.alert(title, message, "question");
    },
    warning: function (title, message) {
        $.messager.alert(title, message, "warning");
    },
    show:function(message,title ) {
        $.messager.show({
            title: title||"提示",
            msg: message || "异常",
            timeout: 400,
            showSpeed: 1000,
            style: {
                left: '',
                top: '',
                right: '0px',//窗口离右边距离,于left互斥  
                bottom: '0px',//窗口离下边距离,于top互斥  
                position: 'fixed'//元素定位方式：fixed固定。 默认:absolute绝对定位  
            }
        });
    },
    confirm: function (fn,title, message) {
        $.messager.confirm(title || "提示", message || "您确认吗?", fn);
    }
}


