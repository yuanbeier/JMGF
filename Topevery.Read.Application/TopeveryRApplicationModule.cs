using System.Collections.Generic;
using System.Reflection;
using Abp.Modules;
using AutoMapper;

namespace Topevery
{
    [DependsOn(typeof(TopeveryCoreModule))]
    public class TopeveryRApplicationModule : AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(Assembly.GetExecutingAssembly());

        }
    }
}
