using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.WebApi.Authorization;
using Abp.WebApi.Controllers;


namespace Topevery.WebApi
{
    [AbpApiAuthorize]
    public abstract class TopeveryApiControllerBase:AbpApiController
    {

        protected TopeveryApiControllerBase()
        {
            LocalizationSourceName = TopeveryConsts.LocalizationSourceName;
        }


        
    }
}
