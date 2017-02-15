/// <reference path="D:\192.168.1.250\江门市\Code\JMGF\Topevery.Web\print/非住宅房屋租赁合同2015版.html" />
/// <reference path="D:\192.168.1.250\江门市\Code\JMGF\Topevery.Web\print/非住宅房屋租赁合同2015版.html" />
/// <reference path="D:\192.168.1.250\江门市\Code\JMGF\Topevery.Web\print/非住宅房屋租赁合同2015版.html" />
//将表单数据转为json
var grid;
var leaseReviewObjet = null;
var handleGenContract;
var isPrint = 1;
var IsPubRenHous;
var IsLowRentHous;
var contractId;
function loadData(param, success, error) {
    topevery.ajax({
        type: "POST",
        url: "api/services/app/HouseRentApplyR/GetWorkflowInstanceInfo",
        contentType: "application/json",
        data: JSON.stringify({
            FlowInstanceId: $("#workFlowInstanceId").val(),
            ModuleType: 1
        })
    }, function (data) {
        if (data.success) {
            success(data.result);
        } else {
            error();
        }
    }, false);
};

TenantsSelectIndex = {
    ///加载列表数据-
    Initialize: function () {
        grid = $('#ProcessViewTable').datagrid({
            height: 300,
            striped: true,
            fitColumns: true,
            loadMsg: false,
            singleSelect: true,
            nowrap: true,
            loader: loadData,
            // rownumbers: true, //行号
            // pagination: true, //分页控件
            pageSize: 10,
            pageList: [10, 20, 50, 100],
            showFooter: true,
            onLoadSuccess: function (data) {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
            },
            columns: [
                [
                    { title: '环节名称', field: 'linkName', width: '120', align: 'center' },
                    { title: '经办人', field: 'agent', width: '100', align: 'center' },
                    {
                        title: '办理时间', field: 'handleTime', width: '150', align: 'center',
                        formatter: function (value) {
                            return topevery.dataTimeFormatTT(value);
                        }
                    },
                   { title: '办理意见', field: 'handleOpinion', width: '100', align: 'center' },
                    {
                        title: '相关附件',
                        field: 'fileRDto',
                        width: '150',
                        align: 'center',
                        formatter: function (data, row, index) {
                            return topevery.ProcessAttachment(data);
                        }
                    }
                ]
            ]
        });
    },
    ///办理提交
    LeaseReviewSave: function (type) {
        if (handleGenContract === true) {
            if ($("#LeaseReviewContr").form('validate') === false) {
                $("#MinorRepairTabs").find("li")[1].click();
                window.top.topeveryMessage.show("请补录合同相关的信息！");
                return;
            } else {
                if ($("#RentStartTime").val() == null || $("#RentStartTime").val() === "" || $("#RentStartTime").val() === undefined) {
                    window.top.topeveryMessage.show("租赁起始日期不能为空！");
                    return;
                }
                if ($("#RentEndTime").val() == null || $("#RentEndTime").val() === "") {
                    window.top.topeveryMessage.show("租赁结束日期不能为空！");
                    return;
                }
                if ($('#ReduceType').combobox('getValue') !== "") {
                    if ($("#ReduceStartTime").val() == null || $("#ReduceStartTime").val() === "") {
                        window.top.topeveryMessage.show("减免日期起不能为空！");
                        return;
                    }
                    if ($("#ReduceEndTime").val() == null || $("#ReduceEndTime").val() === "") {
                        window.top.topeveryMessage.show("减免日期止不能为空！");
                        return;
                    }
                }
            }
        }
        leaseReviewObjet = topevery.form2Json("LeaseReviewContr");
        leaseReviewObjet["RentStartTime"] = $("#RentStartTime").val();
        leaseReviewObjet["RentEndTime"] = $("#RentEndTime").val();
        leaseReviewObjet["ReduceStartTime"] = $("#ReduceStartTime").val();
        leaseReviewObjet["ReduceEndTime"] = $("#ReduceEndTime").val();
        if (isPrint === 0) {
            if ($("input[name='IdFilehiddenFile']").val() === "") {
                window.top.topeveryMessage.show("请上传租赁审批表！");
                return;
            }
        }
        topevery.ajax({
            type: "POST",
            url: "api/services/app/HouseRentApplyW/AddWfInstanceLink",
            contentType: "application/json",
            data: topevery.extend(leaseReviewObjet, {
                ActivityInstanceId: $("#actInstanceId").val(),
                Content: $("#Content").val(),
                FileId: $("input[name='IdFilehiddenFile']").val(),
                FromInstanceId: $("#fromInstanceId").val(),
                HandleGenContract: handleGenContract,
                HouseId: $("#HouseId").val(),
                MonthMoney: $("#MonthMoneys").numberbox('getValue')
            })
        }, function (data) {
            if (data.success) {
                var id = data.result.id;
                window.top.topeveryMessage.show("办理成功");
                window.location = virtualDirName + 'Home/TodoLists';
                if (type === "print") {
                    if (IsPubRenHous === 1 || IsLowRentHous === 1) {
                        window.open(virtualDirName + "PrintRelevant/LowRentHousingContract?id=" + id);
                    } else {
                        if ($("#UsePropertyId").html() === "住宅") {
                            window.open(virtualDirName + "PrintRelevant/HousingContract?id=" + id);
                        } else if ($("#UsePropertyId").html() === "") {
                        } else {
                            window.open(virtualDirName + "PrintRelevant/RegardsTheContract?id=" + id);
                        }
                    }
                }
            } else {
                error();
            }
        }, true);
    },
    //作废
    Cancellation: function () {
        topeveryMessage.confirm(function (r) {
            if (r) {
                topevery.ajax({
                    type: "POST",
                    url: "api/services/app/HouseRentApplyW/AddWfInstanceLink",
                    contentType: "application/json",
                    data: topevery.extend(leaseReviewObjet, {
                        ActivityInstanceId: $("#actInstanceId").val(),
                        Content: $("#Content").val(),
                        FileId: $("input[name='IdFilehiddenFile']").val(),
                        FromInstanceId: $("#fromInstanceId").val(),
                        HandleGenContract: false,
                        HouseId: $("#HouseId").val(),
                        MonthMoney: $("#MonthMoneys").numberbox('getValue'),
                        Obsolete:true
                    })
                }, function (data) {
                    if (data.success) {
                        window.top.topeveryMessage.show("操作成功!");
                        window.location = virtualDirName + 'Home/TodoLists';
                    } else {
                        error();
                    }
                }, true);
            }
        }, "", "您确认作废当前业务吗?");
    },
    PrintToView: function () {
        var id = contractId;
        if (IsPubRenHous === 1 || IsLowRentHous === 1) {
            window.open(virtualDirName + "PrintRelevant/LowRentHousingContract?id=" + id);
        } else {
            if ($("#UsePropertyId").html() === "住宅") {
                window.open(virtualDirName + "PrintRelevant/HousingContract?id=" + id);
            } else if ($("#UsePropertyId").html() === "") {


            } else {
                window.open(virtualDirName + "PrintRelevant/RegardsTheContract?id=" + id);
            }
        }
    },
    ///获取基本信息，赋值到文本框
    loadData: function () {
        topevery.ajax({
            type: "POST",
            url: "api/services/app/HouseRentApplyR/GetHousingAndTenantInfoAsync",
            contentType: "application/json",
            data: JSON.stringify({ id: $("#fromInstanceId").val() })
        }, function (row) {
            if (row.success) {
                var data = row.result;
                for (var j in data) {
                    $("#" + UpperFirstLetter(j) + "").html(data[j]);
                }
                $("#LesseeId").val(data.id);
                $("#Name").html(data.name);
                $("#Sex").html(data.sexName);
                $("#CertNo").html(data.certNo);
                $("#ContactAddress").html(data.contactAddress);
                $("#ContactNumber").html(data.contactNumber);
                $("#Remark").html(data.remark);
                $("#WorkUnits").html(data.workUnits);
                $("#familyMembersCount").html(data.familyMembersCount);//data.familyMembersCount + 1后台已加1
                $("#DateBirth").html(topevery.dataTimeFormat(data.dateBirth));
                $("#HouseNo").html(data.houseNo);
                $("#RentRange").html(data.rentRange);
                $("#BuildStructureName").html(data.buildStructureName);
                $("#UsePropertyId").html(data.usePropertyName);
                $("#HouseDoorplate").html(data.houseDoorplate);
                $("#MetRentArea").html(data.metRentArea);
                $("#PayType").html(data.payTypeName);
                $("#BankCardNo").html(data.bankCardNo);
                $("#MonthMoney").html(data.monthMoney);
                $("#MonthMoneys").textbox('setValue', data.monthMoney);
                $("#CollectMoney").textbox('setValue', data.monthMoney);
                IsPubRenHous = data.isPubRenHous;
                IsLowRentHous = data.isLowRentHous;
                var array = {};
                for (var h in data) {
                    array["" + UpperFirstLetter(h) + ""] = data[h];
                };
                $("#LeaseReviewContr").form("load", array);

                $("#RentStartTime").val(topevery.dataTimeFormat(array.RentStartTime));
                $("#RentEndTime").val(topevery.dataTimeFormat(array.RentEndTime));
                $("#ReduceStartTime").val(topevery.dataTimeFormat(array.ReduceStartTime));
                $("#ReduceEndTime").val(topevery.dataTimeFormat(array.ReduceEndTime));


                $("#Name").click(function () {
                    if (data.lesseeId != null && data.lesseeId !== "") {
                        objectExtend.LesseeInfoOpen(data.lesseeId);
                    }
                });
                $("#HouseNo").click(function () {
                    if (data.houseId != null && data.houseId !== "") {
                        objectExtend.HouseBan(data.houseId);
                    }
                });

                $("#Name")[0].title = data.name;
                $("#Sex")[0].title = data.sexName;
                $("#CertNo")[0].title = data.certNo;
                $("#ContactAddress")[0].title = data.contactAddress;
                $("#ContactNumber")[0].title = data.contactNumber;
                $("#WorkUnits")[0].title = data.workUnits;
                $("#familyMembersCount")[0].title = data.familyMembersCount;
                $("#DateBirth")[0].title = topevery.dataTimeFormat(data.dateBirth);
                $("#HouseNo")[0].title = data.houseNo;
                $("#RentRange")[0].title = data.rentRange;
                $("#BuildStructureName")[0].title = data.buildStructureName;
                $("#UsePropertyId")[0].title = data.usePropertyName;
                $("#HouseDoorplate")[0].title = data.houseDoorplate;
                $("#MetRentArea")[0].title = data.metRentArea;
                $("#PayType")[0].title = data.payTypeName;
                $("#BankCardNo")[0].title = data.bankCardNo;
                $("#MonthMoney")[0].title = data.monthMoney;

                contractId = data.contractId;
                if (IsPubRenHous === 1 || IsLowRentHous === 1) {
                    $("#prints").attr("href", virtualDirName + "PrintRelevant/LowRentHousingContract?id=" + contractId + "");
                    //window.open(virtualDirName + "PrintRelevant/LowRentHousingContract?id=" + contractId);
                } else {
                    if (data.usePropertyName === "住宅") {
                        $("#prints").attr("href", virtualDirName + "PrintRelevant/HousingContract?id=" + contractId + "");
                    } else if (data.usePropertyName === "") {
                        $("#prints").hide();
                    } else {
                        $("#prints").attr("href", virtualDirName + "PrintRelevant/RegardsTheContract?id=" + contractId + "");
                    }
                }
                $("#HouseId").val(data.houseId);
                try {
                    topevery.initmap({
                        mapid: "allmap",
                        searchbtn: "btnMapSearch",
                        searchkey: "suggestId",
                        y: data.latitude,
                        x: data.longitude,
                        left: 150,
                        top: 150,
                        islook: true
                    });
                } catch (e) {

                }

            } else {
                error();
            }
        }, true);

    }
};
$(function () {
    /*初始化*/
    TenantsSelectIndex.Initialize();
    Initializecc($("#actInstanceId").val());
    TenantsSelectIndex.loadData();
    bindDicToDrp("ReduceType", "A7CD7C95-EA39-42A6-BBFB-DF0210C0E374", "--请选择--");
    bindDicToDrp("RentType", "497E9547-0CBD-49EB-B556-BED08F4B5CF0", "--请选择--");
    bindDicToDrp("CreditCard", "8F746198-36E5-49B7-8929-6BFE6C51431B", "", false);
    bindDicToDrp("ExpireHandle", "EC39DF03-EFAE-4F59-9ED7-A210F3F1913A", "");
    $('#ReduceType').combobox({
        onChange: function () {
            rentcheng();
        }
    });
});
///获取办理信息
function Initializecc(id) {
    topevery.ajax({
        type: "POST",
        url: "api/services/app/HouseRentApplyR/GetHouseRentApplyInfo",
        contentType: "application/json",
        data: JSON.stringify({
            "ActivityInstanceId": id,
            "HouseRentApplyId": "",
            "HouseId": $("#houseIds").val()
        })
    }, function (data) {
        if (data.success) {
            ListOfAssignment(data.result);
        } else {
            error();
        }
    }, false);
}
///给办理信息赋值
function ListOfAssignment(data) {

    $("#InUserName").html("[" + data.inUserName + "]" + topevery.dataTimeFormatTT(data.inDate));
    $("#ComponentOpinion").html(data.componentOpinion);
    $("#CurrentLink").html(data.currentLink);
    $("#NextLink").html(data.nextLink);
    $("#ReceiveObject").html(data.receiveObject);
    $("#Timeout").html(data.timeout);

    $("#ComponentOpinion")[0].title = data.componentOpinion;
    $("#InUserName")[0].title = "[" + data.inUserName + "]" + topevery.dataTimeFormatTT(data.inDate);
    $("#CurrentLink")[0].title = data.currentLink;
    $("#NextLink")[0].title = data.nextLink;
    $("#ReceiveObject")[0].title = data.receiveObject;
    $("#Timeout")[0].title = data.timeout;

    handleGenContract = data.isPrint;
    if (data.isPrint === true) {
        $("#attachment").hide();
        $("#HandleAuthority").hide();
        $("#print").show();
        $("#prints").show();
    } else {
        $("#HandleAuthority").show();
        $("#attachment").show();
        $("#prints").hide();
        isPrint = 0;
        $("#print").hide();
        $($("#MinorRepairTabs").find("li")[1]).hide();
    }
}

///首字母转大写
function UpperFirstLetter(str) {
    return str.replace(/\b\w+\b/g, function (word) {
        return word.substring(0, 1).toUpperCase() + word.substring(1);
    });
}
function rentcheng() {
    var monthMoney = $("#MonthMoneys").textbox('getValue');
    if ($('#ReduceType').combobox('getText') === "低收入家庭证（50%）") {
        $("#ReduceMoney").textbox('setValue', monthMoney * 0.5);
        $("#CollectMoney").textbox('setValue', monthMoney * 0.5);
    } else if ($('#ReduceType').combobox('getText') === "--请选择--") {
        $("#ReduceMoney").textbox('setValue', 0);
        $("#CollectMoney").textbox('setValue', monthMoney);
        $("#ReduceEndTime").val("");
        $("#ReduceStartTime").val("");
    } else {
        $("#ReduceMoney").textbox('setValue', monthMoney);
        $("#CollectMoney").textbox('setValue', 0);
    }
}