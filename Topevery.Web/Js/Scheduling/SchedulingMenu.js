//将表单数据转为json
var now;
var week;
var grid;
var dialog1;
var dialog10;
var tenantTypelist;
var dialogImport;
function loadData(param, success, error) {
    topevery.ajax({
        type: "POST",
        url: "api/services/app/SchedulingR/GetSchedulingListAsync",
        contentType: "application/json",
        data: topevery.extend(topevery.form2Json("selectFrom"), {
            PageIndex: param.page,
            PageCount: param.rows,
            Order: param.order,
            Sort: param.sort
        })
    }, function (data) {
        if (data.success) {
            success(data.result);
        } else {
            error();
        }
    }, true);
};

Scheduling = {
    ///加载列表数据-
    Initialize: function () {
        grid = $('#SchedulingTable').datagrid({
            height: 480,
            idField: "id",
            striped: true,
            fitColumns: true,
            fit: true,
            loadMsg: false,
            nowrap: false,
            loader: loadData,
            rownumbers: true, //行号
            pagination: true, //分页控件
            pageSize: 10,
            pageList: [10, 20, 50, 100],
            showFooter: true,
            onLoadSuccess: function (data) {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
            },
            columns: [
                [
                    { field: "schedulinId", checkbox: true },
                      { title: '工作站名称', field: 'houseManageName', width: 80, align: 'center' },
                    {
                        title: '时间段', field: 'periodTime', width: 100, sortable: true, align: 'center',
                        formatter: function (value,row,index) {
                            return row.shiftName + "(" + topevery.dataTimeFormat1(row.startTime) + "-" + topevery.dataTimeFormat1(row.endTime) + ")";
                        }
                    },
                    {
                        title: '备注', field: 'remark', width: 80, align: 'center'
                    },
                    {
                        title: '星期一', field: 'monday', width: 80, align: 'center',
                        formatter: function (value, row, index) {
                            if (value != null && value !== "") {
                                return '<a style="cursor: pointer;" onclick="Scheduling.Add(' + row.schedulinId + ',' + row.houseManageId + ',this);">' + value + '</a>';
                            } else {
                                return '<a style="cursor: pointer;" onclick="Scheduling.Add(' + row.schedulinId + ',' + row.houseManageId + ',this);">&nbsp&nbsp&nbsp</a>';
                            }
                        }
                    },
                    {
                        title: '星期二', field: 'tuesday', width: 80, align: 'center',
                        formatter: function (value, row, index) {
                            if (value != null && value !== "") {
                                return '<a style="cursor: pointer;" onclick="Scheduling.Add(' + row.schedulinId + ',' + row.houseManageId + ',this);">' + value + '</a>';
                            } else {
                                return '<a style="cursor: pointer;" onclick="Scheduling.Add(' + row.schedulinId + ',' + row.houseManageId + ',this);">&nbsp&nbsp&nbsp</a>';
                            }
                        }
                    },
                    {
                        title: '星期三', field: 'wednesday', width: 80, align: 'center',
                        formatter: function (value, row, index) {
                            if (value != null && value !== "") {
                                return '<a style="cursor: pointer;" onclick="Scheduling.Add(' + row.schedulinId + ',' + row.houseManageId + ',this);">' + value + '</a>';
                            } else {
                                return '<a style="cursor: pointer;" onclick="Scheduling.Add(' + row.schedulinId + ',' + row.houseManageId + ',this);">&nbsp&nbsp&nbsp</a>';
                            }
                        }
                    },
                    {
                        title: '星期四', field: 'thursday', width: 80, align: 'center',
                        formatter: function (value, row, index) {
                            if (value != null && value !== "") {
                                return '<a style="cursor: pointer;" onclick="Scheduling.Add(' + row.schedulinId + ',' + row.houseManageId + ',this);">' + value + '</a>';
                            } else {
                                return '<a style="cursor: pointer;" onclick="Scheduling.Add(' + row.schedulinId + ',' + row.houseManageId + ',this);">&nbsp&nbsp&nbsp</a>';
                            }
                        }
                    },
                    {
                        title: '星期五', field: 'friday', width: 80, align: 'center',
                        formatter: function (value, row, index) {
                            if (value != null && value !== "") {
                                return '<a style="cursor: pointer;" onclick="Scheduling.Add(' + row.schedulinId + ',' + row.houseManageId + ',this);">' + value + '</a>';
                            } else {
                                return '<a style="cursor: pointer;" onclick="Scheduling.Add(' + row.schedulinId + ',' + row.houseManageId + ',this);">&nbsp&nbsp&nbsp</a>';
                            }
                        }
                    },
                    {
                        title: '星期六', field: 'saturday', width: 80, align: 'center',
                        formatter: function (value, row, index) {
                            if (value != null && value !== "") {
                                return '<a style="cursor: pointer;" onclick="Scheduling.Add(' + row.schedulinId + ',' + row.houseManageId + ',this);">' + value + '</a>';
                            } else {
                                return '<a style="cursor: pointer;" onclick="Scheduling.Add(' + row.schedulinId + ',' + row.houseManageId + ',this);">&nbsp&nbsp&nbsp</a>';
                            }
                        }
                    },
                    {
                        title: '星期日', field: 'sunday', width: 80, align: 'center',
                        formatter: function (value, row, index) {
                            if (value != null && value !== "") {
                                return '<a style="cursor: pointer;" onclick="Scheduling.Add(' + row.schedulinId + ',' + row.houseManageId + ',this);">' + value + '</a>';
                            } else {
                                return '<a style="cursor: pointer;" onclick="Scheduling.Add(' + row.schedulinId + ',' + row.houseManageId + ',this);">&nbsp&nbsp&nbsp</a>';
                            }
                        }
                    }
                ]
            ],
            toolbar: '#toolbarWrap'
        });
        if ($("#WorkstationDropDown").val()) {
            bindDropDown("HouseManageId", "Common/GetWorkstationBind", "--工作站--", false, false);
        } else {
            bindDropDown("HouseManageId", "Common/GetWorkstationBind", "--工作站--", false, true);
            $("#HouseManageId").combobox("readonly");
        }
        for (var i = 0; i < $(".easyui-textbox").length; i++) {
            $("#" + $('.easyui-textbox').eq(i)[0].id + "").textbox({
                inputEvents: $.extend({}, $.fn.textbox.defaults.inputEvents, {
                    keyup: function (event) {
                        if (event.keyCode === 13) {
                            Scheduling.loadInfo();
                        }
                    }
                })
            });
        }
    },
    ///搜索
    loadInfo: function () {
        $('#SchedulingTable').datagrid('load', { input: topevery.form2Json("selectFrom") }); //点击搜索
    },
    Add: function (schedulinId, houseManageId, thisId) {
        debugger;
        var week = $($(thisId).parent().parent()).eq(0).attr('field');
        var dateTime = getDateTime(week);
        dialog10 = ezg.modalDialog({
            width: 1100,
            height: 595,
            title: '编辑工作人员',
            url: virtualDirName + 'Scheduling/SchedulingView?schedulinId=' + schedulinId + '&dateTime=' + dateTime + '&houseManageId=' + houseManageId
        });
    },
    ///删除一条数据
    deleterow: function (id) {
        topeveryMessage.confirm(function (r) {
            if (r) {
                $.ajax({
                    type: 'POST',
                    url: virtualDirName + 'api/services/app/SchedulingW/DeleteSchedulingAsync',
                    data: JSON.stringify({ "ids": id }),
                    contentType: "application/json",
                    Type: "JSON",
                    success: function (row) {
                        if (row.success) {
                            $("#SchedulingTable").datagrid('reload');
                            topeveryMessage.show("删除成功");
                        } else {
                            topeveryMessage.show(row.result.message);
                        }
                    }
                });
            }
        });
    },
    Delete: function () {
        var arrRows = $('#SchedulingTable').datagrid('getChecked');
        if (arrRows.length === 0) {
            window.top.topeveryMessage.show("请选择一条需要删除的记录!", "提示");
            return;
        }
        var ids = [];
        $.each(arrRows, function () {
            ids.push(this.id);
        });
        topeveryMessage.confirm(function (r) {
            if (r) {
                $.ajax({
                    type: 'POST',
                    url: virtualDirName + 'api/services/app/SchedulingW/DeleteSchedulingAsync',
                    data: JSON.stringify({ "ids": ids.join() }),
                    contentType: "application/json",
                    Type: "JSON",
                    success: function (row) {
                        if (row.success) {
                            $("#SchedulingTable").datagrid('reload');
                            topeveryMessage.show("删除成功");
                        } else {
                            topeveryMessage.show("删除失败");
                        }
                    }
                });
            }
        });
    },
    LastWeek: function () {
        now = addDay(now, -7);
        week = theWeek(now);
        $("#week").html("第<a style=\"color: Red;font-weight: bold;\">" + week + "</a>周");
        var startTime = $("#StartTime").datebox("getValue");
        var endTime = $("#EndTime").datebox("getValue");
        $("#StartTime").datebox("setValue", getWeekStartDate(startTime,-6));
        $("#EndTime").datebox("setValue", getWeekStartDate(endTime, -7));
        Scheduling.loadInfo();
    },
    NextWeek: function () {
        now = addDay(now, 7);
        week = theWeek(now);
        $("#week").html("第<a style=\"color: Red;font-weight: bold;\">" + week + "</a>周");
        var startTime = $("#StartTime").datebox("getValue");
        var endTime = $("#EndTime").datebox("getValue");
        $("#StartTime").datebox("setValue", getWeekStartDate(startTime,8));
        $("#EndTime").datebox("setValue", getWeekStartDate(endTime, 7));
        Scheduling.loadInfo();
    },
    Clear:function() {
        $("#HouseManageId").combobox('setValue', '');
        Scheduling.loadInfo();
    }
}
///初始化
$(function () {
    now = getWeekStartDate(null,4);
    week = theWeek(now);
    $("#week").html("第<a style=\"color: Red;font-weight: bold;\">" + week + "</a>周");
    $("#StartTime").datebox("setValue", getWeekStartDate(null,1));
    $("#EndTime").datebox("setValue", getWeekStartDate(null,7));
    Scheduling.Initialize();
});

