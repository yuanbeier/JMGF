var HouseFacilityIndexs = {
    initialize: function () {
        topevery.ajax({
            type: "POST",
            url: "api/services/app/HouseUnitR/GetHouseFacilityInfo",
            contentType: "application/json",
            data: topevery.extend({ id: $("#hideId").val()})
        }, function (data) {
            if (data.success) {
                var result = data.result;
                if (result.length > 0) {
                    $("#fmHouseFacilityIndex input:checkbox,input:radio").each(function () {
                        for (var item in result) {
                            if ($(this).val() - 0 === result[item].contentId) {
                                $(this).prop('checked', true);
                            }
                        }
                    });
                }
            } else {
                error();
            }
        }, true);
    },
    Add: function (dialog, grid) {
        var str = [];
        $("#fmHouseFacilityIndex").find("input:checked").each(function () {
            str.push($(this).val());
        });
        var array = {
            houseUnitId: $("#hideId").val(),
            ids:str.join()
        }
        topevery.ajax({
            type: "POST",
            url: "api/services/app/HouseUnitW/SaveHouseFacilityInfo",
            contentType: "application/json",
            data: JSON.stringify(array)
        }, function (data) {
            if (data.success) {
                grid.datagrid("reload");
                dialog.dialog('destroy');
            }
        }, false);
    }
}
$(function () {
    HouseFacilityIndexs.initialize();
    $("#onlyDiv :checkbox").each(function () {
        $(this).click(function () {
            $(this).parent().siblings().children(":checkbox").prop("checked", false);
        })
    });
});