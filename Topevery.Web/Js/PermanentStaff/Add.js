///保存数据ajax请求

    var $grid, $dialog;
    var submitFormAdd = function(dialog, grid, type) {
        if ($("#PermanentStaffAdd").form('validate') === false) {
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
            url:virtualDirName+ 'api/services/app/PermanentStaffW/AddPermanentStaffAsync',
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
