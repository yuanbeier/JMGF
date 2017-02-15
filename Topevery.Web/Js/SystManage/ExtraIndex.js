var ExtraIndex = {
    ///批量生成租户二维码
    Lessee: function () {
        if (top.confirm('您确定要批量生成租户二维码？')) {
            topevery.ajax({
                type: "POST",
                url: "api/services/app/LesseeInfoW/BatchCreateQRCodeForLessInfoAsync",
                contentType: "application/json",
                data: null
            }, function (data) {
                if (data.success) {
                    top.message("生成成功");
                }
            }, true);
        }
    },
    ///批量生成楼栋二维码
    HouseBan: function () {
        if (top.confirm('您确定要批量生成楼栋二维码？')) {
            topevery.ajax({
                type: "POST",
                url: "api/services/app/HouseBanW/BatchCreateQRCodeForHouseBanAsync",
                contentType: "application/json",
                data: null
            }, function (data) {
                if (data.success) {
                    top.message("生成成功");
                }
            }, true);
        }
    },
    ///批量生成分户二维码
    HouseUnit: function () {
        if (top.confirm('您确定要批量生成分户二维码？')) {
            topevery.ajax({
                type: "POST",
                url: "api/services/app/HouseUnitW/BatchCreateQRCodeForHouseUnitAsync",
                contentType: "application/json",
                data: null
            }, function (data) {
                if (data.success) {
                    top.message("生成成功");
                }
            }, true);
        }
    },
    ///批量生成合同二维码
    Contract: function () {
        if (top.confirm('您确定要批量生成合同二维码？')) {
            topevery.ajax({
                type: "POST",
                url: "api/services/app/ContractW/BatchCreateQRCodeForContractAsync",
                contentType: "application/json",
                data: null
            }, function (data) {
                if (data.success) {
                    top.message("生成成功");
                }
            }, true);
        }
    },

    ///导入房屋平面图纸
    PlaneDrawing: function () {
        if (top.confirm('您确定要导入房屋平面图纸？')) {
            var imagePath = $('#ImagePath').val();
            if (imagePath == '')
            {
                top.alert('请输入要导入的房屋平面图纸路径！');
                return;
            }

        }
    }
};
