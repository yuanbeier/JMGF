//将表单数据转为json
bindDicToDrp("PayType", "AD33D5B6-42C0-4129-B501-BE6D748F6F7E", "", true);
bindDicToDrp("ReduceType", "A7CD7C95-EA39-42A6-BBFB-DF0210C0E374", "--请选择--");
bindDicToDrp("RentType", "497E9547-0CBD-49EB-B556-BED08F4B5CF0", "--请选择--");
bindDicToDrp("ExpireHandle", "EC39DF03-EFAE-4F59-9ED7-A210F3F1913A", "--请选择--");
var grid;
TenantsSelectIndex = {
    ///加载列表数据-
    loadData: function () {
        topevery.ajax({
            type: "POST",
            url: "api/services/app/HouseRentApplyR/GetHousingAndTenantInfoAsync",
            contentType: "application/json",
            data: JSON.stringify({ id: $("#fromInstanceId").val() })
        }, function (row) {
            if (row.success) {
                var data = row.result;
                $("#LesseeInfoView").form("load", data);
                if (data.rentStartTime != null && data.rentStartTime!=="")
                    $("#RentStartTime").textbox('setValue',topevery.dataTimeFormat(data.rentStartTime));
                if (data.rentEndTime != null && data.rentEndTime !== "")
                    $("#RentEndTime").textbox('setValue',topevery.dataTimeFormat(data.rentEndTime));
                if (data.reduceStartTime != null && data.reduceStartTime !== "")
                    $("#ReduceStartTime").textbox('setValue',topevery.dataTimeFormat(data.reduceStartTime));
                if (data.reduceEndTime != null && data.reduceEndTime !== "")
                $("#ReduceEndTime").textbox('setValue',topevery.dataTimeFormat(data.reduceEndTime));
                topevery.PicturesShow(data.id, 1, "Attachment");
            } else {
                error();
            }
        }, true);
    }
};
$(function () {
    /*初始化*/
    TenantsSelectIndex.loadData();
});
