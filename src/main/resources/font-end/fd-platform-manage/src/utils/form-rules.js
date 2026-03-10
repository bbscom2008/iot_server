


export const myRules = {

    //--- agent-info ---代理商管理-----------------------
    username:[
        {required:true,message:'请输入',trigger:'blur'},
    ],
    userName:[
        {required:true,message:'请输入',trigger:'blur'},
    ],
    userNickName:[
        {required:true,message:'请输入平台管理员',trigger:'blur'}, 
    ],
    tenantProfitRate:[
        {required:true,message:'请输入',trigger:'blur'}, 
    ],
    
    agentTemplateId:[
        {required:true,message:'请选择',trigger:'change'}, 
    ],
    tenantTemplateId:[
        {required:true,message:'请选择',trigger:'change'}, 
    ],
    domainUrl:[
        {required:true,message:'请输入',trigger:'blur'}, 
    ],
    cashPageDomainUrl:[
        {required:true,message:'请选择',trigger:'change'}, 
    ],
    tenantAgentId:[
        {required:true,message:'请选择',trigger:'change'}, 
    ],
    pcBackImage:[
        {required:true,message:'请选择',trigger:'change'}, 
    ],
    appBackImage:[
        {required:true,message:'请选择',trigger:'change'}, 
    ],
    expireTime:[
        {required:true,message:'请选择',trigger:'change'}, 
    ],
    isActive:[
        {required:true,message:'请选择',trigger:'change'}, 
    ],
    productTypeName:[
        {required:true,message:'请选择',trigger:'change'}, 
    ],
    tradeType:[
        {required:true,message:'请选择',trigger:'change'}, 
    ],
    isPaymentInfoStatic:[
        {required:true,message:'请选择',trigger:'change'}, 
    ],
    isAutoConfirmOrder:[
        {required:true,message:'请选择',trigger:'change'}, 
    ],
    cash_page_template:[
        {required:true,message:'请输入',trigger:'blur'}, 
    ],
    incomeType:[
        {required:true,message:'请选择',trigger:'change'}, 
    ],
    systemRate:[
        {required:true,message:'请输入',trigger:'blur'}, 
    ],
    single_fee:[
        {required:true,message:'请输入费用金额',trigger:'blur'}, 
    ],
    product_type_name:[
        {required:true,message:'请输入产品类型名称',trigger:'blur'}, 
    ],

    //--- merchant-info ---商户管理-----------------------
    merchantAgentUserId:[
        {required:true,message:'请选择',trigger:'change'},
    ],
    merchantId:[
        {required:true,message:'请选择',trigger:'change'},
    ],
    merchantRate:[
        {required:true,message:'请输入',trigger:'blur'},
    ],
    channelId:[
        {required:true,message:'请选择',trigger:'change'},
    ],
    merchantAgentProfitRate:[
        {required:true,message:'请输入',trigger:'blur'},
    ],
    merchantPerTransactionFee:[
        {required:true,message:'请输入',trigger:'blur'},
    ],
    channelName:[
        {required:true,message:'请输入',trigger:'blur'},
    ],
    productTypeId:[
        {required:true,message:'请选择',trigger:'change'},
    ],
    channelCode:[
        {required:true,message:'请输入',trigger:'blur'},
    ],
    isMarchOrderAfterVisit:[
        {required:true,message:'请选择',trigger:'change'}, 
    ],
    
    copy_merchant_template_id:[
        {required:true,message:'请选择模板',trigger:'change'}, 
    ],
    copy_merchat_id:[
        {required:true,message:'请选择商户',trigger:'change'}, 
    ],

    
    //码商管理
    merchant_num:[
        {required:true,message:'请输入',trigger:'blur'},
    ],
    parentId:[
        {required:true,message:'请选择',trigger:'change'}, 
    ],
    providerId:[
        {required:true,message:'请选择',trigger:'change'}, 
    ],
    parentId:[
        {required:true,message:'请选择',trigger:'change'}, 
    ],
    isCollectEnable:[
        {required:true,message:'请选择',trigger:'change'}, 
    ],
    isPaymentEnable:[
        {required:true,message:'请选择',trigger:'change'}, 
    ],
    isChangeYuE:[
        {required:true,message:'请选择',trigger:'change'}, 
    ],
    isAuditRequired:[
        {required:true,message:'请选择',trigger:'change'}, 
    ],
    delayedPaymentTime:[
        {required:true,message:'请选择',trigger:'change'}, 
    ],
    is_look_lower:[
        {required:true,message:'请选择',trigger:'change'}, 
    ],
    is_look_lower_order:[
        {required:true,message:'请选择',trigger:'change'}, 
    ],
    is_cancel_replace_order:[
        {required:true,message:'请选择',trigger:'change'}, 
    ],
    is_replace_order:[
        {required:true,message:'请选择',trigger:'change'}, 
    ],
    isDelayedPayment:[
        {required:true,message:'请选择',trigger:'change'}, 
    ],
    maxConcurrentOrdersCount:[
        {required:true,message:'请输入',trigger:'blur'}, 
    ],
    providerRate:[
        {required:true,message:'请输入',trigger:'blur'}, 
    ],
    providerPerTransactionFee:[
        {required:true,message:'请输入',trigger:'blur'}, 
    ],
    weight:[
        {required:true,message:'请输入',trigger:'blur'}, 
    ],
    userId:[
        {required:true,message:'请选择',trigger:'change'}, 
    ],
    changeType:[
        {required:true,message:'请选择',trigger:'change'}, 
    ],
    changeAmount:[
        {required:true,message:'请输入',trigger:'blur'}, 
    ],
    tradePassword:[
        {required:true,message:'请输入',trigger:'blur'}, 
    ],
    can_use_money:[
        {required:true,message:'请输入',trigger:'blur'}, 
    ],
    availableBalance:[
        {required:true,message:'请输入',trigger:'blur'}, 
    ],

    banlance_type:[
        {required:true,message:'请输入余额类型',trigger:'blur'}, 
    ],
    balance:[
        {required:true,message:'请输入当前余额',trigger:'blur'}, 
    ],
    opt_type:[
        {required:true,message:'请输入操作类型',trigger:'blur'}, 
    ],
    
    service_name:[
        {required:true,message:'请输入当前码商',trigger:'blur'}, 
    ],
    change_money:[
        {required:true,message:'请输入变动金额',trigger:'blur'}, 
    ],
    password:[
        {required:true,message:'请输入交易密码',trigger:'blur'}, 
    ],
    product_name:[
        {required:true,message:'请输入产品名称',trigger:'blur'}, 
    ],
    // remark_type:[
    //     {required:true,message:'请选择转账备注类型',trigger:'change'}, 
    // ],
    channel_name:[
        {required:true,message:'请选择产品名称',trigger:'change'}, 
    ],
    system_fee:[
        {required:true,message:'请输入费率',trigger:'change'}, 
    ],

    income_use_name:[
        {required:true,message:'请选择收款用户名',trigger:'change'}, 
    ],
    handle:[
        {required:true,message:'请选择操作',trigger:'change'}, 
    ],
    product_type_id:[
        {required:true,message:'请选择产品类型',trigger:'change'}, 
    ],
    cash_page_templ_id:[
        {required:true,message:'请选择收银台页面模板',trigger:'change'}, 
    ],
    is_float_enable:[
        {required:true,message:'请选择',trigger:'change'}, 
    ],
    float_allow_duplicate:[
        {required:true,message:'请选择',trigger:'change'}, 
    ],
    order_expire_time:[
        {required:true,message:'请选择订单超时时间',trigger:'change'}, 
    ],
    remark_type:[
        {required:true,message:'请选择类型',trigger:'change'}, 
    ],
    
    float_max:[
        {required:true,message:'请输入浮动最大值',trigger:'blur'}, 
    ],
    float_min:[
        {required:true,message:'请输入浮动最小值',trigger:'blur'}, 
    ],
    float_exclude:[
        {required:true,message:'请输入浮动排除值',trigger:'blur'}, 
    ],
    income_name:[
        {required:true,message:'请输入收款名称',trigger:'blur'}, 
    ],
    fixed_amount:[
        {required:true,message:'请输入固定金额',trigger:'blur'}, 
    ],
    productName:[
        {required:true,message:'请输入',trigger:'blur'}, 
    ],
    isFloatEnable:[
        {required:true,message:'请输入',trigger:'blur'}, 
    ],
    floatMax:[
        {required:true,message:'请输入',trigger:'blur'}, 
    ],
    floatMin:[
        {required:true,message:'请输入',trigger:'blur'}, 
    ],
    floatExclude:[
        {required:true,message:'请输入',trigger:'blur'}, 
    ],
    floatAllowDuplicate:[
        {required:true,message:'请选择',trigger:'change'}, 
    ],
    cashTempleId:[
        {required:true,message:'请选择',trigger:'change'}, 
    ],
    orderExpireTime:[
        {required:true,message:'请选择',trigger:'change'}, 
    ],
    transferRemarkType:[
        {required:true,message:'请选择',trigger:'change'}, 
    ],
    //商户代理

    merchantAgentId:[
        {required:true,message:'请选择',trigger:'change'}, 
    ],



    
//提现管理接口文档

withdrawalAmount:[
    {required:true,message:'请输入',trigger:'blur'}, 
],
can_use_money:[
    {required:true,message:'请输入',trigger:'blur'}, 
],
withdrawalReceiptInfo:[
    {required:true,message:'请输入',trigger:'blur'}, 
],
withdrawalExplanation:[
    {required:true,message:'请输入',trigger:'blur'}, 
],
oldTradePwd:[
    {required:true,message:'请输入',trigger:'blur'}, 
],
googleKey:[
    {required:true,message:'请输入',trigger:'blur'}, 
],
auditDesc:[
    {required:true,message:'请输入',trigger:'blur'}, 
],
tradePassword:[
    {required:true,message:'请输入',trigger:'blur'}, 
],
payee_info:[
    {required:true,message:'请输入',trigger:'blur'}, 
],
account:[
    {required:true,message:'请输入',trigger:'blur'}, 
],
withdrawal_apply_amount:[
    {required:true,message:'请输入',trigger:'blur'}, 
],












    //接口文档梳理后字段名--开始
      /*新增收款信息*/
        payeeAccountName:[
            {required:true,message:'请输入',trigger:'blur'}, 
        ],
        fixedAmount:[
            {required:true,message:'请输入固定金额',trigger:'blur'}, 
        ],
        minAmount:[
            {required:true,message:'请输入',trigger:'blur'}, 
        ],
        maxAmount:[
            {required:true,message:'请输入',trigger:'blur'}, 
        ],
        dailyMaxAmount:[
            {required:true,message:'请输入当日最大金额',trigger:'blur'}, 
        ],
        dailyMaxCount:[
            {required:true,message:'请输入当日最大订单数',trigger:'blur'}, 
        ],
        limitType:[
            {required:true,message:'请选择',trigger:'blur'}, 
        ],
        productId:[
            {required:true,message:'请选择',trigger:'change'}, 
        ],
    //接口文档梳理后字段名--结束
}