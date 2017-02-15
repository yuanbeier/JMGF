using System;
using System.Configuration;
using System.Web.Configuration;
using Abp.Web;
using Castle.Facilities.Logging;


namespace Topevery.Web
{
    public class MvcApplication : AbpWebApplication<TopeveryWebModule>
    {
        protected override void Application_Start(object sender, EventArgs e)
        {
            AbpBootstrapper.IocManager.IocContainer.AddFacility<LoggingFacility>(f => f.UseLog4Net().WithConfig("log4net.config"));
            base.Application_Start(sender, e);
       
        }
    }
}
