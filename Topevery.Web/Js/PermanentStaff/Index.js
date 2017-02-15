var grid;
var list;
function loadData(param, success, error) {
    topevery.ajax({
        type: "POST",
        url: "api/services/app/PermanentStaffR/GetPermanentStaffList",
        contentType: "application/json",
        data: JSON.stringify({
            PageIndex: param.page,
            PageCount: param.rows,
            id: topevery.getQuery("id") == null ? 0 : topevery.getQuery("id")
        })
    }, function (data) {
        if (data.success) {
            success(data.result);
        } else {
            error();
        }
    }, false);
};
PermanentStaffIndex = {
    ///加载列表数据-
    Initialize: function () {
        grid = $('#PermanentStaffTable').datagrid({
            height: 300,
            idField: 'id',
            striped: true,
            width: 850,
            fitColumns: true,
            loadMsg: "正在努力加载数据，请稍后...",
            singleSelect: true,
            nowrap: false,
            loader: loadData,
            rownumbers: false, //行号
            pagination: false, //分页控件
            pageSize: 10,
            pageList: [10, 20, 50, 100],
            showFooter: true,
            onLoadSuccess: function (data) {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
            },
            columns: [
                [
                    {
                        width: '50',
                        title: '编号',
                        field: 'id',
                        align: 'center'
                    },
                    {
                        width: '50',
                        title: '姓名',
                        field: 'name',
                        align: 'center'
                    },
                    {
                        width: '50',
                        title: '性别',
                        field: 'sex',
                        align: 'center',
                        formatter: function (value) {
                            for (var i = 0; i < list.length; i++) {
                                if (list[i].Key === value) return list[i].Value;
                            }
                            return value;
                        }
                    },
                    {
                        width: '81',
                        title: '出生年月',
                        field: 'dateBirth',
                        align: 'center',
                        formatter: function (value) {
                            return topevery.dataTimeFormat(value);
                        }
                    },
                    {
                        title: '年龄',
                        field: 'age',
                        width: '50',
                        align: 'center'

                    },
                    {
                        title: '和租户关系',
                        field: 'relationship',
                        width: '80',
                        align: 'center'
                    },
                    {
                        title: '身份证号码',
                        field: 'idCardNo',
                        width: '80',
                        align: 'center'
                    },
                    {
                        title: '工作单位',
                        field: 'workUnits',
                        width: '80',
                        align: 'center'
                    },
                    {
                        title: '联系电话',
                        field: 'contactNumber',
                        width: '80',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        field: 'Action',
                        width: '80',
                        align: 'center',
                        formatter: function (value, row, index) {
                            var c = $("#hiddenPermanentStaffEdit").val() ? '<a href="#"   class="easyui-modifyoperate"  onclick="PermanentStaffIndex.update(' + row.id + ')">修改</a>' : "";
                            var d = $("#hiddenPermanentStaffEdit").val() ? '<a href="#"   class="easyui-oldoperate"  onclick="PermanentStaffIndex.deleterow(' + row.id + ')">删除</a>' : "";
                            return c+" "+ d;
                        }
                    }
                ]
            ],
            //onDblClickRow: PermanentStaffIndex.dbClick,
            toolbar: '#toolbar'
        });
        bindDicToDrp("Sex", "C8CEFBB2-6F98-4F70-8A47-932B9487FC37", "", true, true);
        bindDicToDrp("Relationship", "4A6177F3-041F-45CA-AF29-4364DFA809D6", "", false);
    },
    ////双击事件
    dbClick: function (rowIndex, rowData) {
        PermanentStaffIndex.editrow(rowData.id);
    },
    update: function (id) {
        $("#PermanentStaffAdd").find("legend").html("修改常住家庭成员");
        $("#add").hide();
        $("#edit").show();
        $(".tabs-last").click();
        topevery.ajax({
            type: "POST",
            url: "api/services/app/PermanentStaffR/GetPermanentStaffOne",
            contentType: "application/json",
            data: JSON.stringify({
                id: id
            })
        }, function (data) {
            if (data.success) {
                var array = {};
                var list = data.result;
                for (var h in list) {
                    array["" + UpperFirstLetter(h) + ""] = list[h];
                };
                $("#PermanentStaffAdd").form("load", array);
            } else {
                error();
            }
        }, true);
    },
    edit:function() {
        var array = ezg.serializeObject($('form'));
        if ($("#PermanentStaffAdd").form('validate') === false) {
            return;
        }
        topevery.ajax({
            type: "POST",
            url:  'api/services/app/PermanentStaffW/EditPermanentStaffAsync',
            contentType: "application/json",
            data: JSON.stringify(array)
        }, function (data) {
            if (data.success) {
                window.top.topeveryMessage.show("修改成功");
                $("#PermanentStaffAdd").find("legend").html("新增常住家庭成员");
                $(".tabs-first").click();
                $("#PermanentStaffTable").datagrid('reload');
                $('#PermanentStaffAdd').form('reset');
                $("#add").show();
                $("#edit").hide();
            } else {
                error();
            }
        }, true);
    },
    center:function() {
        $(".tabs-first").click();
        $("#PermanentStaffTable").datagrid('reload');
        $('#PermanentStaffAdd').form('reset');
        $("#add").show();
        $("#edit").hide();
        $("#PermanentStaffAdd").find("legend").html("新增常住家庭成员");
    },
    ///删除一条数据
    deleterow: function (id) {
        topeveryMessage.confirm(function (r) {
            if (r) {
                $.ajax({
                    type: 'POST',
                    url: virtualDirName + 'api/services/app/PermanentStaffW/DeletePermanentStaffAsync',
                    data: JSON.stringify({ "id": id }),
                    contentType: "application/json",
                    Type: "JSON",
                    success: function (row) {
                        window.top.topeveryMessage.show("删除成功");
                        $("#PermanentStaffTable").datagrid('reload');
                        $('#PermanentStaffAdd').form('reset');
                    }
                });
            }
        });
    },
    ///弹出添加窗口
    Add: function () {
        var dialog = ezg.modalDialog({
            width: 750,
            height: 460,
            title: '添加家庭常驻人员',
            url: virtualDirName + 'PermanentStaff/Add?id=' + topevery.getQuery("id") + '',
            buttons: [
                {
                    text: '添加',
                    iconCls: 'icon-ok',
                    handler: function () {
                        dialog.find('iframe').get(0).contentWindow.submitFormAdd(dialog, grid, 1);
                    }
                }, {
                    text: '取消',
                    iconCls: 'icon-remove',
                    handler: function () {
                        dialog.dialog('close');
                    }
                }
            ]
        });
    },
    ///弹出修改窗口
    editrow: function (id) {
        var dialog = ezg.modalDialog({
            width: 750,
            height: 460,
            title: '修改家庭常驻成员',
            url: virtualDirName + 'PermanentStaff/Edit?id=' + id + '',
            buttons: [
                {
                    text: '修改',
                    iconCls: 'icon-ok',
                    handler: function () {
                        dialog.find('iframe').get(0).contentWindow.submitFormEdit(dialog, grid, 1);
                    }
                }, {
                    text: '取消',
                    iconCls: 'icon-remove',
                    handler: function () {
                        dialog.dialog('close');
                    }
                }
            ]
        });
    },
    submitAdd: function () {
        if ($("#PermanentStaffAdd").form('validate') === false) {
            return;
        } else {
            var array = ezg.serializeObject($('form'));
            $.ajax({
                type: 'POST',
                url: virtualDirName + 'api/services/app/PermanentStaffW/AddPermanentStaffAsync',
                data: topevery.extend(array, { LesseeId: $("#LesseeId").val() }),
                cache: false,
                contentType: "application/json",
                Type: "JSON",
                success: function (row) {
                    window.top.topeveryMessage.show("新增成功");
                    $(".tabs-first").click();
                    $("#PermanentStaffTable").datagrid('reload');
                    $('#PermanentStaffAdd').form('reset');
                }
            });
        }
    },
    GetDropDownList: function (guid) {
        topevery.ajax({
            type: "POST",
            url: "Common/GetDropDownList?guid=" + guid + "",
            contentType: "application/json"
        }, function (data) {
            if (data.success) {
                list = data.rows;
                $(document).dequeue("datagrid0102");
            } else {
                error();
            }
        }, false);
    }
}

