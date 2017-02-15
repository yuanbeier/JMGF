var grid;
function loadData(param, success, error) {
    topevery.ajax({
        type: "POST",
        url: "api/services/app/Caching/GetAllCaches",
        contentType: "application/json"
    }, function (data) {
        if (data.success) {
            success(data.result);
        } else {
            error();
        }
    }, false);
};
///闭包对象
ClearCache = {
    ///加载列表数据-
    Initialize: function() {
        grid = $('#ClearCacheTable').datagrid({
            height: 480,
          //  idField: "id",
            striped: true,
            fitColumns: true,
            fit: true,
            singleSelect: false,
            nowrap: false,
            loader: loadData,
            rownumbers: false, //行号
            pagination: true, //分页控件
            pageSize: 10,
            pageList: [1, 10, 20, 50],
            showFooter: true,
            onLoadSuccess: function(data) {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
            },
            columns: [
                [
                    { field: "name", title: "缓存名称", align: "center", width: 60 },
                    {
                        title: '操作',
                        field: 'Action',
                        align: 'center',
                        width: 60,
                        formatter: function (value, row, index) {
                            return "<a href=\"#\" class=\"easyui-modifyoperate\" onclick=\"ClearCache.ClearCaches('" + row.name + "')\">清理缓存</a> ";
                        }
                    }
                ]
            ],
            toolbar: '#toolbarWrap'
        });
    },
   ///清理全部缓存
    ClearAllCaches:function() {
        topevery.ajax({
            type: "POST",
            url: "api/services/app/Caching/ClearAllCaches",
            contentType: "application/json"
        }, function (data) {
            if (data.success) {
                $("#ClearCacheTable").datagrid('reload');
                window.top.topeveryMessage.show("清除缓存成功");
            } else {
                error();
            }
        }, false);
    },
    ///清理缓存
    ClearCaches: function (name) {
        topevery.ajax({
            type: "POST",
            url: "api/services/app/Caching/ClearCache",
            contentType: "application/json",
            data: JSON.stringify({ Id: name })
        }, function (data) {
            if (data.success) {
                $("#ClearCacheTable").datagrid('reload');
                window.top.topeveryMessage.show("清除缓存成功");
            } else {
                error();
            }
        }, false);
    }
}
$(function() {
    ClearCache.Initialize();
})