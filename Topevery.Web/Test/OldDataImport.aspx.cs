using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.IO;
using System.Configuration;
using System.Collections;
using System.Data;
using Topevery.Framework.CommonModel.Utility;
using Topevery.FMP.ObjectModel;
using System.Text;
using Topevery.Infrastructure.File;
using Topevery.Sys;
using Oracle.ManagedDataAccess.Client;

namespace Topevery.Web.Test
{
    public partial class OldDataImport : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        /// <summary>
        /// 导入房屋幢数据
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void btnImportHouseInfo_OnClick(object sender, EventArgs e)
        {
            lblImportData.Text = "";
            StringBuilder strSql = new StringBuilder();
            strSql.Append(" select FWBHID as Id, CQSXID as PropertyId,");
            strSql.Append(" case FGS  when  '历史街区' then 500135 else 500134 end as JurisdictUnitId, ");
            strSql.Append(" FWBH as HouseNo, XFWMP as HouseDoorplate,");
            strSql.Append(" case FGS  when '西区' then 830 when '白沙' then 830 when '东区' then 828 when '堤东' then 828 when '北区' then 831 when '中区' then 832 when '仓后' then 832 when '南区' then 829 when '江南' then 829 else 900 end  as HouseManageId,");
            strSql.Append(" STREET as StreetName, DIHAO as GroundNo, case  QU  when '江门市蓬江区' then 440703  when '江门市江海区' then 440704  else 1 end   as AreaId,");
            strSql.Append(" YFWMP as OrigHouseNo, QSR as PropertyOwner, QSLY as TenureSource,");
            strSql.Append("  CQFW as PropertyRange, YDXZ as LandNature, YDMJ as LandArea, JIDIMJ as SubstrateArea, JZMJ as BuildArea, JZMJ_ZZ as BuildAreaFlat,");
            strSql.Append(" JZMJ_FZZ as BuildAreaNoFlat, JIZUMJ as MetRentArea, JIZUMJ_FZZ as MetRenAreaFlat, JIZUMJ_FZZ as MetRenAreaNoFlat, ZZZJ as FlatRent,");
            strSql.Append(" FZZZJ as NoFlatRent, PDFWJZ as AsseHouseValue, SYQZH as AllRightNo, CZR as ChaZhangRen, JBR as Attn, SHR as Reviewer, CLRQ as ProceDate,JCNF as CompletYear,");
            strSql.Append(" case JZJG   when '钢混' then 500016   when '混合' then 500017   when '砖木' then 500018   when '框架' then 500019   else 500109 end     as BuildStructureId,");
            strSql.Append(" ZCS as TotalFloors, case AQDJ   when '完好' then  500001   when '基本完好' then 500002   when '一般损坏' then 500003   when '严重损坏' then 500004   when '点危' then 500005   when '局危' then 500006   when '全危' then 500007   else 500008 end    as SecurityLevelId, ");
            strSql.Append(" SZDONG as FourEast, SZNAN as FourSouth, SZXI as FourWest, SZBEI as FourNorth,");
            strSql.Append(" case DQGS   when '自墙' then 500020   when '共墙' then 500021   when '他墙' then 500022   else 500023 end    as EastWallRelegId,");
            strSql.Append(" case NQGS   when '自墙' then 500020   when '共墙' then 500021   when '他墙' then 500022   else 500023 end as SouthWallRelegId,");
            strSql.Append(" case XQGS   when '自墙' then 500020   when '共墙' then 500021   when '他墙' then 500022   else 500023 end as WestWallRelegId,");
            strSql.Append(" case BQGS   when '自墙' then 500020   when '共墙' then 500021   when '他墙' then 500022   else 500023 end as NorthWallRelegId,");
            strSql.Append(" case BYTZZ   when 1 then 500040 else case BFZZ_BG when 1 then 500041  else case BFZZ_SY when 1 then 500120 else  case BFZZ_CF when 1 then 500121  else  case BFZZ_QT when 1 then 500122   else  500040  end   end  end  end end as UsePropertyId,");
            strSql.Append(" ZIYONGMJ as UsageArea,CZMJ as RentArea, HBMJ as TransferArea, FWBDMEMO as HousChangAndNotes, PDNF as AsseHouseYear,0 as HousekeepId,'' as Longitude, '' as latitude, 1 as CreatorUserId,");
            strSql.Append(" decode(LOGOUTDATE, null, sysdate, LOGOUTDATE) as CreationTime, 1 as LastModifierUserId, decode(UPDATEDATE, null, sysdate, UPDATEDATE) as LastModificationTime,");
            strSql.Append(" 0 as DeleterUserId, sysdate as DeletionTime, 0 as IsDeleted from gf_cqda ");
            string connectionString = ConfigurationManager.ConnectionStrings["jmgf_old_oracle"].ConnectionString;

            DataTable dt = OracleHelper.ExecuteDataTable(connectionString, CommandType.Text, strSql.ToString(), null);

            if (dt != null && dt.Rows.Count > 0)
            {
                this.DataGridView1.DataSource = dt;
                this.DataGridView1.DataBind();
            }
        }

