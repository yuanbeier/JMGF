var ModifictionDate = {
    ///提交到期处理数据到后台
    SaveModifictionDate: function () {
        if ($("#ModificationDateViewAdd").form('validate') === false) {
            return;
        } else {
            var array = ezg.serializeObject($('form'));
            topevery.ajax({
                type: "POST",
                url: "api/services/app/ContractW/EditContractExpireAsync",
                contentType: "application/json",
                data: JSON.stringify(array)
            }, function(row) {
                if (row.success) {
                    frameHelper.getDialogParentIframe().dialog10.dialog('close');
                    frameHelper.getDialogParentIframe().$("#LeaseContractProcessingTable").datagrid('reload');
                } else {
                    error();
                }
            }, true);
        }
    }
}
bindDicToDrp("ExpireHandle", "EC39DF03-EFAE-4F59-9ED7-A210F3F1913A", "", true);
