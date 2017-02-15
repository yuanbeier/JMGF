var grid;
//将表单数据转为json
var grid;

function loadData(param, success, error) {
    topevery.ajax({
        type: "POST",
        url: "api/services/app/HouseBanR/GetHouseBanAsync",
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
    }, true);
};

HouseBanForLotteryList = {
    ///加载列表数据-
    Initialize: function () {
    grid = $('#HouseBanForLotteryListTable').datagrid({
            height: 600,
            idField: "id",
            striped: true,
            fitColumns: true,
            loadMsg: false,
            singleSelect: true,
            fit:true,
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
                    { title: '分户编号', field: 'id', align: 'center', width: '50', hidden: true },
                    { title: '房屋编号', field: 'houseNo', align: 'center',
                        formatter: function(value, row) {
                            return "<a href='#' onclick='objectExtend.HouseBan(" + row.houseId + ")'>" + value + "</a>";
                        }, width: '120' },
                    { title: '现房屋门牌', field: 'houseDoorplate', align: 'center', width: '120' },
                    { title: '单元名称', field: 'unitName', align: 'center', width: '120' },
                    { title: '租用范围', field: 'rentRange', align: 'center', width: '120' },
                    { title: '建筑结构', field: 'buildStructureName', align: 'center', width: '70', hidden: true },
                    { title: '建筑结构Id', field: 'buildStructureId', width: '120', align: 'center', hidden: true },
                    { title: '住宅月租金', field: 'flatMonthRent', width: '120', align: 'center', hidden: true },
                    { title: '建筑面积', field: 'buildArea', width: '120', align: 'center' },
                    { title: '产权属性Id', field: 'propertyId', width: '80', align: 'center', hidden: true },
                    { title: '产权属性', field: 'propertyName', width: '120', align: 'center' },
                    { title: '计租面积', field: 'metRentArea', width: '80', align: 'center', hidden: true },
                    { title: '用途(使用性质)Id', field: 'usePropertyId', width: '80', align: 'center', hidden: true },
                    { title: ' 用途(使用性质)', field: 'usePropertyName', width:'120', align: 'center' }
                ]
            ],
            toolbar: '#toolbarWrap'
        });
        for (var i = 0; i < $(".easyui-textbox").length; i++) {
            $("#" + $('.easyui-textbox').eq(i)[0].id + "").textbox({
                inputEvents: $.extend({}, $.fn.textbox.defaults.inputEvents, {
                    keyup: function (event) {
                        if (event.keyCode === 13) {
                            HouseBanForLotteryList.loadInfo();
                        }
                    }
                })
            });
        }
    },
    ///导入
    Import: function () {
        //var dialog = ezg.modalDialog({
        //    width: 730,
        //    height: 550,
        //    title: '导入结算单',
        //    url: virtualDirName + 'HouseRepair/StatementImport'
        //});
    },
    ////双击事件
    dbClick: function (rowIndex, rowData) {
        var date = rowData;
        frameHelper.getDialogParentIframe().LeasingApplication.setValueHouse(date);
        frameHelper.getDialogParentIframe().dialog1.dialog('close');
    },
    ///查询功能
    loadInfo: function () {
        $('#HouseBanForLotteryListTable').datagrid('load', { input: topevery.form2Json("selectForm") }); //点击搜索
    },
    HouseBanExp: function () {
        //topevery.ajaxLoading();
        var houseNo = $("#HouseNo").textbox('getValue');
        var houseDoorplate = $("#HouseDoorplate").textbox('getValue');
        var unitName = $("#UnitName").textbox('getValue');
        var propertyId = $("#PropertyId").combobox('getValue');
        var flag = escape(houseNo) + "&houseDoorplate=" + escape(houseDoorplate) + "&unitName="
            + escape(unitName) + "&propertyId=" + propertyId;
        //$.post(virtualDirName + "HouseMenu/HouseBanForLotteryExp?houseNo=" + flag, function (data) {
        //    topevery.ajaxLoadEnd();
        //});
        window.location.href = virtualDirName + "HouseMenu/HouseBanForLotteryExp?houseNo=" + flag;
        //topevery.ajaxLoadEnd();
        //window.open(virtualDirName + "HouseMenu/HouseBanForLotteryExp?houseNo=" + flag);


    }
}
$(function () {
    /*初始化*/
    bindDicToDrp("PropertyId", "B34CFE85-FB80-4817-B660-B8DF27F8DC76", "--产权属性--");
    HouseBanForLotteryList.Initialize();
});

