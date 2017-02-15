var RentForHouseManageRp = {
    //Initialize: function () {
    //    $("#RentForHouseManageRpTable").datagrid({
    //        columns: [
    //            [
    //                { field: "propertyName", title: "产权", width: 50, align: "center" },
    //                { field: "communityName", title: "小区名称", width: 30, align: "center" },
    //                   { field: "isHome", title: "是否住宅", width: 30, align: "center" },
    //                     { field: "eastArea", title: "东区", width: 30, align: "center" },
    //                { field: "southArea", title: "南区", width: 30, align: "center" },
    //                { field: "westArea", title: "西区", width: 30, align: "center" },
    //                { field: "middleArea", title: "中区", width: 30, align: "center" },
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
    //        loader:loader,
    //        onLoadSuccess: function (data) {
    //            $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
    //            $(this).datagrid("clearSelections").datagrid("clearChecked");
    //        },

    //    });
    //},
    //Select: function () {
    //    $("#RentForHouseManageRpTable").datagrid("load");
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
            url: "api/services/app/ReportR/GetWorkstationRentReportAsync",
            contentType: "application/json",
            data: JSON.stringify(submit)
        }, function (data) {
            if (data.success) {
                var html = "";
                for (var i = 0; i < data.result.length ; i++) {//' + data.result[i].communityName + '
                    html += '<tr><td colspan="2">' + data.result[i].propertyName + '</td><td>' + data.result[i].communityName + '</td><td colspan="2">' + data.result[i].isHome + '</td><td>' + data.result[i].eastArea + '</td><td>' + data.result[i].southArea + '</td><td>' + data.result[i].westArea + '</td><td>' + data.result[i].northArea + '</td><td>' + data.result[i].middleArea + '</td><td>' + data.result[i].total + '</td></tr>';
                }
                $("#tbody").html(html);
                RentForHouseManageRp.hebingLie(1);
                RentForHouseManageRp.hebingRows(1);
                RentForHouseManageRp.hebingRows(0);
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
        window.location.href = virtualDirName + "Report/RentForHouseManageRpExport?Year=" + submit["year"] + "&month=" + submit["month"];
    },
    //合并行
    hebingRows: function (col) {
        var trs = $("table tr");
        var rows = 1;
        for (var i = trs.length; i > 0; i--) {
            //if (i % 2 !== 0 && i % 3 !== 0) {
                var cur = $($(trs[i]).find("td")[col]).text();
                var next = $($(trs[i - 1]).find("td")[col]).text();
                if (cur == next) {
                    rows++;
                    $($(trs[i]).find("td")[col]).remove();
                } else {
                    $($(trs[i]).find("td")[col]).attr("rowspan", rows);
                    rows = 1;
                }
            //}
        }
    },
    //合并行
    hebingRows1: function (col) {
        var trs = $("table tr");
        var rows = 1;
        for (var i = trs.length; i > 0; i--) {
            if (i % 2 !== 0 && i % 3 !== 0) {
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
        }
    },
    //合并列
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
    RentForHouseManageRp.loader();
});