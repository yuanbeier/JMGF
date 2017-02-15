var grid;
var dialog10;
var tenantTypelist;
$(function () {
    bindDicToDrp("HonestyType1", "DD5E2AAC-50E7-4652-8F5C-C850813ADA52", "--诚信类型--");
    bindDicToDrp("HonestyType", "DD5E2AAC-50E7-4652-8F5C-C850813ADA52", "--诚信类型--");

    $(document).queue("datagrid0101", function () { LesseeHonestyMantIndex.Initialize(); });
    $(document).dequeue("datagrid0101");

    
});
function loadData(param, success, error) {
    
    topevery.ajax({
        type: "POST",
        url: "api/services/app/LesseeHonestyMangmentR/GetLesseeHonestyList",
        contentType: "application/json",
        data: topevery.extend(topevery.form2Json("selectForm"), {
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
    }, false);
};

LesseeHonestyMantIndex = {
    ///加载列表数据-
    Initialize: function() {
        grid = $('#LesseeHonestyMantTabel').datagrid({
            height: 480,
            idField: "id",
            striped: true,
            fitColumns: true,
            fit:true,
            singleSelect: false,
            nowrap: false,
            loader: loadData,
            rownumbers: false, //行号
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
                    {
                        field: "name", title: "承租人", align: "center", width: 80, formatter: function (value, row, index) {
                            return "<a href='#' onclick='objectExtend.LesseeInfoOpen(" + row.lessID + ")'>" + value + "</a>";
                        }, sortable: true
                    },
                    { field: "honestyTypeName", title: "诚信分类", align: "center", width: 100 },
                     { field: "description", title: "描述", align: "center", width: 100, sortable: true },
                    { field: "reduceScore", title: "扣分", align: "center", width: 100, sortable: true },
                    {
                        field: "auditTime",
                        title: "时间",
                        align: "center",
                        width: 80,
                        formatter: function(value) {
                            return topevery.dataTimeFormat(value);
                        }, sortable: true
                    },
                    {
                        title: '操作',
                        field: 'Action',
                        align: 'center',
                        width: 80,
                        formatter: function (value, row, index) {
                            var b = $("#hiddenLesseeHonestyMantIndexDeleted").val()?"<a href='#' class='easyui-oldoperate' onclick='LesseeHonestyMantIndex.DeleteRow(" + row.id + ")'>删除<a/>":"";
                            return "<a href='#' class='easyui-modifyoperate' onclick='LesseeHonestyMantIndex.Search(" + row.id + ")'>查看<a/>&nbsp;"
                            + b;
                        }
                    }
                ]
            ],
            toolbar: '#toolbarWrap'
        });
        for (var i = 0; i < $(".easyui-textbox").length; i++) {
            $("#" + $('.easyui-textbox').eq(i)[0].id + "").textbox({
                inputEvents: $.extend({}, $.fn.textbox.defaults.inputEvents, {
                    keyup: function (event) {
                        if (event.keyCode === 13) {
                            LesseeHonestyMantIndex.Select();
                        }
                    }
                })
            });
        };
    },

    //查看
    Search: function (id) {
        var dialog = ezg.modalDialog({
            width: 620,
            height: 450,
            title: '租户诚信信息查看',
            url: virtualDirName + "IntegrityMent/LesseeHonestySearch?id=" + id
        });
    },

    //查询
    Select: function() {

        $('#LesseeHonestyMantTabel').datagrid('load', { input: topevery.form2Json("selectForm") }); //点击搜索

    },
    Insert:function() {
        window.location.href = virtualDirName + "IntegrityMent/LesseeHonestyAdd";
    },
    
    Clear: function() {
        $('#Name').textbox('setValue', '');
        $("#HonestyType").combobox('setValue', '--诚信类型--');
        $('#LesseeHonestyMantTabel').datagrid('reload');
        },
        //批量删除租诚信管理信息
    DeleteHouseRepairInfo: function () {
        topeveryMessage.confirm(function (count) {
            if (count) {
                var array = $('#LesseeHonestyMantTabel').datagrid('getSelections');
                if (array.length === 0) {
                    $.messager.alert('提示', '请选择要删除的租户诚信信息!', 'info');
                } else {
                    var ids = "";
                    for (var i = 0; i < array.length; i++) {
                        ids += array[i].id + ",";
                    }
                    $.ajax({
                        type: 'POST',
                        url: virtualDirName + 'api/services/app/LesseeHonestyMangmentW/DeleteLessesHonestyMangmentInfoAsync?input=' + ids,
                        contentType: "application/json",
                        Type: "JSON",
                        success: function (row) {
                            $("#LesseeHonestyMantTabel").datagrid('reload');
                            topeveryMessage.show("删除成功");
                        }
                    });
                }
            }
        });
        },
       
        //单条删除租户诚信信息
    DeleteRow: function (id) {
            topeveryMessage.confirm(function (r) {
                if (r) {
                    $.ajax({
                        type: 'POST',
                        url: virtualDirName + 'api/services/app/LesseeHonestyMangmentW/DeleteLessesHonestyMangment',
                        data: JSON.stringify({ "id": id }),
                        contentType: "application/json",
                        Type: "JSON",
                        success: function (row) {
                            $("#LesseeHonestyMantTabel").datagrid('reload');
                            topeveryMessage.show("删除成功");
                        }
                    });
                }
            });
        }
    }



