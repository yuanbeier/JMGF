using System;
using System.Collections.Generic;
using Abp.Application.Services.Dto;

namespace Topevery.Abp.Page
{
    /// <summary>
    /// 页面列表输出Dto
    /// Add by duanyongming 20160817
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class AppPagedResultOutput<T> : PagedResultOutput<T>
    {
        private readonly int pageindex = 1;
        private readonly int pagesize = 10;

        public AppPagedResultOutput(int totalCount, IReadOnlyList<T> items, int pageIndex, int pageSize)
            : base(totalCount, items)
        {
            this.pageindex = pageIndex;
            this.pagesize = pageSize;
        }

        /// <summary>
        /// 页码
        /// </summary>
        public int PageIndex
        {
            get { return pageindex; }
        }

        /// <summary>
        /// 每页条数
        /// </summary>
        public int PageSize => pagesize;

        /// <summary>
        /// 页数
        /// </summary>
        public int PageCount
        {
            get
            {
                return (int)Math.Ceiling(((double)TotalCount / PageSize));
            }
        }

        /// <summary>
        /// 开始序号
        /// </summary>
        public int Begin
        {
            get { return PageSize * (PageIndex - 1) + 1; }
        }

        /// <summary>
        /// 结束序号
        /// </summary>
        public int End
        {
            get
            {
                return Math.Min(TotalCount, PageSize * PageIndex);
            }
        }
    }
}
