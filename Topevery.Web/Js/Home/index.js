
var dialog;
var dialog1;
var HomeIndex = {
    /*一级标题链接*/
    dataUrl: "home/GetMenu",
    /*初始化*/
    init: function () {
        var callback = function (res) {
            if (res) {
                var data = {
                    list: res
                };
                var html = template('header-title', data);
                $("#center-header-wrap").html(html);
                frameHelper.autoWidth({ pid: "center-header" });
                $("#center-header-wrap ul li").eq(0).click();
            }
        }

        var callback2 = function (res) {
            if (res) {
                var data = {
                    list: res
                };
                var html = template('menu-title', data);
                $("#center-menu-wrap").html(html);
                $("#center-menu-wrap ul li").eq(0).click();
            }
        };

        /**
        * 给一级菜单加单击事件
        */
        $("#center-header-wrap").on("click", "li", function () {
                $(this).addClass("current").siblings().removeClass("current");
                var url = $(this).attr("url");
                topevery.ajax({
                    url: url
                }, callback2, true);
        });

        /*点击二级目录右侧加载相应页面内容*/
        $("#center-menu-wrap").on("click", "li", function () {
           
                $(this).addClass("current").siblings().removeClass("current");
                var url = $(this).attr("url");

                var optsAddTabs = {
                    content: frameHelper.createFrame(url)
                };
                $("#center-content").tabs("close", 0);
                $("#center-content").tabs("add", optsAddTabs);
            
        });
    
        /*初始化一级标题*/
        topevery.ajax({
            url: this.dataUrl
        }, callback,true);

        /*浏览器窗口变化一级标题宽度自适应*/
        $(window).on("resize", function () {
            frameHelper.autoWidth({ pid: "center-header" });
        });

        /*初始化中间主体右侧内容*/
        $("#center-content").tabs({
            showHeader: false,
            border:false,
            fit:true
        });

        /*更多点击*/
        $(".more-detail").on("click", function (event) {
            $(".more-detail-info").toggle();
            event.stopPropagation();
        });

        /**
         * 注册页面单击事件
         */
        $(document).on("click", function () {
            var item = $(".more-detail-info");
            if (item.is(":visible")) {
                item.hide();
            }
        });

        $(".more-detail-info").on("click", function (event) {
            event.stopPropagation();
        });
    },
    ///修改基本信息
    Edit: function() {
        dialog = ezg.modalDialog({
            width: 700,
            height: 280,
            title: '修改用户基本信息',
            url: virtualDirName + "Home/EditUser"
        });
    }
    ,///修改修改密码
    EditPassWord: function () {
        dialog1 = ezg.modalDialog({
            width: 420,
            height: 280,
            title: '修改密码',
            url: virtualDirName + "Home/EditPassWord"
        });
    },
    openAppDownload:function() {
        $("#Download").show();
    },
    close:function () {
        $("#Download").hide();
    }
}

$(function () {
    /*初始化*/
    HomeIndex.init();
});
