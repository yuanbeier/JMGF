
///闭包函数
LogManagement = {
    loadData: function () {
        topevery.ajax({
            type: "POST",
            url: "api/services/app/WebLog/GetLatestWebLogs",
            contentType: "application/json"
        }, function (data) {
            if (data.success) {
                var logs = LogManagement.getFormattedLogs(data.result.latesWebLogLines);
                $('#WebSiteLogsContent').html(logs);
            } else {
                error();
            }
        }, true);
    },
    ///下载日志文件
    GiveloadWebLogs: function () {
        window.location.href = virtualDirName + "File/DownloadTempFile";
    },
    /// 刷新数据
    Select: function () {
        LogManagement.loadData();
    },
    ///字符装换
    getFormattedLogs: function (logLines) {
        var resultHtml = '';
        for (var i = logLines.length-1; i > 0; i--) {
            var logName = logLines[i].split(' ')[0];
            var logLine = logLines[i];
            switch (logName) {
                case "DEBUG":
                    resultHtml += "<span class=\"label label-default\">DEBUG</span>" + logLine.split(logName)[1] + "<br><br>";
                case "INFO":
                    resultHtml += "<span class=\"label label-info\">INFO</span>" + logLine.split(logName)[1] + "<br><br>";
                case "WARN":
                    resultHtml += "<span class=\"label label-warning\">WARN</span>" + logLine.split(logName)[1] + "<br><br>";
                case "ERROR":
                    resultHtml += "<span class=\"label label-danger\">ERROR</span>" + logLine.split(logName)[1] + "<br><br>";
                case "FATAL":
                    resultHtml += "<span class=\"label label-danger\">FATAL</span>" + logLine.split(logName)[1] + "<br><br>";
                default:
            }
        }
        //});
        return resultHtml;
    }
}
///初始化数据
$(function () {
    LogManagement.loadData();
})