$(function () {
    $(document).queue("datagrid0101", function () { ToViewAppIndex.huoqushuju(); });
    $(document).dequeue("datagrid0101");

});
ToViewAppIndex = {
    ///获取数据
    huoqushuju: function () {
        topevery.ajax({
            type: "POST",
            url: "api/services/app/RefundMarginApplyR/GetMarginBasicInfoAsync",
            contentType: "application/json",
            data: JSON.stringify({ id: getRequest("id") })
        }, function (row) {
            if (row.success) {
                var data = row.result;
                var array = {};
                for (var i in data) {
                    array["" + UpperFirstLetter(i) + ""] = data[i];
                };
                topevery.PicturesShow(getRequest("id"), 7, "Attachment");
                $("#SecurityToView").form("load", array);
            } else {
                error();
            }
        }, true);
    }
}
///首字母转大写
function UpperFirstLetter(str) {
    return str.replace(/\b\w+\b/g, function (word) {
        return word.substring(0, 1).toUpperCase() + word.substring(1);
    });
}