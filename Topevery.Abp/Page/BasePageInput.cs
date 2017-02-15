using System;
using System.Collections.Generic;
using Abp.Application.Services.Dto;

namespace Topevery.Abp.Page
{
    /// <summary>
    /// 分页基对象
    /// 袁贝尔
    /// 20160826
    /// </summary>
    public class BasePageInput:IPagedResultRequest,ISortedResultRequest
    {
        /// <summary>
        /// 构造函数
        /// </summary>
        public BasePageInput()
        {
            Roles = new List<int>();
        }

        #region 分页属性
        /// <summary>
        /// 页码（从1开始）
        /// </summary>
        public virtual int PageIndex { set; get; }

        /// <summary>
        /// 页容量大小
        /// </summary>
        public virtual int PageCount { set; get; }

        /// <summary>
        /// 起始行位置
        /// </summary>
        public int BeginIndex => (PageIndex - 1) * PageCount;

        /// <summary>
        /// 结束行位置
        /// </summary>
        public int EndIndex => PageIndex * PageCount;

        /// <summary>
        /// 跳过数据行数
        /// </summary>
        public int SkipCount
        {
            get { return (PageIndex - 1) * PageCount; }

            set { throw new NotImplementedException(); }
        }

        /// <summary>
        /// 获取数据行数
        /// </summary>
        public int MaxResultCount
        {
            get { return PageCount; }

            set
            {
                throw new NotImplementedException();
            }
        }


        #endregion

        /// <summary>
        /// 排序字段(用法:字段名 desc)
        /// </summary>
        public virtual string Sorting { set; get; }


        #region 业务属性
        /// <summary>
        /// 角色
        /// </summary>
        public List<int> Roles { set; get; }


        /// <summary>
        /// 用户Id
        /// </summary>
        public virtual long? UserId { set; get; } 

        /// <summary>
        /// 开始时间
        /// </summary>
        public DateTime? BeginTime { set; get; }

        /// <summary>
        /// 结束时间
        /// </summary>
        public DateTime? EndTime { set; get; }
        #endregion



    }
}
