$(function () {
    if ($("#Info").html() !== "") {
        window.top.topeveryMessage.show($("#Info").html());
        frameHelper.getDialogParentIframe().dialog.dialog('close');
    } else {

    }
})