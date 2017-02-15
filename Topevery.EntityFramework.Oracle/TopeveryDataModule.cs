using System.Data.Entity;
using System.Reflection;
using Abp.EntityFramework;
using Abp.Modules;
using Topevery.EntityFramework;
using Topevery.Zero.EntityFramework.Oracle;

namespace Topevery
{
    [DependsOn(typeof(ZeroEntityFrameworkModule), typeof(TopeveryCoreModule))]
    public class TopeveryDataModule : AbpModule
    {
        public override void PreInitialize()
        {
            Configuration.DefaultNameOrConnectionString = "Default";
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(Assembly.GetExecutingAssembly());
            Database.SetInitializer<TopeveryDbContext>(null);
        }
    }
}
