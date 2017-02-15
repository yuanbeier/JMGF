var RentForAreaRp = {
    //Initialize: function () {
    //    $("#RentForAreaRpTable").datagrid({
    //        columns: [
    //            [
    //                { field: "propertyName", title: "产权", width: 50, align: "center" },
    //                { field: "communityName", title: "小区名称", width: 30, align: "center" },
    //                   { field: "isHome", title: "是否住宅", width: 30, align: "center" },
    //                     { field: "eastArea", title: "蓬江区", width: 30, align: "center" },
    //                { field: "southArea", title: "江海区", width: 30, align: "center" },
    //                { field: "total", title: "合计", width: 30, align: "center" }
    //            ]
    //        ],
    //        height: 440,
    //        idField: "contractId",
    //        fitColumns: true,
    //        fit: true,
    //        toolbar: '#toolbarWrap',
    //        rownumbers: true,
    //        singleSelect: true,
    //        onLoadSuccess: function (data) {
    //            $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
    //            $(this).datagrid("clearSelections").datagrid("clearChecked");
    //        },
    //        loader: function (param, success, error) {
    //            var submit = topevery.form2Json("selectFrom");
    //            if (submit.dateTime) {
    //                var temp = submit.dateTime.split("-");
    //                submit["year"] = temp[0];
    //                submit["month"] = temp[1];
    //            }
    //            topevery.ajax({
    //                type: "POST",
    //                url: "api/services/app/ReportR/GetAreaRentReportAsync",
    //                contentType: "application/json",
    //                data: topevery.extend(submit, {
    //                    PageIndex: param.page,
    //                    PageCount: param.rows
    //                })
    //            }, function (data) {
    //                if (data.success) {
    //                    success(data.result);
    //                } else {
    //                    error();
    //                }
    //            }
    //            , false);
    //        }
    //    });
    //},
    //Select: function () {
    //    $("#RentForAreaRpTable").datagrid("load");
    //},
    loader: function () {
        var submit = topevery.form2Json("selectFrom");
        if (submit.dateTime) {
            var temp = submit.dateTime.split("-");
            submit["year"] = temp[0];
            submit["month"] = temp[1];
        }
        topevery.ajax({
            type: "POST",
            url: "api/services/app/ReportR/GetAreaRentReportAsync",
            contentType: "application/json",
            data: JSON.stringify(submit)
        }, function (data) {
            if (data.success) {
                var html = "";
                for (var i = 0; i < data.result.length ; i++) {
                    html += '<tr><td colspan="2">' + data.result[i].propertyName + '</td><td>' + data.result[i].communityName + '</td><td colspan="2">' + data.result[i].isHome + '</td><td>' + data.result[i].pengJiangDistrict + '</td><td>' + data.result[i].jiangHaiDistrict + '</td><td>' + data.result[i].total + '</td></tr>';
                }
                $("#tbody").html(html);
                RentForAreaRp.hebingLie(1);
                RentForAreaRp.hebingRows(0);
                RentForAreaRp.hebingRows(1);
            } else {
                error();
            }
        }
        , true);
    },
    Export: function () {
        var submit = topevery.form2Json("selectFrom");
        if (submit.dateTime) {
            var temp = submit.dateTime.split("-");
            submit["year"] = temp[0];
            submit["month"] = temp[1];
        }
        window.location.href = virtualDirName + "Report/RentForAreaRpExport?Year=" + submit["year"] + "&Month=" + submit["month"];
    },
    ///合并行
    hebingRows: function (col) {
        var trs = $("table tr");
        var rows = 1;
        for (var i = trs.length; i > 0; i--) {
            var cur = $($(trs[i]).find("td")[col]).text();
            var next = $($(trs[i - 1]).find("td")[col]).text();
            if (cur == next) {
                rows++;
                $($(trs[i]).find("td")[col]).remove();
            } else {
                $($(trs[i]).find("td")[col]).attr("rowspan", rows);
                rows = 1;
            }
        }
    },
    ///合并列
    hebingLie: function (col) {
        var trs = $("table tr");
        var rows = 1;
        for (var i = trs.length; i > 0; i--) {
            var cur = $($(trs[i]).find("td")[col]).text();
            var next = $($(trs[i - 1]).find("td")[col]).text();
            if (cur == "小区" || cur == "合计") {
                rows++;
                $($(trs[i]).find("td")[col]).remove();
                $($(trs[i]).find("td")[col]).attr("colspan", 3);
            } else {
                rows = 1;
            }
        }
    }
};
$(function () {
    var date = new Date();
    if (date.getMonth() === 0) {
        $("#dateTime").val(date.getFullYear() - 1 + "-" + (12));
    } else {
        $("#dateTime").val(date.getFullYear() + "-" + (date.getMonth()));
    }
    RentForAreaRp.loader();
});