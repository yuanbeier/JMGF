using System.Collections.Generic;
using Abp.Json;

namespace Topevery.Abp.Page
{
    /// <summary>
    /// 页面结果输出对象，包含行数和数据集合
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class PagedResultOutputDto<T> 
    {

        /// <summary>
        /// 集合数
        /// </summary>
        public int Total { get; set; }

        /// <summary>
        /// 数据集合
        /// </summary>
        public IReadOnlyList<T> Rows { get; set; }

        /// <summary>
        /// 统计
        /// </summary>
        public IReadOnlyList<T> Footer { get; set; }

        /// <summary>
        /// 创建一个界面输出结果Dto
        /// </summary>
        public PagedResultOutputDto() { }

        /// <summary>
        /// 创建一个界面输出结果Dto
        /// </summary>
        /// <param name="totalCount">集合数</param>
        /// <param name="items">集合</param>
        public PagedResultOutputDto(int totalCount, IReadOnlyList<T> items)
        {
            Total = totalCount;
            Rows = items;
        }

        /// <summary>
        /// 创建一个界面输出结果Dto
        /// </summary>
        /// <param name="totalCount">集合数</param>
        /// <param name="items">集合</param>
        /// <param name="footer">统计</param>
        public PagedResultOutputDto(int totalCount, IReadOnlyList<T> items, IReadOnlyList<T> footer)
        {
            Total = totalCount;
            Rows = items;
            Footer = footer;
        }
    }
}