        /// <summary>
        /// 导入分户数据
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void btnImportHouseUnit_OnClick(object sender, EventArgs e)
        {
            lblImportData.Text = "";
            
                //insert into TYUM_FS.HM_HOUSEBAN(Id, PropertyId, JurisdictUnitId, HouseNo,
                //HouseDoorplate, HouseManageId, StreetName, GroundNo, AreaId, OrigHouseNo,
                //PropertyOwner, TenureSource, PropertyRange, LandNature, LandArea, SubstrateArea,
                //BuildArea, BuildAreaFlat, BuildAreaNoFlat, MetRentArea, MetRenAreaFlat,
                //MetRenAreaNoFlat, FlatRent, NoFlatRent, AsseHouseValue, AllRightNo,
                //ChaZhangRen, Attn, Reviewer, ProceDate, CompletYear, BuildStructureId,
                //TotalFloors, SecurityLevelId, FourEast, FourSouth, FourWest, FourNorth,
                //EastWallRelegId, SouthWallRelegId, WestWallRelegId, NorthWallRelegId,
                //UsePropertyId, UsageArea, RentArea, TransferArea, HousChangAndNotes,
                //AsseHouseYear, HousekeepId, Longitude, latitude, CreatorUserId,
                //CreationTime, LastModifierUserId, LastModificationTime,
                //DeleterUserId, DeletionTime, IsDeleted)

            }

        /// <summary>
        /// 导入租户数据
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void btnImportLesseeInfo_OnClick(object sender, EventArgs e)
        {
            lblImportData.Text = "";

        }

        /// <summary>
        /// 导入合同数据
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void btnImportContractInfo_OnClick(object sender, EventArgs e)
        {
            lblImportData.Text = "";

        }

