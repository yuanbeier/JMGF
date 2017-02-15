///保存数据ajax请求

    var $grid, $dialog;
    var submitFormEdit = function(dialog, grid, type) {
        if ($("#PermanentStaffEdit").form('validate') === false) {
            return;
        } else {
            submitCallback(type);
            $grid = grid, $dialog = dialog;
        }
    };
    var submitCallback = function(type) {
        var array = ezg.serializeObject($('form'));
        $.ajax({
            type: 'POST',
            url: virtualDirName + 'api/services/app/PermanentStaffW/EditPermanentStaffAsync',
            data: JSON.stringify(array),
            cache: false,
            contentType: "application/json",
            Type: "JSON",
            success: function (row) {
                $grid.datagrid('reload');
                $dialog.dialog('destroy');
                $dialog.dialog('close');
                $("#PermanentStaffTable").datagrid('reload');
            }
        });
    };
 function Initialize (id) {
     $.ajax({
         type: 'POST',
         url: virtualDirName + 'PermanentStaff/GetOne',
         data: JSON.stringify({ id: id }),
         cache: false,
         contentType: "application/json",
         Type: "JSON",
         success: function (row) {
             $('#PermanentStaffEdit').form('load', row);
         }
     });
};
 $(function () {
    Initialize(1);
})