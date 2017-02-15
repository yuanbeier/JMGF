using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;

namespace Dapper
{
    /// <summary>
    /// Dapper类
    /// </summary>
    public class DapperDB
    {
        /// <summary>
        /// 连接字符串
        /// </summary>
        private string _connectionString;
        /// <summary>
        /// 创建连接Func
        /// </summary>
        private Func<DbConnection> _dbConnectionFunc;

        #region Constructors
        protected DapperDB(Func<DbConnection> dbConnectionFunc,string connectionString)
        {
            _connectionString = connectionString;
            _dbConnectionFunc = dbConnectionFunc;
        }
        #endregion

        /// <summary>
        /// 创建具体数据库访问类
        /// </summary>
        /// <typeparam name="TProvider"></typeparam>
        /// <param name="connectionString"></param>
        /// <returns></returns>
        #region Methods
        public static DapperDB CreateDatabase<TProvider>(string connectionString) where TProvider : DbConnection
        {
            var db = new DapperDB(() =>
            {
                return Activator.CreateInstance<TProvider>();
            }
            , connectionString);
            return db;
        }
        #endregion

      
        /// <summary>
        /// 打开数据库连接
        /// </summary>
        /// <returns></returns>
        public DbConnection GetConnection(DbTransaction transaction = null)
        {
            if (transaction != null)
                return transaction.Connection;
            var connection = _dbConnectionFunc();
            connection.ConnectionString = _connectionString;
            connection.Open();
            return connection;
        }

     

        /// <summary>
        /// 获取Datable
        /// </summary>
        /// <param name="sql"></param>
        /// <param name="p">Oracle动态参数</param>
        /// <returns></returns>
        public DataTable ExecuteTable(string sql)
        {
            DataTable dt = null;
            using (var conn = GetConnection())
            {
                dt = new DataTable();
                dt.Load(conn.ExecuteReader(sql));

            }
            return dt;
        }

       

        /// <summary>
        /// 查询List接口
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="sql"></param>
        /// <param name="p">object动态参数</param>
        /// <returns></returns>
        public List<T> QueryList<T>(string sql, object p = null)
        {
            List<T> list = null;
            using (var conn = GetConnection())
            {
                list = conn.Query<T>(sql, p).ToList();
                return list;
            }
        }


        /// <summary>
        /// 执行存储过程
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="sql"></param>
        /// <param name="p">object动态参数</param>
        /// <returns></returns>
        public List<T> ExecStoredProcedure<T>(string sql, object p)
        {
            List<T> list = null;
            using (var conn = GetConnection())
            {
                list = conn.Query<T>(sql, p, commandType: CommandType.StoredProcedure).ToList();
                return list;
            }
        }

        /// <summary>
        /// 查询实体接口
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="sql"></param>
        /// <param name="p">Oracle动态参数</param>
        /// <returns></returns>
        public T QueryFirstOrDefault<T>(string sql, DynamicParameters p)
        {
            using (var conn = GetConnection())
            {
                return conn.Query<T>(sql, p).FirstOrDefault();
            }
        }

        /// <summary>
        /// 查询实体接口
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="sql"></param>
        /// <param name="p">Oracle动态参数</param>
        /// <returns></returns>
        public T QueryFirstOrDefault<T>(string sql, object p)
        {
            using (var conn = GetConnection())
            {
                return conn.Query<T>(sql, p).FirstOrDefault();
            }
        }

        /// <summary>
        /// 插入实体
        /// </summary>
        /// <param name="sql"></param>
        /// <param name="p"></param>
        /// <param name="id">自增长Id</param>
        /// <returns>是否插入成功</returns>
        public bool Insert(string sql, DynamicParameters p, ref int id)
        {
            using (var conn = GetConnection())
            {
                int i = conn.Execute(sql, p);
                id = p.Get<int>(DapperConstant.PId);
                if (i > 0)
                {
                    return true;
                }
                return false;
            }
        }

        /// <summary>
        /// 执行脚本
        /// </summary>
        /// <param name="sql"></param>
        /// <param name="p"></param>
        /// <returns></returns>
        public bool Execute(string sql, DynamicParameters p)
        {
            using (var conn = GetConnection())
            {
                int i = conn.Execute(sql, p);
                if (i > 0)
                {
                    return true;
                }
                return false;
            }
        }

        /// <summary>
        /// 执行脚本
        /// </summary>
        /// <param name="sql"></param>
        /// <param name="p"></param>
        /// <returns></returns>
        public bool Execute(string sql, object p)
        {
            using (var conn = GetConnection())
            {
                int i = conn.Execute(sql, p);
                if (i > 0)
                {
                    return true;
                }
                return false;
            }
        }


        /// <summary>
        /// 执行脚本
        /// </summary>
        /// <param name="sql"></param>
        /// <param name="p"></param>
        /// <returns></returns>
        public int ExecuteNonQuery(string sql, DynamicParameters p)
        {
            using (var conn = GetConnection())
            {
                return conn.Execute(sql, p);
            }
        }


        /// <summary>
        /// 执行程序
        /// </summary>
        /// <param name="sql"></param>
        /// <param name="p"></param>
        /// <param name="t"></param>
        /// <returns></returns>
        public int ExecuteNonQuery(string sql, DynamicParameters p, DbTransaction t)
        {
            var conn = t.Connection;
            return conn.Execute(sql, p);
        }

        /// <summary>
        /// 执行脚本
        /// </summary>
        /// <param name="sql"></param>
        /// <param name="p"></param>
        /// <returns></returns>
        public T ExecuteScalar<T>(string sql, object p)
        {
            using (var conn = GetConnection())
            {
                return conn.ExecuteScalar<T>(sql, p);
            }
        }

        /// <summary>
        /// 执行脚本
        /// </summary>
        /// <param name="sql"></param>
        /// <param name="p"></param>
        /// <returns></returns>
        public T ExecuteScalar<T>(string sql, DynamicParameters p)
        {
            using (var conn = GetConnection())
            {
                return conn.ExecuteScalar<T>(sql, p);
            }
        }

    }
}
