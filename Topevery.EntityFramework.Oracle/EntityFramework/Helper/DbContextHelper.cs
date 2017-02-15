using System.Data.Entity;
using System.Linq;
using Abp.Dependency;
using Topevery.Zero.EntityFramework.Oracle.EntityFramework.Helper;

namespace Topevery.EntityFramework.Helper
{
    /// <summary>
    /// 序列帮助类
    /// 袁贝尔
    /// 20160817
    /// </summary>
    public class DbContextHelper:IDbContextHelper,ITransientDependency
    {
        /// <summary>
        /// 数据访问类
        /// </summary>
        private volatile DbContext _dbContext ;

        /// <summary>
        /// 锁帮助对象
        /// </summary>
        private readonly object _lockObject = new object();

        /// <summary>
        /// 
        /// </summary>
        private  DbContext TopeveryDbContext
        {
            get
            {
                if (_dbContext == null)
                {
                    lock (_lockObject)
                    {
                        if (_dbContext == null)
                            _dbContext = IocManager.Instance.Resolve<TopeveryDbContext>();
                    }
                }
                return _dbContext;
            }
        }

        /// <summary>
        /// 得到序列的字符串
        /// </summary>
        /// <param name="sequenceName"></param>
        /// <returns></returns>
        private string GetSequenceSqlByName(string sequenceName)
        {
            return "select " + sequenceName + ".nextval from dual";
        }

        /// <summary>
        /// 获取序列值
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="sequenceName"></param>
        /// <returns></returns>
        public T GetSequenceValueByName<T>(string sequenceName) where T : struct
        {
            string sql = GetSequenceSqlByName(sequenceName);
            return TopeveryDbContext.Database.SqlQuery<T>(sql).First();
        }


        /// <summary>
        /// 获取序列值(默认int)
        /// </summary>
        /// <param name="sequenceName"></param>
        /// <returns></returns>
        public int GetSequenceValueByName(string sequenceName) 
        {
            return GetSequenceValueByName<int>(sequenceName);
        }
    }
}
