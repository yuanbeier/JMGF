///闭包函数
ContractModif = {
    Initialize: function() {
        bindDicToDrp("Sex", "C8CEFBB2-6F98-4F70-8A47-932B9487FC37", "");
        bindDicToDrp("UsePropertyId", "28519BAC-0C61-4921-A7C1-80F3CEB80AC0", "");
        bindDicToDrp("BuildStructureId", "29A43A34-8D05-4F9A-B0FA-EFB8A38F7F98", "");
        bindDicToDrp("PayType", "AD33D5B6-42C0-4129-B501-BE6D748F6F7E", "--请选择--");
        bindDicToDrp("RentType", "497E9547-0CBD-49EB-B556-BED08F4B5CF0", "--请选择--");
        bindDicToDrp("ExpireHandle", "EC39DF03-EFAE-4F59-9ED7-A210F3F1913A", "--请选择--");
        bindDicToDrp("ReduceType", "A7CD7C95-EA39-42A6-BBFB-DF0210C0E374", "--请选择--");
        bindDicToDrp("CreditCard", "8F746198-36E5-49B7-8929-6BFE6C51431B", "", false);
        //var myDate = new Date();
        //var year = myDate.getFullYear();
        //var month = myDate.getMonth();
        //var date = myDate.getDate();
        //$("#SignDate").html(year + "-" + month + "-" + date);
        $(document).dequeue("datagrid0102");
    },
    ///获取数据
    huoqushuju: function () {
        topevery.ajax({
            type: "POST",
            url: "api/services/app/ContractR/GetContractInfoAsync",
            contentType: "application/json",
            data: JSON.stringify({ id: $("#Id").val() })
        }, function(row) {
            if (row.success) {
                var data = row.result;
                ContractModif.bangdingshuju(data);
            } else {
                error();
            }
        }, true);
    },
    ///提交修改数据
    tijiaoAjax: function() {
        var array = ezg.serializeObject($('form'));
        array.bankCardNo = array.bankCardNo1;
        topevery.ajax({
            type: "POST",
            url: "api/services/app/ContractW/EditContractAsync",
            contentType: "application/json",
            data:  JSON.stringify(array)
        }, function(row) {
            if (row.success) {
                try {
                    frameHelper.getDialogParentIframe().dialog6.dialog('close');
                } catch (e) {

                }
                try {
                    frameHelper.getDialogParentIframe().ContractIndex.Select();
                } catch (e) {

                } 
            } else {
                error();
            }
        }, true);
    },
    ///绑定数据到文本
    bangdingshuju: function (data) {
        $("#ContractSigningAdd").form("load", data);
        $("#SignDate").html(topevery.dataTimeFormat(data.signDate));
        $("#ContractNo").html(data.contractNo);
        if (data.automaticRenew!=null) {
            $("#AutomaticRenew").combobox('setValue', data.automaticRenew.toString());
        }
       
    },
    ReduceTypeChange: function(data) {
        $('#ReduceType').combobox({
            onChange: function () {
                var monthMoney = $("#MonthMoney").textbox('getValue');
                if ($('#ReduceType').combobox('getText') === "减半") {
                    $("#ReduceMoney").textbox('setValue', parseFloat(monthMoney * 0.5));
                    $("#CollectMoney").textbox('setValue', parseFloat(monthMoney * 0.5));
                } else if ($('#ReduceType').combobox('getText') === "--请选择--") {
                    $("#ReduceMoney").textbox('setValue', 0);
                    $("#CollectMoney").textbox('setValue', monthMoney);
                    //$("#ReduceEndTime").val("");
                    //$("#ReduceStartTime").val("");
                } else if ($('#ReduceType').combobox('getText') === "八成") {
                    $("#ReduceMoney").textbox('setValue', parseFloat(monthMoney * 0.8).toFixed(2));
                    $("#CollectMoney").textbox('setValue', parseFloat(monthMoney * 0.2).toFixed(2));
                } else if ($('#ReduceType').combobox('getText') === "七成") {
                    $("#ReduceMoney").textbox('setValue', parseFloat(monthMoney * 0.7).toFixed(2));
                    $("#CollectMoney").textbox('setValue', parseFloat(monthMoney * 0.3).toFixed(2));
                } else if ($('#ReduceType').combobox('getText') === "六成") {
                    $("#ReduceMoney").textbox('setValue', parseFloat(monthMoney * 0.6).toFixed(2));
                    $("#CollectMoney").textbox('setValue', parseFloat(monthMoney * 0.4).toFixed(2));
                } else {
                    $("#ReduceMoney").textbox('setValue', monthMoney);
                    $("#CollectMoney").textbox('setValue', 0);
                }
            }
        });
        $("#MonthMoney").textbox({
            onChange: function () {
                var monthMoney = $("#MonthMoney").textbox('getValue');
                if ($('#ReduceType').combobox('getText') === "减半") {
                    $("#ReduceMoney").textbox('setValue', parseFloat(monthMoney * 0.5));
                    $("#CollectMoney").textbox('setValue', parseFloat(monthMoney * 0.5));
                } else if ($('#ReduceType').combobox('getText') === "--请选择--") {
                    $("#ReduceMoney").textbox('setValue', 0);
                    $("#CollectMoney").textbox('setValue', monthMoney);
                    //$("#ReduceEndTime").val("");
                    //$("#ReduceStartTime").val("");
                } else if ($('#ReduceType').combobox('getText') === "八成") {
                    $("#ReduceMoney").textbox('setValue', parseFloat(monthMoney * 0.8).toFixed(2));
                    $("#CollectMoney").textbox('setValue', parseFloat(monthMoney * 0.2).toFixed(2));
                } else if ($('#ReduceType').combobox('getText') === "七成") {
                    $("#ReduceMoney").textbox('setValue', parseFloat(monthMoney * 0.7).toFixed(2));
                    $("#CollectMoney").textbox('setValue', parseFloat(monthMoney * 0.3).toFixed(2));
                } else if ($('#ReduceType').combobox('getText') === "六成") {
                    $("#ReduceMoney").textbox('setValue', parseFloat(monthMoney * 0.6).toFixed(2));
                    $("#CollectMoney").textbox('setValue', parseFloat(monthMoney * 0.4).toFixed(2));
                } else {
                    $("#ReduceMoney").textbox('setValue', monthMoney);
                    $("#CollectMoney").textbox('setValue', 0);
                }
            }
        });
        $("#ReduceMoney").textbox({
            onChange: function () {
                var monthMoney = $("#MonthMoney").textbox('getValue');
                var reduceMoney = $("#ReduceMoney").textbox('getValue');
                $("#CollectMoney").textbox('setValue', parseFloat(monthMoney - reduceMoney).toFixed(2));
            }
        });
        $(document).dequeue("datagrid0103");
    }
}
///初始化数据
$(function () {
    $(document).queue("datagrid0101", function () { ContractModif.Initialize();  });
    $(document).queue("datagrid0102", function () { ContractModif.ReduceTypeChange(); });
    $(document).queue("datagrid0103", function () { ContractModif.huoqushuju(); });
    $(document).dequeue("datagrid0101");
});

 