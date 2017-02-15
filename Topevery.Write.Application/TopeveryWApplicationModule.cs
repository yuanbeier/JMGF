using System.Reflection;
using Abp.Modules;

namespace Topevery
{
    [DependsOn(typeof(TopeveryCoreModule))]
    public class TopeveryWApplicationModule : AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(Assembly.GetExecutingAssembly());

        }
    }
}
