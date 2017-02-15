
ModifyBankCardNmber = {
    Save: function () {
        var array = ezg.serializeObject($('form'));
        if (!$("#ModifyBankCardNmberAdd").form("validate")) {
            return;
        }
        topevery.ajax({
            type: "POST",
            url: "api/services/app/ContractW/ModifyBankCardNmber",
            contentType: "application/json",
            data: JSON.stringify(array)
        }, function (data) {
            if (data.success) {
                if (data.result.isSuccess) {
                    frameHelper.getDialogParentIframe().grid.datagrid('reload');
                    frameHelper.getDialogParentIframe().dialog7
                        .dialog("close");
                    window.top.topeveryMessage.show(data.result.message);
                } else {
                    window.top.topeveryMessage.show(data.result.message);
                }
            } else {
                error();
            }
        }, true);
    }
}
