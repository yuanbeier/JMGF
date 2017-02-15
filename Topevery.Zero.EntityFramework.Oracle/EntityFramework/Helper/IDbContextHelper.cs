namespace Topevery.Zero.EntityFramework.Oracle.EntityFramework.Helper
{
    /// <summary>
    /// dbcontext帮助接口
    /// 袁贝尔
    /// 20160817
    /// </summary>
    public interface IDbContextHelper
    {
        /// <summary>
        /// 获取序列值
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="sequenceName"></param>
        /// <returns></returns>
        T GetSequenceValueByName<T>(string sequenceName) where T : struct;

        /// <summary>
        /// 获取序列值(默认int)
        /// </summary>
        /// <param name="sequenceName"></param>
        /// <returns></returns>
        int GetSequenceValueByName(string sequenceName);
    }
}
