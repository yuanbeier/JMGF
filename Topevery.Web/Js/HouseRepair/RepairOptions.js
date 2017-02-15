var grid;
var dialog10;
var tenantTypelist;
var lastIndex;

var CacheData = "";
var CacheArray = new Array();

var TheFirstTime = 0;
var ids = getRequest("ids").split(';');
var idskk = getRequest("ids").split(';');

var data = frameHelper.getDialogParentIframe().gridRepairPlanTable.datagrid('getRows');
function loadData(param, success, error) {
    topevery.ajax({
        type: "POST",
        url: "api/services/app/RepairItemR/GetRepairItemList",
        contentType: "application/json",
        data: topevery.extend(topevery.form2Json("selectForm"), {
            PageIndex: param.page,
            PageCount: param.rows
        })
    }, function (data) {
        if (data.success) {
            success(data.result);
            $(document).dequeue("datagrid0102");
        } else {
            error();
        }
    }, false);
};

HouserRepairMentIndex = {
    ///加载列表数据-
    Initialize: function () {
        grid = $("#houseRepairDataGrid").datagrid({
            height: 420,
            idField: "id",
            striped: true,
            fitColumns: true,
            singleSelect: false,
            nowrap: false,
            loader: loadData,
            rownumbers: true, //行号
            pagination: true, //分页控件
            checkOnSelect: false,
            selectOnCheck: false,
            pageSize: 20,
            pageList: [10, 20, 50, 100],
            showFooter: true,
            onBeforeLoad: function (param) {
                TheFirstTime++;
                if (TheFirstTime === 1) {
                    return true;
                } else {
                    if (TheFirstTime % 2 === 0) {
                        var isok = false;
                        topeveryMessage.confirm(function(r) {
                            if (r) {
                                HouserRepairMentIndex.Initialize();
                                isok = true;
                            } else {
                                TheFirstTime--;
                                isok = false;
                            }
                        }, "是否确认", "如果当前页面修缮数量有修改，请先保存后在添加其他数据，否则当前编辑数据示范放弃编辑！");
                        if (isok) {
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        return true;
                    }
                }
            },
            onLoadSuccess: function (data) {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
                CacheData = "";
                for (var k = 0; k < idskk.length - 1; k++) {
                    var rowIndex = $('#houseRepairDataGrid').datagrid('getRowIndex', idskk[k].split(',')[0]);
                    if (rowIndex === -1) {
                        CacheData += idskk[k].split(',')[0] + "," + idskk[k].split(',')[1] + "," + idskk[k].split(',')[2] + ";";
                    }
                }
                for (var kk = 0; kk < ids.length - 1; kk++) {
                    var rowIndexk = $('#houseRepairDataGrid').datagrid('getRowIndex', ids[kk].split(',')[0]);
                    var datask = $('#houseRepairDataGrid').datagrid('getData').rows[rowIndexk];
                    $('#houseRepairDataGrid').datagrid('selectRow', rowIndexk);
                    $('#houseRepairDataGrid').datagrid('checkRow', rowIndexk);
                    if (datask != null) {
                        datask.number = ids[kk].split(',')[1];
                        datask.unitNumN = ids[kk].split(',')[2];
                        $('#houseRepairDataGrid').datagrid('beginEdit', rowIndexk);
                        $('#houseRepairDataGrid').datagrid('endEdit', rowIndexk);
                    }
                }
                if (CacheData != null && CacheData !== "") {
                    CacheArray = CacheData.split(';');
                } else {
                    CacheArray = new Array();
                }
                var result = [];
                for (var i = 0; i < idskk.length - 1; i++) {
                    var obj = idskk[i];
                    var num = obj;
                    var isExist = false;
                    for (var j = 0; j < CacheArray.length - 1; j++) {
                        var aj = CacheArray[j];
                        var n = aj;
                        if (n == num) {
                            isExist = true;
                            break;
                        }
                    }
                    if (!isExist) {
                        result.push(obj);
                    }
                }
                idskk = CacheArray;
               
            },
            columns: [
                [
                    { field: "id", checkbox: true },
                    { field: "quotaNo", title: "定额号", align: "center", width: 50, checkOnSelect: false },
                    { field: "repairCate", title: "工程小类", align: "center", width: 120, checkOnSelect: false },
                    { field: "repairTypeId", title: "工程大类", align: "center", width: 60, hidden: true },
                    { field: "repairTypeName", title: "工程大类", align: "center", width: 60, checkOnSelect: false },
                    { field: "unit", title: "单位", align: "center", width: 50, checkOnSelect: false },
                    { field: "unitPriceY", title: "单价(有住户)(元)", align: "center", width: 100, checkOnSelect: false }, {
                        field: "number",
                        title: "有住户数量",
                        align: "center",
                        width: 50,
                        editor: {
                            type: 'numberbox', options: { precision: 0, min: 0 }
                        }
                    },
                    { field: "unitPriceN", title: "单价(空置房)(元)", align: "center", width: 100, checkOnSelect: false }, {
                        field: "unitNumN",
                        title: "空置房数量",
                        align: "center",
                        width: 50,
                        editor: {
                            type: 'numberbox', options: { precision: 0, min: 0 }
                        }
                    }
                ]
            ],
            onClickRow: function (rowIndex) {
                if (lastIndex !== rowIndex) {
                    $('#houseRepairDataGrid').datagrid('beginEdit', rowIndex);
                    $('#houseRepairDataGrid').datagrid('endEdit', lastIndex);
                }
                lastIndex = rowIndex;
            },
            toolbar: '#toolbar'
        });
        for (var i = 0; i < $(".easyui-textbox").length; i++) {
            $("#" + $('.easyui-textbox').eq(i)[0].id + "").textbox({
                inputEvents: $.extend({}, $.fn.textbox.defaults.inputEvents, {
                    keyup: function (event) {
                        if (event.keyCode === 13) {
                            HouserRepairMentIndex.loadInfo80();
                        }
                    }
                })
            });
        };
        bindDicToDrp("RepairTypeId", "0ACFD5BD-D3DA-45CB-99B4-ED3009E08950", "--请选择--");
    },
    InlineEditor: function () {
        var ids = getRequest("ids");
        for (var i = 0; i < $('#houseRepairDataGrid').datagrid('getRows').length; i++) {
            //$('#houseRepairDataGrid').datagrid('beginEdit', i);
        }
    },
    ///搜索
    loadInfo80: function () {
        $('#houseRepairDataGrid').datagrid('load', { input: topevery.form2Json("selectForm") }); //点击搜索
    },
    ///保存选择修缮方案
    Confirm: function () {
        $('#houseRepairDataGrid').datagrid('endEdit', lastIndex);
        var type = getRequest("type");
        var budgetMoney = 0;
        var houseRepairArray = $('#houseRepairDataGrid').datagrid('getChecked');
        var repairPlanTableArray;
        if (frameHelper.getDialogParentIframe().gridRepairPlanTable !== undefined) {
            repairPlanTableArray = frameHelper.getDialogParentIframe().gridRepairPlanTable.datagrid('getRows');
        }
        var repairPlanTableArrayChange;
        if (frameHelper.getDialogParentIframe().gridRepairPlanTableChange!==undefined) {
             repairPlanTableArrayChange = frameHelper.getDialogParentIframe().gridRepairPlanTableChange.datagrid('getRows');
        }
        if (houseRepairArray.length === 0) {
            $.messager.alert('提示', '至少选择一条修缮项目', 'info');
        } else {
            var i;
            if (type === "0") {
                for (var k = 0; k < repairPlanTableArray.length; k++) {
                    for (var j = 0; j < CacheArray.length; j++) {
                        if (CacheArray[j].split(',')[0] == repairPlanTableArray[k].id) {
                            houseRepairArray.push(repairPlanTableArray[k]);
                        }
                    }
                }
                frameHelper.getDialogParentIframe().gridRepairPlanTable.datagrid('loadData', { total: 0, rows: [] });
                frameHelper.getDialogParentIframe().$("#BudgetMoney").numberbox("setValue", 0);
                for (i = 0; i < houseRepairArray.length; i++) {
                    if (houseRepairArray[i] !== "id") {
                        frameHelper.getDialogParentIframe().gridRepairPlanTable.datagrid('insertRow', { index: i, row: houseRepairArray[i] });
                        budgetMoney += houseRepairArray[i].unitPriceY * houseRepairArray[i].number + houseRepairArray[i].unitPriceN * houseRepairArray[i].unitNumN;
                    }
                }
                var money = frameHelper.getDialogParentIframe().$("#BudgetMoney").textbox('getValue');
                if (money === null || money === "") {
                    money = 0;
                }
                frameHelper.getDialogParentIframe().$("#BudgetMoney").textbox('setValue', (parseFloat(money) + parseFloat(budgetMoney)).toFixed(2));
                frameHelper.getDialogParentIframe().dialogAdd.dialog('close');
            } else if (type === "1") {
                for (var l = 0; l < repairPlanTableArrayChange.length; l++) {
                    for (var m = 0; m < CacheArray.length; m++) {
                        if (CacheArray[m].split(',')[0] == repairPlanTableArrayChange[l].id) {
                            houseRepairArray.push(repairPlanTableArrayChange[l]);
                        }
                    }
                }
                frameHelper.getDialogParentIframe().gridRepairPlanTableChange.datagrid('loadData', { total: 0, rows: [] });
                for (i = 0; i < houseRepairArray.length; i++) {
                    if (houseRepairArray[i] !== "id") {
                        frameHelper.getDialogParentIframe().gridRepairPlanTableChange.datagrid('insertRow', { index: i, row: houseRepairArray[i] });
                    }
                }
                try {
                    frameHelper.getDialogParentIframe().dialogAddChange.dialog('close');
                } catch (e) {

                } 
            }
        }
    }
}
///初始化
$(function () {
    $(document).queue("datagrid0101", function () { HouserRepairMentIndex.Initialize(); });
    $(document).queue("datagrid0102", function () { HouserRepairMentIndex.InlineEditor(); });
    $(document).dequeue("datagrid0101");
});


