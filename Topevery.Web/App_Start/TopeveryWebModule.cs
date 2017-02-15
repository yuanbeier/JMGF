using System;
using System.Reflection;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using Abp.IO;
using Abp.Localization;
using Abp.Localization.Dictionaries;
using Abp.Localization.Dictionaries.Xml;
using Abp.Modules;
using Abp.Web.Mvc;
using AutoMapper;
using TimerServices;


namespace Topevery.Web
{
    [DependsOn(
        typeof(AbpWebMvcModule),
        typeof(TimeServicesModule),
        typeof(TopeveryWebApiModule),
        typeof(TopeveryDataModule)
        )]
    public class TopeveryWebModule : AbpModule
    {
        public override void PreInitialize()
        {
            //Add/remove languages for your application
            Configuration.Localization.Languages.Add(new LanguageInfo("zh-CN", "简体中文", "famfamfam-flag-cn",true));

            //Add/remove localization sources here
            Configuration.Localization.Sources.Add(
                new DictionaryBasedLocalizationSource(
                    TopeveryConsts.LocalizationSourceName,
                    new XmlFileLocalizationDictionaryProvider(
                        HttpContext.Current.Server.MapPath("~/Localization/Topevery")
                        )
                    )
                );

            //Configure navigation/menu
            Configuration.Navigation.Providers.Add<TopeveryNavigationProvider>();

            //关于缓存的配置
            //Configuration.Caching.Configure(PmiCacheConst.DepartmentCahceStoreName, cache =>
            //{
            //    cache.DefaultSlidingExpireTime = TimeSpan.FromHours(8);//有效期8小时
            //});


            //关于审计的配置               
            Configuration.Auditing.IsEnabled = true;
            Configuration.Auditing.MvcControllers.IsEnabled = false;

            //过滤器注册
            Configuration.UnitOfWork.RegisterFilter("HouseUnitFilter", true);
        }

        public override void Initialize()
        {

            var server = HttpContext.Current.Server;
            IocManager.RegisterAssemblyByConvention(Assembly.GetExecutingAssembly());

            AreaRegistration.RegisterAllAreas();
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }

    }
}
