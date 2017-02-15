//将表单数据转为json
var grid;
TenantsSelectModif = {
    ///加载列表数据-
    loadData: function () {
        topevery.ajax({
            type: "POST",
            url: "api/services/app/HouseRentApplyR/GetHousingAndTenantInfoAsync",
            contentType: "application/json",
            data: JSON.stringify({ id: $("#Id").val() })
        }, function (row) {
            if (row.success) {
                var data = row.result;
                $("#LesseeInfoView").form("load", data);
            } else {
                error();
            }
        }, true);
    }, ModifSave: function () {
        if ($("#LesseeInfoView").form('validate') === false) {
            return;
        } else {
            var array = ezg.serializeObject($('form'));
            topevery.ajax({
                type: "POST",
                url: "api/services/app/HouseRentApplyW/EditHouseRentApplyAsync",
                contentType: "application/json",
                data: topevery.extend(array, { FileId: array.IdhiddenFile })
            }, function (row) {
                if (row.success) {
                    frameHelper.getDialogParentIframe().dialogModif.dialog('close');
                    frameHelper.getDialogParentIframe().grid.datagrid('reload');
                    window.top.topeveryMessage.show("提交成功");
                } else {
                    error();
                }
            }, true);
        }
    }
};
$(function () {
    /*初始化*/
    bindDicToDrp("PayType", "AD33D5B6-42C0-4129-B501-BE6D748F6F7E", "");
    TenantsSelectModif.loadData();
    $('#PayType').combobox({
        onChange: function () {
            rentcheng();
        }
    });
});
function rentcheng() {
    if ($('#PayType').combobox('getText') !== "现金") {
        $("#BankCardNo").textbox({
            required: true,
            missingMessage: "银行卡号不能为空"
        });
    } else {
        $("#BankCardNo").textbox({
            required: false
        });
    }
}
