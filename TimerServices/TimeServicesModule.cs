using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Abp.Modules;
using Abp.Threading.BackgroundWorkers;
using Topevery;

namespace TimerServices
{
    [DependsOn(typeof(TopeveryWApplicationModule))]
    public class TimeServicesModule:AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(Assembly.GetExecutingAssembly());
        }

        public override void PostInitialize()
        {
            var workManager = IocManager.Resolve<IBackgroundWorkerManager>();
         
        }
    }
}
