var dialog;
var RentCollect = {
    Select: function () {
        $("#RentCollectDataGrid").datagrid("reload");
    },
    SelectContract: function () {
        dialog = ezg.modalDialog({
            width: 1000,
            height: 555,
            title: '选择合同',
            url: virtualDirName + "Contract/ContractInfo"
        });
    },
    loadRentInfo: function (rowData) {
        $("#selectForm").form("load", rowData);
    },
    Cancel:function() {
        window.location.href = virtualDirName + "RentCollect/RentCollectIndex";
    },
    Add: function () {
        if (!$("#selectForm").form("validate")) {
            return;
        }
        var array = ezg.serializeObject($("form"));
        topevery.ajax({
            type: "POST",
            url: "api/services/app/RentCollectW/AddRentCollectRecordAsync",
            contentType: "application/json",
            data: JSON.stringify(array)
        }, function (data) {
            if (data.success) {
                RentCollect.Cancel();
            }
        }, true);
    }
};
$(function () {
    bindDicToDrp("paymentId", "AD33D5B6-42C0-4129-B501-BE6D748F6F7E", "", true, true);
    var date = new Date();
    $("#recordTime").datebox({
        value: date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate()
    });
    $("#contractNo").textbox({
        required: true,
        editable: false,
        icons: [
            {
                iconCls: "icon-search",
                handler: function () {
                    RentCollect.SelectContract();
                }
            }
        ]
    });
});