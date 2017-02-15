//将表单数据转为json
var grid;
var tenantTypelist;
var sexlist;
var certNamelist;
function loadData(param, success, error) {
    topevery.ajax({
        type: "POST",
        url: "api/services/app/lesseeInfoR/GetLesseeInfosAsync",
        contentType: "application/json",
        data: topevery.extend(topevery.form2Json("sumbitFrom"), {
            PageIndex: param.page,
            PageCount: param.rows
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
    Initialize: function() {
        grid = $('#TenantsSelectTable').datagrid({
            height: 350,
            idField: "id",
            striped: true,
            fitColumns: true,
            loadMsg: false,
            singleSelect: true,
            nowrap: false,
            loader: loadData,
            rownumbers: true, //行号
            pagination: true, //分页控件
            pageSize: 10,
            pageList: [10, 20, 50, 100],
            onLoadSuccess: function (data) {
                $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
            },
            showFooter: true,
            columns: [
                [
                    { title: '编号', field: 'id', width: '50', align: 'center'},
                    { title: '姓名', field: 'name', width: '80', align: 'center' },
                    {
                        title: '性别', field: 'sex', width: '40', align: 'center',
                        formatter: function (value) {
                            for (var i = 0; i < sexlist.length; i++) {
                                if (sexlist[i].Key === value) return sexlist[i].Value;
                            }
                            return value;
                        }
                    },
                    {
                        title: '证件类型', field: 'certName', width: '65', align: 'center',
                        formatter: function (value) {
                            for (var i = 0; i < certNamelist.length; i++) {
                                if (certNamelist[i].Key === value) return certNamelist[i].Value;
                            }
                            return value;
                        }
                    },
                    { title: '证件号码', field: 'certNo', width: '130', align: 'center' },
                    {
                        title: '租户类型', field: 'tenantType', width: '70', align: 'center',
                        formatter: function (value) {
                            for (var i = 0; i < tenantTypelist.length; i++) {
                                if (tenantTypelist[i].Key === value) return tenantTypelist[i].Value;
                            }
                            return value;
                        }
                    },
                    {
                        title: '出生日期',
                        field: 'dateBirth',
                        width: '80',
                        align: 'center' ,
                        formatter: function(value) {
                            return topevery.dataTimeFormat(value);
                        }
                    },
                    { title: '工作单位', field: 'workUnits', width: '80', align: 'center' },
                    { title: '联系地址', field: 'contactAddress', width: '80', align: 'center' },
                    { title: '联系号码', field: 'contactNumber', width: '80', align: 'center' },
                    //{ title: '目前租住', field: 'currentRent', width: '80', align: 'center' },
                     { title: '银行卡号', field: 'bankCardNo', width: '80', align: 'center' },
                    { title: '家庭成员', field: 'familyMembersCount', width: '80', align: 'center', hidden: true }
                ]
            ],
            onDblClickRow: TenantsSelectIndex.dbClick,
            toolbar: '#toolbar'
        });
        $(document).dequeue("datagrid0105");
    },
    ////双击事件
    dbClick: function(rowIndex, rowData) {
        var data = rowData;
        frameHelper.getDialogParentIframe().LeasingApplication.setValueName(data);
        frameHelper.getDialogParentIframe().dialog.dialog('close');
    },
    ///搜索
    loadInfo80: function() {
        $('#TenantsSelectTable').datagrid('load', { input: topevery.form2Json("sumbitFrom") }); //点击搜索
    },
    ///性别
    GetDropDownSex: function(guid) {
        topevery.ajax({
            type: "POST",
            url: "Common/GetDropDownList?guid=" + guid + "",
            contentType: "application/json"
        }, function(data) {
            if (data.success) {
                sexlist = data.rows;
                $(document).dequeue("datagrid0102");
            } else {
                error();
            }
        }, false);
    },
    ///证件类型
    GetDropDownCertName: function (guid) {
        topevery.ajax({
            type: "POST",
            url: "Common/GetDropDownList?guid=" + guid + "",
            contentType: "application/json"
        }, function (data) {
            if (data.success) {
                certNamelist = data.rows;
                $(document).dequeue("datagrid0103");
            } else {
                error();
            }
        }, false);
    },
    ///租户类型
    GetDropDownTenantType: function (guid) {
        topevery.ajax({
            type: "POST",
            url: "Common/GetDropDownList?guid=" + guid + "",
            contentType: "application/json"
        }, function (data) {
            if (data.success) {
                tenantTypelist = data.rows;
                $(document).dequeue("datagrid0104");
            } else {
                error();
            }
        }, false);
    }
}

function  binding() {
    bindDicToDrp("CertName", "D11CFDA8-992B-4A9A-81D3-7201BD4D6E4D", "--证件类型--");
    bindDicToDrp("TenantType", "7705DB66-07EB-4F3E-86F5-51A79663DF6A", "--租户类型--");
    for (var i = 0; i < $(".easyui-textbox").length; i++) {
        $("#" + $('.easyui-textbox').eq(i)[0].id + "").textbox({
            inputEvents: $.extend({}, $.fn.textbox.defaults.inputEvents, {
                keyup: function (event) {
                    if (event.keyCode === 13) {
                        TenantsSelectIndex.loadInfo80();
                    }
                }
            })
        });
    }
}

/*初始化*/
$(function () {
    $(document).queue("datagrid0101", function () { TenantsSelectIndex.GetDropDownSex("C8CEFBB2-6F98-4F70-8A47-932B9487FC37");  });
    $(document).queue("datagrid0102", function () { TenantsSelectIndex.GetDropDownCertName("D11CFDA8-992B-4A9A-81D3-7201BD4D6E4D");  });
    $(document).queue("datagrid0103", function () { TenantsSelectIndex.GetDropDownTenantType("7705DB66-07EB-4F3E-86F5-51A79663DF6A");  });
    $(document).queue("datagrid0104", function () { TenantsSelectIndex.Initialize();  });
    $(document).queue("datagrid0105", function () { binding();  });
    $(document).dequeue("datagrid0101");
});