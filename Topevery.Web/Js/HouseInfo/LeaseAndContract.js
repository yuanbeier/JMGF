$(function () {
    $("#viewTabs").tabs("add", {
        title: "分户平面图纸",
        index: 1,
        selected: false,
        href: virtualDirName + "House/HouseUnitDrawing?id=" + getRequest("id"),
        onLoad: function () {
            //$("#divFileUpload").hide();
            $.getScript(virtualDirName + "Js/HouseInfo/HouseUnitDrawing.js");
        }
    });
    $("#viewTabs").tabs("add", {
        title: "分户图片",
        index: 2,
        selected: false,
        href: virtualDirName + "House/HouseUnitImage?id=" + getRequest("id"),
        onLoad: function () {
            //$("#divFileUpload").hide();
            $.getScript(virtualDirName + "Js/HouseInfo/HouseUnitImage.js");
        }
    });
    LeaseAndContract.Initialize();
    //load分户信息
    topevery.ajax({
        type: "POST",
        url: "api/services/app/HouseUnitR/GetHouseUnitItemAsync",
        contentType: "application/json",
        data: topevery.extend({
            id: $("#id").val()
        })
    }, function (data) {
        if (data.success) {
            $("#housUnitform").form("load", data.result);
            //topevery.PicturesShow(data.result.id, 10, "Attachment", 30);
            $("#imgUrl").attr("src", data.result.qrCodeUrl + "&h=400&w=400");
            data.result.isHome === 1 ? $("#isHome").prop("checked", true) : $("#isHome").prop("checked", false);
            data.result.isTao === 1 ? $("#isTao").prop("checked", true) : $("#isTao").prop("checked", false);
            data.result.isRentable === 1 ? $("#isRentable").prop("checked", true) : $("#isRentable").prop("checked", false);
            data.result.isSwing === 1 ? $("#isSwing").prop("checked", true) : $("#isSwing").prop("checked", false);
            data.result.isRent === 1 ? $("#isRent").prop("checked", true) : $("#isRent").prop("checked", false);
            data.result.isPubRenHous === 1 ? $("#isPubRenHous").prop("checked", true) : $("#isPubRenHous").prop("checked", false);
            data.result.isLowRentHous === 1 ? $("#isLowRentHous").prop("checked", true) : $("#isLowRentHous").prop("checked", false);
        } else {
            alert("失败");
        }
    }, false);
    //load合同信息
    topevery.ajax({
        type: "POST",
        url: "api/services/app/ContractR/GetContractByUnitIdAsync",
        contentType: "application/json",
        data: topevery.extend({
            id: getRequest("id")
        })
    }, function (data) {
        if (data.success) {
            var result = data.result;
            if (result) {
                $("#name").html(result.name);
                $("#sexName").html(result.sexName);
                $("#dateBirth").html(topevery.dataTimeFormat(result.dateBirth));
                $("#certNo").html(result.certNo);
                $("#contactAddress").html(result.contactAddress);
                $("#contactNumber").html(result.contactNumber);
                $("#workUnits").html(result.workUnits);
                $("#familyMembersCount").html(result.familyMembersCount);
                $("#contractNo").html(result.contractNo);
                $("#signDate").html(topevery.dataTimeFormat(result.signDate));
                $("#currentRent").html(result.currentRent);
            }
        }
    }, false);
});
LeaseAndContract = {
    Initialize: function () {
        $("#LeaseAndContractDataGrid").datagrid({
            height: 500,
            idField: "id",
            fitColumns: true,
            nowrap: false,
            rownumbers: true, //行号
            pagination: true, //分页控件
            columns: [
                [
                    { field: "contractNo", title: "合同编号", width: 150, align: "center" },
                    { field: "lesseeName", title: "承租人", width: 80, align: "center" },
                    { field: "contactNumber", title: "联系电话", width: 100, align: "center" },
                    {
                        field: "rentStartTime", title: "承租开始时间", width: 100, align: "center", formatter: function (value) {
                            return topevery.dataTimeFormat(value);
                        }
                    },
                    {
                        field: "rentEndTime", title: "承租结束时间", width: 100, align: "center", formatter: function (value) {
                            return topevery.dataTimeFormat(value);
                        }
                    },
                    { field: "monthMoney", title: "月租金（元）", width: 100, align: "center" },
                    { field: "isRemove", title: "是否解除合同", width: 100, align: "center", formatter: topevery.checkFormat }
                ]
            ],
            loader: function (param, success, error) {
                topevery.ajax({
                    type: "POST",
                    url: "api/services/app/HouseRentApplyR/GetHouseRentApplyHisInfoAsync",
                    contentType: "application/json",
                    data: topevery.extend({
                        PageIndex: param.page,
                        PageCount: param.rows,
                        HouseUnitId: getRequest("id")
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
    }
}