using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using System.Web;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;


namespace Topevery
{
    /// <summary>
    /// 应用服务类的基类
    /// </summary>
    [AbpAuthorize]
    public abstract class TopeveryAppServiceBase : ApplicationService
    {
      
        protected TopeveryAppServiceBase()
        {
            LocalizationSourceName = TopeveryConsts.LocalizationSourceName;
        }

       
    }
}