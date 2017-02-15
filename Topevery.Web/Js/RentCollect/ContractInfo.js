var ContractInfo = {
    Initialize: function () {
        $("#contractInfoDataGrid").datagrid({
            columns: [
                [
                    { field: "contractId", checkbox: true },
                    { field: "contractNo", title: "合同编号", width: 100, align: "center" },
                    { field: "houseDoorplate", title: "房屋门牌", width: 100, align: "center" },
                    { field: "rentRange", title: "租用范围", width: 100, align: "center" },
                    { field: "lesseeName", title: "承租人", width: 100, align: "center" },
                    { field: "payType", title: "交租方式", width: 100, align: "center" },
                    {
                        field: "rentStartTime", title: "租赁期限起", width: 100, align: "center", formatter: function (value) {
                            return topevery.dataTimeFormat(value);
                        }
                    },
                    {
                        field: "rentEndTime", title: "租赁期限止", width: 100, align: "center", formatter: function (value) {
                            return topevery.dataTimeFormat(value);
                        }
                    }
                ]
            ],
            height: 440,
            idField: "contractId",
            fitColumns: true,
            rownumbers: true,
            singleSelect:true,
            pagination: true,
            onLoadSuccess: function (data) {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
                $(this).datagrid("clearSelections").datagrid("clearChecked");
            },
            loader: function (param, success, error) {
                topevery.ajax({
                    type: "POST",
                    url: "api/services/app/RentCollectR/GetContractAndRentCollectPageListAsync",
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
                }
                , false);
            },
            onDblClickRow: function (rowIndex, rowData) {
                frameHelper.getDialogParentIframe().RentCollect.loadRentInfo(rowData);
                frameHelper.getDialogParentIframe().dialog.dialog('close');
            },
            //onLoadSuccess: function () {
            //    $(this).datagrid("clearSelections").datagrid("clearChecked");
            //}
        });
    },
    Select:function() {
        $("#contractInfoDataGrid").datagrid("load");
    }
};
$(function() {
    ContractInfo.Initialize();
});