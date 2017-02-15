var map = null;
var drawingManager;
var overlays = [];
MapHelper = {
    Map: null,
    Init: function (args) {
        if (map != null)
            return;
        map = new BMap.Map(args.mapid);
     
  

        map.enableScrollWheelZoom();

        map.addControl(new BMap.NavigationControl()); // 添加平移缩放控件
        map.addControl(new BMap.ScaleControl()); // 添加比例尺控件
        map.centerAndZoom(new BMap.Point(113.0318, 22.5450), 20); // 初始化地图,设置中心点坐标和地图级别
        map.setCurrentCity("江门");
        MapHelper.Addarea();


        var overlaycomplete = function (e) {
            overlays.push(e.overlay);
        };
        var styleOptions = {
            strokeColor: "red",    //边线颜色。  
            fillColor: "red",      //填充颜色。当参数为空时，圆形将没有填充效果。  
            strokeWeight: 2,       //边线的宽度，以像素为单位。  
            strokeOpacity: 0.8,    //边线透明度，取值范围0 - 1。  
            fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。  
            strokeStyle: 'solid' //边线的样式，solid或dashed。  
        }
        //实例化鼠标绘制工具  
        drawingManager = new BMapLib.DrawingManager(map, {
            isOpen: false, //是否开启绘制模式  
            //enableDrawingTool: true, //是否显示工具栏  
            drawingToolOptions: {
                anchor: BMAP_ANCHOR_TOP_RIGHT, //位置  
                offset: new BMap.Size(5, 5), //偏离值  
            },
            circleOptions: styleOptions, //圆的样式  
            polylineOptions: styleOptions, //线的样式  
            polygonOptions: styleOptions, //多边形的样式  
            rectangleOptions: styleOptions //矩形的样式  
        });

        //添加鼠标绘制工具监听事件，用于获取绘制结果  
        drawingManager.addEventListener('overlaycomplete', overlaycomplete);

        map.addEventListener("rightclick", function (e) {
            if (confirm(e.point.lng + "," + e.point.lat)) {
                $("shape").innerHTML = $("shape").innerHTML + " <br/>(" + e.point.lng + "," + e.point.lat + ")";
            }
        });


        //var bound = new BMap.Bounds(new BMap.Point(112.073727,21.641164), new BMap.Point(113.199914, 22.820509)); // 范围 左下角，右上角的点位置 
        //try {    //try catch方法，可以避免bug引起的错误
        //    BMapLib.AreaRestriction.setBounds(map, bound); // 已map为中心，已b为范围的地图
        //} catch (e) {
        //    // 捕获错误异常
        //    alert(e);
        //}

    },
    SetHouse: function () {
        $.ajax({
            type: "POST",
            url: virtualDirName + "api/services/app/HouseBanR/GetHouseBanListFromMap",
            contentType: "application/json",
            data: topevery.extend({ SearchCondition: $("#HouseNo").val() })
        }).done(function (data) {
            if (data.success) {
                map.clearOverlays(); //清除地图上所有覆盖物
                var result = data.result;
                for (var i = 0; i < result.length; i++) {
                    var long = parseFloat(result[i].longitude);
                    var lat = parseFloat(result[i].latitude);
                    if (isNaN(long) || isNaN(lat)) {
                        continue;
                    }
                    var point = new BMap.Point(long, lat);
                    var marker = new BMap.Marker(point); // 创建标注
                    marker.setTitle(result[i].houseNo);
                    marker.addEventListener("click", (function (result) {
                        return function () {
                            $("#houseWindow").show();
                            var imgshow = "";
                            for (var j = 0; j < result.fileRDto.length; j++) {
                                imgshow += "<a title=\"" + result.fileRDto[j].fileName + "\"  target=\"_blank\"><img onclick='$.bindViewerClick(this);' class='viewer-item' width='" + 100 + "'  src=\"" + result.fileRDto[j].imageShowUrl + "\" style='margin-left: 6px;margin-top:4px;'> <img/></a>";
                            }
                            var leasing =$("#LeasingApply").val()? "<a class='easyui-btn' onclick='MapHelper.Leasing(\"" + result.houseNo + "\")'>房屋租赁申请</a>":"";
                            var minorRepair = $("#RepairApply").val()? "<a class='easyui-btn1' onclick='MapHelper.MinorRepair(\"" + result.houseNo + "\")'>小修工程申请</a>":"";
                            var daZhongXiu = $("#DaZhongXiuEngineeringApply").val()?"<a class='easyui-btn'  onclick='MapHelper.DaZhongXiu(\"" + result.houseNo + "\")'>大中修工程申请</a>":"";
                            var html = "<div style='width: 109px;float: left;'>" + leasing + minorRepair + daZhongXiu+ "</div><div style='padding:0 5px'>" + imgshow + "</div>";
                           
                            var wi = new BMap.InfoWindow(html);
                            this.openInfoWindow(wi);
                            map.panTo(new BMap.Point(result.longitude, result.latitude));
                            MapHelper.GetHouseInfo(result.id);
                        }
                    })(result[i]));
                    map.addOverlay(marker); // 将标注添加到地图中
                    MapHelper.Addarea();
                }
            }
        });
    },
    GetHouseInfo: function (id) {
        topevery.ajax({
            type: "POST",
            url: "api/services/app/HouseBanR/GetHouseBanItemAsync",
            contentType: "application/json",
            data: topevery.extend({ "id": id })
        }, function (data) {
            if (data.success) {
                var d = data.result;
                $("#HouseNoD").html("<a href='#' onclick='objectExtend.HouseBan(" + d.id + ")'>" + d.houseNo + "</a>");
                $("#HouseDoorplate").html(d.houseDoorplate);
                $("#BuildStructureName").html(d.buildStructureName);
                $("#PropertyName").html(d.propertyName);
                $("#PropertyRange").html(d.propertyRange);
                $("#TotalFloors").html(d.totalFloors);
                $("#CompletYear").html(d.completYear);
                $("#SecurityLevelName").html(d.securityLevelName);
                $("#BuildArea").html(d.buildArea);
                $("#MetRentArea").html(d.metRentArea);
                $("#AreaIdName").html(d.areaIdName);
                $("#GroundNo").html(d.groundNo);
                $("#LandNatureName").html(d.landNatureName);
                $("#LandArea").html(d.landArea);
                $("#SubstrateArea").html(d.substrateArea);
                $("#ImmovableNo").html(d.immovableNo);
            }
        }, false);
    },
    Leasing: function (i) {
        window.location.href = virtualDirName + "HouseRentApply/LeasingApplication?mapHouseNo=" + i;
        window.top.$(".center-menu").find("li").eq(3).addClass("current");
        window.top.$(".center-menu").find("li").eq(0).removeClass("current");
    },
    MinorRepair: function (i) {
        window.location.href = virtualDirName + "HouseRepair/MinorRepairEngineeringApply?mapHouseNo=" + i;
        window.top.$(".center-menu").find("li").eq(4).addClass("current");
        window.top.$(".center-menu").find("li").eq(0).removeClass("current");
    },
    DaZhongXiu: function (i) {
        window.location.href = virtualDirName + "BigHouseRepair/DaZhongXiuEngineeringApply?mapHouseNo=" + i;
        window.top.$(".center-menu").find("li").eq(5).addClass("current");
        window.top.$(".center-menu").find("li").eq(0).removeClass("current");
    },
    close:function() {
        $("#houseWindow").hide();
    },
    Addarea: function () {
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
            map.centerAndZoom(new BMap.Point(112.8018, 22.4450), 11); // 初始化地图,设置中心点坐标和地图级别
         
        });
    },
}
//手动画边界测试
var bdDrawHandle = null;
function draw(type) {
    drawingManager.open();
    drawingManager.setDrawingMode(type);
}

