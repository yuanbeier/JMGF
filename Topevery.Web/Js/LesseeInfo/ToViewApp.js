$(function () {
    $(document).queue("datagrid0101", function () { ToViewAppIndex.Initialize(); });
    $(document).queue("datagrid0102", function () { ToViewAppIndex.huoqushuju(); });
    $(document).dequeue("datagrid0101");

});
ToViewAppIndex = {
    Initialize: function () {
        bindDicToDrp("CertName", "D11CFDA8-992B-4A9A-81D3-7201BD4D6E4D", "", false);
        bindDicToDrp("Sex", "C8CEFBB2-6F98-4F70-8A47-932B9487FC37", "", false);
        bindDicToDrp("TenantType", "7705DB66-07EB-4F3E-86F5-51A79663DF6A", "", false);
        bindDropDown("HouseManageId", "Common/GetWorkstationBind", "", false);
        $(document).dequeue("datagrid0102");
    },
    ///获取数据
    huoqushuju: function () {
        topevery.ajax({
            type: "POST",
            url: "api/services/app/LesseeInfoR/GetLesseeInfOne",
            contentType: "application/json",
            data: JSON.stringify({ id:getRequest("id") })
        }, function (row) {
            if (row.success) {
                var data = row.result;
                var array = {};
                for (var i in data) {
                    array[""+ UpperFirstLetter(i) + ""] = data[i];
                };
                $("#LesseeInfoToView").form("load", array);
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