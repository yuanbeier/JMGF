using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Topevery.EntityFramework.Helper;

namespace Topevery.UnitTest
{
    class Program
    {
        static void Main(string[] args)
        {
            TestConcurrentSequence();
            Console.Read();
        }

        /// <summary>
        /// 测试并发获取序列值
        /// </summary>
        public static void TestConcurrentSequence()
        {
            const int n = 50;
            Task[] tasks = new Task[n];
            for (int i = 0; i < n; i++)
            {
                if (i%2 == 0)
                {
                    tasks[i] = Task.Factory.StartNew(() => GetSequence());
                }
                else
                {
                    tasks[i] = Task.Factory.StartNew(() => GetSequencetwo());

                }
            }
            Task.WhenAll(tasks);
        }

        public static void GetSequence()
        {
            int i = SequenceHelper.GetSequenceValueByName("S_T_UM_EVT_REPLY");
            Console.WriteLine("线程Id:" + Task.CurrentId + "序列值:" + i);
        }

        public static void GetSequencetwo()
        {
            Thread.Sleep(100);
            int i = SequenceHelper.GetSequenceValueByName("S_T_UM_EVT_REPLY");
            Console.WriteLine("线程Id:" + Task.CurrentId + "序列值:" + i);
        }
    }
}
