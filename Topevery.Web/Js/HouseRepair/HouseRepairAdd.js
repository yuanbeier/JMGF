
var submitFormAdd = function (dialog, grid, that) {
    if (!$("#HouseRepairAdd").form('validate')) {
        return;
    }
    var array = ezg.serializeObject($('form'));
    $(that).remove();
    topevery.ajax({
        type: "POST",
        url: "api/services/app/RepairItemW/AddRepairItemAsync",
        contentType: "application/json",
        data: JSON.stringify(array)
    }, function (data) {
        if (data.success) {
            //获取要插入到父窗口表格的数据
            array.unitNumN = $("#unitNumN").numberbox("getValue");
            array.number = $("#number").numberbox("getValue");
            var arrayList = {
                id: data.result.id,
                quotaNo: array.QuotaNo,
                repairCate: array.RepairCate,
                repairTypeId: array.RepairTypeId,
                unit: array.Unit,
                unitPriceY: array.UnitPriceY,
                unitPriceN: array.UnitPriceN,
                unitNumN: array.unitNumN,
                number: array.number,
                repairTypeName: $("#RepairTypeId").combobox("getText")
            };
            //判断是预算方案添加  还是变更方案添加
            if (type == 1) {
                var i = frameHelper.getDialogParentIframe().gridRepairPlanTable.datagrid('getRows');
                frameHelper.getDialogParentIframe().gridRepairPlanTable.datagrid('insertRow', { index: i.lenght, row: arrayList });
                var budgetMoney = 0;
                var money = frameHelper.getDialogParentIframe().$("#BudgetMoney").textbox('getValue');
                if (money === null || money === "") {
                    money = 0;
                }
                budgetMoney = arrayList.unitPriceY * arrayList.number + arrayList.unitPriceN * arrayList.unitNumN;
                frameHelper.getDialogParentIframe().$("#BudgetMoney").textbox('setValue', (parseFloat(money) + parseFloat(budgetMoney)).toFixed(2));
                frameHelper.getDialogParentIframe().dialogPrice.dialog('close');
            }else if (type==2) {
                var j = frameHelper.getDialogParentIframe().gridRepairPlanTableChange.datagrid('getRows');
                frameHelper.getDialogParentIframe().gridRepairPlanTableChange.datagrid('insertRow', { index: j.lenght, row: arrayList });
                frameHelper.getDialogParentIframe().dialogPrice.dialog('close');
            } else {
                grid.datagrid('reload');
                dialog.dialog('destroy');
            }
        }
    }, true);
};
///绑定工程大类下拉框的数据
function bindDicToDrp(btnid, guid, defaultText, required, lastDefault) {
    $("#" + btnid).combobox({
        editable: false,
        panelHeight: 'auto',
        url: virtualDirName + "Common/DicBindToDrp?guid=" + guid + "",
        loadFilter: function (data) {
            var data = $.treeMap(data, function (row) {
                return {
                    value: row.Data.Key,
                    text: row.Data.Value
                };
            });
            //设置第一个值为默认值
            if (lastDefault) {
                data[0].selected = true;
            };
            // 添加空行
            if (defaultText !== "") {
                if ($.isArray(data)) {
                    data.splice(0, 0, { value: "", text: defaultText });
                    $(document).dequeue("datagrid0102");
                }
            }
            return data;
        },
        required: required ? true : false
    });
}
///type=1 预算修缮方案  type=2 变更修缮方案  
var type = getRequest("type");
//初始化为手工录入修缮方案的相关
function Initialize() {
    if (type != null) {
        $("#QuotaNo").textbox({
            required: false
        });
        $("#RepairTypeId").combobox("setValue", "500281");
        $("#RepairTypeId").combobox("readonly");
        $(".hidden").show();
    }
}
//由于存在下拉赋值不了的问题，所以这里用的序列
$(document).queue("datagrid0101", function () { bindDicToDrp("RepairTypeId", "0ACFD5BD-D3DA-45CB-99B4-ED3009E08950", "--请选择--"); });
$(document).queue("datagrid0102", function () {Initialize();});
$(document).dequeue("datagrid0101");