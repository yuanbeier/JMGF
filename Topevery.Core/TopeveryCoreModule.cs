using System.Reflection;

using Abp.Modules;
using Topevery.Zero;
using Abp.AutoMapper;
using Topevery.Zero.Core;

namespace Topevery
{
    [DependsOn(typeof(TopeveryZeroModule),typeof(AbpAutoMapperModule))]
    public class TopeveryCoreModule : AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(Assembly.GetExecutingAssembly());
        }
    }
}
