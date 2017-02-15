using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Domain.Entities;
using Abp.Domain.Uow;
using Abp.EntityFramework;
using Abp.EntityFramework.Repositories;
using Dapper;
using Oracle.ManagedDataAccess.Client;

namespace Topevery.EntityFramework.Repositories
{
    public abstract class TopeveryRepositoryBase<TEntity, TPrimaryKey> : EfRepositoryBase<TopeveryDbContext, TEntity, TPrimaryKey>, ITopeveryRepositoryBase
        where TEntity : class, IEntity<TPrimaryKey>
    {
        private readonly string _connection = ConfigurationManager.ConnectionStrings["Default"].ToString();

        public DapperDB DapperDb { set; get; }
        protected TopeveryRepositoryBase(IDbContextProvider<TopeveryDbContext> dbContextProvider)
            : base(dbContextProvider)
        {
            DapperDb = DapperDB.CreateDatabase<OracleConnection>(_connection);

        }

        //在下面添加存储层公共方法

        /// <summary>
        /// 获取总数的SQL
        /// </summary>
        /// <param name="tableName"></param>
        /// <param name="whereSql"></param>
        /// <returns></returns>
        public string GetCountSql(string tableName,string whereSql)
        {
            return $@"SELECT count(1) FROM {tableName} {whereSql}";
        }

        /// <summary>
        /// 获取查询的SQL
        /// </summary>
        /// <param name="tableName"></param>
        /// <param name="whereSql"></param>
        /// <param name="sort"></param>
        /// <returns></returns>
        public string GetPageSql(string tableName, string whereSql, string sort)
        {
            return string.Format(@"SELECT tmp.* FROM (SELECT row_number() over(order by {2}) AS rw,t.* FROM {0} t {1}) tmp
            WHERE rw between :p_begin_index AND :p_end_index", tableName, whereSql, sort);
        }

        public string GetPageSql(string sql)
        {
            return string.Format(@"select * from ( select rownum rn,temp.* from ({0}) temp) where rn between :p_begin_index AND :p_end_index", sql);
        }

        /// <summary>
        /// 物理删除表记录
        /// </summary>
        /// <param name="tableName">表名</param>
        /// <param name="id">主键Id</param>
        public async Task DelTableInfoAsync(string tableName, int id)
        {
            StringBuilder sbBuilder = new StringBuilder();
            sbBuilder.AppendFormat(@"delete from {0} where id=:p_id", tableName);
            await Context.Database.ExecuteSqlCommandAsync(sbBuilder.ToString(),
                    new OracleParameter(":p_id", OracleDbType.Int32, id, ParameterDirection.Input));
        }

        /// <summary>
        /// 根据字段删除表记录
        /// </summary>
        /// <param name="tableName"></param>
        /// <param name="fieldName"></param>
        /// <param name="fileId"></param>
        /// <returns></returns>
        public async Task DelTableInfoByFieldAsync(string tableName,string fieldName,int fileId)
        {
            string sql = string.Format("delete from {0} where {1}=:fileId",tableName,fieldName);
            await Context.Database.ExecuteSqlCommandAsync(sql, new OracleParameter(":fileId", OracleDbType.Int32, fileId, ParameterDirection.Input));
        }


        /// <summary>
        /// 物理删除表记录
        /// </summary>
        /// <param name="tableName">表名</param>
        /// <param name="id">主键Id</param>
        public void DelTableInfo(string tableName, int id)
        {
            StringBuilder sbBuilder = new StringBuilder();
            sbBuilder.AppendFormat(@"delete from {0} where id=:p_id", tableName);
             Context.Database.ExecuteSqlCommand(sbBuilder.ToString(),
                    new OracleParameter(":p_id", OracleDbType.Int32, id, ParameterDirection.Input));
        }

     
        /// <summary>
        /// 执行Sql
        /// </summary>
        /// <param name="sql"></param>
        /// <returns></returns>
        public async Task ExecutionSqlAsync(string sql)
        {
            await Context.Database.ExecuteSqlCommandAsync(sql);
        }

        /// <summary>
        /// 批量添加数据
        /// </summary>
        /// <param name="list"></param>
        /// <returns></returns>
        public void AddRange<T>(IList<T> list) 
        {
            var entities = list as IList<TEntity>;
            if (entities != null)
            {
              Context.Set<TEntity>().AddRange(entities);
            }
        }
    }

    public abstract class TopeveryRepositoryBase<TEntity> : TopeveryRepositoryBase<TEntity, int>
        where TEntity : class, IEntity<int>
    {
        protected TopeveryRepositoryBase(IDbContextProvider<TopeveryDbContext> dbContextProvider)
            : base(dbContextProvider)
        {

        }

        //这里不能添加任何方法, 在上一个类里面添加 (这个类继承了上一个类)

       
    }
}
