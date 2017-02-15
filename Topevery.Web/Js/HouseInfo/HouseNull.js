$(function () {
    HouseNull.Initialize();
    bindDicToDrp("usePropertyId", "28519BAC-0C61-4921-A7C1-80F3CEB80AC0", "--使用性质--");
    bindDicToDrp("buildStructureId", "29A43A34-8D05-4F9A-B0FA-EFB8A38F7F98", "--建筑结构--");
    //bindDropDown("houseManageId", "Common/GetWorkstationBind", "--工作站--");
});
var HouseNull = {
    Initialize: function () {
        $("#houseNullDataGrid").datagrid({
            columns: [
                [
                    {
                        field: "houseNo", title: "房屋编号", width: 60, align: "center", formatter: function (value, row, index) {
                            if (row.houseBanId) {
                                return "<a href='#' onclick='objectExtend.HouseBan(" + row.houseBanId + ")'>" + value + "</a>";
                            }
                            else {
                                return value;
                            }
                        }
                    },
                                        { field: "houseDoorplate", title: "现房屋门牌", width: 100, align: "center" },
                    { field: "unitName", title: "单元名称", width: 100, align: "center" },
                    {
                        field: "isRentable", title: "是否可出租", width: 100, align: "center", formatter: function (value, row, index) {
                            return HouseNull.InputFormatter(value, row, index, "isRentable");
                        }, styler: function (value, row, index) {
                            return HouseNull.StyleFormatter(row.isRentableEdit);
                        }
                    },
                    {
                        field: "isSwing", title: "周转房", width: 100, align: "center", formatter: function (value, row, index) {
                            return HouseNull.InputFormatter(value, row, index, "isSwing");
                        }, styler: function (value, row, index) {
                            return HouseNull.StyleFormatter(row.isSwingEdit);
                        }
                    },
                    {
                        field: "isTao", title: "是否成套住宅", width: 100, align: "center", formatter: function (value, row, index) {
                            return HouseNull.InputFormatter(value, row, index, "isTao");
                        }, styler: function (value, row, index) {
                            return HouseNull.StyleFormatter(row.isTaoEdit);
                        }
                    },
                    { field: "flatMonthRent", title: "(非)住宅月租金", width: 100, align: "center" },
                    { field: "metRentArea", title: "计租面积", width: 100, align: "center" },
                    { field: "buildArea", title: "建筑面积", width: 100, align: "center" }
                ]
            ],
            height: 480,
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
                    url: "api/services/app/HouseUnitR/GetHouseBanNullPageList",
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
                            HouseNull.Select();
                        }
                    }
                })
            });
        }
    },
    Select:function() {
        $("#houseNullDataGrid").datagrid("reload");
    },
    UpdateRow: function (index, that, name, temp) {
        var up = {};
        var t = 0;
        if (!temp) {
            temp = 1;
        } else {
            temp = 0;
        }
        if ($(that).is(':checked')) {
            t = 1;
        }
        switch (name) {
            case "isRentable": up.isRentable = t, up.isRentableEdit=temp; break;
            case "isSwing": up.isSwing = t, up.isSwingEdit=temp; break;
            case "isTao": up.isTao = t, up.isTaoEdit = temp; break;
            default: return;
        }
        $("#houseNullDataGrid").datagrid("updateRow", {
            index: index,
            row:up
        })
    },
    Restore:function(){
        $("#houseNullDataGrid").datagrid("rejectChanges");
    },
    HouseBan: function (id) {
        ezg.modalDialog({
            width: 1200,
            height: 460,
            title: '房屋楼栋信息',
            url: virtualDirName + "House/HouseBanAdd?view=1&id=" + id
        });
    },
    Save: function () {
        var data = $("#houseNullDataGrid").datagrid("getChanges", "updated");
        if (data.length <= 0) {
            window.top.topeveryMessage.show("没有修改");
            return;
        }
        topeveryMessage.confirm(function (r) {
            if (r) {
                    var str = "";
                    for (var i in data) {
                        str += "id:"+data[i].id+",isRentable:" + data[i].isRentable + ",isSwing:" + data[i].isSwing + ",isTao:" + data[i].isTao + "|";
                    }
                    str = str.substring(0, str.length - 1);
                    topevery.ajax({
                        type: "POST",
                        url: "api/services/app/HouseUnitW/SaveHouseNullInfo",
                        contentType: "application/json",
                        data: topevery.extend({ HouseNullInfo: str })
                    }, function (data) {
                        if (data.success) {
                            $("#houseNullDataGrid").datagrid("reload");
                        }
                    }, false);
            }
        })
    },
    HullExp: function () {
        window.location.href = virtualDirName + "House/HouseNullExp" + GetUrlByform2Json();
    },
    InputFormatter: function (value, row, index, d) {
        var g = d + "Edit";
        if(value==1){
            return "<input type='checkbox' checked='checked' onclick='HouseNull.UpdateRow(" + index + ",this,\"" + d + "\"," + row.g + ")' />";
        }
        else if(value==0){
            return "<input type='checkbox' onclick='HouseNull.UpdateRow(" + index + ",this,\"" + d + "\"," + row.g + ")'  />"
        }
        else{
            return "";
        }
    },
    StyleFormatter: function (i) {
        return i===1?"background-color:#ffee00;color:red":"";
    }
};