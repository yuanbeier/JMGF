$(function () {
    $(document).queue("datagrid0101", function () { ContractModif.Initialize(); });
    $(document).queue("datagrid0102", function () { ContractModif.huoqushuju(); });
    $(document).dequeue("datagrid0101");

});
ContractModif = {
    Initialize: function () {
        bindDicToDrp("Sex", "C8CEFBB2-6F98-4F70-8A47-932B9487FC37", "");
        bindDicToDrp("UsePropertyId", "28519BAC-0C61-4921-A7C1-80F3CEB80AC0", "");
        bindDicToDrp("BuildStructureId", "29A43A34-8D05-4F9A-B0FA-EFB8A38F7F98", "");
        bindDicToDrp("PayType", "AD33D5B6-42C0-4129-B501-BE6D748F6F7E", "");
        bindDicToDrp("ReduceType", "8F746198-36E5-49B7-8929-6BFE6C51431B", "");
        bindDicToDrp("RentType", "497E9547-0CBD-49EB-B556-BED08F4B5CF0", "");
        bindDicToDrp("ExpireHandle", "EC39DF03-EFAE-4F59-9ED7-A210F3F1913A", "");
        $(document).dequeue("datagrid0102");
    },
    ///获取数据
    huoqushuju: function () {
        topevery.ajax({
            type: "POST",
            url: "api/services/app/ContractR/GetContractInfoAsync",
            contentType: "application/json",
            data: JSON.stringify({ id: $("#Id").val() })
        }, function (row) {
            if (row.success) {
                var data = row.result;
                ContractModif.bangdingshuju(data);
            } else {
                error();
            }
        }, true);
    },
    ///绑定数据到文本
    bangdingshuju: function (data) {
        $("#ContractSigningAdd").form("load", data);
        if (data.automaticRenew !== null) {
            $("#AutomaticRenew").combobox('setValue', data.automaticRenew.toString());
        }
        $("#ContractNo").html(data.contractNo);
    }
}