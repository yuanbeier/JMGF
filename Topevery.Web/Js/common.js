
/*
* 公共的JS
* 
*/


/**
 * 
 * @param {} btnid 控件Id
 * @param {} guid 字典项的命名空间ID
 * @param {} defaultText 默认显示的文字
 * @returns {} 
 */
function bindDicToDrp(btnid, guid, defaultText, required, lastDefault) {
    $("#" + btnid).combobox({
        editable: false,
        panelHeight: 'auto',
        panelMaxHeight:300,
        url: virtualDirName + "Common/DicBindToDrp?guid=" + guid + "",
        loadFilter: function (data) {
            var data = $.treeMap(data, function (row) {
                return {
                    value: row.Data.Key,
                    text: row.Data.Value
                };
            });
            //设置第一个值为默认值
            if (lastDefault) {
                data[0].selected = true;
            };
            // 添加空行
            if (defaultText !== "") {
                if ($.isArray(data)) {
                    data.splice(0, 0, { value: "", text: defaultText });
                }
            }
            return data;
        },
        required: required ? true : false
    });
}


/**
 * 获取所属区域
 * @param {} btnid 控件Id
 * @returns {} 
 */
function bindAreaToDrp(btnid) {
    $("#" + btnid).combobox({
        editable: false, panelHeight: 'auto',
        panelHeight: 'auto',
        panelMaxHeight: 300,
        loader: function (param, success, error) {
            topevery.ajax({
                type: "POST",
                url: "api/services/app/SysAreaR/GetAreaDtosAsync",
                contentType: "application/json",
                data: JSON.stringify({ ParentId: 1 })
            }, function (data) {
                if (data.success) {
                    var result = $.treeMap(data.result, function (row) {
                        return {
                            value: row.id,
                            text: row.name
                        };
                    });
                    if ($.isArray(result)) {
                        result.splice(0, 0, { value: "", text: "--请选择--" });
                    }
                    success(result);
                } else {
                    error();
                }
            }, false);
        }
    });
}

function bindDeptToDrp(array) {
    $("#" + array.btnid).combobox({
        editable: false,
        required: true,
        panelHeight: 'auto',
        panelMaxHeight: 300,
        data:[
                {
                    "value": 823,
                    "text": "公房管理中心"
                },      
                {
                    "value": 833,
                    "text": "历史街区"
                }
        ],
        onChange: function (newValue, oldValue) {
            if (newValue) {
                $("#" + array.btnid2).combobox({
                    required: true,
                    loader: function (param, success, error) {
                        topevery.ajax({
                            type: "POST",
                            url: "api/services/app/DeptR/GetDeptInfo",
                            contentType: "application/json",
                            data: JSON.stringify({ ParentId: newValue })
                        }, function (data) {
                            if (data.success) {
                                var result = $.treeMap(data.result, function (row) {
                                    return {
                                        value: row.id,
                                        text: row.name
                                    };
                                });
                                //if ($.isArray(result)) {
                                //    result.splice(0, 0, { value: "", text: "--请选择--" });
                                //}
                                success(result);
                            } else {
                                error();
                            }
                        }, false);
                    }
                });
            }
        }
    });
}

function bindValueTextDrp(arg){
    $("#" + arg.bindId).combobox({
        editable: arg.editable||false,
        required: arg.required,
        url: virtualDirName + arg.url,
        panelHeight: 'auto',
        panelMaxHeight: 300,
        loadFilter: function (data) {
            var result = data.result;
            if (arg.lastDefault) {
                result[0].selected = true;
            }
            if (arg.defaultText) {
                if ($.isArray(result)) {
                    result.splice(0, 0, { value: "", text: arg.defaultText });
                }
            }
            return result;
        }
    });
}


///扩展方法

function bindDropDown(btnid, url, defaultText, required, lastDefault) {
    $("#" + btnid).combobox({
        editable: false,
       // panelHeight: 'auto',
        panelMaxHeight: 300,
        url: virtualDirName + url,
        loadFilter: function (data) {
            var data = $.treeMap(data, function (row) {
                return {
                    value: row.Data.Key,
                    text: row.Data.Value
                };
            });
            if (lastDefault) {
                data[0].selected = true;
            };
            // 添加空行
            if (defaultText !== "") {
                if ($.isArray(data)) {
                    data.splice(0, 0, { value: "", text: defaultText });
                }
            }
            return data;
        },
        required: required ? true : false
    });
}


///扩展方法  取枚举数据