$(function () {
    $("#IdCardNo").textbox({
        validType: 'idCode'
    });
    $("#IdCardNo").textbox("textbox").bind("blur", function () {
        var str = $("#IdCardNo").textbox("getText");
        if ($("#IdCardNo").textbox("isValid") && str) {
            var temp = str.substring(6, 14);
            var year = temp.substring(0, 4);
            var month = temp.substring(4, 6);
            var day = temp.substring(6, 8);
            if (str.substring(16, 17) % 2 == 0) {
                $("#Sex").combobox("select", 500046);
            } else {
                $("#Sex").combobox("select", 500045);
            }
            if (!$("#DateBirth").datebox("getText")) {
                $("#DateBirth").datebox('setValue', year + "-" + month + "-" + day);
            }
            if (!$("#Age").numberbox("getValue")) {
                var date = new Date();
                $("#Age").numberbox("setValue", date.getFullYear() - year);
            }
        }
    });
    $("#IdCardNo").textbox({
        onChange: function (newValue, oldValue) {
            var str = $("#IdCardNo").textbox("getText");
            if ($("#IdCardNo").textbox("isValid") && str) {
                var temp = str.substring(6, 14);
                var year = temp.substring(0, 4);
                var month = temp.substring(4, 6);
                var day = temp.substring(6, 8);
                if (str.substring(16, 17) % 2 === 0) {
                    $("#Sex").combobox("select", 500046);
                } else {
                    $("#Sex").combobox("select", 500045);
                }
                $("#DateBirth").datebox('setValue', year + "-" + month + "-" + day);
                var date = new Date();
                $("#Age").numberbox("setValue", date.getFullYear() - year);
            }
        }
    });
    $(document).queue("datagrid0101", function () { PermanentStaffIndex.GetDropDownList("C8CEFBB2-6F98-4F70-8A47-932B9487FC37"); });
    $(document).queue("datagrid0102", function () { PermanentStaffIndex.Initialize(); });
    $(document).dequeue("datagrid0101");
});
/*初始化*/
