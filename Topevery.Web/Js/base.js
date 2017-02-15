/**
*  Js基类 
   by 贺黎亮 2016-07-20创建
   袁贝尔 20160824 修改
*/
var topevery = {
    /**
     * 遮罩层加载
     * @returns {} 
     */
    ajaxLoading: function () {
        $("<div class=\"datagrid-mask\"></div>").css({ display: "block", width: "100%", height: $(window).height() }).appendTo("body");
        $("<div class=\"datagrid-mask-msg\"></div>").html("正在处理，请稍候...").appendTo("body").css({ display: "block", left: ($(document.body).outerWidth(true) - 190) / 2, top: ($(window).height() - 45) / 2 });
    },
    /**
     * 遮罩层关闭
     * @returns {} 
     */
    ajaxLoadEnd: function () {
        $(".datagrid-mask").remove();
        $(".datagrid-mask-msg").remove();
    },
    /**
     * 
     * @param {} args ajax参数
     * @param {} callback 回调函数
     * @param {} isShowLoading 是否需要加载动态图片
     * @returns {} 
     */
    ajax: function (args, callback, isShowLoading) {
        //采用jquery easyui loading css效果
     
        if (isShowLoading) {
            topevery.ajaxLoading();
        }
        args.url = virtualDirName + args.url;
        args = $.extend({}, { type: "POST", dataType: "json" }, args);
        $.ajax(args).done(function(data) {
                if (isShowLoading) {
                    topevery.ajaxLoadEnd();
                }
                if (callback) {
                    callback(data);
                }
            })
            .fail(function (jqXHR) {
                if (isShowLoading) {
                    topevery.ajaxLoadEnd();
                }
                var json = JSON.parse(jqXHR.responseText);
                //使用window.top属性是为了防止重复提交,如有更改.先联系lmy
                if (json.error.message.indexOf("|") > -1) {
                    window.top.topeveryMessage.alert("提示", json.error.message.split("|")[1]);
                }
                else if (json.error.message.indexOf("Required permissions") > -1) {
                    window.top.topeveryMessage.alert("提示", "请配置权限：" + json.error.message.split(":")[1]);
                }
                else {
                    window.top.topeveryMessage.alert("提示", "操作失败");
                }
            });
    },

    /**
   * 上传控件的初始化
   * @param {} moduleId 模块Id
   * @param {} keyId    申请主体Id
   * @param {} activityInstanceId 环节实例Id
   * @param {} target 目标
   * @returns {} 
   */
    setUploadFile : function (moduleId, keyId, activityInstanceId,target) {
        target = $("#"+target);
        topevery.ajax({
            type: "POST",
            url: "api/services/app/FileRelation/GetFileRDtoList",
            contentType: "application/json",
            data: JSON.stringify({ keyId: keyId, ModuleType: moduleId, ActivityIntanceId: activityInstanceId })
        }, function(row) {
            if (row.success) {
                var data = row.result;
                var hdFileData = "";
                for (var i = 0; i < data.length; i++) {
                    var li = target.next().next().find("ul").clone().html();
                    console.log(li);
                    li = li.replace("{imgUrl}", data[i].imageShowUrl).replace("{imgName}", data[i].fileName).replace("{imgName}", data[i].fileName)
                    .replace("{fileId}", data[i].fileId);
                    target.next().append(li);
                    if (hdFileData === "") {
                        hdFileData = data[i].fileId + "," + data[i].fileName ;
                    } else {
                        hdFileData += ";" + data[i].fileId + "," + data[i].fileName ;
                    }
                }
                //回发时还原hiddenfiled的保持数据
                target.next().next().find("input").val(hdFileData);
            }
        });
    },
 
    /* 初始化百度地图 */
    initmap: function(args) {
        // 百度地图API功能
        var map = new BMap.Map(args.mapid); // 创建Map实例
        map.addControl(new BMap.NavigationControl()); // 添加平移缩放控件
        map.addControl(new BMap.ScaleControl()); // 添加比例尺控件
        map.addControl(new BMap.OverviewMapControl()); //添加缩略地图控件
        map.enableScrollWheelZoom(); //启用滚轮放大缩小
        map.addControl(new BMap.MapTypeControl()); //添加地图类型控件
        // map.setCurrentCity("深圳");          // 设置地图显示的城市 此项是必须设置的

        //创建信息窗口
        var infoWindow1 = new BMap.InfoWindow("");
        //marker1.addEventListener("click", function () { this.openInfoWindow(infoWindow1); });
        var marker1;
        //默认填充坐标上去
        if (args.x > 0 && args.y > 0) {
            map.centerAndZoom(new BMap.Point(args.x, args.y), 15); // 初始化地图,设置中心点坐标和地图级别
            $("#BaiduMap").val(args.x + "," + args.y);
        } else {
            map.centerAndZoom(new BMap.Point(113.0418, 22.3550), 11); // 初始化地图,设置中心点坐标和地图级别
            map.setCurrentCity("江门");
            $("#BaiduMapLable").html("<a style=\"font-size: 14px;\">该房屋还没有在地图上标记，请到房屋管理标记房屋地址!</a>");
        }
       
        var bdary = new BMap.Boundary();
        bdary.get("江门", function (rs) {       //获取行政区域       
            //添加遮罩层
            //思路：利用行政区划点的集合与外围自定义东南西北形成一个环形遮罩层
            //1.获取选中行政区划边框点的集合  rs.boundaries[0]
            var strs = new Array();
            strs = rs.boundaries[0].split(";");
            var EN = "";    //行政区划东北段点的集合
            var NW = ""; //行政区划西北段点的集合
            var WS = ""; //行政区划西南段点的集合
            var SE = ""; //行政区划东南段点的集合
            var pt_e = strs[0]; //行政区划最东边点的经纬度
            var pt_n = strs[0]; //行政区划最北边点的经纬度
            var pt_w = strs[0]; //行政区划最西边点的经纬度
            var pt_s = strs[0]; //行政区划最南边点的经纬度
            var n1 = ""; //行政区划最东边点在点集合中的索引位置
            var n2 = ""; //行政区划最北边点在点集合中的索引位置
            var n3 = ""; //行政区划最西边点在点集合中的索引位置
            var n4 = ""; //行政区划最南边点在点集合中的索引位置

            //2.循环行政区划边框点集合找出最东南西北四个点的经纬度以及索引位置
            for (var n = 0; n < strs.length; n++) {
                var pt_e_f = parseFloat(pt_e.split(",")[0]);
                var pt_n_f = parseFloat(pt_n.split(",")[1]);
                var pt_w_f = parseFloat(pt_w.split(",")[0]);
                var pt_s_f = parseFloat(pt_s.split(",")[1]);

                var sPt = new Array();
                try {
                    sPt = strs[n].split(",");
                    var spt_j = parseFloat(sPt[0]);
                    var spt_w = parseFloat(sPt[1]);
                    if (pt_e_f < spt_j) {   //东
                        pt_e = strs[n];
                        pt_e_f = spt_j;
                        n1 = n;
                    }
                    if (pt_n_f < spt_w) {  //北
                        pt_n_f = spt_w;
                        pt_n = strs[n];
                        n2 = n;
                    }

                    if (pt_w_f > spt_j) {   //西
                        pt_w_f = spt_j;
                        pt_w = strs[n];
                        n3 = n;
                    }
                    if (pt_s_f > spt_w) {   //南
                        pt_s_f = spt_w;
                        pt_s = strs[n];
                        n4 = n;
                    }
                }
                catch (err) {
                    alert(err);
                }
            }
            //3.得出东北、西北、西南、东南四段行政区划的边框点的集合
            if (n1 < n2) {     //第一种情况 最东边点在索引前面
                for (var o = n1; o <= n2; o++) {
                    EN += strs[o] + ";"
                }
                for (var o = n2; o <= n3; o++) {
                    NW += strs[o] + ";"
                }
                for (var o = n3; o <= n4; o++) {
                    WS += strs[o] + ";"
                }
                for (var o = n4; o < strs.length; o++) {
                    SE += strs[o] + ";"
                }
                for (var o = 0; o <= n1; o++) {
                    SE += strs[o] + ";"
                }
            }
            else {   //第二种情况 最东边点在索引后面
                for (var o = n1; o < strs.length; o++) {
                    EN += strs[o] + ";"
                }
                for (var o = 0; o <= n2; o++) {
                    EN += strs[o] + ";"
                }
                for (var o = n2; o <= n3; o++) {
                    NW += strs[o] + ";"
                }
                for (var o = n3; o <= n4; o++) {
                    WS += strs[o] + ";"
                }
                for (var o = n4; o <= n1; o++) {
                    SE += strs[o] + ";"
                }
            }
            //4.自定义外围边框点的集合
            var E_JW = "170.672126, 39.623555;";            //东
            var EN_JW = "170.672126, 81.291804;";       //东北角
            var N_JW = "105.913641, 81.291804;";        //北
            var NW_JW = "-169.604276,  81.291804;";     //西北角
            var W_JW = "-169.604276, 38.244136;";       //西
            var WS_JW = "-169.604276, -68.045308;";     //西南角
            var S_JW = "114.15563, -68.045308;";            //南
            var SE_JW = "170.672126, -68.045308 ;";         //东南角
            //4.添加环形遮罩层
            var ply1 = new BMap.Polygon(EN + NW + WS + SE + E_JW + SE_JW + S_JW + WS_JW + W_JW + NW_JW + EN_JW + E_JW, { strokeColor: "none", fillColor: "rgb(246,246,246)", strokeOpacity: 0 }); //建立多边形覆盖物
            map.addOverlay(ply1);  //遮罩物是半透明的，如果需要纯色可以多添加几层
            ply1 = new BMap.Polygon(EN + NW + WS + SE + E_JW + SE_JW + S_JW + WS_JW + W_JW + NW_JW + EN_JW + E_JW, { strokeColor: "none", fillColor: "rgb(246,246,246)", strokeOpacity: 0 }); //建立多边形覆盖物
            map.addOverlay(ply1);  //遮罩物是半透明的，如果需要纯色可以多添加几层

            //5. 给目标行政区划添加边框，其实就是给目标行政区划添加一个没有填充物的遮罩层
            var ply = new BMap.Polygon(rs.boundaries[0], { strokeWeight: 2, strokeColor: "#ff0000", fillColor: "" });
            map.addOverlay(ply);
            map.setViewport(ply.getPath());    //调整视野
            if (args.x > 0 && args.y > 0) {
                map.centerAndZoom(new BMap.Point(parseFloat(args.x) - 0.06, parseFloat(args.y) + 0.01), 13); // 初始化地图,设置中心点坐标和地图级别
                map.panBy(args.left ? args.left : 150, args.top ? args.top : 150);
                map.disableScrollWheelZoom();

                $("#BaiduMap").val(args.x + "," + args.y);
            } else {
                map.centerAndZoom(new BMap.Point(112.518, 22.7550), 11); // 初始化地图,设置中心点坐标和地图级别
                map.setCurrentCity("江门");
                $("#BaiduMapLable").html("<a style=\"font-size: 14px;\">该房屋还没有在地图上标记，请到房屋管理标记房屋地址!</a>");
            }
        });
        if (args.x > 0 && args.y > 0)
        {
            marker1 = new BMap.Marker(new BMap.Point(args.x, args.y)); // 创建标注
            map.addOverlay(marker1); // 将标注添加到地图中
        }

        /* 搜索自动提示 */
        var ac = new BMap.Autocomplete( //建立一个自动完成的对象
        {
            "input": args.searchkey,
            "location": map
        });
        var myValue;
        ac.addEventListener("onconfirm", function(e) { //鼠标点击下拉列表后的事件
            //var _value = e.item.value;
            //myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
            //setPlace();
            $("#" + args.searchbtn).click();
        });

        function setPlace() {
            map.clearOverlays(); //清除地图上所有覆盖物
            function myFun() {
                var pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
                map.centerAndZoom(pp, 11);
                map.addOverlay(new BMap.Marker(pp)); //添加标注
            }

            var local = new BMap.LocalSearch(map, {
                //智能搜索
                onSearchComplete: myFun
            });
            local.search(myValue);
        }

        /* 查询 */
        $("#" + args.searchbtn).click(function($e) {
            // 百度地图API功能
            var local = new BMap.LocalSearch(map, {
                renderOptions: { map: map }
            });
            document.getElementById(args.searchkey).focus();
            local.search($("#" + args.searchkey).val());
        });

        $("#" + args.searchkey).keyup(function(event) {
            if (event.which == 13) {
                $("#" + args.searchbtn).trigger("click");
            }
        });
     
        /* 点击地图 拾取坐标 */
        //map.clearOverlays();    //清除地图上所有覆盖物
        function markZB(e) {
            // 创建地理编码实例      
            var myGeo = new BMap.Geocoder();
            // 根据坐标得到地址描述    
            myGeo.getLocation(new BMap.Point(e.point.lng, e.point.lat), function (result) {
                if (result) {
                    if (result.address.indexOf("江门市") > -1) {
                        map.removeOverlay(marker1); //清除地图上所有覆盖物
                        $("#BaiduMap").val(e.point.lng + "," + e.point.lat);
                        marker1 = new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat)); // 创建标注
                        map.addOverlay(marker1); // 将标注添加到地图中
                    } else {
                        alert("请选择江门区域！");
                    }
                }
            });
            //map.removeEventListener("click", markZB);
            GetAddressName(e.point.lng, e.point.lat);
        }

        /*查看模式不添加事件*/
        if (!args.islook) {
            map.addEventListener("click", markZB);
        }

        /*通过坐标获取地址*/
        function GetAddressName(lng, lat) {
            var SAMPLE_ADDRESS_POST = "http://api.map.baidu.com/geocoder/v2/?ak=1nCQCnDr3Nt3GKDVeBmKGe2Y&callback=renderReverse&output=json&pois=1";
            var addressOptions = SAMPLE_ADDRESS_POST + "&location=" + lat + "," + lng;
            $.ajax({
                type: "get",
                url: addressOptions,
                dataType: "JSONP",
                success: function(data) {
                    renderReverse(data);
                },
                error: function(data) {
                    renderReverse(data);
                }
            });
        }

        /*回调 通过坐标获取地址*/
        function renderReverse(response) {
            $("#" + args.searchkey).val(response.result.formatted_address);
        }

    },
    /* 获取表单值赋值到json变量 */
    getParmByForm: function(args) {
        try {
            for (var item in args.JSON) {
                var domtype = $("#" + item).attr("type");
                var dysetMes = "", checkvalue = 0;


                if ($("#" + item).hasClass("easyui-numberbox")
                ) {
                    dysetMes = args.jsonParm + "." + item + "=$('#" + item + "').textbox('getValue')";
                    eval(dysetMes);
                } else if ($("#" + item).hasClass("easyui-datebox")
                ) {
                    dysetMes = args.jsonParm + "." + item + "=$('#" + item + "').datebox('getValue')";
                    eval(dysetMes);
                }

                if (domtype === "text" || domtype === "textarea") {
                    dysetMes = args.jsonParm + "." + item + "=$('#" + item + "').val()";
                    eval(dysetMes);
                } else if (domtype === "checkbox") {
                    if ($("#" + item).is(':checked')) {
                        checkvalue = 1;
                    } else {
                        checkvalue = 0;
                    }
                    dysetMes = args.jsonParm + "." + item + "=" + checkvalue;
                    eval(dysetMes);
                } else {
                    var nameDom = $("input[name='" + item + "']").attr("type");
                    if (nameDom == "radio") {
                        var radioVal = $("input[name='" + item + "']:checked").val();
                        dysetMes = args.jsonParm + "." + item + "=" + radioVal;
                        eval(dysetMes);
                    }
                    //树控件
                    if ($("#" + item).hasClass("easyui-combotree")) {
                        var Tree_Id = $("#" + item).combotree('tree').tree('getSelected');
                        dysetMes = args.jsonParm + "." + item + "=" + Tree_Id.Id;
                        eval(dysetMes);
                    }
                }
            }
        } catch (e) {
        }
    },
    /* 设置json变量到表单 */
    setParmByForm: function(args) {
        try {
            for (var item in args.JSON) {
                var domtype = $("#" + item).attr("type");
                var dysetMes = "", checkvalue = 0;


                if (domtype == "text") {
                    dysetMes = "$('#" + item + "').val(args.JSON." + item + ")";
                    eval(dysetMes);

                    if ($("#" + item).hasClass("easyui-numberbox")) {
                        try {
                            dysetMes = "$('#" + item + "').textbox('setValue',args.JSON." + item + ")";
                            eval(dysetMes);
                        } catch (e) {
                        }
                    }

                } else if (domtype == "checkbox") {
                    if (eval("args.JSON." + item) == "1") {
                        $("#" + item).attr("checked", true);
                    }
                } else {
                    var nameDom = $("input[name='" + item + "']").attr("type");
                    if (nameDom == "radio") {
                        if (eval("args.JSON." + item) != "0") {
                            $("input[name=" + item + "][type=radio][value=" + eval("args.JSON." + item) + "]").attr("checked", 'checked');
                        }
                    }
                    //树控件
                    if ($("#" + item).hasClass("easyui-combotree")) {

                    }
                }

            }
        } catch (e) {
        }
    },
    /*弹出新窗口 */
    openWindow: function(args) {

        var dialog = ezg.modalDialog({
            width: args.width,
            height: args.height,
            title: args.title,
            url: args.url,
            buttons: args.buttons
        });
        return dialog;
    },
    /* 获取url参数*/
    getQuery: function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    },
    /* 处理null */
    proNull: function(parm) {
        return (typeof (parm) == "undefined" || parm == "undefined" || parm == null) ? "" : parm;
    },
    /* 处理数字null */
    proNumNull: function(parm) {
        return (typeof(parm) == "undefined" || parm == null || parm == "" || parm == NaN) ? "0" : parm;
    },
    jsonToDate: function(t, format) { //格式日期 如：jsonToDate(date,"yyyy-MM-dd"):2012-08-14
        if (t == "") return t;
        try {
            var obj = {};
            if ("object" == typeof (t)) {
                obj = t;
            } else {
                t = t.replace("date", "Date");
                obj = eval('new ' + (t.replace(/\//g, '')));
            }
            return obj.format(format);
        } catch (e) {
            return t;
        }
    },
    /* 设置json变量到查看表单 */
    setParmByLookForm: function(args) {
        try {
            for (var item in args.JSON) {
                var domtype = $("#" + item).attr("type");
                var dysetMes = "", checkvalue = 0;
                dysetMes = "$('#" + item + "').html(args.JSON." + item + ");";
                try {
                    eval(dysetMes);
                } catch (e) {
                }
                dysetMes = "$('#" + item + "').val(args.JSON." + item + ");";
                try {
                    eval(dysetMes);
                } catch (e) {
                }
                dysetMes = "$('#" + item + "').textbox('setValue',args.JSON." + item + ");";
                try {
                    eval(dysetMes);
                } catch (e) {
                }
            }
        } catch (e) {
        }
    },
    /*获取图片缩略图地址 */
    getSmallmg: function(Url) {
        var smallimg = Url.substring(0, Url.lastIndexOf('.')) + "_t" + Url.substring(Url.lastIndexOf('.'));
        return smallimg;
    },
    /* 计算日期相差月数量 */
    DateDiff: function(interval, date1, date2) {
        var long = date2.getTime() - date1.getTime(); //相差毫秒  
        switch (interval.toLowerCase()) {
        case "y":
            return parseInt(date2.getFullYear() - date1.getFullYear());
        case "m":
            return parseInt((date2.getFullYear() - date1.getFullYear()) * 12 + (date2.getMonth() - date1.getMonth()));
        case "d":
            return parseInt(long / 1000 / 60 / 60 / 24);
        case "w":
            return parseInt(long / 1000 / 60 / 60 / 24 / 7);
        case "h":
            return parseInt(long / 1000 / 60 / 60);
        case "n":
            return parseInt(long / 1000 / 60);
        case "s":
            return parseInt(long / 1000);
        case "l":
            return parseInt(long);
        }
    },
    /*获取提交值*/
    GetFormVal: function(formid) {
        var objs = $("input,textarea", $("#" + formid));
        var postdata = {};
        try {
            objs.each(function() {
                var o = $(this);


                if (o.attr("type") == "radio" && o.attr("name") != "") {
                    field = o.attr("name");
                    postdata[field] = $("input[type='radio'][name='" + field + "']:checked").val();
                    return true;
                }

                if (typeof (o) != "undefined" && o.attr("id")) {
                    var field = o.attr("id");
                    if (o.isTag("input")) {
                        if (o[0].type == "text" || o[0].type == "hidden" || o[0].type == "password") {
                            if (o.hasClass("iptval") && o.attr("rel") == o.val())
                                postdata[field] = "";
                            else
                                postdata[field] = o.val();
                        } else if (o.hasClass("checkbox")) {
                            postdata[field] = o.attr("checked") ? 1 : 0
                        }
                    } else if (o.isTag("textarea")) {
                        postdata[field] = o.val();
                    } else if (o.isTag("select")) {
                        postdata[field] = o.val();
                    } else if (o.isTag("radio")) {
                        postdata[field] = $("input[type='radio'][name='" + field + "']:checked").val();
                    }
                }
            });
        } catch (e) {
            alert(e);
        }
        return postdata;
    },
    /*数字转大写*/
    convertCurrency: function(currencyDigits) {
        // Constants: 
        var MAXIMUM_NUMBER = 99999999999.99;
        // Predefine the radix characters and currency symbols for output: 
        var CN_ZERO = "零";
        var CN_ONE = "壹";
        var CN_TWO = "贰";
        var CN_THREE = "叁";
        var CN_FOUR = "肆";
        var CN_FIVE = "伍";
        var CN_SIX = "陆";
        var CN_SEVEN = "柒";
        var CN_EIGHT = "捌";
        var CN_NINE = "玖";
        var CN_TEN = "拾";
        var CN_HUNDRED = "佰";
        var CN_THOUSAND = "仟";
        var CN_TEN_THOUSAND = "万";
        var CN_HUNDRED_MILLION = "亿";
        var CN_SYMBOL = "人民币";
        var CN_DOLLAR = "元";
        var CN_TEN_CENT = "角";
        var CN_CENT = "分";
        var CN_INTEGER = "整";

        // Variables: 
        var integral; // Represent integral part of digit number. 
        var decimal; // Represent decimal part of digit number. 
        var outputCharacters; // The output result. 
        var parts;
        var digits, radices, bigRadices, decimals;
        var zeroCount;
        var i, p, d;
        var quotient, modulus;

        // Validate input string: 
        currencyDigits = currencyDigits.toString();
        if (currencyDigits == "") {
            //alert("Empty input!"); 
            return "";
        }
        if (currencyDigits.match(/[^,.\d]/) != null) {
            alert("Invalid characters in the input string!");
            return "";
        }
        if ((currencyDigits).match(/^((\d{1,3}(,\d{3})*(.((\d{3},)*\d{1,3}))?)|(\d+(.\d+)?))$/) == null) {
            alert("Illegal format of digit number!");
            return "";
        }

        // Normalize the format of input digits: 
        currencyDigits = currencyDigits.replace(/,/g, ""); // Remove comma delimiters. 
        currencyDigits = currencyDigits.replace(/^0+/, ""); // Trim zeros at the beginning. 
        // Assert the number is not greater than the maximum number. 
        if (Number(currencyDigits) > MAXIMUM_NUMBER) {
            alert("Too large a number to convert!");
            return "";
        }

        // Process the coversion from currency digits to characters: 
        // Separate integral and decimal parts before processing coversion: 
        parts = currencyDigits.split(".");
        if (parts.length > 1) {
            integral = parts[0];
            decimal = parts[1];
            // Cut down redundant decimal digits that are after the second. 
            decimal = decimal.substr(0, 2);
        } else {
            integral = parts[0];
            decimal = "";
        }
        // Prepare the characters corresponding to the digits: 
        digits = new Array(CN_ZERO, CN_ONE, CN_TWO, CN_THREE, CN_FOUR, CN_FIVE, CN_SIX, CN_SEVEN, CN_EIGHT, CN_NINE);
        radices = new Array("", CN_TEN, CN_HUNDRED, CN_THOUSAND);
        bigRadices = new Array("", CN_TEN_THOUSAND, CN_HUNDRED_MILLION);
        decimals = new Array(CN_TEN_CENT, CN_CENT);
        // Start processing: 
        outputCharacters = "";
        // Process integral part if it is larger than 0: 
        if (Number(integral) > 0) {
            zeroCount = 0;
            for (i = 0; i < integral.length; i++) {
                p = integral.length - i - 1;
                d = integral.substr(i, 1);
                quotient = p / 4;
                modulus = p % 4;
                if (d == "0") {
                    zeroCount++;
                } else {
                    if (zeroCount > 0) {
                        outputCharacters += digits[0];
                    }
                    zeroCount = 0;
                    outputCharacters += digits[Number(d)] + radices[modulus];
                }
                if (modulus == 0 && zeroCount < 4) {
                    outputCharacters += bigRadices[quotient];
                    zeroCount = 0;
                }
            }
            outputCharacters += CN_DOLLAR;
        }
        // Process decimal part if there is: 
        if (decimal != "") {
            for (i = 0; i < decimal.length; i++) {
                d = decimal.substr(i, 1);
                if (d != "0") {
                    outputCharacters += digits[Number(d)] + decimals[i];
                }
            }
        }
        // Confirm and return the final output string: 
        if (outputCharacters == "") {
            outputCharacters = CN_ZERO + CN_DOLLAR;
        }
        if (decimal == "") {
            outputCharacters += CN_INTEGER;
        }
        outputCharacters = CN_SYMBOL + outputCharacters;
        return outputCharacters;
    },
    /*得到新增日期后的值*/
    DateAdd: function(interval, number, date) {
        switch (interval.toLowerCase()) {
        case "y":
            return new Date(date.setFullYear(date.getFullYear() + number));
        case "m":
            return new Date(date.setMonth(date.getMonth() + number));
        case "d":
            return new Date(date.setDate(date.getDate() + number));
        case "w":
            return new Date(date.setDate(date.getDate() + 7 * number));
        case "h":
            return new Date(date.setHours(date.getHours() + number));
        case "n":
            return new Date(date.setMinutes(date.getMinutes() + number));
        case "s":
            return new Date(date.setSeconds(date.getSeconds() + number));
        case "l":
            return new Date(date.setMilliseconds(date.getMilliseconds() + number));
        }
    },
    /* 表单验证 */
    validForm: function(formid) {
        var objs = $("#" + formid + " input")
        var isValid = true;
        try {
            objs.each(function() {
                var o = $(this);
                if (isValid && typeof (o) != "undefined" && o.attr("id")) {
                    var field = o.attr("id");
                    if (o.isTag("input")) {
                        if (o[0].type == "text") {
                            if (o.attr("required") == "required" && o.val() == "") {
                                o.focus();
                                isValid = false;
                                return;
                            }
                        }
                    }
                }
            });
        } catch (e) {
            alert(e);
        }
        return isValid;
    },
    /* 检测Flash这是否安装 */
    flashChecker: function() {
        var hasFlash = 0; //是否安装了flash
        var flashVersion = 0; //flash版本

        if (document.all) {
            var swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
            if (swf) {
                hasFlash = 1;
                VSwf = swf.GetVariable("$version");
                flashVersion = parseInt(VSwf.split(" ")[1].split(",")[0]);
            }
        } else {
            if (navigator.plugins && navigator.plugins.length > 0) {
                var swf = navigator.plugins["Shockwave Flash"];
                if (swf) {
                    hasFlash = 1;
                    var words = swf.description.split(" ");
                    for (var i = 0; i < words.length; ++i) {
                        if (isNaN(parseInt(words[i]))) continue;
                        flashVersion = parseInt(words[i]);
                    }
                }
            }
        }
        return { f: hasFlash, v: flashVersion };
    },
    ///两个对象合并成一个
    extend: function(obj1, obj2) {
        if (obj1 !== null && obj2 !== null) {
            for (var key in obj2) {
                if (obj1.hasOwnProperty(key))continue; //有相同的属性则略过 
                obj1[key] = obj2[key];
            }
            return JSON.stringify(obj1);
        } else if (obj1 !== null) {
            return JSON.stringify(obj1);
        } else if (obj2 !== null) {
            return JSON.stringify(obj2);
        } else {
            return null;
        }
    },
    ///json转换成对象
    form2Json: function(id) {
        var arr = $("#" + id).serializeArray();
        var jsonStr = "";
        jsonStr += '{';
        for (var i = 0; i < arr.length; i++) {
            jsonStr += '"' + arr[i].name + '":"' + $.trim(arr[i].value) + '",';
        }
        jsonStr = jsonStr.substring(0, (jsonStr.length - 1));
        jsonStr += '}';
        var json = JSON.parse(jsonStr);
        return json;
    },
    ///导出时查询对象装换成url
    ExportUrl:function(input) {
        var url = "";
        var j = 0;
        for (var i in input) {//用javascript的for/in循环遍历对象的属性 
            if (j === 0) {
                url += "?" + i + "=" + input[i] + "";
            } else {
                url += "&" + i + "=" + input[i] + "";
            }
            j++;
        }
        return url;
    },

    ///时间格式装换  
    dataTimeFormat: function(datatime) {
        if (datatime !== null) {
            var data = datatime.split("T")[0];
            return data;
        } else {
            {
                return null;
            }
        }
    },
    ///时间格式装换  
    dataTimeFormat1: function (datatime) {
        if (datatime !== null) {
            var data = datatime.split("T")[1].substring(0,5);
            return data;
        } else {
            {
                return null;
            }
        }
    },
    dataTimeFormatTT: function(datatime) {
        if (datatime !== null) {
            var data = datatime.replace("T", " ");
            return data;
        } else {
            {
                return null;
            }
        }
    },
    ///0,1 check格式转换
    checkFormat: function(value) {
        if (value === 1) return "<input type='checkbox' checked='checked' disabled='disabled' />";
        else if (value === 0) return "<input type='checkbox' disabled='disabled' />";
        else return "";
    },
    ///清空查询数据，并且查询
    Clear: function (myform, table) {
        $("#" + myform + "").form('clear');
        $("#" + table + "").datagrid('load');
    },
    ///附件展示公共方法  id  申请表主键编号，type 相关模块，attachmentId  要绑定内容的编号  wodth 图片宽度
    PicturesShow: function(id, type, attachmentId, width,height) {
        if (width == null || width === "") {
            width = 30;
        }
        if (!height) {
            height = 30;
        }
        topevery.ajax({
            type: "POST",
            url: "api/services/app/FileRelation/GetFileRDtoList",
            contentType: "application/json",
            data: JSON.stringify({ KeyId: id, ModuleType: type })
        }, function(row) {
            if (row.success) {
                var data = row.result;
                var html = "";
                for (var i = 0; i < data.length; i++) {
                    var suffix = data[i].fileName.split('.')[1];
                    switch (suffix) {
                    case "xlsx":
                        html += "<a title=\"" + data[i].fileName + "\" href=\"" + data[i].fileDownUrl + "\" target=\"_blank\"><img width='" + width + "' src=\"" +virtualDirName+ "Images/xlsx.jpg\"> <img/>" + data[i].fileName + "</a>";
                        break;
                        case "xls":
                            html += "<a title=\"" + data[i].fileName + "\" href=\"" + data[i].fileDownUrl + "\" target=\"_blank\"><img width='" + width + "' src=\"" +virtualDirName+ "Images/xlsx.jpg\"> <img/>" + data[i].fileName + "</a>";
                            break;
                    case "doc":
                        html += "<a title=\"" + data[i].fileName + "\" href=\"" + data[i].fileDownUrl + "\" target=\"_blank\"><img width='" + width + "' src=\"" + virtualDirName+"Images/Word.png\"> <img/>" + data[i].fileName + "</a>";
                        break;
                    case "docx":
                        html += "<a title=\"" + data[i].fileName + "\" href=\"" + data[i].fileDownUrl + "\" target=\"_blank\"><img width='" + width + "' src=\"" + virtualDirName+"Images/Word.png\">  <img/>" + data[i].fileName + "</a>";
                        break;
                    case "PDF":
                        html += "<a title=\"" + data[i].fileName + "\" href=\"" + data[i].fileDownUrl + "\" target=\"_blank\"><img width='" + width + "' src=\"" +virtualDirName+ "Images/pdf.png\">  <img/>" + data[i].fileName + "</a>";
                        break;
                    case "pdf":
                        html += "<a title=\"" + data[i].fileName + "\" href=\"" + data[i].fileDownUrl + "\" target=\"_blank\"><img width='" + width + "' src=\"" + virtualDirName+"Images/pdf.png\">  <img/>" + data[i].fileName + "</a>";
                        break;
                    case "pptx":
                        html += "<a title=\"" + data[i].fileName + "\" href=\"" + data[i].fileDownUrl + "\" target=\"_blank\"><img width='" + width + "' src=\"" +virtualDirName+ "Images/PPT.png\">  <img/>" + data[i].fileName + "</a>";
                        break;
                    default:
                        html += "<a title=\"" + data[i].fileName + "\" href=\"" + data[i].imageShowUrl + "\" target=\"_blank\"><img width='" + width + "' height='" + height + "' href=\"" + data[i].fileDownUrl + "\" src=\"" + data[i].imageShowUrl + "\"> <img/>" + data[i].fileName + "</a>";
                        break;
                    }
                }
                $("#" + attachmentId + "").append(html);
            } else {
                error();
            }
        }, true);
    },
    ImgShow: function (id, type, attachmentId, width, height) {
        if (width) {
            width = 100;
        };
        if (!height) {
            height = 100;
        };
        topevery.ajax({
            type: "POST",
            url: "api/services/app/FileRelation/GetFileRDtoList",
            contentType: "application/json",
            data: JSON.stringify({ KeyId: id, ModuleType: type })
        }, function (row) {
            if (row.success) {
                var data = row.result;
                var html = "<ul class='photo-list'>";
                for (var i = 0; i < data.length; i++) {
                    var suffix = data[i].fileName.split('.')[1];
                    html += "<li><a title=\"" + data[i].fileName + "\" href=\"" + data[i].imageShowUrl + "\" target=\"_blank\"><img width='" + width + "' height='" + height + "' href=\"" + data[i].fileDownUrl + "\" src=\"" + data[i].imageShowUrl + "\"> <img/></a><p>" + data[i].fileName + "</p></li>"
                }
                html += "</ul>";
                $("#" + attachmentId + "").append(html);
            } else {
                error();
            }
        }, true);
    },
    ProcessAttachment: function(data, width) {
        if (width == null || width === "") {
            width = 30;
        }
        var html = "<div style='margin:2px;'>";
        for (var i = 0; i < data.length; i++) {
            var suffix = data[i].fileName.split('.')[1];
            switch (suffix) {
            case "xlsx":
                html += "<a title=\"" + data[i].fileName + "\" href=\"" + data[i].fileDownUrl + "\" target=\"_blank\"><img width='" + width + "' height='30' src=\"" + virtualDirName+"Images/xlsx.jpg\"> </a>";
                break;
            case "xls":
                html += "<a title=\"" + data[i].fileName + "\" href=\"" + data[i].fileDownUrl + "\" target=\"_blank\"><img width='" + width + "' height='30' src=\"" + virtualDirName+"Images/xlsx.jpg\"> </a>";
                break;
            case "doc":
                html += "<a title=\"" + data[i].fileName + "\" href=\"" + data[i].fileDownUrl + "\" target=\"_blank\"><img width='" + width + "' height='30' src=\"" + virtualDirName+"Images/Word.png\"> </a>";
                break;
            case "docx":
                html += "<a title=\"" + data[i].fileName + "\" href=\"" + data[i].fileDownUrl + "\" target=\"_blank\"><img width='" + width + "' height='30' src=\"" + virtualDirName+"Images/Word.png\">  </a>";
                break;
            case "PDF":
                html += "<a title=\"" + data[i].fileName + "\" href=\"" + data[i].fileDownUrl + "\" target=\"_blank\"><img width='" + width + "' height='30' src=\"" + virtualDirName+"Images/pdf.png\">  </a>";
                break;
            case "pdf":
                html += "<a title=\"" + data[i].fileName + "\" href=\"" + data[i].fileDownUrl + "\" target=\"_blank\"><img width='" + width + "' height='30' src=\"" + virtualDirName+"Images/pdf.png\">  </a>";
                break;
            case "pptx":
                html += "<a title=\"" + data[i].fileName + "\" href=\"" + data[i].fileDownUrl + "\" target=\"_blank\"><img width='" + width + "' height='30' src=\"" + virtualDirName+"Images/PPT.png\">  </a>";
                break;
            default:
                html += "<a title=\"" + data[i].fileName + "\" href=\"" + data[i].imageShowUrl + "\" target=\"_blank\"><img width='" + width + "' height='30' href=\"" + data[i].fileDownUrl + "\" src=\"" + data[i].imageShowUrl + "\"> </a>";
                break;
            }
        }
        html += "</div>";
        return html;
    }
}
/* 
 常量
*/
var Constant = {
    /*计分表*/
    Score: {
        rootId:100,
        /* Dic职务 */
        post: 101,
        /* Dic职称 */
        staff: 110,
        /* Dic技术等级 */
        technicalLevel: 115,
        /* Dic 文化程度 */
        educationLevels: 122
    },
    tmppageDic: null,
    /* 返回模板Key对应的页面*/
    getDicPage: function (key) {
        if (this.tmppageDic == null) {
            this.tmppageDic = new Array();
            this.tmppageDic["1"] = "/Pact/HousingRental";
            this.tmppageDic["2"] = "/Pact/PlaceRental";
            this.tmppageDic["3"] = "/Pact/StationRental";
            this.tmppageDic["4"] = "/Pact/HouseRental";
            this.tmppageDic["5"] = "/Pact/NoHouseRental";
        }
        return this.tmppageDic[key];
    }
}
/*
 Easyui公共方法
    by 贺黎亮 2016-07-28创建
*/
var EasyuiUtil = {
    /* 关闭提示 */
    closeTip: function () {
        setTimeout(function () {
            $(".messager-body").window('close');
        }, 1000);
    },
    /* 不展开树 */
    treeGridShow: function (data, rootshow) {
        $(data).each(function (index, item) {
            if (!item.children) {
                // item.state = "open";
            }
            else {
                var isadd = true;
                if (rootshow != null && rootshow) {
                    if (item.ParentId == "00000000-0000-0000-0000-000000000000") {
                        isadd = false;
                    }
                }
                if (isadd && item.children.length > 0) {
                    item.state = "closed";
                }
                EasyuiUtil.treeGridShow(item.children);
            }
        });
        return data;
    },
    /* 删除 */
    del: function (args) {
        var selRows = $('#' + args.grid).datagrid('getChecked');
        if (selRows.length <= 0) {
            $.messager.alert('提示', '请选择一条记录进行操作!', 'info');
            return;
        }
        var OperArr = [], IdArr = [];
        $(selRows).each(function (i, o) {
            eval("OperArr.push(o." + args.tipFieldName + ");")
            IdArr.push(o.Id);
        });
        $.messager.confirm("操作提示", "您确定要执行删除物业 " + OperArr.join(",") + " 操作吗？", function (data) {
            if (data) {
                /*请求删除API */
                Topevery.API({
                    type: "post", api: args.api, data: { id: IdArr.join(","), ids: IdArr.join(",") }, callback: function (res) {
                        if (res.state == 1) {
                            if (args.callback) { args.callback(res); }
                            $.messager.alert('提示', '删除成功!', 'info');
                            EasyuiUtil.closeTip();
                        } else {
                            $.messager.alert('提示', res.msg, 'info');
                        }
                    }
                });
            }
        });
    },
    /* 图片处理 */
    picManage: {
        delApiUrl: "",
        /* 上传完毕拼接到图片列表 */
        addToPicList: function (args) {
            EasyuiUtil.picManage.delApiUrl = args.delApiUrl;
            EasyuiUtil.picManage.funType = args.funType;
            
            var imgbox_tmp = $("#" + args.imgboxtmp).html();
            var fileclass = "";
            imgbox_tmp = imgbox_tmp.replace("{UrlGuid}", args.file.Url).replace("{UrlGuid}", args.file.Url)
                          .replace("{imgboxId}", args.estateimgbox).replace("{imgboxId}", args.estateimgbox)
                         .replace("{FileTiltle}", args.file.FileTitle).replace("{Id}", args.file.Id);

            /* 文件类型缩略图 */
            if (args.file.FileExtation == ".doc" || args.file.FileExtation == ".pdf"
                || args.file.FileExtation == ".xls" || args.file.FileExtation == ".xlsx" || args.file.FileExtation == ".docx") {
                imgbox_tmp = imgbox_tmp.replace("{blank}", "");
                imgbox_tmp = imgbox_tmp.replace("{BigUrl}", args.file.Url);
                var imgName="";
                switch (args.file.FileExtation) {
                    case ".doc":
                    case ".docx":
                        imgName="doc";
                        fileclass = "imgdoc";
                        break;
                    case ".pdf":
                        imgName="pdf";
                        fileclass = "imgpdf";
                        break;
                    case ".xls":
                    case ".xlsx":
                        imgName="xls";
                        fileclass = "imgxls";
                        break;
                }
                imgbox_tmp = imgbox_tmp.replace("{imgClass}", fileclass)
                imgbox_tmp = imgbox_tmp.replace("{Url}", "");
                
                imgbox_tmp = imgbox_tmp.replace("{SmallUrl}", "../images/" + imgName + ".png");
            }

            imgbox_tmp = imgbox_tmp.replace("{blank}", " target=\"_blank\"");
            imgbox_tmp = imgbox_tmp.replace("{BigUrl}", args.file.Url);
            imgbox_tmp = imgbox_tmp.replace("{imgClass}", "");
            imgbox_tmp = imgbox_tmp.replace("{SmallUrl}", Topevery.getSmallmg(args.file.Url));
            imgbox_tmp = imgbox_tmp.replace("{Url}", args.file.Url);
            
            if (args.look) {
                imgbox_tmp = imgbox_tmp.replace("{look}", "dn");
            } else {
                imgbox_tmp = imgbox_tmp.replace("{look}", "");
            }

            $("#" + args.estateimgbox).append(imgbox_tmp);
        },
        /* 删除图片 */
        delPic: function (obj) {
            var DelJson = [];
            var Id = $(obj).attr("fId");
            if ($(obj).attr("imgboxId") == "propertycertimgbox") {
                DelJson = LeaseManager.formParm.EropertyCert;
            }
            else if ($(obj).attr("imgboxId") == "leasebrowerbox") {
                DelJson = LeaseManager.formParm.LeaseBrowseFile;
            }
            else if ($(obj).attr("imgboxId") == "turnroombox") {
                DelJson = TurnRoomManager.formParm.certFile;
            }
            else if ($(obj).attr("imgboxId") == "estateimgbox") {
                DelJson = EstateManager.formParm.EstatePic;
            }
            else if ($(obj).attr("imgboxId") == "leaseestateimgbox") {
                DelJson = LeaseManager.formParm.EstatePic;
            }
            else if ($(obj).attr("imgboxId") == "estatepropertycertimgbox") {
                DelJson = EstateManager.formParm.EropertyCert;
            }
            else if ($(obj).attr("imgboxId") == "housingrentalimgbox") {
                DelJson = PartBaseTemplate.pactFile;
            }
            else {
                DelJson = LeaseManager.formParm.EstatePic;
            }
            
            $(DelJson).each(function (i, o) {
                if ($(obj).attr("Url") == o.Url) {
                    DelJson.splice(i, 1);
                    $(obj).parent().remove();
                    return;
                }
            })
            //编辑模式调用接口删除附件
            if (Id != "0") {
                /*请求删除API */
                Topevery.API({
                    type: "post", api: EasyuiUtil.picManage.delApiUrl, data: { id: Id,funType: EasyuiUtil.picManage.funType }, callback: function (data) {
                        if (data.state == 1 || data.status==1 ) {
                        } else {
                            $.messager.alert('提示', data.msg, 'info');
                        }
                    }
                });
            }
        },
        /* 修改文件标题 */
        editFileTitle: function (obj) {
            if ($(obj).text() == "保存") {
                var OperJson = [];
                if ($(obj).attr("imgboxId") == "propertycertimgbox") {
                    OperJson = LeaseManager.formParm.EropertyCert;
                }
                else if ($(obj).attr("imgboxId") == "leasebrowerbox") {
                    OperJson = LeaseManager.formParm.LeaseBrowseFile;
                }
                else if ($(obj).attr("imgboxId") == "turnroombox") {
                    OperJson = TurnRoomManager.formParm.certFile;
                }
                else if ($(obj).attr("imgboxId") == "estateimgbox") {
                    OperJson = EstateManager.formParm.EstatePic;
                }
                else if ($(obj).attr("imgboxId") == "leaseestateimgbox") {
                    OperJson = LeaseManager.formParm.EstatePic;
                }
                else if ($(obj).attr("imgboxId") == "estatepropertycertimgbox") {
                    OperJson = EstateManager.formParm.EropertyCert;
                }
                else if ($(obj).attr("imgboxId") == "housingrentalimgbox") {
                    OperJson = PartBaseTemplate.pactFile;
                }
                else {
                    OperJson = LeaseManager.formParm.EstatePic;
                }
                $(OperJson).each(function (i, o) {
                    if ($(obj).attr("Url") == o.Url) {
                        o.FileTitle = $(obj).prev().find("textarea").val();
                        $(obj).prev().prev().html(o.FileTitle);
                        $(obj).prev().prev().show();
                        $(obj).prev().hide();
                        $(obj).text("编辑");
                        return;
                    }
                })
            } else {
                $(obj).prev().prev().hide();
                $(obj).prev().find("textarea").val($(obj).prev().prev().text());
                $(obj).prev().show();
                $(obj).text("保存");
            }
        }
    },
    /* Grid树表格 */
    treeGrid: function (args) {
        $('#'+args.id).treegrid({
            queryParams: args.queryParams,
            title: '',
            iconCls: 'icon-save',
            width: 700,
            height: 350,
            nowrap: false,
            rownumbers: true,
            animate: true,
            collapsible: true,
            border: true,
            url: args.url,
            idField: args.idField,
            treeField: args.treeField,
            columns:args.columns ,
            loadFilter: function (data) {
               return EasyuiUtil.treeGridShow(data);
           }
        });
    },
    /* Grid 表格 */
    grid: function (args) {
        $('#' + args.id).datagrid({
            queryParams: args.queryParams,
            singleSelect: args.singleSelect,
            selectOnCheck: false,
            checkOnSelect: false,
            url: virtualDirName + args.url,
            rownumbers: true,
            fit: false,
            border: false,
            pagination: true,
            nowrap: true,
            height: "95%",
            idField: 'Id',
            pageSize: 10,
            pageList: [10, 20, 50, 100],
            sortName: 'DisplayIndex',
            sortOrder: 'desc',
            columns: args.columns,
            toolbar: '#toolbar'
        });
    },
    /* 提示 */
    alterTip: function (args) {
        $.messager.alert('提示', args.msg, 'info');
    },
    /* 初始化字典Select */
    initDicSelect: function () {
        $("select").each(function () {
            $('#' + $(this).attr("id")).combotree({
                url:virtualDirName+'/Dictionary/GetAllDicByType?type=' + $(this).attr("type"),
                required: true,
                idField: "Id",
                textField: "Name",
                onClick: function (node) {
                }
            });
        });
    }
}
/* 公共方法 */
Date.prototype.format = function (format) {
    var o =
    {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(),    //day
        "h+": this.getHours(),   //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
        "S": this.getMilliseconds(), //millisecond
        "w": this.getDay()
    }
    if (format == "chs") {
        var date2 = new Date();
        var date3 = date2.getTime() - this.getTime()
        var days = Math.floor(date3 / (24 * 3600 * 1000))
        var leave1 = date3 % (24 * 3600 * 1000)
        var hours = Math.floor(leave1 / (3600 * 1000))
        var leave2 = leave1 % (3600 * 1000)
        var minutes = Math.floor(leave2 / (60 * 1000))
        var leave3 = leave2 % (60 * 1000)
        var seconds = Math.round(leave3 / 1000)
        format = (days > 365) ? Math.round(days / 365) + "年前" :
        (
            (days > 30 && days < 365) ? Math.round(days / 30) + "月前" :
            (
                (days > 0 && days < 31) ? days + "天前" :
                (
                    (hours > 0) ? hours + "小时前" :
                    (
                        (minutes > 0) ? minutes + "分钟前" : "1分钟前"
                    )
                )
            )
        );
    }
    else {
        if (/(y+)/.test(format))
            format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(format))
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    }
    return format;
}
//格式化字符串
//var str = String.Format("我叫{0}，今年{1}岁！", "小菜", 20);
String.Format = function (format) {
    switch (arguments.length) {
        case 0:
            return "";
        case 1:
            return arguments[0];
        default:
            var args = arguments;
            for (var i = 0; i < args.length - 1;) {
                format = format.replace("{" + i + "}", function () {
                    return args[++i].toString();
                });
            }
            return format;
    }
}
/*扩展Jquery */
$.fn.extend({
    /*根据tag判断HTML元素*/
    isTag: function (tn) { 
        if (!tn || !$(this)[0]) return false;
        if (!$(this)[0].tagName) return false;
        return $(this)[0].tagName.toLowerCase() == tn ? true : false;
    }
});
$.extend($.fn.validatebox.defaults.rules, {
    CHS: {
        validator: function (value, param) {
            return /^[\u0391-\uFFE5]+$/.test(value);
        },
        message: '请输入汉字'
    },
    english: {// 验证英语
        validator: function (value) {
            return /^[A-Za-z]+$/i.test(value);
        },
        message: '请输入英文'
    },
    ip: {// 验证IP地址
        validator: function (value) {
            return /\d+\.\d+\.\d+\.\d+/.test(value);
        },
        message: 'IP地址格式不正确'
    },
    ZIP: {
        validator: function (value, param) {
            return /^[0-9]\d{5}$/.test(value);
        },
        message: '邮政编码不存在'
    },
    QQ: {
        validator: function (value, param) {
            return /^[1-9]\d{4,10}$/.test(value);
        },
        message: 'QQ号码不正确'
    },
    mobile: {
        validator: function (value, param) {
            return /^(?:13\d|15\d|18\d)-?\d{5}(\d{3}|\*{3})$/.test(value);
        },
        message: '手机号码不正确'
    },
    email: {
        validator: function (value, param) {
            return /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(value);
        },
        message: '邮箱不正确'
    },
    tel: {
        validator: function (value, param) {
            return /^(\d{3}-|\d{4}-)?(\d{8}|\d{7})?(-\d{1,6})?$/.test(value);
        },
        message: '电话号码不正确'
    },
    mobileAndTel: {
        validator: function (value, param) {
            return /(^([0\+]\d{2,3})\d{3,4}\-\d{3,8}$)|(^([0\+]\d{2,3})\d{3,4}\d{3,8}$)|(^([0\+]\d{2,3}){0,1}13\d{9}$)|(^\d{3,4}\d{3,8}$)|(^\d{3,4}\-\d{3,8}$)/.test(value);
        },
        message: '请正确输入电话号码'
    },
    number: {
        validator: function (value, param) {
            return /^[0-9]+.?[0-9]*$/.test(value);
        },
        message: '请输入数字'
    },
    money: {
        validator: function (value, param) {
            return (/^(([1-9]\d*)|\d)(\.\d{1,2})?$/).test(value);
        },
        message: '请输入正确的金额'

    },
    mone: {
        validator: function (value, param) {
            return (/^(([1-9]\d*)|\d)(\.\d{1,2})?$/).test(value);
        },
        message: '请输入整数或小数'

    },
    integer: {
        validator: function (value, param) {
            return /^[+]?[1-9]\d*$/.test(value);
        },
        message: '请输入最小为1的整数'
    },
    integ: {
        validator: function (value, param) {
            return /^[+]?[0-9]\d*$/.test(value);
        },
        message: '请输入整数'
    },
    range: {
        validator: function (value, param) {
            if (/^[1-9]\d*$/.test(value)) {
                return value >= param[0] && value <= param[1];
            } else {
                return false;
            }
        },
        message: '输入的数字在{0}到{1}之间'
    },
    minLength: {
        validator: function (value, param) {
            return value.length >= param[0];
        },
        message: '至少输入{0}个字'
    },
    maxLength: {
        validator: function (value, param) {
            return value.length <= param[0];
        },
        message: '最多{0}个字'
    },
    //select即选择框的验证
    selectValid: {
        validator: function (value, param) {
            if (value === param[0]) {
                return false;
            } else {
                return true;
            }
        },
        message: '请选择'
    },
    idCode: {
        validator: function (value, param) {
            return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value);
        },
        message: '请输入正确的身份证号'
    },
    loginName: {
        validator: function (value, param) {
            return /^[\u0391-\uFFE5\w]+$/.test(value);
        },
        message: '登录名称只允许汉字、英文字母、数字及下划线。'
    },
    equalTo: {
        validator: function (value, param) {
            return value === $(param[0]).val();
        },
        message: '两次输入的字符不一至'
    },
    englishOrNum: {// 只能输入英文和数字
        validator: function (value) {
            return /^[a-zA-Z0-9_ ]{1,}$/.test(value);
        },
        message: '请输入英文、数字、下划线或者空格'
    },
    xiaoshu: {
        validator: function (value) {
            return /^(([1-9]+)|([0-9]+\.[0-9]{1,2}))$/.test(value);
        },
        message: '最多保留两位小数！'
    },
    ddPrice: {
        validator: function (value, param) {
            if (/^[1-9]\d*$/.test(value)) {
                return value >= param[0] && value <= param[1];
            } else {
                return false;
            }
        },
        message: '请输入1到100之间正整数'
    },
    BankCardNumber: {
        validator: function (value, param) {
            return /^\d{19}$/g.test(value);
        },
        message: '请输入正确的银行卡号！'
    },
    jretailUpperLimit: {
        validator: function (value, param) {
            if (/^[0-9]+([.]{1}[0-9]{1,2})?$/.test(value)) {
                return parseFloat(value) > parseFloat(param[0]) && parseFloat(value) <= parseFloat(param[1]);
            } else {
                return false;
            }
        },
        message: '请输入0到100之间的最多俩位小数的数字'
    },
    rateCheck: {
        validator: function (value, param) {
            if (/^[0-9]+([.]{1}[0-9]{1,2})?$/.test(value)) {
                return parseFloat(value) > parseFloat(param[0]) && parseFloat(value) <= parseFloat(param[1]);
            } else {
                return false;
            }
        },
        message: '请输入0到1000之间的最多俩位小数的数字'
    }
});
/*扩展Easyui form */
$.extend($.fn.form.methods, {
    enableDisabled: function (jq) {
        var pp = jq[0];
        $.each(pp, function () {
            $(this).attr("disabled", "disabled");
        });
    }
});
$.extend($.fn.form.methods, {
    enableReadonly: function (jq) {
        var pp = jq[0];
        $.each(pp, function () {
            $(this).attr("readonly", "readonly");
        });
    }
});
$.extend({
    treeMap: function (tree, mapFunc) {
        //递归转换数据
        function recursionMap(item) {
            //执行客户端代码
            var newItem = mapFunc(item);

            if (newItem.children && $.isArray(newItem.children)) {
                newItem.children = $.map(newItem.children, function (value, index) {
                    return recursionMap(value);
                });
            }
            return newItem;
        }

        var mapTree = $.map(tree, function (item, index) {
            return recursionMap(item, mapFunc);
        });
        return mapTree;
    }
});
function getRequest(sProp) {
    var re = new RegExp(sProp + "=([^\&]*)", "i");
    var a = re.exec(document.location.search);
    if (a == null)
        return null;
    return a[1];
}
function myformatter(date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    return y + '-' + (m < 10 ? ('0' + m) : m) + '-' + (d < 10 ? ('0' + d) : d);
}
function myparser(s) {
    if (!s) return new Date();
    var ss = (s.split('-'));
    var y = parseInt(ss[0], 10);
    var m = parseInt(ss[1], 10);
    var d = parseInt(ss[2], 10);
    if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
        return new Date(y, m - 1, d);
    } else {
        return new Date();
    }
}
(function ($) {
    $.fn.my97 = function (options, params) {
        if (typeof options == "string") {
            return $.fn.my97.methods[options](this, params);
        }
        options = options || {};
        if (!WdatePicker) {
            alert("未引入My97js包！");
            return;
        }
        return this.each(function () {
            var data = $.data(this, "my97");
            var newOptions;
            if (data) {
                newOptions = $.extend(data.options, options);
                data.opts = newOptions;
            } else {
                newOptions = $.extend({}, $.fn.my97.defaults, $.fn.my97.parseOptions(this), options);
                $.data(this, "my97", {
                    options: newOptions
                });
            }
            $(this).addClass('Wdate').click(function () {
                WdatePicker(newOptions);
            });
        });
    };
    $.fn.my97.methods = {
        setValue: function (target, params) {
            target.val(params);
        },
        getValue: function (target) {
            return target.val();
        },
        clearValue: function (target) {
            target.val('');
        }
    };
    $.fn.my97.parseOptions = function (target) {
        return $.extend({}, $.parser.parseOptions(target, ["el", "vel", "weekMethod", "lang", "skin", "dateFmt", "realDateFmt", "realTimeFmt", "realFullFmt", "minDate", "maxDate", "startDate", {
            doubleCalendar: "boolean",
            enableKeyboard: "boolean",
            enableInputMask: "boolean",
            autoUpdateOnChanged: "boolean",
            firstDayOfWeek: "number",
            isShowWeek: "boolean",
            highLineWeekDay: "boolean",
            isShowClear: "boolean",
            isShowToday: "boolean",
            isShowOthers: "boolean",
            readOnly: "boolean",
            errDealMode: "boolean",
            autoPickDate: "boolean",
            qsEnabled: "boolean",
            autoShowQS: "boolean",
            opposite: "boolean"
        }
        ]));
    };
    $.fn.my97.defaults = {
        dateFmt: 'yyyy-MM-dd'
    };

    $.parser.plugins.push('my97');
})(jQuery);
/*
   帮助类
*/
var util = {
    /* 虚拟目录名称 */
    path: "",
    webapipath: virtualDirName + "api/services/app/",
    ajaxLoading: function () {
        $("<div class=\"datagrid-mask\"></div>").css({ display: "block", width: "100%", height: $(window).height() }).appendTo("body");
        $("<div class=\"datagrid-mask-msg\"></div>").html("正在处理，请稍候").appendTo("body").css({ display: "block", left: ($(document.body).outerWidth(true) - 190) / 2, top: ($(window).height() - 45) / 2 });
    },
    ajaxLoadEnd: function () {
        $(".datagrid-mask").remove();
        $(".datagrid-mask-msg").remove();
    },
    /* 请求API */
    ajax: function (args)
    {
        var apiurl = args.api;
        var vdata = args.data;
        if (args.loading != false) {
            util.ajaxLoading();
        }
        if (args.isApi === 1) {
            apiurl = util.webapipath + apiurl;
        }
        if (apiurl.indexOf("api/") == 0) {
            apiurl = "/" + apiurl;
        }
        $.ajax({
            type: args.type ? args.type : "post",
            dataType: "json",
            Type: "JSON",
            contentType: "application/json",
            url: util.path + apiurl,
            data: vdata,
            async: args.wait ? false : true,
            success: function (res) {
                util.ajaxLoadEnd();
                if (args.callback) {
                    args.callback(res);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                util.ajaxLoadEnd();
                if (args.subtnDom != null) {
                    args.subtnDom.attr("isClick", 0);
                }
                if (XMLHttpRequest.responseText != "") {
                    if (args.errcallback) {
                        args.errcallback(XMLHttpRequest.responseText);
                        return;
                    }
                    if (args.isSubmit != null) {
                        args.isSubmit.isSubmit = false;
                    }
                    $.messager.alert("提示", "系统错误！", "info");
                }
            },
            complete: function (XHR, TS) { XHR = null; }
        });
    },
    ///时间格式装换  
    dataTimeFormat: function (val, row) {
        if (val !== null && typeof (val) != "undefined") {
            var data = val.split("T")[0];
            return data;
        } else {
            {
                return null;
            }
        }
    },
    ///时间格式转换
    dataTimeAllFormat: function (val, row) {
        if (val !== null && typeof (val) != "undefined") {
            var house = val.split("T")[1].substring(0, 5);
            return val.split("T")[0] + " " + house;
        } else {
            {
                return "";
            }
        }
    },
    /*新增Tab跳转*/
    addTab: function (obj) {
        var parmjson = $.parseJSON($(obj).attr("approparm"));
        console.log(parmjson);
        var urlParm = "", dyjson = "";
        for (var item in parmjson) {
            if (item != "redirUrl") {
                urlParm += "&" + item + "=";
                dyjson = "eval('urlParm+=parmjson." + item + "')";
                eval(dyjson);
            }
        }
        if (urlParm.length > 0) {
            urlParm = urlParm.substring(1);
        }
        if (typeof (top.addTab) == "undefined") {
            window.open(parmjson.redirUrl + "?" + urlParm)
        }
        top.addTab(null, parmjson.title, parmjson.redirUrl + "?" + urlParm, parmjson.title, true);
    },
    /*获取图片缩略图地址 */
    getSmallmg: function (url) {
        if (typeof (url) == "undefined") {
            return;
        }
        return url + "&W=100&H=100";
    },
    /* 文件上传*/
    uploadFile: {
        init: function (args) {
            $("#" + args.id).powerWebUpload({
                accept: {
                    title: "",
                    extensions: "jpg,png,xls,doc,docx,xlsx,pdf,gif,ppt,pptx,rar,zip",
                    mimeTypes: ""
                },
                auto: true,
                fileNumLimit: 50,
                callback: function (response) {
                    util.uploadFile.saveData(args, response);
                }
            });
        },
        /*保存数据*/
        saveData: function (args, file) {
            var uploadid = $("#" + args.id).attr("id");
            var imgboxid = $("#" + args.id).attr("imgbox");
            var imgboxtmpid = $("#" + args.id).attr("imgboxtmpid");

            var fileData = $("#" + uploadid).data("file");
            if (typeof (fileData) == "undefined") {
                fileData = [];
            }
            fileData.push(file);
            $("#" + uploadid).data("file", fileData);
            //添加到图片框
            util.uploadFile.appendImgBox(imgboxid, imgboxtmpid, file, uploadid);
        },
        /* 添加到图片框 */
        appendImgBox: function (imgboxid, imgboxtmpid, res, uploadid) {
            if ($("#" + imgboxid).attr("showedit") == "0") {
                res.showedit = "dn";
            }
            res.uploadid = uploadid;
            var tmpDom = $('#' + imgboxtmpid).tmpl(res);
            tmpDom.appendTo($('#' + imgboxid));
        },
        /*获取缩略图*/
        getSmallPic: function (url, fileextation) {
            var fileclass = "";
            var smallurl = "";

            switch (fileextation) {
                case ".doc":
                case ".docx":
                    fileclass = "imgdoc";
                    break;
                case ".pdf":
                    fileclass = "imgpdf";
                    break;
                case ".xls":
                case ".xlsx":
                    fileclass = "imgxls";
                    break;
                case ".zip":
                case ".rar":
                    fileclass = "imgrar";
                    break;
                case ".ppt":
                case ".pptx":
                    fileclass = "imgppt";
                    break;
            }

            if (fileclass == "") {
                smallurl = util.path + "/ashx/thumbimage.ashx?fid=" + url;
                smallurl = util.getSmallmg(smallurl)
            }


            return smallurl;
        },
        /*检测是否是图片*/
        isPic: function (fileextation) {
            var isPic = false;
            switch (fileextation) {
                case ".png":
                case ".jpg":
                case ".gif":
                case ".bmp":
                    isPic = true;
                    break;
            }
            return isPic;
        },
        /* 得到文件缩略图 */
        getfilePic: function (fileextation) {
            var fileclass = "";
            switch (fileextation) {
                case ".doc":
                case ".docx":
                    fileclass = "imgdoc";
                    break;
                case ".pdf":
                    fileclass = "imgpdf";
                    break;
                case ".xls":
                case ".xlsx":
                    fileclass = "imgxls";
                    break;
                case ".zip":
                case ".rar":
                    fileclass = "imgrar";
                    break;
                case ".ppt":
                case ".pptx":
                    fileclass = "imgppt";
                    break;
            }
            return fileclass;
        },
        /*得到非图片的缩略图*/
        getNoPicSmallPic: function (url, fileextation) {
            if (util.uploadFile.isPic(fileextation) == false) {
                return util.uploadFile.getfilePic(fileextation);
            }
        },
        /*点击图片跳转*/
        getBigPic: function (url, fileextation, FileTitle) {
            if (util.uploadFile.isPic(fileextation)) {
                return util.path + "/ashx/thumbimage.ashx?fid=" + url;
            }
            return util.path + "/Ashx/DownloadFile.ashx?FID=" + url + "&cid=" + FileTitle;
        },
        /*是否新窗口弹出*/
        isblank: function (url, fileextation) {
            if (util.uploadFile.isPic(fileextation)) {
                return " target='_blank'";
            }
        },
        /*删除附件*/
        delFile: function (obj) {
            //alert('1');
            var fileData = $("#" + $(obj).attr("uploadid")).data("file");
            //console.info(fileData);
            $(fileData).each(function (i, o) {
                if ($(obj).attr("url") == o.Url) {
                    fileData.splice(i, 1);
                    util.ajax({
                        type: "post",
                        api: util.webapipath + "FileW/DeleteFile",
                        data: JSON.stringify({ Id: o.Id }),
                        callback: function (res) {

                        }
                    });
                    $(obj).parent().parent().remove();
                    $("#" + $(obj).attr("uploadid")).data("file", fileData);
                    return;
                }
            });
        }
    },
    /*将URL参数转换成JSON对象*/
    parseQueryString: function () {
        var url = window.location.search.substr(1);
        var postdata = {};
        for (var i = 0; i < url.split("&").length ; i++) {
            var item = url.split("&")[i];
            postdata[item.split("=")[0]] = item.split("=")[1]
        }
        return postdata;
    },
    /*将json对象循环成隐藏input追加到页面*/
    arrJsonTobody: function (options) {
        for (var item in options) {
            if (!item) {
                continue;
            }
            var itemVal = "itemVal=options." + item;
            eval(itemVal);
            $("body").append("<input type='hidden'  id='" + item + "' value='" + itemVal + "' />")
        }
    },
    /* 获取url参数*/
    getQuery: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return r[2]; //decodeURI(r[2]);
        return null;
    },
    /*判断URL是否传了指定参数*/
    ParmhasVal: function (name) {
        var parmVal = util.getQuery(name);
        return (parmVal == null || parmVal == "") ? false : true;
    },
    /* 设置表单值 */
    setFormParm: function (res) {
        var objs = $("input,textarea,select", $("body"));
        var curVal = "";
        try {
            objs.each(function (index) {
                var o = $(this);
                if (o.attr("type") == "checkbox" && o.attr("name") != "") {
                    field = o.attr("name");

                    curVal = "curVal=res." + field;
                    eval(curVal);
                    /*选中*/
                    if (curVal) {
                        if (typeof (curVal) != "string") {
                            curVal = curVal.toString();
                        }
                        var vdata = curVal.split(",");
                        $(vdata).each(function (i, val) {
                            $("input[name='" + field + "'][value='" + val + "']").attr("checked", "checked").parent().addClass("easyui-selectedcheckbox");
                        });
                    }
                }
                else if (o.attr("type") == "radio" && o.attr("name") != "") {
                    field = o.attr("name");
                    curVal = "curVal=res." + field;
                    eval(curVal);
                    $("input[type=radio][name='" + field + "'][value=" + curVal + "]").attr("checked", 'checked').parent().addClass("easyui-selectedradio");
                }
                else if (o.attr("type") == "text" || o.attr("type") == "select") {
                    field = o.attr("id");
                    curVal = "curVal=res." + field;
                    eval(curVal);

                    //日期
                    if (o.hasClass("applyDate") && curVal != null) {
                        curVal = curVal.split("T")[0];
                    }
                    else if (o.hasClass("fullapplyDate") && curVal != null) {
                        curVal = util.dataTimeAllFormat(curVal);
                    }

                    $("#" + field).val(curVal);


                }
                else if (o.attr("type") == "select") {
                    field = o.attr("id");
                    curVal = "curVal=res." + field;
                    eval(curVal);
                    $("#" + field).val(curVal);
                }
                else if (o.attr("type") == "hidden") {
                    field = o.attr("id");
                    curVal = "curVal=res." + field;
                    eval(curVal);
                    $("#" + field).val(curVal);
                }
                else if (o.attr("type") != "button" && o.attr("id") != "") {
                    field = o.attr("id");
                    curVal = "curVal=res." + field;
                    eval(curVal);
                    $("#" + field).val(curVal);
                }


            });
        } catch (e) {
            alert(e);
        }
        //附件列表赋值
        var uploaddivArr = $(".uploaddiv");
        $(uploaddivArr).each(function () {
            var uploadid = $(this).attr("id");
            var topParmName = $(this).attr("topParmName");
            var filelist = [];
            filelist = "filelist=res." + topParmName;
            eval(filelist);
            $(filelist).each(function (i, o) {
                util.uploadFile.saveData({
                    id: uploadid
                }, o);
            });

        });

    },
    /*获取表单参数*/
    getFormParm: function (formid) {

        var objs = $("input,textarea,select", $("body"));
        if (formid != null) {
            objs = $("input,textarea,select", $("#" + formid));
        }
        var postdata = {};
        try {
            objs.each(function () {
                var o = $(this);
                if (o.attr("type") == "checkbox" && o.attr("name") != "") {
                    field = o.attr("name");
                    var chk_value = [];
                    $('input[name=' + field + ']:checked').each(function () {
                        chk_value.push($(this).val());
                    });
                    postdata[field] = chk_value.join(",");
                }
                else if (o.attr("type") == "radio" && o.attr("name") != "") {
                    field = o.attr("name");
                    postdata[field] = $("input[name='" + field + "']:checked").val();
                }
                else if (o.attr("type") == "text" || o.attr("type") == "select") {
                    field = o.attr("id");
                    postdata[field] = $("#" + field).val();
                } else if (o.attr("type") != "button" && o.attr("id") != "") {
                    field = o.attr("id");
                    postdata[field] = $("#" + field).val();
                } else if (o.attr("type") == "hidden") {
                    field = o.attr("id");
                    postdata[field] = $("#" + field).val();
                } else if (o.attr("type") == "select") {
                    field = o.attr("id");
                    postdata[field] = $("#" + field).val();
                }

            });

        } catch (e) {
            alert(e);
        }

        /*初始化上传*/
        var uploaddivArr = $(".uploaddiv");
        $(uploaddivArr).each(function () {
            var uploadid = $(this).attr("id");
            var topParmName = $(this).attr("topParmName");
            postdata[topParmName] = JSON.stringify($("#" + uploadid).data("file"));
        });

        return postdata;
    },
    /*将easyui的分页转换成我们分页格式*/
    ConvertEayuiPageInfo: function (para) {
        para = {};
        para.PageInfo.PageIndex = para.page;
        para.PageInfo.PageSize = para.rows;
        para.PageInfo.SortField = para.sort;
        para.PageInfo.SortType = para.order;
        delete para.page;
        delete para.rows;
        delete para.sort;
        delete para.order;
        return JSON.stringify(para);
        //return JSON.stringify({
        //    PageIndex: para.page,
        //    PageSize: para.rows,
        //    SortField: para.sort,
        //    SortType: para.order
        //});
    },
    /*查看模式操作*/
    lookMode: function (type) {
        if (util.ParmhasVal("islook") == false) {
            return;
        }

        /*查看模式要隐藏的*/
        $("*[isookhide='1']").hide();
        if (type != "load") {

            $("input[type='text']").attr("readonly", "readonly");

            var noborder = "BORDER-BOTTOM: 0px solid; BORDER-LEFT: 0px solid; BORDER-RIGHT: 0px solid; BORDER-TOP: 0px solid;";

            $("textarea").attr("readonly", "readonly").attr("style", noborder);

            $("select").attr("disabled", "disabled").attr("style", noborder);

            $("input[type='text']").attr("class", "");

            //隐藏没有选择的radio
            $("input[type='radio']").each(function (i, o) {
                if ($(o).is(':checked') == false) {
                    $(o).parent().parent().hide();
                } else {
                    $(o).parent().hide();
                }
            });

        }
    },
    /*加载问题*/
    LoadProblem: function (param) {
        //console.info(param);
        $(param).each(function (index, obj) {
            if (index == 0) {
                $('#temp').show().find('select').val(obj.ItemTypeId);
                $('#temp').find("textarea").val(obj.ProblemContent);
            }
            else {
                var dom = $('#temp').clone();
                dom.find('select').val(obj.ItemTypeId);
                dom.find("textarea").val(obj.ProblemContent);
                $('#temp').after(dom);
            }
        });
    },
    /*添加问题模板*/
    addProblem: function () {
        if ($('#temp').css('display') == "none") {
            $('#temp').show();
        }
        else {
            var clone = $('#temp').clone();
            clone.find("textarea").val("");
            $('#tdproblem').append(clone);
        }
    },
    /* 关闭提示 */
    closeTip: function () {
        setTimeout(function () {
            $(".messager-body").window("close");
        }, 1500);
    },
    /*删除问题模板*/
    delProblem: function (currentObj) {
        if ($('#temp').length == 1) {
            $(currentObj).parents('#temp').hide();
        }
        else {
            $(currentObj).parents('#temp').remove();
        }
    },
    /*跳转到合同管理页面，因为五个项目页面都要用到，所以提取出来*/
    goToPactManage: function (id) {
        top.addTab(null, '合同管理' + id, "/project/pactmanage?ProjectId=" + id, '合同管理' + id, true);
    },
    /*判断是否为空，为空返回""*/
    isNull: function (param) {
        if (param) {
            return param;
        }
        else {
            return "";
        }
    },
    goToEarly: function () {
        var projectId = util.getQuery('ProjectId');
        top.addTab(null, '前期管理' + projectId, "/project/earlymanage?ProjectId=" + projectId, '前期管理' + projectId, true);
    },
    /* 设置json变量到表单 */
    setParmByForm: function (args) {

        try {
            for (var item in args.JSON) {
                var val = "";
                eval("val=args.JSON." + item);
                if ($("#" + item).attr("dw") != null && val != null) {
                    val += $("#" + item).attr("dw");
                }
                if ($("#" + item).attr("datehour") != null && val != null) {
                    val = util.dataTimeAllFormat(val);
                }

                if (val == null) {
                    val = ""
                }

                $("#" + item).html(val);
            }
        } catch (e) {
        }
    },
    /*动态设置iframe高度*/
    iFrameHeight: function (id, height) {
        var mainheight = $("#" + id).contents().find("body").height() + 30;
        if (mainheight > 50) {
            if (mainheight > 300) {
                mainheight = mainheight + 100;
            }
            if (typeof (height) != "undefined") {
                mainheight = mainheight + height;
            }
            $("#" + id).height(mainheight);
            $("#" + $("#" + id).attr("frmid")).hide();
        } else {
            $("#" + $("#" + id).attr("frmid")).show();
        }
    },
    /*格式化报表提示*/
    formatReportTip: function () {

    },
    /*分页条*/
    pageBar: function (pageindex, totalCount, callback, id, pageSize) {
        if (!pageSize) {
            pageSize = 10;
        }
        /*生成分页条*/
        //var totalCount = collectRents.data.MonthList.length;//总条数
        var totalPage = totalCount % pageSize == 0 ? totalCount / pageSize : parseInt(totalCount / pageSize) + 1;
        var start = pageindex - 5;//开始页码
        if (start <= 0) {
            start = 1;
        }
        var end = pageindex + 5;//结束页码
        if (end > totalPage) {
            end = totalPage;
        }
        var html = '<ul>';
        if (pageindex > 1) {
            html += '<li onclick="' + callback + '(' + (pageindex - 1) + ')"  class="operate-btn">&lt;</li>';
        }
        else {
            html += '<li  class="operate-btn">&lt;</li>';
        }
        for (var i = start; i <= end; i++) {
            if (i == pageindex) {
                html += '<li onclick="' + callback + '(' + i + ')"  class="current">' + i + '</li>';
            }
            else {
                html += '<li onclick="' + callback + '(' + i + ')"  class="operate-btn">' + i + '</li>';
            }
        }
        if (pageindex < end) {
            html += '<li  onclick="' + callback + '(' + (pageindex + 1) + ')"  class="operate-btn">&gt;</li>';
        }
        else {
            html += '<li class="operate-btn">&gt;</li></ul>';
        }

        if (totalCount > 0) {
            $('#' + id).html(html);
        }

    },
    /*跳转新增tab*/
    redirUrl: function (title, url) {
        top.addTab(null, title, url, title, true);
    },
    /*跳转新增tab*/
    redirreportUrl: function (title, url) {
        url += "&year=" + util.getQuery("year") + "&month=" + util.getQuery("month");
        top.addTab(null, title, url, title, true);
    },
    /*打印*/
    windowPrint: function (options, obj) {
        LODOP = getLodop();
        LODOP.PRINT_INIT("打印控件功能演示_Lodop功能_全页");
        $(obj).hide();
        LODOP.ADD_PRINT_HTM("3%", "5%", "90%", "100%", document.documentElement.innerHTML);
        LODOP.PREVIEW();
        $(obj).show();
        //window.print();
    },
    jsonToDate: function (t, format, right) {
        if (t == null) return "";
        if (t == "") return t;

        if (t.indexOf("T") > 0) {
            t = util.dataTimeFormat(t);
            var year = t.split('-')[0];
            var month = t.split('-')[1];
            var date = t.split('-')[2];
            var alldate = year + "年" + month + "月" + date + "日";
            if (right != null && right != "") {
                alldate += right;
            }
        }

        try {
            var obj = {};
            if ("object" == typeof (t)) {
                obj = t;
            } else {
                t = t.replace("date", "Date");
                obj = eval("new " + (t.replace(/\//g, "")));
            }
            return obj.format(format);
        } catch (e) {
            return t;
        }
    },
    stringAppend: function (left, center, right, rightt) {
        if (util.isNoEmpty(left)
            && util.isNoEmpty(right)
            ) {
            return left + center + right + rightt;
        }
        return "";
    },
    isNoEmpty: function (val) {
        return (val == null || val == "") ? false : true;
    },
    /*初始化Select*/
    initSelect: function () {
        var isajaxList = $("select[isajax='1']");
        $(isajaxList).each(function () {
            var selectid = $(this).attr("id");
            var changeToVal = $(this).attr("changeToVal");

            if (typeof (changeToVal) != "undefined") {
                $("#" + selectid).change(function () {
                    $("#" + changeToVal).val($(this).val());
                });
            }
            $("#" + selectid).html("");
            util.ajax({
                type: "post",
                api: util.webapipath + $(this).attr("url"),
                data: "",
                callback: function (res) {
                    $("#" + selectid).append("<option value=\"\">-请选择-</option>");
                    $(res.Result).each(function (i, o) {
                        $("#" + selectid).append("<option value=\"" + o + "\">" + o + "</option>");
                    });
                }
            });

        });
    },
    /*Html解码*/
    htmlDecode: function (value) {
        if (value) {
            return $('<div />').html(value).text();
        } else {
            return '';
        }
    },
    Percentage: function (num, total) {
        var money = Math.round(num / total * 10000) / 100.00 + "%";
        if (money == "0%")
            return "";
        return money;
    },
}
/*
    通用增删改查逻辑基类
    by 贺黎亮 2016-09-19创建
*/
var TopeveryBase = Base.extend({
    gridApiUrl: "",
    /*构造方法*/
    constructor: function () {
    },
    /*初始化表格*/
    initGrid: function (options) {
        options = $.extend({}, { id: "grid", width: "100%", height: "90%", method: "post", singleSelect: true }, options || {});
        if (options.url == null) {
            options.url = $("#" + options.id).attr("url");
        }
        if (typeof (options.url) == "undefined") {
            options.url = $("#" + options.id).attr("turl");
        }

        if ($("#" + options.id).attr("singleSelect") == "false") {
            options.singleSelect = false;
        }

        var gridParm = {
            queryParams: options.queryParams,
            method: options.method,
            singleSelect: options.singleSelect,
            iconCls: "icon-save",
            striped: true,
            width: options.width,
            height: options.height,
            nowrap: false,
            animate: true,
            collapsible: true,
            border: true,
            rownumbers: true, //行号
            pagination: options.pagination || true, //分页控件
            pageSize: 10,
            pageList: [1, 10, 20, 50],
            sortName: "Id",
            sortOrder: "desc",
            toolbar: '#toolbarWrap',
            loadFilter: function (data) {
                return data;
            },
            onLoadSuccess: function (data) {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
            },
            loader: function (param, Success, error) {
                if (typeof (param.sort) == "undefined") {
                    param.sort = "Id";
                }
                if (typeof (param.order) == "undefined") {
                    param.order = "desc";
                }
                var postParm = {
                    PageIndex: param.page,
                    PageCount: param.rows,
                    sort: param.sort,
                    order: param.order
                };
                if (options.queryParams != null) {
                    postParm = $.extend({}, postParm, options.queryParams);
                }

                postParm = $.extend({}, postParm, util.parseQueryString());

                var formpostdata = ezg.serializeObject($('form')); //util.getFormParm();
                postParm = $.extend({}, postParm, formpostdata);
               
                /* 获取详情*/
                util.ajax({
                    type: "post",
                    api:  options.url,
                    data: JSON.stringify(postParm),
                    loading: false,
                    isApi: 1,
                    callback: function (data) {
                        if (data.success) {
                            Success(data.result);
                        } else {
                            error();
                        }
                    }
                });

            }
        };
        if (options.columns != null) {
            gridParm.columns = options.columns;
        }
        $("#" + options.id).datagrid(gridParm);
    },
    /*格式化操作列按钮*/
    formatOper: function (options) {
        var opermsg = "";
        if (options.type == "string") {
            return options.mes;
        }

        if (options.btnArr != null) {
            var tmpMes = "";
            $(options.btnArr).each(function (i, o) {
                tmpMes = JSON.stringify(o.approparm);
                opermsg += "<a class=\"" + o.classname + "\" approparm='" + tmpMes + "' onclick=\"javascript:util.addTab(this)\"  >" + o.title + "</a>";
            });

        } else {
            if (options.approparm != null) {
                options.approparm = JSON.stringify(options.approparm);
                opermsg += "<a class=\"easyui-checkoperate\" approparm='" + options.approparm + "' onclick=\"javascript:util.addTab(this)\"  >审</a>";
            }
            if (options.editparm != null) {
                options.editparm = JSON.stringify(options.editparm);
                opermsg += "<a class=\"easyui-modifyoperate\" approparm='" + options.editparm + "' onclick=\"javascript:util.addTab(this)\"  >修改</a>";
            }
            if (options.lookparm != null) {
                options.lookparm = JSON.stringify(options.lookparm);
                opermsg += "<a class=\"easyui-checkoperate\" approparm='" + options.lookparm + "' onclick=\"javascript:util.addTab(this)\"  >查看</a>";
            }
        }

        return opermsg;
    },
    /* 表单提交 */
    submitForm: function (options, curthis) {
        //验证用户必须输入必填项
        var validate = $("body").form("validate");
        if (validate === false) {
            return false;
        }
        var subtnDom = $("#" + $(curthis).attr("id"));
        if (subtnDom.attr("isClick") === "1") {
            return;
        }
        postdata = ezg.serializeObject($('form'));
        subtnDom.attr("isClick", 1);
        var apiurl = util.webapipath + $(curthis).attr("url");
        //如果是编辑
        if (subtnDom.attr("isedit") == 1) {
            apiurl = util.webapipath + $(curthis).attr("editur");
        }
        util.ajax({
            type: options.method,
            api: apiurl,
            data: JSON.stringify(postdata),
            subtnDom: subtnDom,
            callback: function (res) {
                subtnDom.attr("isClick", 0);
                if (res.success) {
                    $.messager.alert("提示", "提交成功", "info");
                }
                if (options.callback) {
                    options.callback(res);
                }

            }
        });
    },
    /* 刷新页面详情 */
    getPageDetails: function (options) {
        var parm = util.parseQueryString();
        parm = $.extend({}, parm, options.parm || {});
        //console.log(JSON.stringify(parm))
        /* 获取详情*/
        util.ajax({
            type: options.method,
            api: util.webapipath + options.url,
            data: JSON.stringify(parm),
            callback: function (res) {
                res = res.Result;
                //console.log(res)
                if (options.type == "look") {
                } else if (options.noFormSet == null) {
                    util.setFormParm(res);
                    $("body").form("validate");
                }
                /*查看模式*/
                util.lookMode();
                if (options.callback) {
                    options.callback(res);
                }
            }
        });
    },
    /*弹出层*/
    openDialog: function (options, obj) {
        options = $.extend({
            url: $(obj).attr("url"),
            title: $(obj).attr("title"),
            width: $(obj).attr("width"),
            height: $(obj).attr("height")
        }, options || {});
        var btnOper = [
                {
                    text: "确定",
                    iconCls: "icon-ok",
                    handler: function () {
                        console.info(options.callback);
                        var dialogFrm = mydialog.find("iframe").get(0).contentWindow;
                        var dycallack = "dialogFrm." + options.subcallback + "(callback);";
                        eval(dycallack);
                        function callback() {
                            options.callback();
                            mydialog.dialog("close");
                        }
                    }
                }, {
                    text: "关闭",
                    iconCls: "icon-remove",
                    handler: function () {
                        mydialog.dialog("close");
                    }
                }
        ];

        if ($(obj).attr("nobtn") == "1") {
            btnOper = [];
        }
        var mydialog = ezg.modalDialog({
            width: options.width || 400,
            height: options.height || 350,
            title: options.title,
            url: virtualDirName+options.url,
            buttons: btnOper
        });

    },
    /*删除*/
    delData: function (options, obj) {
        var selRows = $("#" + options.grid).datagrid("getChecked");
        if (selRows.length <= 0) {
            $.messager.alert("提示", "请选择一条记录进行操作!", "info");
            return;
        }
        var OperArr = [], IdArr = [];
        $(selRows).each(function (i, o) {
            eval("OperArr.push(o." + options.tipFieldName + ");");
            IdArr.push(o.Id);
        });

        $.messager.confirm("操作提示", "您确定要执行删除操作吗？", function (data) {
            if (data) {
                //console.log(JSON.stringify({ IdString: IdArr.join(",") }))
                /*请求删除API */
                util.ajax({
                    type: "post",
                    api: util.webapipath + $(obj).attr("url"),
                    data: JSON.stringify({ IdString: IdArr.join(",") }),
                    callback: function (res) {
                        if (res.Success) {
                            if (options.callback) {
                                options.callback(res);
                            }
                            $.messager.alert("提示", "删除成功!", "info");
                            util.closeTip();
                            //window.location.reload();
                            $("#" + options.grid).datagrid("reload");

                        } else {
                            $.messager.alert("提示", res.msg, "info");
                        }
                    }
                });
            }
        });
    },
    /*渲染列表*/
    initList: function (options) {
        options = $.extend({}, { id: "grid" }, options || {});
        if (typeof (options.sort) == "undefined") {
            options.sort = "Id";
        }
        if (typeof (options.order) == "undefined") {
            options.order = "desc";
        }
        var postParm = {
            PageIndex: param.page,
            PageCount: param.rows,
            sort: options.sort,
            order: options.order
        };
        postParm = $.extend({}, postParm, util.parseQueryString());
        var formpostdata = util.getFormParm();
        postParm = $.extend({}, postParm, formpostdata);
        //console.log( util.ConvertEayuiPageInfo(postParm)),
        /* 获取详情*/
        util.ajax({
            type: "post",
            api: options.url,
            data: util.ConvertEayuiPageInfo(postParm),
            loading: true,
            isApi: 1,
            callback: function (data) {
                if (data.result == null) {
                    if (options.callback)
                        options.callback(data.result);
                    return;
                }
                if (options.noclear == null || options.noclear == "") {
                    $('#' + options.id).html("");
                }
                if (options.cusomTmp) {
                    options.cusomTmp(data.result);
                } else {
                    var rdata = data.result;
                    if (typeof (data.result.rows) != "undefined") {
                        rdata = data.result.rows;
                    }
                    $(rdata).each(function (i, o) {
                        o.index = i + 1;
                    });
                    var tmpDom = $('#' + options.tmpid).tmpl(rdata);
                    if (options.oper == "insertAft") {
                        tmpDom.insertAfter($('#' + options.oper));
                    } else {

                        tmpDom.appendTo($('#' + options.id));
                    }
                }
                if (options.callback)
                    options.callback(data.result);
            }
        });

    }
});

