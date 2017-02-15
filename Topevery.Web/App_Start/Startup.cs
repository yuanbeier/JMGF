using Microsoft.Owin;
using Owin;
using Abp.Owin;
using Microsoft.Owin.Security.Cookies;
using Topevery.Zero;
using Topevery.Web;

[assembly: OwinStartup(typeof(Startup))]

namespace Topevery.Web
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.UseAbp();



            app.UseCookieAuthentication(new CookieAuthenticationOptions
            {
                AuthenticationType = DefaultAuthenticationTypes.ApplicationCookie,
                LoginPath = new PathString("/Account/Login")
            });
        }
    }
}