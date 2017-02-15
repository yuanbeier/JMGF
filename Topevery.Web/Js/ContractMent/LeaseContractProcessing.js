//将表单数据转为json
var grid;
var dialog10;
var tenantTypelist;
function loadData(param, success, error) {
    topevery.ajax({
        type: "POST",
        url: "api/services/app/ContractR/GetLeaseContractExpiresListAsync",
        contentType: "application/json",
        data: topevery.extend(topevery.form2Json("sumbitFrom"), {
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
    }, false);
};
LeaseContract = {
    ///加载列表数据-
    Initialize: function () {
        $("#Day").textbox('setValue', "30");
        grid = $('#LeaseContractProcessingTable').datagrid({
            height: 480,
            idField: "id",
            striped: true,
            fitColumns: true,
            fit:true,
            singleSelect: false,
            nowrap: false,
            loader: loadData,
            rownumbers: true, //行号
            pagination: true, //分页控件
            pageSize: 10,
            pageList: [10, 20, 50, 100],
            showFooter: true,
            onLoadSuccess: function (data) {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
            },
            columns: [
                [
                    { field: "id", checkbox: true },
                    {
                        field: "contractNo", title: "合同编号", width: 90, align: "center", formatter: function (value, row, index) {
                            if (row.id !== 0) {
                                return "<a href='#' onclick='objectExtend.dbClick(" + row.id + ")'>" + value + "</a>";
                            } else {
                                return "";
                            }
                        }, sortable: true
                    },
                    {
                        field: "lesseeName", title: "承租人", width: 80, align: "center",
                        formatter: function (value, row, index) {
                            if (row.lesseeId !== 0) {
                                return "<a href='#' onclick='objectExtend.LesseeInfoOpen(" + row.lesseeId + ")'>" + value + "</a>";
                            } else {
                                return "";
                            }
                        }
                    },
                    {
                        field: "houseDoorplate", title: "房屋门牌", width: 120, align: "center", formatter: function (value, row, index) {
                            if (value !== null) {
                                return "<a href='#' onclick='objectExtend.HouseBan(" + row.houseId + ")'>" + value + "</a>";
                            } else {
                                return "";
                            }
                        }
                    },
                    { field: "payTypeName", title: "交租方式", width: 70, align: "center" },
                    { field: "certName", title: "证件名称", width: 70, align: "center" },
                    { field: "certNo", title: "证件号码", width: 100, align: "center", sortable: true },
                    { field: "rentRange", title: "租用范围", width: 100, align: "center" },
                    { field: "rentMargin", title: "保证金", width: 100, align: "center", sortable: true },
                    {
                        field: "rentStartTime",
                        title: "租用期限起",
                        width: 100,
                        align: "center",
                        formatter: function(value) {
                            return topevery.dataTimeFormat(value);
                        }, sortable: true
                    },
                    {
                        field: "rentEndTime",
                        title: "租用期限止",
                        width: 100,
                        align: "center",
                        formatter: function(value) {
                            return topevery.dataTimeFormat(value);
                        }, sortable: true
                    },
                    {
                        field: "day",
                        title: "离到期日期",
                        width: 100,
                        align: "center",
                        formatter: function(value) {
                            return value;
                        }, sortable: true
                    }
                ]
            ],
            onDblClickRow: LeaseContract.dbClick,
            toolbar: '#toolbarWrap'
        });
        for (var i = 0; i < $(".easyui-textbox").length; i++) {
            $("#" + $('.easyui-textbox').eq(i)[0].id + "").textbox({
                inputEvents: $.extend({}, $.fn.textbox.defaults.inputEvents, {
                    keyup: function(event) {
                        if (event.keyCode === 13) {
                            LeaseContract.loadInfo80();
                        }
                    }
                })
            });
        };
        bindDropDown("HouseManageId", "Common/GetWorkstationBind", "--工作站--", false);
    },
    ///搜索
    loadInfo80: function() {
        $('#LeaseContractProcessingTable').datagrid('load', { input: topevery.form2Json("sumbitFrom") }); //点击搜索
    },
    ///批量修改到期日期
    SaveData: function() {
        var array = $('#LeaseContractProcessingTable').datagrid('getSelections');
        if (array.length === 0) {
            $.messager.alert('提示', '请选择一条合同记录!', 'info');
        } else {
            var idList = "";
            for (var i = 0; i < array.length; i++) {
                idList += array[i].id + ",";
            }
            dialog10 = ezg.modalDialog({
                width: 500,
                height: 300,
                title: '批量修改到期日期',
                url: virtualDirName + "ContractMent/ModificationDateView?input=" + idList,
                buttons: [
                ]
            });
        }
    }
}
///初始化
$(function() {
    $(document).queue("datagrid0101", function () { LeaseContract.Initialize();});
    $(document).dequeue("datagrid0101");
});
