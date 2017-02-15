using Abp.Web.Mvc.Views;

namespace Topevery.Web.Views
{
    public abstract class TopeveryWebViewPageBase : TopeveryWebViewPageBase<dynamic>
    {

    }

    public abstract class TopeveryWebViewPageBase<TModel> : AbpWebViewPage<TModel>
    {
        protected TopeveryWebViewPageBase()
        {
            LocalizationSourceName = TopeveryConsts.LocalizationSourceName;
        }
    }
}