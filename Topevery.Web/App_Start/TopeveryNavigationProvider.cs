using System.Linq;
using System.Security.Policy;
using Abp;
using Abp.Application.Navigation;
using Abp.Localization;


namespace Topevery.Web
{
    /// <summary>
    /// This class defines menus for the application.
    /// It uses ABP's menu system.
    /// When you add menu items here, they are automatically appear in angular application.
    /// See .cshtml and .js files under App/Main/views/layout/header to know how to render menu.
    /// </summary>
    public class TopeveryNavigationProvider : NavigationProvider
    {
      

        public TopeveryNavigationProvider()
        {

        }


        public override void SetNavigation(INavigationProviderContext context)
        {
         

          
        }

        private static ILocalizableString L(string name)
        {
            return new LocalizableString(name, TopeveryConsts.LocalizationSourceName);
        }

      
    }
}