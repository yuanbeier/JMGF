using Microsoft.VisualStudio.TestTools.UnitTesting;
using Topevery.Tenement;
using Topevery.Tenement.Dto;

namespace Topevery.UnitTest.TM
{
    [TestClass]
    public class LesseeInfoAppServiceTests
    {
        private readonly ILesseeInfoRAppService lesseeInfoRepository;
        /// <summary>
        /// 构造函数
        /// </summary>
        /// <param name="_lesseeInfoRepository">ILesseeInfo  Core 接口</param>
        public LesseeInfoAppServiceTests(ILesseeInfoRAppService _lesseeInfoRepository)
        {
            lesseeInfoRepository = _lesseeInfoRepository;
        }
        [TestMethod]
        public void Test()
        {
            //LesseeInfoInput input = new LesseeInfoInput();
            //var List = lesseeInfoRepository.GetLesseeInfoList(input);

        }
    }
}
