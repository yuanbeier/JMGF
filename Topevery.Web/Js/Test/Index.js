var DirectoryManageList;
$(function () {
    /*
      by 贺黎亮 2016-09-19创建
*/
    DirectoryManageList = TopeveryBase.extend({
        /*新增修改*/
        openDialog: function (options, obj) {
            if (options == null) {
                options = {};
            }
            options.callback = function () {
                new DirectoryManageList().initGrid({});
            }
            options.subcallback = "DirectoryManage.submit";
            this.base(options, obj);
        }
    });

    new DirectoryManageList().initGrid({});
    bindDicToDrp("TenantType", "7705DB66-07EB-4F3E-86F5-51A79663DF6A", "", false, false);
    bindDropDown("HouseManageId", "Common/GetWorkstationBind", "", false);
});
