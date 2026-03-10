import {
  userNameValidate,
  amountCheckRule,
  amountCheck,
  rateCheckRule,
  userNickNameRules,
  accountRules,
  fixedAmountCheckRule,
  amountCheck100,
  codeRule,
  passwordPattern,
  changeAmount, groupIdRule
} from '@/utils/validate.js'

export const queryRules = {
  userName: [...userNickNameRules],
  userNickName: [...userNickNameRules],
  providerUserName: [...userNickNameRules],
  queryAmount: [amountCheckRule]
}

export const feeChangeFormRules = {
  changeAmount: [
    { required: true, message: '请输入变动金额', trigger: 'blur' },
    { validator: amountCheck, trigger: 'blur' }
  ],
  tradePassword: [{ required: true, message: '请输入交易密码', trigger: 'blur' }, passwordPattern]
}

export const merchantSettingRules = {
  merchantRate: [{ required: true, message: '请输入商户费率', trigger: 'blur' }, rateCheckRule],
  merchantPerTransactionFee: [
    { required: true, message: '请输入费用金额', trigger: 'blur' },
    { validator: changeAmount, trigger: 'blur' }
  ],
  merchantAgentProfitRate: [
    { required: true, message: '请输入代理分润比例', trigger: 'blur' },
    rateCheckRule
  ],
  channelIds: [{ required: true, message: '请选择通道', trigger: 'change' }],

}

export const merchantRules = {

  weight: [{ required: true, message: '请输入权重', trigger: 'blur' }],
  merchantPacket:[{ required: true, message: '请选择商户分组', trigger: 'change' }],

  merchantId: [{ required: true, message: '请选择商户', trigger: 'change' }],

  groupId: [...groupIdRule],

  merchantRate: [{ required: true, message: '请输入商户费率', trigger: 'blur' }, rateCheckRule],

  merchantAgentProfitRate: [
    { required: true, message: '请输入代理分润比例', trigger: 'blur' },
    rateCheckRule
  ],

  merchantPerTransactionFee: [
    { required: true, message: '请输入费用金额', trigger: 'blur' },
    { validator: amountCheck100, trigger: 'blur' }
  ],
  merchantIds: [{ required: true, message: '请选择商户', trigger: 'change' }],

  // roleCode:[
  //     { required: true, message: '请输入角色编码', trigger: 'blur' },
  //     { pattern: /^[a-zA-Z][a-zA-Z0-9]{0,31}$/, message: '以字母开头，数字、字母1到32 位', trigger: 'blur' },
  // ],

  channelId: [{ required: true, message: '请选择通道名称', trigger: 'change' }],
  isActive: [{ required: true, message: '请选择是否启用', trigger: 'change' }],

  userName: [{ required: true, message: '请输入账号', trigger: 'blur' }, ...userNameValidate],
  userNickName: [{ required: true, message: '请输入名称', trigger: 'blur' }, ...userNickNameRules],

  //通道管理
  channelName: [
    { required: true, message: '请输入通道名称', trigger: 'blur' },
    // ...userNickNameRules
  ],
  channelCode: [{ required: true, message: '请输入通道编码', trigger: 'blur' }, codeRule],
  tradeType: [{ required: true, message: '请选择交易类型', trigger: 'change' }],
  limitType: [{ required: true, message: '请选择金额限制类型', trigger: 'change' }],
  productId: [{ required: true, message: '请选择产品', trigger: 'change' }],

  fixedAmount: [
    { required: true, message: '请输入固定金额', trigger: 'blur' },
    fixedAmountCheckRule
  ],
  minAmount: [
    { required: true, message: '请输入最小金额', trigger: 'blur' },
    { validator: amountCheck, trigger: 'blur' }
  ],
  maxAmount: [
    { required: true, message: '请输入最大金额', trigger: 'blur' },
    { validator: amountCheck, trigger: 'blur' }
  ],
  isMatchOrderAfterVisit: [{ required: true, message: '请选择是否访问后匹配', trigger: 'change' }],

  merchantAgentId: [{ required: true, message: '请选择商户代理', trigger: 'change' }],

  providerId: [{ required: true, message: '请选择码商', trigger: 'change' }]
}
