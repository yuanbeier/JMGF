using Oracle.ManagedDataAccess.Client;
using System;
using System.Data;
using System.Data.Common;
using System.Linq;

namespace Dapper
{
    public class OracleDapperOld
    {
        #region Fields
        private readonly string _connectionString;

        private readonly string _parameterToken = ":";
        public string ParameterToken { get { return _parameterToken; } }
        #endregion

        #region Constructs
        public OracleDapperOld(string connectionString)
        {
            if (connectionString == null)
                throw new ArgumentNullException("connectionString");
            _connectionString = connectionString;
        }


        #endregion

        #region Method

        public DbCommand GetSqlStringCommand(string sqlText)
        {
            DbCommand cmd = this.CreateCommand();
            cmd.CommandText = sqlText;
            cmd.CommandType = System.Data.CommandType.Text;
            return cmd;
        }

        public int ExecuteNonQuery(DbCommand cmd)
        {
            DbConnection connection = GetConnection();

            cmd.Connection = connection;
            return cmd.ExecuteNonQuery();

        }

        public int ExecuteNonQuery(DbCommand cmd, DbTransaction transaction)
        {
            if (transaction == null)
                throw new ArgumentNullException("transcation");
            DbConnection connection = GetConnection(transaction);
            cmd.Connection = connection;
            cmd.Transaction = transaction;
            return cmd.ExecuteNonQuery();
        }

        public T Query<T>(DbCommand cmd)
        {
            using (DbConnection connection = GetConnection())
            {

                return connection.Query<T>(cmd.CommandText, cmd.Parameters).FirstOrDefault();
            }
        }


        public virtual DbConnection GetConnection(DbTransaction transaction = null)
        {
            if (transaction != null)
                return transaction.Connection;

            DbConnection connection = new OracleConnection(_connectionString);
            connection.Open();
            return connection;
        }

        public DbCommand CreateCommand()
        {
            return new Oracle.ManagedDataAccess.Client.OracleCommand();
        }

         

        public void AddOutParameter(DbCommand dbcmd ,string paramName, DbType dbType,object paramValue)
        {
            DbParameter p = dbcmd.CreateParameter();
            p.DbType = dbType;
            p.Direction = ParameterDirection.Output;
            p.Value = paramValue;
            p.ParameterName = paramName;
            dbcmd.Parameters.Add(p);
        }

        public void AddInParameter(DbCommand dbcmd, string paramName, DbType dbType, object paramValue)
        {
            //try
            //{
                DbParameter p = dbcmd.CreateParameter();
                p.DbType = dbType;
                p.Direction = ParameterDirection.Input;
                p.Value = paramValue;
                p.ParameterName = paramName;
                dbcmd.Parameters.Add(p);
            //}
            //catch (Exception ex)
            //{
                              
            //}
        }

        public object GetParameterValue(DbCommand dbcmd ,string paraName)
        {
           return dbcmd.Parameters[paraName].Value;
        }


        public IDataReader ExecuteReader(DbCommand dbcmd)
        {
            IDataReader result;
            DbConnection connection = GetConnection();
            dbcmd.Connection = connection;
            IDataReader innerReader = dbcmd.ExecuteReader(CommandBehavior.Default | CommandBehavior.CloseConnection);
            return innerReader;

        }

        public object ExecuteScalar(DbCommand dbcmd)
        {
            using (DbConnection connection = GetConnection())
            {
                dbcmd.Connection = connection;
                return dbcmd.ExecuteScalar();
            }
        }

        public object ExecuteScalar(DbCommand dbcmd,DbTransaction t)
        {
            
            using (DbConnection connection = t.Connection)
            {
                dbcmd.Connection = connection;
                return dbcmd.ExecuteScalar();
            }
        }

        public DbCommand GetStoredProcCommand(string procName)
        {
            var dbcmd = CreateCommand();
            dbcmd.CommandText = procName;
            dbcmd.CommandType = CommandType.StoredProcedure;
            return dbcmd;
        }


        public DataTable ExecuteTable(DbCommand cmd)
        {
            DataTable dt = null;
            using (var conn = GetConnection())
            {
                dt = new DataTable();
                dt.Load(conn.ExecuteReader(cmd.CommandText));
            }
            return dt;
        }
        #endregion
    }
}
