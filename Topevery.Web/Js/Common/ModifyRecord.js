var ModifyRecord = {
    Initialize: function () {
        $('#gridtable').datagrid({
            idField: "id",
            fitColumns: true,
            nowrap: false,
            height: 370,
            columns: [
                [
                    { field: "columnName", title: "字段名称", width: 60, align: "center" },
                    { field: "oldValue", title: "旧值", width: 60, align: "center" },
                    {
                        field: "newValue", title: "新值", width: 60, align: "center",
                        formatter: function (value) {
                            return "<a style=\"color: red;\">" + value + "</a>";
                        }
                    },
                    { field: "ipAddress", title: "Ip地址", width: 60, align: "center" },
                    { field: "userName", title: "修改人名称", width: 60, align: "center" },
                    {
                        field: "createTime",
                        title: "修改时间",
                        width: 60,
                        align: "center",
                        formatter: function (value) {
                            return topevery.dataTimeFormat(value);
                        }
                    },
                    { field: "Remark", title: "备注", width: 60, align: "center" }
                ]
            ],
            loader: function (param, success, error) {
                topevery.ajax({
                    type: "POST",
                    url: "api/services/app/LesseeInfoR/GetModifyRecordList",
                    contentType: "application/json",
                    data: JSON.stringify({ EntityId: getRequest("id"), EntityType: 0 })
                }, function (row) {
                    if (row.success) {
                        success(row.result);
                    } else {
                        error();
                    }
                }, false);
            }
        });
    }
};
$(function () {
    ModifyRecord.Initialize();
});