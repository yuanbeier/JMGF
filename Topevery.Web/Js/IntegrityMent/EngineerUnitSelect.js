///初始化


var grid;
var dialog10;
var tenantTypelist;

$(function () {

    EngineerUnitMentIndex.Initialize();

    bindDicToDrp("UnitType", "9228E3DB-C5D4-4E24-BACF-F4E6DE1FD2A4", "--请选择--");
});


function loadData(param, success, error) {
    topevery.ajax({
        type: "POST",
        url: "api/services/app/EngineerUnitR/GetEngineerUnitList",
        contentType: "application/json",
        data: topevery.extend(topevery.form2Json("selectForm"), {
            PageIndex: param.page,
            PageCount: param.rows
        })
    }, function (data) {
        if (data.success) {
            success(data.result);
        } else {
            error();
        }
    }, false);
}


EngineerUnitMentIndex = {
    ///加载列表数据-
    Initialize: function () {
        grid = $('#EngineerUnitInfoTable').datagrid({
            height: 480,
            striped: true,
           
            fitColumns: true,
            loadMsg: false,
            singleSelect: true,
            nowrap: false,
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
                    { field: "unitName", title: "单位名称", align: "left", width: 120 },
                    { field: "unitAddress", title: "单位地址", align: "left", width: 220 },
                    { field: "unitTypeName", title: "类型", align: "center", width: 40 },
                    { field: "unitTelePhone", title: "单位电话", align: "center", width: 60 },
                    { field: "unitprincipal", title: "单位负责人", align: "center", width: 60 },
                    { field: "remark", title: "备注", align: "center", width: 140 }
                    
                ]
            ],
            onDblClickRow: EngineerUnitMentIndex.dbClick,
            toolbar: '#toolbar',
            loader: loadData
        });
    },
    ////双击事件
    dbClick: function (rowIndex, rowData) {
        var data = rowData;
        frameHelper.getDialogParentIframe().LeasingApplication.setValueName(data);
        frameHelper.getDialogParentIframe().dialog.dialog('close');
    },
    
    //查询
    Select: function () {
        $('#EngineerUnitInfoTable').datagrid('load', { input: topevery.form2Json("selectForm") }); //点击搜索

    },
    //   清空查询条件
    Clear: function () {
        $('#UnitName').textbox('setValue', '');
        $("#UnitType").combobox('setValue', '--请选择--');
        $('#EngineerUnitInfoTable').datagrid('reload');
      

    }
}