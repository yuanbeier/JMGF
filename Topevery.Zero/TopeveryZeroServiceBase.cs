using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.UI;
using Topevery.Zero.Core;



namespace Topevery.Zero
{
    /// <summary>
    /// 应用服务类的基类
    /// </summary>
    public abstract class TopeveryZeroServiceBase : ApplicationService
    {

        protected TopeveryZeroServiceBase()
        {
            LocalizationSourceName = TopeveryZeroConsts.LocalizationSourceName;
        }

    }
}