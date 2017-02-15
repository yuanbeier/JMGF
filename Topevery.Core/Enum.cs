using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Topevery
{
    /// <summary>
    /// 文件模板类型Id
    /// 刘珠明
    /// 20160905
    /// </summary>
    public enum ModuleType
    {
        /// <summary>
        /// 房屋租赁申请流程实例扩展表
        /// </summary>
        [Description("房屋租赁申请流程实例扩展表")]
        HouseRentApply = 1,

        /// <summary>
        /// 租金减免申请
        /// </summary>
        [Description("租金减免申请")]
        RentRemissApply = 2,

        /// <summary>
        /// 小修工程任务单
        /// </summary>
        [Description("小修工程任务单")]
        RepairTaskList = 3,

        /// <summary>
        /// 退房屋租金申请
        /// </summary>
        [Description("退房屋租金申请")]
        RefundRentApply = 4,

        /// <summary>
        /// 合同
        /// </summary>
        [Description("合同")]
        Contract = 5,

        /// <summary>
        /// 租户诚信新增
        /// </summary>
        [Description("租户诚信新增")]
        LesseeHonestyMangmentList = 6,

        /// <summary>
        /// 退保证金申请
        /// </summary>
        [Description("退保证金申请")]
        RefundMarginApply = 7,

        /// <summary>
        /// 退房申请
        /// </summary>
        [Description("退房申请")]
        RefundHouseApply = 8,

        /// <summary>
        /// 房屋楼栋
        /// </summary>
        [Description("房屋楼栋")]
        HouseBan = 9,

        /// <summary>
        /// 房屋分户
        /// </summary>
        [Description("房屋分户")]
        HouseUnit = 10,

        /// <summary>
        /// 租金收缴记录
        /// </summary>
        [Description("租金收缴记录")]
        RentCollectRecord = 11,

        /// <summary>
        /// 房屋灭失
        /// </summary>
        [Description("房屋灭失")]
        HouseLoss = 12,

        /// <summary>
        /// 分配房管员
        /// </summary>
        [Description("分配房管员")]
        HouseKeeper = 13,

        /// <summary>
        /// 租户管理
        /// </summary>
        [Description("租户管理")]
        Lessess = 14,

        /// <summary>
        /// 工程预结算单价
        /// </summary>
        [Description("工程预结算单价")]
        HouserRepair = 15,

        /// <summary>
        /// 工程单位档案
        /// </summary>
        [Description("工程单位档案")]
        EngineerUnit = 16,

        /// <summary>
        /// 生成公房银行代收数据
        /// </summary>
        [Description("公房银行代扣数据")]
        BankWithholding = 17,

        /// <summary>
        /// 历史街区银行代收数据
        /// </summary>
        [Description("历史街区银行代收数据")]
        OldBankWithholding = 18,

        /// <summary>
        /// 租户诚信
        /// </summary>
        [Description("租户诚信")]
        LesseeHonesty = 19,

        /// <summary>
        /// 企业诚信
        /// </summary>
        [Description("企业诚信")]
        UnitHonesty = 20,

        /// <summary>
        /// 大中修工程任务单
        /// </summary>
        [Description("大中修工程任务单")]
        RepairLargeAndMedium = 21,

        /// <summary>
        /// 日常检查项目表
        /// </summary>
        [Description("日常安全检查表")]
        DailySafety = 22,

        /// <summary>
        /// 日常检查项目表
        /// </summary>
        [Description("日常检查项目表")]
        DailySafetyType = 23,

        /// <summary>
        /// 专项检查检查表
        /// </summary>
        [Description("专项检查检查表")]
        SpecialSafety = 24,

        /// <summary>
        /// 专项检查项目表 
        /// </summary>
        [Description("专项检查项目表")]
        SpecialSafetyType = 25,

        /// <summary>
        /// 危房检查表 
        /// </summary>
        [Description("危房检查表")]
        DangerousHouse = 26,

        /// <summary>
        /// 房屋完损状况 
        /// </summary>
        [Description("房屋完损状况表")]
        BuildingDamagedCondition = 27,

        /// <summary>
        /// 应急抢险物资登记表 
        /// </summary>
        [Description("应急抢险物资登记表")]
        BuildingDisasterRelief = 28,

        /// <summary>
        /// 应急抢险物资 
        /// </summary>
        [Description("应急抢险物资表")]
        EmergencyRescueSupplies = 29,

        /// <summary>
        /// 房屋楼栋图片
        /// </summary>
        [Description("房屋楼栋图片")]
        HouseBanLuodong = 30,

        /// <summary>
        /// 环节实例
        /// </summary>
        [Description("环节实例")]
        ActivityInstance = 31,

        /// <summary>
        /// 班次维护
        /// </summary>
        [Description("班次维护")]
        ShiftMaintenance = 32,

        /// <summary>
        /// 必经点维护
        /// </summary>
        [Description("必经点维护")]
        ClockPoints = 33,

        /// <summary>
        /// 必经点签到
        /// </summary>
        [Description("必经点签到")]
        InspectCheck = 34,

        /// <summary>
        /// 打卡
        /// </summary>
        [Description("打卡")]
        Sign = 35,

        /// <summary>
        /// 房屋楼栋图片
        /// </summary>
        [Description("分户图片")]
        HouseUnitImage = 36,
    }

    /// <summary>
    /// 单位类型
    /// </summary>
    public enum UnitType
    {
        /// <summary>
        /// 设计单位
        /// </summary>
        DesignUnit = 500062,

        /// <summary>
        /// 施工单位
        /// </summary>
        ConstructionUnit = 500083,

        /// <summary>
        /// 监理单位
        /// </summary>
        SupervisionUnit = 500082
    }

    /// <summary>
    /// 部门类型
    /// </summary>
    public enum Workstation
    {
        /// <summary>
        /// 部门
        /// </summary>
        Department = 15000,

        /// <summary>
        /// 机构
        /// </summary>
        Institutions = 15001,

        /// <summary>
        /// 工作站
        /// </summary>
        Workstation = 15002,

        /// <summary>
        /// 公司
        /// </summary>
        Company = 15003
    }

    /// <summary>
    /// 操作类型
    /// </summary>
    public enum OperatorType
    {
        /// <summary>
        /// 添加
        /// </summary>
        [Description("添加")]
        Add = 1,

        /// <summary>
        /// 修改
        /// </summary>
        [Description("修改")]
        Edit = 2,

        /// <summary>
        /// 删除
        /// </summary>
        [Description("删除")]
        Delete = 3,

        /// <summary>
        /// 导出
        /// </summary>
        [Description("导出")]
        Export = 4,

        /// <summary>
        /// 导入
        /// </summary>
        [Description("导入")]
        Import = 5,

        /// <summary>
        /// 办理
        /// </summary>
        [Description("办理")]
        Transaction = 6,

        [Description("作废")]
        Obsolete = 7
    }

    /// <summary>
    /// 任务单类型
    /// </summary>
    public enum TaskType
    {
        /// <summary>
        /// 小修工程申请
        /// </summary>
        [Description("小修工程申请")]
        RepairEngineering = 1,

        /// <summary>
        /// 大中修工程申请
        /// </summary>
        [Description("大中修工程申请")]
        RepairLargeAndMedium = 2
    }

    /// <summary>
    /// 周末枚举
    /// </summary>
    public enum Week
    {
        Monday = 1,
        Tuesday = 2,
        Wednesday = 3,
        Thursday = 4,
        Friday = 5,
        Saturday = 6,
        Sunday = 0
    }

    /// <summary>
    /// 是否上传
    /// </summary>
    public enum IsUpload
    {
        /// <summary>
        /// 修缮部修缮人员制定修缮方案
        /// 上传施工图纸、预算书等
        /// </summary>
        UploadConstDrawing = 1,

        /// <summary>
        /// 修缮人员上传附件
        /// 招标书、中标通知书、合同相关文件、投标文件等
        /// </summary>
        UploadBiddBook = 2,

        /// <summary>
        /// 验收
        /// 结算书、施工过程图片，文书等
        /// </summary>
        UploadSettlBook = 3
    }

    /// <summary>
    /// 状态
    /// </summary>
    public enum Status
    {
        /// <summary>
        /// 否
        /// </summary>
        Valid = 0,

        /// <summary>
        /// 是
        /// </summary>
        Invalid = 1
    }

    /// <summary>
    ///支付方式 
    /// </summary>
    public enum PaymentType
    {
        /// <summary>
        /// 现金
        /// </summary>
        Cash = 500037,
        /// <summary>
        /// 银行代收
        /// </summary>
        BankWithholding = 500038
    }

    /// <summary>
    /// 所属管辖单位
    /// </summary>
    public enum JurisdictionEnum
    {
        /// <summary>
        /// 公房中心
        /// </summary>
        PublicHouseCenter = 823,
        /// <summary>
        /// 历史街区
        /// </summary>
        HistoricalStreet = 833
    }
}
