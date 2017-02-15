using System.Web.Optimization;

namespace Topevery.Web
{
    public static class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.IgnoreList.Clear();



            //~/Bundles/Topevery/css
            bundles.Add(
                new StyleBundle("~/Bundles/Topevery/css")
                    .Include("~/Libs/jquery-easyui-1.4.5/themes/bootstrap/easyui-ty.css", new CssRewriteUrlTransform())
                    .Include("~/Css/pending-list.css")
                    .Include("~/Css/icon.css")
                    .Include("~/Css/reset-ty.css")
                );

            //~/Bundles/Topevery/js
            bundles.Add(
                new ScriptBundle("~/Bundles/Topevery/js")
                    .Include(
                        "~/Libs/jquery-easyui-1.4.5/easyui-lang-zh_CN.js",
                        "~/Libs/base.js",
                        "~/Js/base.js",
                        "~/Js/frameHelper.js",
                        "~/Js/message.js",
                        "~/Js/common.js",
                        "~/Libs/jquery-easyui-1.4.5/extEasyUI.js"
                    )
                );

        }
    }
}
