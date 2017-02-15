DailySafetyInspectionTiew = {
    Initialize: function () {
        topevery.ajax({
            type: "POST",
            url: "api/services/app/SafetyR/GetSpecialSafetyTypeInfoAsync",
            contentType: "application/json",
            data: JSON.stringify({ Id: topevery.getQuery("Id") })
        }, function (data) {
            if (data.success) {
                var row = data.result.dailySafetyType;
                for (var i = 0; i < row.length; i++) {
                    if (row[i].checkResult === true) {
                        $("#id_" + row[i].checkProjectId + "").prop("checked", true);
                    }
                    $("#input_" + row[i].checkProjectId + "").val(row[i].checkThat);
                    topevery.PicturesShow(row[i].id, 25, "Attachment_" + row[i].checkProjectId + "");
                }
                topevery.PicturesShow(data.result.id, 24, "Attachment");
                var array = {};
                var list = data.result;
                for (var h in list) {
                    array["" + UpperFirstLetter(h) + ""] = list[h];
                };
                $("#DailySafetyInspectionTiew").form("load", array);
            } else {
                error();
            }
        }, true);
    }
}
$(function () {
    DailySafetyInspectionTiew.Initialize();
})