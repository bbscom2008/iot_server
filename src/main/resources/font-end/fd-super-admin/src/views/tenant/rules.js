import {
  rateCheck,
  accountRules,
  urlRules,
  userNickNameRules,
  userName,
  amountCheck,
  rulesName,
  changeAmount,
  domainRule,
  tradePwd
} from '@/utils/validate'

const arrayCheck = (rule, value, callback) => {
  console.log('value', value)

  if (value && value.length === 0) {
    callback(new Error('请上传图片'))
  } else {
    callback()
  }
}

export const queryRules = {
  createTime: [{ required: true, message: '请选择时间', trigger: 'change' }],
  productTypeName: [...userNickNameRules],
  userName: [...userNickNameRules],
  userNickName: [...userNickNameRules],
  tenantName: [
    // ...userNickNameRules
    // { required: true, message: '请输入名称', trigger: 'blur' }
  ]
}

export const tenantRules = {
  userName: [{ required: true, message: '请输入账号', trigger: 'blur' }, ...userName],
  tradePassword: [{ required: true, message: '请输入交易密码', trigger: 'blur' }, ...tradePwd],
  banlance_type: [{ required: true, message: '请输入余额类型', trigger: 'blur' }],
  balance: [{ required: true, message: '请输入当前余额', trigger: 'blur' }],
  operationType: [{ required: true, message: '请输入操作类型', trigger: 'blur' }],
  amount: [
    { required: true, message: '请输入金额', trigger: 'blur' },
    { validator: amountCheck, trigger: 'blur' }
  ],

  agentName: [
    { required: true, message: '请输入代理商名称', trigger: 'blur' },
    { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' }
  ],

  tenantProfitRate: [
    { required: true, message: '请输入比例', trigger: 'blur' },
    { validator: rateCheck, trigger: 'blur' }
  ],

  //-------平台管理

  username: [
    { required: true, message: '请输入平台账号', trigger: 'blur' },
    { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' },
    ...accountRules
  ],

  userNickName: [{ required: true, message: '请输入名称', trigger: 'blur' }, ...userNickNameRules],

  cashPageDomainUrl: [{ required: true, message: '请选择收银台域名', trigger: 'change' }],
  tenantAgentId: [{ required: true, message: '请选择代理', trigger: 'change' }],

  tenantDomainId: [{ required: true, message: '请输入平台地址', trigger: 'blur' }, ...urlRules],

  pcBackImage: [
    // { required: true, message: '请上传PC端背景图', trigger: 'blur' }
    { required: true, validator: arrayCheck, trigger: 'blur' }
  ],

  appBackImage: [{ required: true, validator: arrayCheck, trigger: 'blur' }],

  expireTime: [{ required: true, message: '请选择到期时间', trigger: 'blur' }],
  tenantDomain: [
    { required: true, message: '请输入平台域名', trigger: 'blur' },
    { min: 1, max: 128, message: '长度在 1 到 128 个字符', trigger: 'blur' }
  ],

  tenantTemplateId: [{ required: true, message: '请选择模板', trigger: 'change' }],

  ossConfigId: [{ required: true, message: '请选择对象存储', trigger: 'change' }],
  //-------- 产品类型列表
  productTypeName: [
    { required: true, message: '请输入产品类型名称', trigger: 'blur' },
    { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' }
  ],

  productTypeCode: [
    { required: true, message: '请输入产品类型编码', trigger: 'blur' },
    ...userNickNameRules
  ],

  tradeType: [{ required: true, message: '请选择交易类型', trigger: 'blur' }],

  cashTemplateId: [{ required: true, message: '请选择收银台模板', trigger: 'change' }],

  incomeType: [{ required: true, message: '请选择收入类型', trigger: 'blur' }],
  isPaymentInfoStatic: [{ required: true, message: '请选择是否静态', trigger: 'blur' }],

  paymentDataType: [{ required: true, message: '请选择收款信息类型', trigger: 'blur' }],

  isAutoConfirmOrder: [{ required: true, message: '请选择是否自动确认', trigger: 'blur' }],
  isActive: [{ required: true, message: '请选择是否启用', trigger: 'blur' }],
  isEnableFloating: [{ required: true, message: '请选择是否开启浮动', trigger: 'blur' }],

  agentTemplateId: [{ required: true, message: '请选择代理商模板', trigger: 'blur' }],

  // ---------------绑定 产品类型

  productTypeIds: [{ required: true, message: '请选择产品类型', trigger: 'blur' }],

  systemRate: [
    { required: true, message: '请输入系统费率', trigger: 'blur' },
    { validator: rateCheck, trigger: 'blur' }
  ],

  tenantName: [
    { required: true, message: '请输入平台名称', trigger: 'blur' }
    // { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' }
  ],
  platformUrl: [{ required: true, message: '请输入平台域名', trigger: 'blur' }, domainRule],
  merchantAgentUrl: [
    { required: true, message: '请输入商户代理域名', trigger: 'blur' },
    domainRule
  ],
  merchantUrl: [{ required: true, message: '请输入商户域名', trigger: 'blur' }, domainRule],
  serverUrl: [{ required: true, message: '请输入码商PC端域名', trigger: 'blur' }, domainRule],
  serverMobileUrl: [
    { required: true, message: '请输入手机端域名地址', trigger: 'blur' },
    domainRule
  ],
  apiUrl: [
    { required: true, message: '请输入支付网关地址', trigger: 'blur' },
    { min: 1, max: 128, message: '长度在 1 到 128 个字符', trigger: 'blur' }
  ]
}
export const neturlRules = {
  productTypeCode: [{ required: true, message: '请选择产品类型编码', trigger: 'blur' }],
  analyticalModel: [
    { required: false, message: '请输入解析模式', trigger: 'blur' },
    ...userNickNameRules
  ],
  placeholder: [
    { required: false, message: '请输入占位符', trigger: 'blur' },
    ...userNickNameRules
  ],
  replaceValue: [
    { required: false, message: '请输入替换值', trigger: 'blur' },
    ...userNickNameRules
  ],
  isActive: [{ required: true, message: '请选择是否启用', trigger: 'blur' }]
}