function bindDropDownEunm(btnid, url, defaultText, required, lastDefault) {
    $("#" + btnid).combobox({
        editable: false,
        panelHeight: 'auto',
        panelMaxHeight: 300,
        url: virtualDirName + url,
        loadFilter: function (data) {
            var data = $.treeMap(data, function (row) {
                return {
                    value: row.Key,
                    text: row.Value
                };
            });
            if (lastDefault) {
                data[0].selected = true;
            };
            // 添加空行
            if (defaultText !== "") {
                if ($.isArray(data)) {
                    data.splice(0, 0, { value: "", text: defaultText });
                }
            }
            return data;
        },
        required: required ? true : false
    });
}
/**
 * 删除一条或多条数据
 * @param {} ids
 * @param {} tableId datagridId
 * @param {} url 应用层接口地址 
 * @returns {} 
 */
function deleteAjax(ids, tableId, url) {
    if (!ids) {
        var rows = $("#" + tableId).datagrid("getChecked");
        if (rows.length === 0) {
            window.top.topeveryMessage.show("请选择一条需要删除的记录!", "提示");
            return;
        };
        var t = [];
        $.each(rows, function () {
            t.push(this.id);
        });
        ids = t.join();
    };
    topeveryMessage.confirm(function (r) {
        if (r) {
            $.ajax({
                type: 'POST',
                url: url,
                data: JSON.stringify({ "ids": ids }),
                contentType: "application/json",
                Type: "JSON",
                success: function (row) {
                    if (row.success) {
                        if (row.result) {//特殊返回值
                            if (row.result.isSuccess) {
                                $('#' + tableId).datagrid('clearSelections');
                                $("#" + tableId).datagrid('reload');
                                window.top.topeveryMessage.show("删除成功");
                            }
                            else {
                                window.top.topeveryMessage.show(row.result.message);
                            }
                        }
                        else {
                            $('#' + tableId).datagrid('clearSelections');
                            $("#" + tableId).datagrid('reload');
                            window.top.topeveryMessage.show("删除成功");
                        }
                    }
                }
            });
        }
    });
}

//根据form2Json对象转换成get链接
function GetUrlByform2Json() {
    var arr = topevery.form2Json("selectFrom");
    var url = new Array("?1=1");
    for (var i in arr) {
        url.push(i + "=" + arr[i]);
    }
    return url.join("&");
};

objectExtend = {
    ///弹出查看租户明细
    LesseeInfoOpen: function(id) {
        var dialog = ezg.modalDialog({
            width: 730,
            height: 500,
            title: '查看租户明细',
            url: virtualDirName + 'LesseeInfo/ToView?id=' + id + ''
        });
    },
    ///合同查看
    dbClick: function(id) {
        ezg.modalDialog({
            width: 1200,
            height: 600,
            title: '合同查看',
            url: virtualDirName + 'ContractMent/ContractToView?Id=' + id
        });
    },
    ///房屋页面
    HouseBan: function(id) {
        ezg.modalDialog({
            width: 1200,
            height: 460,
            title: '房屋楼栋信息',
            url: virtualDirName + "House/HouseBanView?view=1&id=" + id
        });
    }
}

///首字母转大写
function UpperFirstLetter(str) {
    return str.replace(/\b\w+\b/g, function (word) {
        return word.substring(0, 1).toUpperCase() + word.substring(1);
    });
}

///datagrid页脚内容调整
function DataGridFooter(data) {
    var rows = [];
    var footer = [
        data.result.rows[data.result.rows.length - 1]
    ];
    for (var i = 0; i < data.result.rows.length - 1; i++) {
        rows.push(data.result.rows[i]);
    };
    return { "rows": rows, "footer": footer };
}

function DataGridFooterList(data) {
    var rows = [];
    var footer = [
        data.result[data.result.length - 1]
    ];
    for (var i = 0; i < data.result.length - 1; i++) {
        rows.push(data.result[i]);
    };  
    return { "rows": rows, "footer": footer };
   
}

////下拉 切换
//    var j = 0;
//    /*初始化*/
//$("#completed-search-btn").on("click", function() {
//    $("#completed-search-list").slideToggle();
//    j = j + 1;
//    if (j % 2 !== 0) {
//        $("#completed-search-btn").html("收起∧");
//    } else {
//        $("#completed-search-btn").html("更多∨");
//    }
//});


function  BindingWorkstation() {
    if ($("#WorkstationDropDown").val()) {
        bindDropDown("HouseManageId", "Common/GetWorkstationBind", "--工作站--", false, false);
    } else {
        bindDropDown("HouseManageId", "Common/GetWorkstationBind", "--工作站--", false, true);
        $("#HouseManageId").combobox("readonly");
    }
}