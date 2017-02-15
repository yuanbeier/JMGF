using System.Reflection;
using Abp;
using Abp.Modules;

namespace Topevery.Zero.Core
{
    [DependsOn(typeof(AbpKernelModule))]
    public class TopeveryZeroCoreModule : AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(Assembly.GetExecutingAssembly());
        }
    }
}
