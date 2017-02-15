namespace Topevery.Zero.Core
{
    /// <summary>
    /// 用户状态
    /// </summary>
    public enum UserStatus
    {
        Normal = 10301,
        Pause = 10302,
        Delete = 10303,
        All = 2147483647,
    }

    /// <summary>
    /// 内置配置
    /// </summary>
    public enum SysInnerEnum
    {
        AppOwner = 1,
        Password = 2,
        VCode = 3,
        AppHost = 4,
        AppSite = 5,
    }

    /// <summary>
    /// 权限角色类型
    /// </summary>
    public enum RoleType
    {
        /// <summary>
        /// 角色
        /// </summary>
        Role = 0,
        /// <summary>
        /// 人员
        /// </summary>
        Staff = 1
    }

    /// <summary>
    /// 数据状态
    /// </summary>
    public enum DbStatus
    {
        /// <summary>
        /// 有效
        /// </summary>
        Valid = 0,

        /// <summary>
        /// 无效
        /// </summary>
        Invalid = 1
    }

    /// <summary>
    /// 实体类型（用于修改记录表）
    /// </summary>
    public enum EntityType
    {
        Houseban,
        Houseunit,
        Housingloss,
        Contract,
        Lesseeinfo,
        Permanentstaff,
        HouseRentApply,
        RefundHouseApply,
        SameMonthReceivableRent
    }

    public enum BusinessType
    {
        /// <summary>
        /// 租金收缴
        /// </summary>
        RentCollectRecord = 1,

        /// <summary>
        /// 退保证金
        /// </summary>
        RefundMargin = 2,

        /// <summary>
        /// 退租金
        /// </summary>
        RefundRent=3
    }
}
