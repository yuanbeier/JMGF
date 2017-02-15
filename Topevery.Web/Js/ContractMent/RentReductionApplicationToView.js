$(function () {
    $(document).queue("datagrid0101", function () { ToViewAppIndex.huoqushuju(); });
    $(document).dequeue("datagrid0101");

});
ToViewAppIndex = {
    huoqushuju: function () {
        topevery.ajax({
            type: "POST",
            url: "api/services/app/RentRemissionApplyR/GetRentRemissionApplyAsync",
            contentType: "application/json",
            data: JSON.stringify({ id: getRequest("id") })
        }, function (row) {
            if (row.success) {
                var data = row.result;
                var array = {};
                for (var i in data) {
                    array["" + UpperFirstLetter(i) + ""] = data[i];
                };
                topevery.PicturesShow(getRequest("id"), 2, "Attachment");
                $("#RentReduction").form("load", array);
            } else {
                error();
            }
        }, true);
        bindDicToDrp("ReduceType", "A7CD7C95-EA39-42A6-BBFB-DF0210C0E374", "", false);
        bindDicToDrp("CertType", "8F746198-36E5-49B7-8929-6BFE6C51431B", "", false);
    }
}
///首字母转大写
function UpperFirstLetter(str) {
    return str.replace(/\b\w+\b/g, function (word) {
        return word.substring(0, 1).toUpperCase() + word.substring(1);
    });
}