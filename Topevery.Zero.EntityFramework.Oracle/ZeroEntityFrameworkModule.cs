using Abp.Dependency;
using Abp.EntityFramework;
using Abp.Modules;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Topevery.Zero.Core;

namespace Topevery.Zero.EntityFramework.Oracle
{
    [DependsOn(typeof(TopeveryZeroCoreModule),typeof(AbpEntityFrameworkModule))]
    public class ZeroEntityFrameworkModule: AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(Assembly.GetExecutingAssembly());
        }
    }
}
