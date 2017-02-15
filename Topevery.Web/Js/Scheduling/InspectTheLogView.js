//将表单数据转为json
var grid;
var dialog;
function loadData(param, success, error) {
    topevery.ajax({
        type: "POST",
        url: "api/services/app/ClockPointsR/GetInspectTheLogViewAsync",
        contentType: "application/json",
        data: topevery.extend(topevery.form2Json("selectFrom"), {
            PageIndex: param.page,
            PageCount: param.rows,
            Order: param.order,
            Sort: param.sort,
            Id: topevery.getQuery('Id'),
            ClockPointsId: topevery.getQuery('ClockPointsId'),
        })
    }, function (data) {
        if (data.success) {
            success(data.result);
        } else {
            error();
        }
    }, true);
};

InspectTheLogView = {
    ///加载列表数据-
    Initialize: function () {
        grid = $('#InspectTheLogViewTable').datagrid({
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
                    { field: "id", checkbox: true },
                    { width: 80, title: '必经点名称', field: 'clockPointsName', align: 'center' },
                    { width: 80, title: '签到时间', field: 'date', align: 'center', formatter: function (value) { return topevery.dataTimeFormat(value); } },
                     { width: 80, title: '备注', field: 'remark', align: 'center' },
                    {
                        width: 80, title: '签到状态', field: 'patrolStatue', align: 'center',
                        formatter: function (value) {
                            if (value === 1) {
                                return "已签到";
                            } else if (value === 0) {
                                return '<a style="color:red;">未签到</a>';
                            } else {
                                return value;
                            }
                        }
                    },
                ]
            ], toolbar: '#toolbarWrap',
        });
        for (var i = 0; i < $(".easyui-textbox").length; i++) {
            $("#" + $('.easyui-textbox').eq(i)[0].id + "").textbox({
                inputEvents: $.extend({}, $.fn.textbox.defaults.inputEvents, {
                    keyup: function (event) {
                        if (event.keyCode === 13) {
                            HousingPatrols.loadInfo();
                        }
                    }
                })
            });
        };
    },
    ///搜索
    loadInfo: function () {
        $('#InspectTheLogViewTable').datagrid('load', { input: topevery.form2Json("selectFrom") }); //点击搜索
    }
}
///初始化
$(function () {
    $(document).queue("datagrid0101", function () { InspectTheLogView.Initialize(); });
    $(document).dequeue("datagrid0101");
});

