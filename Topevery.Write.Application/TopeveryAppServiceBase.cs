using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web;
using Abp.Application.Services;
using Topevery.Zero.EntityFramework.Oracle.EntityFramework.Helper;

namespace Topevery
{
    /// <summary>
    /// 应用服务类的基类
    /// </summary>
    public abstract class TopeveryAppServiceBase : ApplicationService
    {
    


        /// <summary>
        /// 
        /// </summary>
        protected TopeveryAppServiceBase()
        {
            LocalizationSourceName = TopeveryConsts.LocalizationSourceName;
        }

      
    }
}