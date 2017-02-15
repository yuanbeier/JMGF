//将表单数据转为json
var grid;

function loadData(param, success, error) {
    topevery.ajax({
        type: "POST",
        url: "api/services/app/HouseBanR/GetHouseBanBuildingSelectionsAsync",
        contentType: "application/json",
        data: topevery.extend(topevery.form2Json("sumbitFrom"), {
            PageIndex: param.page,
            PageCount: param.rows,
            usePropertyId: topevery.getQuery("usePropertyId")
        })
    }, function (data) {
        if (data.success) {
            success(data.result);
        } else {
            error();
        }
    }, false);
};

TenantInformationIndex = {
    ///加载列表数据-
    Initialize: function () {
        grid = $('#TenantInformationTable').datagrid({
            height: 350,
            idField: "id",
            striped: true,
            fitColumns: true,
            loadMsg: false,
            singleSelect: true,
            nowrap: false,
            loader: loadData,
            rownumbers: true, //行号
            pagination: true, //分页控件
            pageSize: 20,
            pageList: [10, 20, 50, 100],
            showFooter: true,
            onLoadSuccess: function(data) {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
            },
            columns: [
                [
                    { title: '房屋编号', field: 'houseNo', align: 'center', width: '90' },
                    { title: '现房屋门牌', field: 'houseDoorplate', align: 'center', width: '120' },
                    { title: '建筑结构', field: 'buildStructureName', align: 'center', width: '70' },
                    { title: '建筑面积', field: 'buildArea', align: 'center', width: '90' },
                    { title: '安全等级', field: 'securityLevelName', align: 'center', width: '90' },
                    { title: '总层数', field: 'totalFloors', align: 'center', width: '90' },
                    { title: '建成年份', field: 'completYear', align: 'center', width: '90' },
                    //{ title: '工作站名称', field: 'houseManageName', align: 'center', width: '80' },
                    //{ title: '产权属性', field: 'propertyName', width: '70', align: 'center' },
                    { title: ' 用途(使用性质)', field: 'usePropertyName', align: 'center' }
                ]
            ],
            onDblClickRow: TenantInformationIndex.dbClick,
            toolbar: '#toolbar'
        });
        for (var i = 0; i < $(".easyui-textbox").length; i++) {
            $("#" + $('.easyui-textbox').eq(i)[0].id + "").textbox({
                inputEvents: $.extend({}, $.fn.textbox.defaults.inputEvents, {
                    keyup: function (event) {
                        if (event.keyCode === 13) {
                            TenantInformationIndex.loadInfo80();
                        }
                    }
                })
            });
        }
    },
    ////双击事件
    dbClick: function (rowIndex, rowData) {
        var date = rowData;
        frameHelper.getDialogParentIframe().LeasingApplication.setValueHouse(date);
        frameHelper.getDialogParentIframe().dialog1.dialog('close');
    },
    ///搜索
    loadInfo80: function () {
        $('#TenantInformationTable').datagrid('load', { input: topevery.form2Json("sumbitFrom") }); //点击搜索
    }
}
$(function () {
    /*初始化*/

    bindDicToDrp("PropertyId", "B34CFE85-FB80-4817-B660-B8DF27F8DC76", "--产权属性--");
    TenantInformationIndex.Initialize();
});
