using System.Data.Entity;
using Abp.EntityFramework;
using Abp.Modules;
using Topevery.Zero.EntityFramework.Oracle;


namespace Topevery.EntityFramework
{
    public class TopeveryDbContext : ZeroCommonDbContext
    {
        //TODO: Define an IDbSet for each Entity...



        /* NOTE: 
         *   Setting "Default" to base class helps us when working migration commands on Package Manager Console.
         *   But it may cause problems when working Migrate.exe of EF. If you will apply migrations on command line, do not
         *   pass connection string name to base classes. ABP works either way.
         */


        public TopeveryDbContext()
            : base("Default")
        {

        }

        /* NOTE:
         *   This constructor is used by ABP to pass connection string defined in TopeveryDataModule.PreInitialize.
         *   Notice that, actually you will not directly create an instance of TopeveryDbContext since ABP automatically handles it.
         */

        public TopeveryDbContext(string nameOrConnectionString)
            : base(nameOrConnectionString)
        {

        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
          
            modelBuilder.HasDefaultSchema("TYUM_FS");

            //注册过滤器
       
        }
    }
}
