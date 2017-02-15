using Abp.EntityFramework;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity;

namespace Topevery.Zero.EntityFramework.Oracle
{
    public abstract class ZeroCommonDbContext:AbpDbContext
    {
       
        /// <summary>
        /// 默认构造
        /// </summary>
        protected ZeroCommonDbContext()
        {

        }

        /// <summary>
        /// 带参数的构造函数
        /// </summary>
        /// <param name="nameOrConnectionString"></param>
        protected ZeroCommonDbContext(string nameOrConnectionString)
            : base(nameOrConnectionString)
        {

        }

        protected ZeroCommonDbContext(DbConnection dbConnection, bool contextOwnsConnection)
            : base(dbConnection, contextOwnsConnection)
        {

        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        
        }
    }
}
