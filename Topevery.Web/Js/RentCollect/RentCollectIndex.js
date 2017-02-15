var dialog;
var grid;
var RentCollect = {
    Initialize: function () {
        grid = $("#RentCollectDataGrid").datagrid({
            frozenColumns: [
               [
                    { field: "id", checkbox: true },
                  {
                      field: "contractNo", title: "合同编号", width: 90, align: "center", formatter: function (value, row, index) {
                          if (value.indexOf("总数") === -1) {
                              return "<a href='#' onclick='objectExtend.dbClick(" + row.contractId + ")'>" + value + "</a>";
                          }
                          else {
                              return value;
                          }
                      }, sortable: true
                  },
                  {
                      field: "houseDoorplate", title: "现房屋门牌", width: 100, align: "center", formatter: function (value, row, index) {
                          if (value != null) {
                              return "<a href='#' onclick='objectExtend.HouseBan(" + row.houseBanId + ")'>" + value + "</a>";
                          }
                      }, sortable: true
                  },
                  { field: "rentRange", title: "租用范围", width: 100, align: "center", sortable: true },
                    {
                        field: "lesseeName", title: "承租人", width: 70, align: "center", formatter: function (value, row, index) {
                            if (value != null)
                                return "<a href='#' onclick='objectExtend.LesseeInfoOpen(" + row.lesseeId + ")'>" + value + "</a>";
                        }, sortable: true
                    }
               ]
            ],
            columns: [
                [
                   {
                       field: "recordTime", title: "交款日期", width: 150, align: "center", formatter: function (value) {
                           return topevery.dataTimeFormatTT(value);
                       }, sortable: true
                   },
                    { field: "monthlyIncome", title: "实收金额", width: 100, align: "center", sortable: true },
                      { field: "monthRent", title: "月租实收", width: 100, align: "center", sortable: true },
                     { field: "newRent", title: "新欠实收", width: 100, align: "center", sortable: true },
                      { field: "oldRent", title: "旧欠实收", width: 100, align: "center", sortable: true },
                      { field: "beforeReceiptRent", title: "以前预收属本月", width: 100, align: "center", sortable: true },
                    { field: "savedRent", title: "预存款实收", width: 100, align: "center", sortable: true },
                     { field: "payType", title: "交款方式", width: 100, align: "center" },
                    { field: "usePropertyName", title: "使用性质", width: 70, align: "center" },
                    { field: "propertyName", title: "产权属性", width: 70, align: "center" },
                     { field: "invoiceNumber", title: "发票号", width: 100, align: "center", sortable: true },
                    { field: "housManageName", title: "所属工作站", width: 100, align: "center" },
                    { field: "payeeName", title: "收款人", width: 100, align: "center" }
                ]
            ],
            height: 480,
            idField: "id",
            //fitColumns: true,
            fit: true,
            showFooter: true,
            rownumbers: true,
            pagination: true,
            singleSelect: true,
            toolbar: "#toolbarWrap",
            loader: function (param, success, error) {
                topevery.ajax({
                    type: "POST",
                    url: "api/services/app/RentCollectR/GetRentCollectCashPageList",
                    contentType: "application/json",
                    data: topevery.extend(topevery.form2Json("selectForm"), {
                        PageIndex: param.page,
                        PageCount: param.rows,
                        Order: param.order,
                        Sort: param.sort
                    })
                }, function (data) {
                    if (data.success) {
                        success(data.result);
                    } else {
                        error();
                    }
                }
                , false);
            },
            onLoadSuccess: function (data) {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
                $(this).datagrid("clearSelections").datagrid("clearChecked");
            }
        });
        for (var i = 0; i < $(".easyui-textbox").length; i++) {
            $("#" + $('.easyui-textbox').eq(i)[0].id + "").textbox({
                inputEvents: $.extend({}, $.fn.textbox.defaults.inputEvents, {
                    keyup: function (event) {
                        if (event.keyCode === 13) {
                            RentCollect.Select();
                        }
                    }
                })
            });
        }
    },
    RentCollect: function () {
        window.location.href = virtualDirName + "RentCollect/RentCollect";
    },
    Select: function () {
        $("#RentCollectDataGrid").datagrid("load");
    },
    ///更新发票号码
    UpdateInvoiceNumber: function () {
        var arrRows = $('#RentCollectDataGrid').datagrid('getChecked');
        if (arrRows.length === 0) {
            window.top.topeveryMessage.show("请选择一条需要更新发票号的记录!", "提示");
        } else {
            dialog = ezg.modalDialog({
                width: 340,
                height: 150,
                title: '更新发票号码',
                url: virtualDirName + 'RentCollect/UpdateInvoiceNumber?id=' + arrRows[0].id + "&invoiceNumber=" + arrRows[0].invoiceNumber
            });
        }
    },
    BatchDelete: function () {
        var arrRows = $('#RentCollectDataGrid').datagrid('getChecked');
        if (arrRows.length === 0) {
            window.top.topeveryMessage.show("请选择一条需要删除的记录!", "提示");
        } else {
            var url = virtualDirName + 'api/services/app/RentCollectW/DeleteRentCollectRecordAsync';
            deleteAjax(arrRows[0].id, "RentCollectDataGrid", url);
        }
    },
    Reset: function () {
        $("#contractNo").textbox("setValue", "");
        $("#houseDoorplate").textbox("setValue", "");
        $("#lesseeName").textbox("setValue", "");
        $("#propertyId").combobox("setValue", "");
        $("#IsHome").combobox("setValue", " ");
        $("#paymentId").combobox("setValue", "");
        $("#RentCollectDataGrid").datagrid("load");
    },
    RentExp: function () {
        var contractNo = $("#contractNo").textbox('getValue');
        var houseDoorplate = $("#houseDoorplate").textbox('getValue');
        var lesseeName = $("#lesseeName").textbox('getValue');
        var recordTimeQ = $("#RecordTimeQ").val();
        var houseManageId = $("#HouseManageId").combobox("getValue");
        var recordTimeZ = $("#RecordTimeZ").val();
        var isHome = $("#IsHome").combobox("getValue");
        var paymentId = $("#paymentId").combobox("getValue");
        var flag = contractNo + "&houseDoorplate=" + houseDoorplate + "&lesseeName="
            + lesseeName + "&RecordTimeQ=" + recordTimeQ + "&RecordTimeZ=" + recordTimeZ + "&houseManageId=" + houseManageId + "&isHome=" + isHome + "&paymentId=" + paymentId;
        //topevery.ajaxLoading();
        window.location.href = virtualDirName + "RentCollect/RentCollectExp?contractNo=" + flag;
        // topevery.ajaxLoadEnd();
    }
};
$(function () {
    var date = new Date();
    $("#RecordTimeQ").val(date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " 00:00:00");
    $("#RecordTimeZ").val(date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " 23:59:59");
    RentCollect.Initialize();
    $("#IsHome").combobox({
        editable: false, panelHeight: 'auto',
        data: [
            {
                "value": " ",
                "text": "--使用性质--",
                "selected": true
            },
            {
                "value": "1",
                "text": "住宅"
            }, {
                "value": "0",
                "text": "非住宅"
            }
        ]
    });
    bindDicToDrp("propertyId", "B34CFE85-FB80-4817-B660-B8DF27F8DC76", "--产权属性--", false, false);//产权属性
    if ($("#WorkstationDropDown").val()) {
        bindDropDown("HouseManageId", "Common/GetWorkstationBind", "--工作站--", false, false);
    } else {
        bindDropDown("HouseManageId", "Common/GetWorkstationBind", "--工作站--", false, true);
        $("#HouseManageId").combobox("readonly");
    }
    bindDicToDrp("paymentId", "AD33D5B6-42C0-4129-B501-BE6D748F6F7E", "--交租方式--", true, false);
    var j = 0;
    /*初始化*/
    $("#completed-search-btn").on("click", function () {
        $("#completed-search-list").slideToggle();
        j = j + 1;
        if (j % 2 !== 0) {
            $("#completed-search-btn").html("收起∧");
        } else {
            $("#completed-search-btn").html("更多∨");
        }
    });
});