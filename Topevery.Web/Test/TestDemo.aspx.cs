using System;
using System.Collections.Generic;
using System.IO;
using System.Data;

namespace Topevery.Web.Test
{
    public partial class TestDemo : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
            }
        }
        protected void ImportButton_OnClick(object sender, EventArgs e)
        {
            if (fileupload1.HasFile)
            {
                string savePath = "";
                string SaveFolder = System.Web.HttpContext.Current.Request.MapPath("/") 
                    +"Upload/"+ System.DateTime.Now.ToString("yyyyMMdd") + "/";
                if (!Directory.Exists(SaveFolder))
                {
                    Directory.CreateDirectory(SaveFolder);
                }
               string fileName = System.IO.Path.GetFileName(fileupload1.PostedFile.FileName);
                string contentType = fileupload1.PostedFile.ContentType;
                List<string> fileContentType = new List<string>();
                fileContentType.Add("application/x-xls");
                fileContentType.Add("application/vnd.ms-excel");
                fileContentType.Add("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                if (!fileContentType.Contains(contentType))
                {
                    Label1.Text = "请选择有效的excel文件！";
                }
                else
                {
                    string ext = contentType == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ? "xlsx" : "xls";
                    Label1.Text = "";
                    fileName = fileName.Substring(0, fileName.LastIndexOf('.')) + DateTime.Now.ToString("yyyyMMddHHmmssfff") + "." + ext;
                    savePath = SaveFolder + fileName;
                    fileupload1.PostedFile.SaveAs(savePath);

                    FileStream fs = new FileStream(savePath, FileMode.Open, FileAccess.Read);
                    DataTable dt = Topevery.Infrastructure.File.NPOIHelper.ImportExcelToDataTable(fs, "新增房屋登记表", 1);
                    GridView1.DataSource = dt;
                    GridView1.DataBind();
                    File.Delete(savePath);
                    //DataSet ds = Topevery.Infrastructure.Excel.NPOIHelper.ImportExcelToDataSet(fs);
                    //    if (ds != null && ds.Tables.Count > 0)
                    //    {

                    //    }
                }

            }
            else
            {
                Label1.Text = "请选择Excel文件";
            }
        }

        protected void UnCompressButton_OnClick(object sender, EventArgs e)
        {
            if (fileupload2.HasFile)
            {
                string savePath = "";
                string SaveFolder = System.AppDomain.CurrentDomain.BaseDirectory 
                    + "Upload\\" + System.DateTime.Now.ToString("yyyyMMdd") + "\\";
                if (!Directory.Exists(SaveFolder))
                {
                    Directory.CreateDirectory(SaveFolder);
                }
                string fileName = System.IO.Path.GetFileName(fileupload2.PostedFile.FileName);
                string contentType = fileupload2.PostedFile.ContentType;
                List<string> fileContentType = new List<string>();
                fileContentType.Add("application/x-tar");
                fileContentType.Add("application/x-compressed-tar");
                fileContentType.Add("application/x-bzip-compressed-tar");
                fileContentType.Add("application/octet-stream");
                fileContentType.Add("application/x-zip-compressed");
                if (!fileContentType.Contains(contentType))
                {
                    Label2.Text = "请选择有效的压缩文件！";
                }
                else
                {
                    Label2.Text = "";
                    savePath = SaveFolder + fileName;
                    fileupload2.PostedFile.SaveAs(savePath);
                    string unCompressPath = SaveFolder + fileName.Substring(0, fileName.LastIndexOf('.'));
                    Topevery.Infrastructure.File.Compress.UnCompressRAR(unCompressPath, SaveFolder, fileName);
                    File.Delete(savePath);
                    this.Label2.Text = unCompressPath;
                }
            }
            else
            {
                Label2.Text = "请选择压缩文件";
            }
        }
    }
}