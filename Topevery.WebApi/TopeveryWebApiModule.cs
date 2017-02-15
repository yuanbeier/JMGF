using System;
using System.IO;
using System.Linq;
using System.Reflection;
using Abp.Application.Services;
using Abp.Configuration.Startup;
using Abp.Modules;
using Abp.WebApi;
using Abp.WebApi.Controllers.Dynamic.Builders;
using Swashbuckle.Application;
using System.Web.Http;

namespace Topevery
{
    [DependsOn(typeof (AbpWebApiModule), typeof (TopeveryRApplicationModule), typeof (TopeveryWApplicationModule))]
    public class TopeveryWebApiModule : AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(Assembly.GetExecutingAssembly());

            DynamicApiControllerBuilder
                .ForAll<IApplicationService>(typeof (TopeveryRApplicationModule).Assembly, "app")
                .Build();

            DynamicApiControllerBuilder
                .ForAll<IApplicationService>(typeof (TopeveryWApplicationModule).Assembly, "app")
                .Build();

         
            Configuration.Modules.AbpWebApi().HttpConfiguration.Filters.Add(new HostAuthenticationFilter("Bearer"));

            ConfigureSwaggerUi();
        }

        private void ConfigureSwaggerUi()
        {
            Configuration.Modules.AbpWebApi().HttpConfiguration
                .EnableSwagger(c =>
                {
                    c.SingleApiVersion("v1", "SwaggerIntegrationDemo.WebApi");
                    c.ResolveConflictingActions(apiDescriptions => apiDescriptions.First());

                    var baseDirectiory = AppDomain.CurrentDomain.BaseDirectory;

                    var commentsFileName = "bin//Topevery.Write.Application.XML";
                    var commentsFile = Path.Combine(baseDirectiory, commentsFileName);
                    c.IncludeXmlComments(commentsFile);
                     commentsFileName = "bin//Topevery.Read.Application.XML";
                     commentsFile = Path.Combine(baseDirectiory, commentsFileName);
                    c.IncludeXmlComments(commentsFile);

                })
                //访问路径 /apis/index
                .EnableSwaggerUi("apis/{*assetPath}",
                    b => b.InjectJavaScript(Assembly.GetExecutingAssembly(), "Topevery.SwaggerUi.scripts.translator.js")
                );

        }
    }
}
