<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="OldDataImport.aspx.cs" Inherits="Topevery.Web.Test.OldDataImport" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>老系统数据导入</title>
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
            <div>房屋幢数据导入</div>
            <div>
                <asp:Button ID="btnImportHouseInfo" runat="server" OnClientClick="return confirm('您确定要导入房屋幢数据？')" OnClick="btnImportHouseInfo_OnClick" Text="导入房屋幢数据" />
                <asp:Button ID="btnImportHouseUnit" runat="server" OnClientClick="return confirm('您确定要导入分房数据？')" OnClick="btnImportHouseUnit_OnClick" Text="导入分房数据" />
                <asp:Button ID="btnImportLesseeInfo" runat="server" OnClientClick="return confirm('您确定要导入租户数据？')" OnClick="btnImportLesseeInfo_OnClick" Text="导入租户数据" />
                <asp:Button ID="btnImportContractInfo" runat="server" OnClientClick="return confirm('您确定要导入合同数据？')" OnClick="btnImportContractInfo_OnClick" Text="导入合同数据" />
            </div>
            <div><asp:Label ID="lblImportData" runat="server" ForeColor="Red"></asp:Label></div>
        </div>
        <div class="pannel">
            <div>房屋平面图纸导入</div>
            <div>
                <dl>
                    <dt>请输入要导入文件的路径:</dt>
                    <dd>
                        <asp:TextBox ID="txtImportImagePath" runat="server" Width="400px"></asp:TextBox>
                        <asp:Button ID="btnImportHouseImage" runat="server" Text="确定上传" OnClientClick="return confirm('您确定要上传平面图纸？')" OnClick="btnImportHouseImage_OnClick" />
                        <asp:Label ID="lblImportImage" runat="server" ForeColor="Red"></asp:Label></dd>
                </dl>
            </div>
            <div>
            <asp:GridView ID="DataGridView1" runat="server"></asp:GridView>
                </div>
        </div>
    </form>
</body>
</html>
