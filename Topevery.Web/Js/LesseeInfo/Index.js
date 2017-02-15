//将表单数据转为json
var grid;
var tenantTypelist;
function loadData(param, success, error) {
    topevery.ajax({
        type: "POST",
        url: "api/services/app/lesseeInfoR/GetLesseeInfoPageList",
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

LesseeInfoIndex = {
    ///加载列表数据-
    Initialize: function() {
        grid = $('#testid').datagrid({
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
            onLoadSuccess: function(data) {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
            },
            columns: [
                [
                    { field: "id", checkbox: true },
                    {
                        width: '8%',
                        title: '姓名',
                        field: 'name',
                        align: 'center',
                        sortable: true,
                        formatter: function(value, row, index) {
                            return "<a href='#' onclick='LesseeInfoIndex.dbClick(" + row.id + ")'>" + value + "</a>";
                        }
                    },
                    {
                        title: '工作站',
                        field: 'houseManageName',
                        width: '8%',
                        align: 'center'
                    },
                    {
                        width: '8%',
                        title: '租户类型',
                        field: 'tenantName',
                        align: 'center'
                    },
                    {
                        width: '8%',
                        title: '证件类型',
                        field: 'certName',
                        align: 'center',
                        formatter: function(value) {
                            for (var i = 0; i < tenantTypelist.length; i++) {
                                if (tenantTypelist[i].Key === value) return tenantTypelist[i].Value;
                            }
                            return value;
                        }
                    },
                    {
                        width: '13%',
                        title: '证件号码',
                        sortable: true,
                        field: 'certNo',
                        align: 'center'
                    },
                    {
                        title: '联系号码',
                        field: 'contactNumber',
                        sortable: true,
                        width: '12%',
                        align: 'center'
                    },
                    {
                        title: '联系地址',
                        field: 'contactAddress',
                        sortable: true,
                        width: '10%',
                        align: 'center'
                    },
                    {
                        title: '创建时间',
                        field: 'creationTime',
                        width: 100,
                        align: 'center',
                        sortable: true,
                        formatter: function(value) {
                            return topevery.dataTimeFormat(value);
                        }
                    },
                    {
                        title: '操作',
                        field: 'Action',
                        width: '18%',
                        align: 'center',
                        formatter: function(value, row, index) {
                            var e = $("#hiddenLesseeInfoEdit").val() ? '<a href="#" class="easyui-modifyoperate" onclick="LesseeInfoIndex.editrow(' + row.id + ')">修改</a> ' : "";
                            var d = $("#hiddenLesseeInfoDeleted").val() ? '<a href="#"   class="easyui-oldoperate"  onclick="LesseeInfoIndex.deleterow(' + row.id + ')">删除</a>' : "";
                            var f = $("#hiddenLesseeInfoPermanentStaff").val() ? '<a href="#"   class="easyui-modifyoperate"  onclick="LesseeInfoIndex.ResidentFamilyOpen(' + row.id + ')">常住人口</a>' : "";
                            return e + d + f;
                        }
                    }
                ]
            ],
            toolbar: '#toolbarWrap'
        });
        bindDicToDrp("CertName", "D11CFDA8-992B-4A9A-81D3-7201BD4D6E4D", "",false);
        for (var i = 0; i < $(".easyui-textbox").length; i++) {
            $("#" + $('.easyui-textbox').eq(i)[0].id + "").textbox({
                inputEvents: $.extend({}, $.fn.textbox.defaults.inputEvents, {
                    keyup: function(event) {
                        if (event.keyCode === 13) {
                            LesseeInfoIndex.loadInfo80();
                        }
                    }
                })
            });
        }
    },
    ////双击事件
    dbClick: function (id) {
        LesseeInfoIndex.ToViewOpen(id);
    },
    ///搜索
    loadInfo80: function() {
        $('#testid').datagrid('load', { input: topevery.form2Json("selectFrom") }); //点击搜索
    },
    ///删除一条租户数据
    deleterow: function (id) {
        //var url = virtualDirName + 'api/services/app/lesseeInfoW/DeleteLessInfoListAsync';
        //deleteAjax(id, "testid", url);
        topeveryMessage.confirm(function(r) {
            if (r) {
                $.ajax({
                    type: 'POST',
                    url: virtualDirName + 'api/services/app/lesseeInfoW/DeleteLessInfoListAsync',
                    data: JSON.stringify({ "ids": id }),
                    contentType: "application/json",
                    Type: "JSON",
                    success: function (row) {
                        if (row.result.isSuccess) {
                            $("#testid").datagrid('reload');
                            topeveryMessage.show(row.result.message);
                        } else {
                            topeveryMessage.show(row.result.message);
                        }
                    }
                });
            }
        });
    },
    DeleteLesseeInfo: function () {
        //var arrRows = $('#testid').datagrid('getChecked');
        //if (arrRows.length === 0) {
        //    window.top.topeveryMessage.show("请选择一条需要删除的记录!", "提示");
        //    return;
        //}
        //var ids = [];
        //var url = virtualDirName + 'api/services/app/lesseeInfoW/DeleteLessInfoListAsync';
        //$.each(arrRows, function () {
        //    ids.push(this.id);
        //});
        //deleteAjax(ids.join(), "testid", url);
        var arrRows = $('#testid').datagrid('getSelections');
        if (arrRows.length === 0) {
            $.messager.alert('提示', '请选择一条需要删除的记录!', 'info');
        } else {
            var ids = [];
            var url = virtualDirName + 'api/services/app/lesseeInfoW/DeleteLessInfoListAsync';
            $.each(arrRows, function() {
                ids.push(this.id);
            });
            $.ajax({
                type: 'POST',
                url: url,
                data: JSON.stringify({ "ids": ids.join() }),
                contentType: "application/json",
                Type: "JSON",
                success: function (row) {
                    if (row.result.isSuccess) {
                        $("#testid").datagrid('reload');
                        topeveryMessage.show(row.result.message);
                    } else {
                        topeveryMessage.show(row.result.message);
                    }
                }
            });
        }
    },
    ///弹出租户添加窗口
    Add: function() {
        var dialog = ezg.modalDialog({
            width: 730,
            height: 450,
            title: '新增租户',
            url: virtualDirName + 'LesseeInfo/Add',
            buttons: [
                {
                    text: '确认',
                    iconCls: 'icon-ok',
                    handler: function() {
                        dialog.find('iframe').get(0).contentWindow.submitFormAdd(dialog, grid, 1,this);
                    }
                }
            ]
        });
    },
    ///弹出租户修改窗口
    editrow: function(id) {
        var dialog = ezg.modalDialog({
            width: 730,
            height: 450,
            title: '修改租户',
            url: virtualDirName + 'LesseeInfo/Edit?id=' + id + '',
            buttons: [
                {
                    text: '确认',
                    iconCls: 'icon-ok',
                    handler: function() {
                        dialog.find('iframe').get(0).contentWindow.submitFormEdit(dialog, grid, 1, this);
                    }
                }
            ]
        });
    },
    ///弹出家庭常驻人员窗口
    ResidentFamilyOpen: function(id) {
        var dialog = ezg.modalDialog({
            width: 890,
            height: 400,
            title: '家庭常驻人员',
            url: virtualDirName + 'PermanentStaff/Index?id=' + id + ''
        });
    },
    ///弹出查看租户明细
    ToViewOpen: function(id) {
        var dialog = ezg.modalDialog({
            width: 730,
            height: 500,
            title: '查看租户明细',
            url: virtualDirName + 'LesseeInfo/ToView?id=' + id + ''
        });
    },
    ///证件类型
    GetDropDownTenantType: function(guid) {
        topevery.ajax({
            type: "POST",
            url: "Common/GetDropDownList?guid=" + guid + "",
            contentType: "application/json"
        }, function(data) {
            if (data.success) {
                tenantTypelist = data.rows;
                $(document).dequeue("datagrid0102");
            } else {
                error();
            }
        }, false);
    }
}
///初始化
$(function () {
    $(document).queue("datagrid0101", function () {
        LesseeInfoIndex.GetDropDownTenantType("D11CFDA8-992B-4A9A-81D3-7201BD4D6E4D");
        //bindDicToDrp("TenantType", "7705DB66-07EB-4F3E-86F5-51A79663DF6A", "", false, false);
        //if ($("#WorkstationDropDown").val()) {
            bindDropDown("HouseManageId", "Common/GetWorkstationBind", "--工作站--", false, false);
        //} else {
        //    bindDropDown("HouseManageId", "Common/GetWorkstationBind", "--工作站--", false, true);
        //    $("#HouseManageId").attr("readonly", "readonly");
        //    $("#HouseManageId").combobox("readonly");
        //}
    });
    $(document).queue("datagrid0102", function () { LesseeInfoIndex.Initialize();  });
    $(document).dequeue("datagrid0101");
});
