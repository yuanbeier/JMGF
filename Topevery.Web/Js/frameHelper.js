/**
 * 获取弹出窗口的iframe
 */
var inlineFrame = window.parent.frames[0];

var frameHelper = {

    /*
     * 创建iframe内联框架
     * @param url iframe引用的url地址
     * @return string
     */
    createFrame: function (url) {
        return '<iframe scrolling="auto" frameborder="0"  style="width:100%;height:100%;" src="' + url + '" ></iframe>';
    },
    /*
     *添加tabs面板
     * @param tab 面板
     * @param exist 相关子面板是否存在
     * @param url 打开新页面的url地址
     * @param title 新页面在面板标题栏的标题
     * @return void
     */
    addTab : function (tab, exist, url) {
    
        if(!tab.tabs("exists",exist)){
            tab.tabs("add", {
                content:this.createFrame(url)
            });
        }
    },

   /**
    * 宽度自适应
    * @param {} args 
    * @returns {} 
    */
   autoWidth :function(args) {
        var headerWidth = $("#"+args.pid).width();
        var headerLi =$("#"+$("#"+args.pid).attr("childid"));
        var averageWidth = Math.floor(headerWidth / headerLi.length);
        if (averageWidth > parseInt( $("#"+args.pid).attr("maxWidth"))) {
            averageWidth = parseInt($("#"+args.pid).attr("maxWidth")) ;
        }
        headerLi.css("width", averageWidth);
   },
    /**
     * 获取当前模态窗口的父窗口
     * @returns {} 
     */
   getDialogParentIframe: function () {
       var count = window.parent.$("div[class='panel window']:visible").length;
       if (count > 1) {
           return (window.parent.$("div[class='panel window']:visible").eq(window.parent.$("div[class='panel window']:visible").length - 2).find("iframe"))[0].contentWindow;
       } else {
           return window.parent.$(".center-content").find("iframe")[0].contentWindow;
       }
   }
};