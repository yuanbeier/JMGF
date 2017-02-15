$(function () {
    bindDicToDrp("PropertyId", "B34CFE85-FB80-4817-B660-B8DF27F8DC76", "--产权属性--");
    bindDicToDrp("lossCategoryId", "32E99457-7802-4348-A99D-6E33363E93DE", "--灭失类别--");
    HouseLossIndex.Initialize();
});
var grid;
var HouseLossIndex = {
    Initialize: function () {
        grid=$("#houseLossDataGrid").datagrid({
            columns: [
                [
                    { field: "id", checkbox: true },
                    {
                        field: "houseNo", title: "房屋编号", width: 60, align: "center", formatter: function (value, row, index) {
                            return "<a href='#' onclick='objectExtend.HouseBan(" + row.houseId + ")'>" + value + "</a>";
                        }
                    },
                    { field: "houseDoorplate", title: "现房屋门牌", width: 100, align: "center" },
                    { field: "propertyName", title: "产权属性", width: 100, align: "center" },
                    { field: "unitName", title: "单元名称", width: 100, align: "center" },
                    { field: "lossReason", title: "灭失原因", width: 100, align: "center" },
                    { field: "lossCategoryName", title: "灭失类别", width: 100, align: "center" },
                    { field: "landNatureName", title: "用地性质", width: 100, align: "center" },
                    { field: "remark", title: "备注", width: 100, align: "center" }
                ]
            ],
            height: 480,
            idField: "id",
            striped: true,
            fitColumns: true,
            fit:true,
            nowrap: false,
            rownumbers: true, //行号
            pagination: true, //分页控件
            showFooter: true,
            toolbar: "#toolbarWrap",
            onLoadSuccess: function (data) {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
            },
            loader: function (param, success, error) {
                topevery.ajax({
                    type: "POST",
                    url: "api/services/app/HousingLossR/GetHousingLossPageList",
                    contentType: "application/json",
                    data: topevery.extend(topevery.form2Json("selectFrom"), {
                        PageIndex: param.page,
                        PageCount: param.rows
                    })
                }, function (data) {
                    if (data.success) {
                        success(data.result);
                    } else {
                        error();
                    }
                }
                , false);
            }
        });
        for (var i = 0; i < $(".easyui-textbox").length; i++) {
            $("#" + $('.easyui-textbox').eq(i)[0].id + "").textbox({
                inputEvents: $.extend({}, $.fn.textbox.defaults.inputEvents, {
                    keyup: function (event) {
                        if (event.keyCode === 13) {
                            HouseLossIndex.Select();
                        }
                    }
                })
            });
        }
    },
    Select: function () {
        $("#houseLossDataGrid").datagrid("load");
    },
    Add: function () {
        var dialog = ezg.modalDialog({
            width: 500,
            height: 410,
            title: '房屋灭失登记',
            url: virtualDirName + "House/HouseLossAdd",
            buttons: [
                {
                    text: '确认',
                    iconCls: 'icon-ok',
                    handler: function () {
                        dialog.find('iframe').get(0).contentWindow.submitFormAdd(dialog,grid);
                    }
                }
            ]
        });
    },
    Delete: function (id) {
        var url = virtualDirName + 'api/services/app/HousingLossW/DeleteHousingLossAsync';
        deleteAjax("", "houseLossDataGrid", url);
    }
};