
$(function () {

    $(".pending-table").datagrid({
        columns: [
            [
                { field: "id", checkbox: true, align: "center" },
                { field: "name", title: "姓名", width: 100, align: "center" },
                { field: "certNo", title: "证件编号", width: 60, align: "center" },
                { field: "certName", title: "证件名称", width: 100, align: "center" },
                { field: "workUnits", title: "工作单位", width: 100, align: "center" },
                { field: "contactAddress", title: "联系地址", width: 100, align: "center" }
                
            ]
        ],
        idField: "id",
        striped: true,
        fitColumns: true,
        loadMsg: "正在努力加载数据，请稍后...",
        singleSelect: true,
        nowrap: false,
        rownumbers: true,
        pagination: true,
        showFooter: true,
        toolbar: "#toolbar",
        loader: loadData,
        onLoadSuccess: function(data) {
            $(this).datagrid('doCellTip', { 'max-width': '400px', 'delay': 500 });
        }
    });

    function loadData(param, success, error) {
        //使用Toevery.API暂时有问题，待调整
        Topevery.API({
            type: "POST",
            api:virtualDirName+ "/api/services/app/LesseeInfoR/GetLesseeInfoPageList",
            contentType: "application/json",
            data: JSON.stringify({
                skipCount: param.page,
                maxResultCount: param.rows,
                sorting: null,
                filter: null
            }),
            callback: function (data) {
                if (data.success) {
                    success(data.result);
                } else {
                    error();
                }
            }
        });
        //$.ajax({
        //    type: "POST",            
        //    dataType: "json",
        //    contentType: "application/json",
        //    url: "/api/services/app/LesseeInfoR/GetLesseeInfoPageList",
        //    cache: false,
        //    data: JSON.stringify({
        //        skipCount: param.page,
        //        maxResultCount: param.rows,
        //        name: param.name,
        //        certNo:param.certNo,
        //        sorting: null,
        //        filter: null
        //    }),
        //    success: function (data) {
        //        if (data.success) {
        //            success(data.result);
        //        } else {
        //            error();
        //        }
        //    }
        //});
    }

    function search(){
        var data = {
            name: $("#txtName").val().trim(),
            certNo: $("#certNo").val().trim()
        };
        $(".pending-table").datagrid("reload",data);
    }
});