

(function ($, window) {

    function initWebUpload(item, options) {


        if (!WebUploader.Uploader.support()) {
            var error = "上传控件不支持您的浏览器！请尝试升级flash版本或者使用Chrome引擎的浏览器。<a target='_blank' href='http://se.360.cn'>下载页面</a>";
            if (window.console) {
                window.console.log(error);
            }
            $(item).text(error);
            return;
        }
        //创建默认参数
        var defaults = {
            auto: true,
            onAllComplete: function (event) { }, // 当所有file都上传后执行的回调函数
            onComplete: function (event) { }, // 每上传一个file的回调函数
            innerOptions: {},
            fileNumLimit: undefined, //验证文件总数量, 超出则不允许加入队列
            fileSizeLimit: undefined, //验证文件总大小是否超出限制, 超出则不允许加入队列。
            fileSingleSizeLimit: undefined, //验证单个文件大小是否超出限制, 超出则不允许加入队列
            PostbackHold: false
        };
        var opts = $.extend({},defaults, options);
        var hdFileData = options.hiddenInputVlaue;
        var target = $(item); //容器
        var pickerid = "";
        if (typeof guidGenerator36 != "undefined") //给一个唯一ID
            pickerid = guidGenerator36();
        else
            pickerid = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        var uploaderStrdiv = '<div class="webuploader">';
        if (opts.auto) {
            uploaderStrdiv =
                '<div id="Uploadthelist" class="uploader-list"></div>' +
                '<div class="btns">' +
                '<div id="' + pickerid + '">上传文件' + opts.accept.title + '</div>' +
                "</div>";
        } else {
            uploaderStrdiv =
                '<div  class="uploader-list"></div>' +
                '<div class="btns">' +
                '<div id="' + pickerid + '">上传文件</div>' +
                '<button class="webuploadbtn">开始上传</button>' +
                "</div>";
        }
  
        uploaderStrdiv += "</div>";
        target.append(uploaderStrdiv);

        var $list = target.find(".uploader-list"),
            $btn = target.find(".webuploadbtn"), //手动上传按钮备用
            state = "pending";


        var webuploaderoptions = $.extend({
            // swf文件路径
            swf: virtualDirName + "libs/webuploader-0.1.5/Uploader.swf",
            // 文件接收服务端。
            server: virtualDirName + "File/UploadFile",
            deleteServer: virtualDirName + "Home/DeleteFile",
            // 选择文件的按钮。可选。
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            pick: "#" + pickerid,
            //不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
            resize: false,
            fileNumLimit: opts.fileNumLimit,
            accept: opts.accept,
            fileSizeLimit: opts.fileSizeLimit,
            fileSingleSizeLimit: opts.fileSingleSizeLimit
        },
            opts.innerOptions);
        var uploader = WebUploader.create(webuploaderoptions);
       
      

        if (opts.auto) {
            uploader.on("fileQueued", function (file) {
                $list.append('<div id="' + $(item)[0].id + file.id + '" class="item">' +
                    '<span class="webuploadinfo">' + file.name + "</span>" +
                    '<span class="webuploadstate">正在上传...</span>' +
                    '<div class="webuploadDelbtn">删除</div><br />' +
                    "</div>");
                uploader.upload();
            });
        } else {
            uploader.on("fileQueued", function (file) { //队列事件
                $list.append('<div id="' + $(item)[0].id + file.id + '" class="item">' +
                    '<span class="webuploadinfo">' + file.name + "</span>" +
                    '<span class="webuploadstate">等待上传...</span>' +
                    '<div class="webuploadDelbtn">删除</div><br />' +
                    "</div>");
            });
        }


        uploader.on("uploadProgress", function (file, percentage) { //进度条事件
            var $li = target.find("#" + $(item)[0].id + file.id),
                $percent = $li.find(".progress .bar");

            // 避免重复创建
            if (!$percent.length) {
                $percent = $('<span class="progress">' +
                    '<span  class="percentage"><span class="text"></span>' +
                    '<span class="bar" role="progressbar" style="width: 0%">' +
                    "</span></span>" +
                    "</span>").appendTo($li).find(".bar");
            }

            $li.find("span.webuploadstate").html("上传中");
            $li.find(".text").text(Math.round(percentage * 100) + "%");
            $percent.css("width", percentage * 100 + "%");
        });
        uploader.on("uploadSuccess", function (file, response) { //上传成功事件
            if (response.Success === true) {
                uploader.removeFile(file);
                if (options.callback) {
                    var url = virtualDirName + 'Ashx/ThumbImage.ashx?FID=' + response.Result + '&W=80&H=80';
                    file.url = url;
                    file.fileId = response.Result;
                    switch (file.ext) {
                        case "doc":
                        case "docx":
                            file.url =virtualDirName +  "Images/Word.png";
                            break;
                        case "pdf":
                            file.url = virtualDirName + "Images/pdf.png";
                            break;
                        case "xls":
                        case "xlsx":
                            file.url = virtualDirName + "Images/Excel.png";
                            break;
                   }
                   var $inputHidden = target.next().next().find("input");
                   if ($inputHidden.val() === "") {
                       $inputHidden.val(file.fileId + "," + file.name);
                   } else {
                       $inputHidden.val($inputHidden.val() + ";" + file.fileId + "," + file.name);
                   }
                    var li = target.next().next().find("ul").clone().html();
                    li = li.replace("{imgUrl}", file.url).replace("{imgName}", file.name).replace("{imgName}", file.name)
                    .replace("{fileId}", file.fileId);
                    target.next().append(li);
          
                }
            } else {
                target.find("#" + $(item)[0].id + file.id).find("span.webuploadstate").html(response.message);
            }
          
        });

        uploader.on("uploadError", function (file) {
            target.find("#" + $(item)[0].id + file.id).find("span.webuploadstate").html("上传出错");
        });

        uploader.on("uploadComplete", function (file) { //全部完成事件
            target.find("#" + $(item)[0].id + file.id).find(".progress").fadeOut();

        });

        uploader.on("all", function (type) {
            if (type === "startUpload") {
                state = "uploading";
            } else if (type === "stopUpload") {
                state = "paused";
            } else if (type === "uploadFinished") {
                state = "done";
            }

            if (state === "uploading") {
                $btn.text("暂停上传");
            } else {
                $btn.text("开始上传");
            }
        });

        //删除时执行的方法
        uploader.on("fileDequeued", function (file) {
          
            $("#" + $(item)[0].id + file.id).remove();

        });

        //多文件点击上传的方法
        $btn.on("click", function () {
            if (state === "uploading") {
                uploader.stop();
            } else {
                uploader.upload();
            }
        });

        //删除
        $list.on("click", ".webuploadDelbtn", function () {

            var $ele = $(this);
            var id = $ele.parent().attr("id");
            var id = id.replace($(item)[0].id, "");
            var file = uploader.getFile(id);
            uploader.removeFile(file);
        });
        return uploader;
    }

    $.fn.powerWebUpload = function (options) {
        var ele = this;
        if (typeof WebUploader == "undefined") {
          return  initWebUpload(ele, options);
        } else {
            return initWebUpload(ele, options);
        }
    };

  

})(jQuery, window);

$(document).ready(function () {

    /**
     * 关闭方法
     */
    $(".uploadImg").on("click","a", function () {
        var $hiddenFile = $(this).parent().parent().parent().next().find("input");
        var files = $hiddenFile.val().split(';');
        var index = -1;
        for (var i = 0; i < files.length; i++) {
            if (files[i].indexOf($(this)[0].id)>-1) {
                index = i;
                break;
            }
        }
        if (index !== -1) {
            files.splice(index, 1);
            $hiddenFile.val(files.join(';'));
        }
        $(this).parent().parent().remove();
    });
});
