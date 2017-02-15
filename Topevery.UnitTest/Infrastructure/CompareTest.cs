using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Topevery.Infrastructure.Compare;
using Topevery.Infrastructure.Comparer;

namespace Topevery.UnitTest.Infrastructure
{
    [TestClass]
    public class CompareTest
    {
        [TestMethod]
        public void Test()
        {
            TestA a = new TestA()
            {
               Name =  null
            };
            TestA b = new TestA()
            {
                Name = "",
              
            };
           var list =  ComparerHelper.GetFieldModityRecords<TestA>(a, b);
        }
    }
}
