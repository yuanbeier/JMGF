using System.Threading.Tasks;
using Abp.Domain.Repositories;
using System.Collections.Generic;

namespace Topevery
{
    /// <summary>
    /// 公共删除基类接口
    /// </summary>
    public interface ITopeveryRepositoryBase
    {
        /// <summary>
        /// 物理删除表记录
        /// </summary>
        /// <param name="tableName">表名</param>
        /// <param name="id">主键Id</param>
        Task DelTableInfoAsync(string tableName, int id);

        /// <summary>
        /// 根据字段删除表记录
        /// </summary>
        /// <param name="tableName"></param>
        /// <param name="fieldName"></param>
        /// <param name="fileValue"></param>
        /// <returns></returns>
        Task DelTableInfoByFieldAsync(string tableName, string fieldName, int fileId);

        /// <summary>
        /// 物理删除表记录
        /// </summary>
        /// <param name="tableName">表名</param>
        /// <param name="id">主键Id</param>
        void DelTableInfo(string tableName, int id);


        /// <summary>
        /// 执行Sql
        /// </summary>
        /// <param name="sql"></param>
        /// <returns></returns>
        Task ExecutionSqlAsync(string sql);

        /// <summary>
        /// 批量添加
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="list"></param>
        /// <returns></returns>
        void AddRange<T>(IList<T> list);
    }
}