        /// <summary>
        /// 导入房屋平面图纸
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void btnImportHouseImage_OnClick(object sender, EventArgs e)
        {
            this.lblImportImage.Text = "";
            string importImagePath = txtImportImagePath.Text.Trim();
            if (importImagePath != "")
            {
                if (!Directory.Exists(importImagePath))
                {
                    this.lblImportImage.Text = "您输入的文件导入路径不存在！";
                    return;
                }
                int rel = 0;
                DataTable dtResult = new DataTable();
                dtResult.Columns.Add("Index", Type.GetType("System.String"));
                dtResult.Columns.Add("DataId", Type.GetType("System.String"));
                dtResult.Columns.Add("HouseNo", Type.GetType("System.String"));
                dtResult.Columns.Add("ImageName", Type.GetType("System.String"));

                foreach (string item in Directory.GetDirectories(importImagePath))
                {
                    DirectoryInfo directoryinfo = new DirectoryInfo(item);
                    string houseNo = directoryinfo.Name;
                    DateTime creationTime = directoryinfo.CreationTime;
                    string strSql = "select * from HM_HouseBan where HouseNo =:HouseNo ";
                    OracleParameter[] parameters = {
                        new OracleParameter ("HouseNo",OracleDbType.Varchar2,50)};
                    parameters[0].Value = houseNo;
                    //string strSql = "select * from HM_HouseBan where HouseNo ='"+ houseNo + "' ";

                    string connectionString = ConfigurationManager.ConnectionStrings["jmgf_new_oracle"].ConnectionString;

                    DataTable dt = OracleHelper.ExecuteDataTable(connectionString,CommandType.Text, strSql, parameters);

                    if (dt != null && dt.Rows.Count > 0)
                    {
                        try
                        {
                            Guid fid = Guid.Empty;
                            FileInfo[] arrFile = directoryinfo.GetFiles();

                            foreach (FileInfo fileInfo in arrFile)
                            {
                                string fileName = Path.GetFileName(fileInfo.FullName);
                                string fileExtensionName = Path.GetExtension(fileInfo.FullName);
                                string fileid = fileName.Replace(fileExtensionName, "");
                                Guid fileId = fid;
                                if (fid == Guid.Empty)
                                    fileId = Guid.NewGuid();
                                using (Stream inStream = StaticFunction.StreamToMemoryStream(fileInfo.OpenRead()))
                                {
                                    using (Stream fmpStream = FileManager.CreateFile(fileId, fileName))
                                    {
                                        StaticFunction.StreamSourceStreamToTargetStream(inStream, fmpStream);
                                        StringBuilder strSql0 = new StringBuilder();
                                        strSql0.Append(" insert into Sys_FileRelation(Id,ModuleId,KeyId,FileId,FileName,CreatorUserId,CreationTime,FileType) ");
                                        strSql0.Append(" values(SYS_FILERELATION_SEQ.Nextval,:ModuleId,:KeyId,:FileId,:FileName,:CreatorUserId,:CreationTime,:FileType)");
                                        OracleParameter[] parameters0 = {
                                                new OracleParameter ("ModuleId",OracleDbType.Int32,10),
                                                new OracleParameter ("KeyId",OracleDbType.Int32,10),
                                                new OracleParameter("FileId",OracleDbType.Raw),
                                                new OracleParameter("FileName",OracleDbType.Varchar2,200),
                                                new OracleParameter("CreatorUserId",OracleDbType.Int32,10),
                                                new OracleParameter("CreationTime",OracleDbType.Date),
                                                new OracleParameter("FileType",OracleDbType.Int32,1)
                                        };
                                        parameters0[0].Value = Topevery.ModuleType.HouseBan;
                                        parameters0[1].Value = int.Parse(dt.Rows[0]["Id"].ToString());
                                        parameters0[2].Value =fileId.ToByteArray();
                                        parameters0[3].Value = fileName;
                                        parameters0[4].Value = 0;
                                        parameters0[5].Value = System.DateTime.Now;
                                        parameters0[6].Value = FileHelper.GetAttachType(fileExtensionName);
                                        rel+= OracleHelper.ExecuteNonQuery(connectionString,CommandType.Text,strSql0.ToString(),parameters0);

                                        DataRow newRow= dtResult.NewRow();
                                        newRow["Index"] = rel.ToString();
                                        newRow["DataId"] = dt.Rows[0]["Id"].ToString();
                                        newRow["HouseNo"] = houseNo;
                                        newRow["ImageName"] = fileName;
                                        dtResult.Rows.Add(newRow);
                                    }
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                            throw ex;
                        }
                        finally
                        {

                        }
                    }
                }
                DataGridView1.DataSource = dtResult;
                DataGridView1.DataBind();
                this.lblImportImage.Text = "成功导入了" + rel + "张图片";
            }
            else
                this.lblImportImage.Text = "请输入文件导入路径！";
        }
    }

    public abstract class OracleHelper
    {
      
        private static Hashtable parmCache = Hashtable.Synchronized(new Hashtable());
        public static int ExecuteNonQuery(string connectionString,CommandType cmdType, string cmdText, params OracleParameter[] commandParameters)
        {
            OracleCommand cmd = new OracleCommand();
            using (OracleConnection conn = new OracleConnection(connectionString))
            {
                PrepareCommand(cmd, conn, null, cmdType, cmdText, commandParameters);
                int val = cmd.ExecuteNonQuery();
                cmd.Parameters.Clear();
                return val;
            }
        }

        public static DataTable ExecuteDataTable(string connectionString,CommandType cmdType, string cmdText, params OracleParameter[] commandParameters)
        {
            OracleCommand cmd = new OracleCommand();
            OracleConnection conn = new OracleConnection(connectionString);
            try
            {
                PrepareCommand(cmd, conn, null, cmdType, cmdText, commandParameters);
                OracleDataAdapter da = new OracleDataAdapter();
                DataTable dt = new DataTable();
                da.SelectCommand = cmd;
                da.Fill(dt);
                return dt;
            }
            finally
            {
                conn.Close();
            }
        }

        public static DataSet ExecuteDataSet(string connectionString,CommandType cmdType, string cmdText, params OracleParameter[] commandParameters)
        {
            OracleCommand cmd = new OracleCommand();
            OracleConnection conn = new OracleConnection(connectionString);
            try
            {

                PrepareCommand(cmd, conn, null, cmdType, cmdText, commandParameters);
                OracleDataAdapter da = new OracleDataAdapter();
                DataSet ds = new DataSet();
                da.SelectCommand = cmd;
                da.Fill(ds);
                return ds;
            }
            finally
            {
                conn.Close();
            }
        }

        public static int ExecuteNonQuery(OracleConnection connection, CommandType cmdType, string cmdText, params OracleParameter[] commandParameters)
        {

            OracleCommand cmd = new OracleCommand();

            PrepareCommand(cmd, connection, null, cmdType, cmdText, commandParameters);
            int val = cmd.ExecuteNonQuery();
            cmd.Parameters.Clear();
            connection.Close();
            return val;
        }


        public static int ExecuteNonQuery(OracleTransaction trans, CommandType cmdType, string cmdText, params OracleParameter[] commandParameters)
        {
            OracleCommand cmd = new OracleCommand();
            PrepareCommand(cmd, trans.Connection, trans, cmdType, cmdText, commandParameters);
            int val = cmd.ExecuteNonQuery();
            cmd.Parameters.Clear();
            trans.Connection.Close();
            return val;
        }


        public static OracleDataReader ExecuteReader(string connectionString,CommandType cmdType, string cmdText, params OracleParameter[] commandParameters)
        {
            OracleCommand cmd = new OracleCommand();
            OracleConnection conn = new OracleConnection(connectionString);


            try
            {
                PrepareCommand(cmd, conn, null, cmdType, cmdText, commandParameters);
                OracleDataReader rdr = cmd.ExecuteReader(CommandBehavior.CloseConnection);
                cmd.Parameters.Clear();
                return rdr;
            }
            catch
            {
                conn.Close();
                throw;
            }
            //finally
            //{
            //  conn.Close();
            //}
        }


        public static object ExecuteScalar(string connectionString,CommandType cmdType, string cmdText, params OracleParameter[] commandParameters)
        {
            OracleCommand cmd = new OracleCommand();

            using (OracleConnection connection = new OracleConnection(connectionString))
            {
                PrepareCommand(cmd, connection, null, cmdType, cmdText, commandParameters);
                object val = cmd.ExecuteScalar();
                cmd.Parameters.Clear();
                return val;
            }
        }


        public static object ExecuteScalar(OracleConnection connection, CommandType cmdType, string cmdText, params OracleParameter[] commandParameters)
        {

            OracleCommand cmd = new OracleCommand();

            PrepareCommand(cmd, connection, null, cmdType, cmdText, commandParameters);
            object val = cmd.ExecuteScalar();
            cmd.Parameters.Clear();
            connection.Close();
            return val;
        }


        public static void CacheParameters(string cacheKey, params OracleParameter[] commandParameters)
        {
            parmCache[cacheKey] = commandParameters;
        }

        public static OracleParameter[] GetCachedParameters(string cacheKey)
        {
            OracleParameter[] cachedParms = (OracleParameter[])parmCache[cacheKey];

            if (cachedParms == null)
                return null;

            OracleParameter[] clonedParms = new OracleParameter[cachedParms.Length];

            for (int i = 0, j = cachedParms.Length; i < j; i++)
                clonedParms[i] = (OracleParameter)((ICloneable)cachedParms[i]).Clone();

            return clonedParms;
        }


        private static void PrepareCommand(OracleCommand cmd, OracleConnection conn, OracleTransaction trans, CommandType cmdType, string cmdText, OracleParameter[] cmdParms)
        {

            if (conn.State != ConnectionState.Open)
                conn.Open();
            cmd.CommandTimeout = 180;
            cmd.Connection = conn;
            cmd.CommandText = cmdText;


            if (trans != null)
                cmd.Transaction = trans;

            cmd.CommandType = cmdType;

            if (cmdParms != null)
            {
                foreach (OracleParameter parm in cmdParms)
                    cmd.Parameters.Add(parm);
            }
        }
    }
}