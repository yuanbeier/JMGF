<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="TestDemo.aspx.cs" Inherits="Topevery.Web.Test.TestDemo" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>测试Demo</title>
    <style>
        .pannel {
            border: solid 1px #e6e6e6;
            padding: 5px;
            margin: 5px;
        }

        dt, dd {
            display: inline;
        }

        body {
            font-size: 14px;
            font-family: "Microsoft YaHei";
        }
    </style>
</head>
<body>
    <form id="form1" runat="server">
        <div class="pannel">
            <div>测试压缩文件解压</div>
            <div>
                <dl>
                    <dt>请选择您要导入的压缩文件:</dt>
                    <dd>
                        <asp:FileUpload ID="fileupload2" runat="server" Width="200px" /><asp:Button ID="UnCompressButton" runat="server" Text="确定解压" OnClick="UnCompressButton_OnClick" />
                        <asp:Label ID="Label2" runat="server" ForeColor="Red"></asp:Label></dd>
                </dl>
            </div>
        </div>
        <div class="pannel">
            <div>测试Excel导入</div>
            <div>
                <dl>
                    <dt>请选择您要导入的Excel文件:</dt>
                    <dd>
                        <asp:FileUpload ID="fileupload1" runat="server" Width="200px" />
                        <asp:Button ID="ImportButton" runat="server" Text="确定导入" OnClick="ImportButton_OnClick" />
                        <asp:Label ID="Label1" runat="server" ForeColor="Red"></asp:Label>
                    </dd>
                </dl>
            </div>
            <div>
                <asp:GridView ID="GridView1" runat="server"></asp:GridView>
            </div>
        </div>
    </form>
</body>
</html>
