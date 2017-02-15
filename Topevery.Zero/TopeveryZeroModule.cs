using System.Reflection;
using Abp.Modules;
using Topevery.Zero.Core;

namespace Topevery.Zero
{
    [DependsOn(typeof(TopeveryZeroCoreModule))]
    public class TopeveryZeroModule : AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(Assembly.GetExecutingAssembly());
        }
    }
}