function getDateTime(week) {
    var day;
    var startTime = $("#StartTime").datebox('getValue');
    switch (week) {
        case "monday":
            day = 0;
            break;
        case "tuesday":
            day =1;
            break;
        case "wednesday":
            day = 2;
            break;
        case "thursday":
            day = 3;
            break;
        case "friday":
            day = 4;
            break;
        case "saturday":
            day = 5;
            break;
        case "sunday":
            day = 6;
            break;
        default:
            day = 0;
    }
    return addDay(startTime, day);
}

//获得本周的开始日期 
function getWeekStartDate(data, day) {
    var now = new Date(); //当前日期 
    if (data!=null) {
        now = new Date(data);
    } 
    var nowDayOfWeek = now.getDay(); //今天本周的第几天 
    var nowDay = now.getDate(); //当前日 
    var nowMonth = now.getMonth(); //当前月 
    var nowYear = now.getYear(); //当前年 
    nowYear += (nowYear < 2000) ? 1900 : 0; //
    var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek + day);
    return formatDate(weekStartDate);
}
//指定日期添加day
function addDay(data,day) {
    var now = new Date(data);
    var nowYear = now.getYear(); //当前年 
    nowYear += (nowYear < 2000) ? 1900 : 0; //
    var nowMonth = now.getMonth(); //当前月 
    var nowDay = now.getDate(); //当前日 
    var weekStartDate = new Date(nowYear, nowMonth, nowDay + day);
    return formatDate(weekStartDate);
}
//格式化日期：yyyy-MM-dd 
function formatDate(date) {
    var myyear = date.getFullYear();
    var mymonth = date.getMonth() + 1;
    var myweekday = date.getDate();

    if (mymonth < 10) {
        mymonth = "0" + mymonth;
    }
    if (myweekday < 10) {
        myweekday = "0" + myweekday;
    }
    return (myyear + "-" + mymonth + "-" + myweekday);
}
//指定日期或者当前日期在当年的周
function theWeek(data) {
    var now = new Date(); //当前日期 
    if (data != null) {
        now = new Date(data);
    }
    var totalDays = 0;
    years = now.getYear()
    if (years < 1000)
        years += 1900
    var days = new Array(12);
    days[0] = 31;
    days[2] = 31;
    days[3] = 30;
    days[4] = 31;
    days[5] = 30;
    days[6] = 31;
    days[7] = 31;
    days[8] = 30;
    days[9] = 31;
    days[10] = 30;
    days[11] = 31;

    //判断是否为闰年，针对2月的天数进行计算
    if (Math.round(now.getYear() / 4) == now.getYear() / 4) {
        days[1] = 29
    } else {
        days[1] = 28
    }

    if (now.getMonth() == 0) {
        totalDays = totalDays + now.getDate();
    } else {
        var curMonth = now.getMonth();
        for (var count = 1; count <= curMonth; count++) {
            totalDays = totalDays + days[count - 1];
        }
        totalDays = totalDays + now.getDate();
    }
    //得到第几周
    var week = Math.round(totalDays / 7);
    return week;
}