function getPoint() {
    for (var i = 0; i < overlays.length; i++) {
        var overlay = overlays[i].getPath();
        for (var j = 0; j < overlay.length; j++) {
            var grid = overlay[j];
        }
    }
}
(function ($, window) {
    $.bindViewerClick = function(elm) {
        viewImg();
        function viewImg() {
            var $win = $(window);
            var $obj = $(elm),
                src = $obj.attr("src"),
                win_h = window.innerHeight || document.documentElement.clientHeight,
                win_w = window.innerWidth || document.documentElement.clientWidth,
                sroll_t = $win.scrollTop(),
                sroll_l = $win.scrollLeft(),
                $img = $("<img style='position:absolute;z-index:9999998;left:50%;border-radius:8px;opacity:0;' src='" + src + "' />"),
                $bg = $("<div style='position:fixed;z-index:9999997;top:0;bottom:0;left:0;right:0;background:black;opacity:0.6;'></div>"),
                $close = $("<a title='关闭' style='position:absolute;z-index:9999999;left:50%;padding:11px 15px;cursor:pointer;background:black;color:white;border-radius:50%;font-family:Arial;font-size:14px;transition:background .5s;text-decoration:none;'>X</a>");
            $bg.appendTo("body").hide().fadeIn(200);
            $close.appendTo("body").hover(function() {
                $(this).css({ "background": "#D90000", "text-decoration": "none" })
            }, function() {
                $(this).css("background", "black")
            }).hide();
            $(document).off("click", $img.get(0));
            $img.appendTo("body").load(function() {
                var img_w = $(this).width(),
                    img_h = $(this).height();
                if (win_h * 0.8 < img_h || win_w * 0.8 < img_w) { //处理图片大过屏幕的问题
                    var win_scale = win_w / win_h,
                        img_scale = img_w / img_h,
                        temp = 0;
                    if (win_scale > img_scale) { //由图片高度着手处理
                        temp = img_h;
                        img_h = win_h * 0.8;
                        img_w = img_w * img_h / temp;
                    } else { //由图片宽度着手处理
                        temp = img_w;
                        img_w = win_w * 0.8;
                        img_h = img_w * img_h / temp;
                    }
                }
                $(this).css({ "top": win_h / 2 + sroll_t, "margin-left": sroll_l - 50, "margin-top": "-50px", "width": "100px", "height": "100px" })
                    .animate({ "opacity": "1", "margin-left": -img_w / 2, "margin-top": -img_h / 2, "width": img_w, "height": img_h }, 300,
                        function() {
                            $close.css({ "top": win_h / 2 + sroll_t, "margin-left": img_w / 2 - 20 + sroll_l, "margin-top": -10 - img_h / 2 }).fadeIn(500);
                        });
                $close.add($bg).click(function() {
                    $img.add($bg).add($close).remove();
                    $img = $bg = $close = null;
                })
            })
        }
    };
}(jQuery, window));
