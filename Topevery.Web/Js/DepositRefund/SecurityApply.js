var dialogChoose;

securityApply = {
    SaveSecurityApply: function () {
        if (!$("#SecurityApply").form('validate')) {
            return;
        }
        if ($("#ApplyContent").textbox("getValue") == null || $("#ApplyContent").textbox("getValue") === "" || $("#ApplyContent").textbox("getValue") == undefined) {
            window.top.topeveryMessage.show("请输入申请内容！");
            return;
        }
        if ($("input[name='fileDivIdhiddenFile']").val() == null || $("input[name='fileDivIdhiddenFile']").val() === "" || $("input[name='fileDivIdhiddenFile']").val() == undefined) {
            window.top.topeveryMessage.show("上传保证金单据复印件！");
            return;
        }
        window.top.topeveryMessage.confirm(function (r) {
            if (r) {
                topevery.ajax({
                    type: "POST",
                    url: "api/services/app/RefundMarginApplyW/AddRefundMarginApplyAsync",
                    contentType: "application/json",
                    data: topevery.extend(topevery.form2Json("SecurityApply"), { FileId: $("input[name='fileDivIdhiddenFile']").val() })
                }, function (data) {
                    if (data.success) {
                        if (data.result.isSuccess) {
                            var id = data.result.id;
                            window.top.topeveryMessage.show(data.result.message);
                            //  window.location = virtualDirName + 'Home/TodoLists';
                            window.open(virtualDirName + "PrintRelevant/DepositBackSheet?id=" + id);

                            window.top.$(".center-menu").find("li").eq(1).click();
                        } else {
                            window.top.topeveryMessage.show(data.result.message);
                        }
                    } else {
                        error();
                    }
                }, true);
            }
        }, "", "您确认已经上传了保证金单据附件、身份证扫描件吗?");
    },
    ContractSelection: function () {
        dialogChoose = ezg.modalDialog({
            width: 1100,
            height: 480,
            title: '租赁合同选择',
            url: virtualDirName + 'DepositRefund/DepositRefundContractChoice',
            buttons: [
            ]
        });
    }
}

///回写合同选择带出的信息
function SaveHouse(data) {
    $("#SecurityApply").form("load", data);
    $("#ContractId").val(data.id);
    $("#RefundMoney").numberbox({
        max: data.rentMargin
    });
    $("#RefundMoney").numberbox("setValue", data.rentMargin);
}

$(function() {
    $("#ContractNo").textbox({
        required: true,
        editable: false,
        icons: [
            {
                iconCls: "icon-search",
                handler: function () {
                    securityApply.ContractSelection();
                }
            }
        ]
    });
})