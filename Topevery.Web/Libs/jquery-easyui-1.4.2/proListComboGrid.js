
var progrid = progrid || {};

//产品下拉表格
progrid.productComboGrid = function (container, value, sort) {

    if (typeof sort != "string")
        sort = "";

    var productGrid;

    productGrid = container.combogrid({
        toolbar: [
             {
                 text: "<form id='productComboGridsearchForm" + sort + "'>产品名称：" +
         " <input id='Product_Name' class='easyui-combobox' name='Product_Name' data-options=\"valueField:'Product_Name',textField:'Product_Name',url:'/Product/ComboBoxGetProductNameByRemote',mode:'remote',prompt:'输入关键字',hasDownArrow:false,onBeforeLoad:function(param){if(param == null || param.q == null || param.q.replace(/ /g, '') == ''){var value = $(this).combobox('getValue');if(value){param.id = value;return true;}return false;}}\" style='width:120px;' />商品编号：<input id='Product_NO' name='Product_NO' class='easyui-textbox' type='text' style='width: 120px;' /></form>",
             },
             {
                 text: '查询',
                 iconCls: 'icon-search',
                 handler: function () {
                     var data = ezg.serializeObject($('#productComboGridsearchForm' + sort));
                     productGrid.combogrid('grid').datagrid('reload', data);
                 }
             },
             {
                 text: '重置',
                 iconCls: 'ext-icon-export_cur_pate',
                 handler: function () {
                     $('#productComboGridsearchForm' + sort).form('reset');
                 }
             }],
        panelWidth: 600,
        panelMinHeight: 260,
        value: value,
        idField: 'Product_ID',
        textField: 'Product_Name',
        pagination: true,
        pageSize: 30,
        pageList: [5, 10, 20, 30, 40, 50],
        sortName: 'Product_ID',
        sortOrder: 'desc',
        url: '/Product/GetProduct?Product_State=0&Is_Best=-1&Is_Hot=-1&Is_New=-1&Is_Hight=-1&Is_Presale=-1&Is_Special=-1',
        columns: [[
            { field: 'Product_ID', title: 'ID', width: 70, sortable: true },
            {
                field: 'Product_Name', title: '商品名称', width: 220,
                //formatter: function (value, row) {
                //    if (typeof value === 'string') {
                //        var prodcutId = row.Product_ID;
                //        var url = '@EzgShop.Common.App_Parameters.MobileDomain' + 'product/detail/' + prodcutId;
                //        return value.length > 15 ? '<a href="' + url + '" target="_blank"   title="' + value + '">' + value.substr(0, 15) + '...</a>' : '<a href="' + url + '" target="_blank"   title="' + value + '">' + value + '</a>';
                //    }
                //    return "";
                //}
            },
            { field: 'Product_NO', title: '商品编码', width: 150 },
            { field: 'Product_SN', title: '货品编码', width: 150 },
           { field: 'Product_StateName', title: '状态', width: 70, align: 'center' },
        ]]
    });
};
