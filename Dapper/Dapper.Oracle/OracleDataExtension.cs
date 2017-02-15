using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Dapper;
using Oracle.ManagedDataAccess.Types;

namespace Dapper
{
    public static class OracleDataExtension
    {
 

        /// <summary>
        /// 从Oracle数据类型转成 T 类型（T ，int decimal ....)
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="p"></param>
        /// <returns></returns>
        public static T ChangeByDecimal<T>(this OracleDynamicParameters p,string name) where T : struct
        {
            if (p == null)
            {
                return default(T);
            }
           return p.Get<OracleDecimal, T>(name);
        }

        /// <summary>
        /// 获取数据总数
        /// </summary>
        /// <param name="p"></param>
        /// <returns></returns>
        public static int GetRecordCount(this OracleDynamicParameters p) 
        {
            return p.ChangeByDecimal<int>(DapperConstant.RecordCount);
        }
    }
}
