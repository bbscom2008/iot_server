import {
  rateCheck,
  userNameRule,
  accountRules,
  amountCheck,
  groupIdListRule,
  weightCheck,
  userNickNameRules,
  floatExcludeCheckRule,
  amountCheck100,
  fixedAmountCheckRule,
  dailyMaxCountRule,
  urlRules,
  tradePwd,
  expireDurationRule,
  changeAmount,
  countRules,
  countRules2,
  authIdListRule,
  amountCheck000,
  orderConsecutiveTimeoutLimit
} from '@/utils/validate'

const checkRichText = (rule, value, callback) => {
  if ('<p><br></p>' == value) {
    // 富文本内容为空
    callback(new Error('请输入内容'))
  } else {
    callback()
  }
}

export const templateRules = {
  themeColor: [{ required: true, message: '请选择颜色', trigger: 'change' }],
  templateName: [
    { required: true, message: '请输入名称', trigger: 'blur' },
    // { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' }
  ],

  templateTitleName: [
    { required: true, message: '请输入名称', trigger: 'blur' },
    // { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' }
  ],

  templateTitleLogoUrl: [{ required: true, message: '请选择', trigger: 'blur' }],

  tutorialButtonName: [
    { required: true, message: '请输入名称', trigger: 'blur' },
    // { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' }
  ],
  tutorialFilesUrl: [{ required: true, message: '请选择1-5张图片', trigger: 'blur' }],

  submitTitle: [
    { required: true, message: '请输入名称', trigger: 'blur' },
    // { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' }
  ],

  submitCheckType: [{ required: true, message: '请选择检验格式', trigger: 'blur' }],

  transferRemarkTitle: [
    { required: true, message: '请输入名称', trigger: 'blur' },
    // { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' }
  ],
  tutorialContent: [{ validator: checkRichText, trigger: 'blur' }],
  buttonTitle: [
    { required: true, message: '请输入名称', trigger: 'blur' },
    // { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' }
  ],
  buttonUrl: [
    { required: true, message: '请输入链接', trigger: 'blur' },
    // { min: 1, max: 128, message: '长度在 1 到 128 个字符', trigger: 'blur' }
  ],
  buttonLogoUrl: [{ required: true, message: '请选择', trigger: 'blur' }],

  submitTitle: [
    { required: true, message: '请输入名称', trigger: 'blur' },
    // { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' }
  ],
  showType: [{ required: true, message: '请选择', trigger: 'blur' }],
  checkType: [{ required: true, message: '请选择', trigger: 'blur' }],

  textTitle: [
    { required: true, message: '请输入名称', trigger: 'blur' },
    // { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' }
  ],

  isShow: [{ required: true, message: '请选择', trigger: 'blur' }],

  remark: [
    // { min: 1, max: 128, message: '长度在 1 到 128 个字符', trigger: 'blur' }
  ],

  paramCode: [
    { required: true, message: '请输入参数', trigger: 'blur' },
    // 正则表达式 校验定符串是  数字、字母、下划线，以字母开头，1到32 位，
    // {
    //   pattern: /^[a-zA-Z][a-zA-Z0-9]{0,31}$/,
    //   message: '以字母开头，数字、字母1到32 位',
    //   trigger: 'blur'
    // }
  ],

  paramTitle: [{ required: true, message: '请输入名称', trigger: 'blur' }, 
    // ...userNickNameRules
  ],

  fileTitle: [{ required: true, message: '请输入名称', trigger: 'blur' }, ...userNickNameRules]
}

export const productRules = {
    productName: [{ required: true, message: '请输入名称', trigger: 'blur' }, 
    // ...userNickNameRules
  ],
  productTypeCode: [
    { required: true, message: '请输入编码', trigger: 'blur' },
    // ...userNickNameRules
  ],
  orderConsecutiveTimeoutLimit: [
    { required: false, message: '请输入', trigger: 'blur' },
    orderConsecutiveTimeoutLimit
  ],

  cashTemplateId: [{ required: true, message: '请选择模板', trigger: 'change' }],
  productTypeId: [{ required: true, message: '请选择类型', trigger: 'change' }],
  floatMax: [{ required: true, message: '请输入最大值', trigger: 'blur' }, ...countRules],
  floatMin: [{ required: true, message: '请输入最小值', trigger: 'blur' }, ...countRules],
  floatExclude: [
    { required: true, message: '请输入排除值', trigger: 'blur' },
    floatExcludeCheckRule
  ],
  tradeType: [{ required: true, message: '请选择交易类型', trigger: 'blur' }],
  isFloatEnable: [{ required: true, message: '请选择', trigger: 'blur' }],
  orderExpireTime: [{ required: true, message: '请选择过期时间', trigger: 'change' }],
  transferRemarkType: [{ required: true, message: '请选择类型', trigger: 'change' }],

  maxDailyOrdersCount: [
    { required: true, message: '请输入每日最大订单数', trigger: 'blur' },
    dailyMaxCountRule
  ]
}

export const serviceRules = {
  tradeType: [{ required: true, message: '请选择交易类型', trigger: 'blur' }],
  userName: [{ required: true, message: '请输入账号', trigger: 'blur' }, userNameRule],
  providerNickName: [{ required: true, message: '请输入码商名称', trigger: 'blur' }],
  providerIdList: [{ required: true, message: '请选择码商', trigger: 'change' }],
  userNickName: [
    { required: true, message: '请输入码商名称', trigger: 'blur' },
    { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' }
  ],

  parentId: [{ required: true, message: '请选择上级', trigger: 'change' }],

  maxConcurrentCollectOrdersCount: [
    { required: true, message: '请输入最大同时代收接单数量', trigger: 'blur' },
    ...countRules2
  ],
  maxConcurrentPaymentOrdersCount: [
    { required: true, message: '请输入最大同时代付接单数量', trigger: 'blur' },
    ...countRules2
  ],
  money: [
    { required: true, message: '请输入金额', trigger: 'blur' },
    { validator: amountCheck, trigger: 'blur' }
  ],
  balance: [{ required: true, message: '请输入当前余额', trigger: 'blur' }],
  operationType: [{ required: true, message: '请选择操作类型', trigger: 'change' }],
  amount: [
    { required: true, message: '请输入金额', trigger: 'blur' },
    { validator: amountCheck, trigger: 'blur' }
  ],
  changeAmount: [
    { required: true, message: '请输入金额', trigger: 'blur' },
    { validator: changeAmount, trigger: 'blur' }
  ],
  minAllowableCollectAmount: [
    { required: true, message: '请输入最小允许接单金额', trigger: 'blur' },
    { validator: amountCheck000, trigger: 'blur' }
  ],
  password: [{ required: true, message: '请输入交易密码', trigger: 'blur' }, ...tradePwd],
  productIds: [{ required: true, message: '请选择产品', trigger: 'change' }],
  providerRate: [
    { required: true, message: '请输入费率', trigger: 'blur' },
    { validator: rateCheck, trigger: 'blur' }
  ],
  tradePassword: [{ required: true, message: '请输入交易密码', trigger: 'blur' }, ...tradePwd],
  receiveUserId: [{ required: true, message: '请选择收款用户名', trigger: 'change' }],
  banlance_type: [{ required: true, message: '请输入余额类型', trigger: 'blur' }],

  providerPerTransactionFee: [
    { required: true, message: '请输入单笔手续费', trigger: 'blur' },
    { validator: amountCheck100, trigger: 'blur' }
  ],
  weight: [
    { required: true, message: '请输入权重', trigger: 'blur' },
    { validator: weightCheck, trigger: 'blur' }
  ],
  isActive: [{ required: true, message: '请选择', trigger: 'blur' }],
  providerId: [{ required: true, message: '请选择码商模板', trigger: 'change' }],

  groupIdList: [groupIdListRule],
  personOperatorAuthList: [authIdListRule],
  botUserName:[...userNickNameRules]

}

export const queryRules = {
  productName: [...userNickNameRules],
  userName: [...userNickNameRules],
  payeeAccountName: [...userNickNameRules],
  userNickName: [...userNickNameRules],
  templateName: [...userNickNameRules],
  expireTime: [{ required: true, message: '请选择', trigger: 'change' }],
  createTime: [{ required: true, message: '请选择', trigger: 'change' }],
}
export const patchRules = {
  maxConcurrentCollectOrdersCount: [
    { required: true, message: '请输入最大同时代收接单数量', trigger: 'blur' },
    ...countRules2
  ],
  maxConcurrentPaymentOrdersCount: [
    { required: true, message: '请输入最大同时代付接单数量', trigger: 'blur' },
    ...countRules2
  ],
   productIds: [{ required: true, message: '请选择产品', trigger: 'change' }],
}

export const incomeInfoRules = {
  providerId: [{ required: true, message: '请选择码商', trigger: 'change' }],

  payeeAccountName: [
    { required: true, message: '请输入收款账户名称', trigger: 'blur' },
    ...userNickNameRules
  ],

  limitAmountType: [{ required: true, message: '请选择类型', trigger: 'blur' }],

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
  dailyMaxAmount: [
    { required: true, message: '请输入每日最大金额', trigger: 'blur' },
    { validator: amountCheck, trigger: 'blur' }
  ],
  dailyMaxCount: [
    { required: true, message: '请输入每日最大次数', trigger: 'blur' },
    ...countRules,
    dailyMaxCountRule
  ],

  productId: [{ required: true, message: '请选择产品', trigger: 'change' }],

  textValueRules: [
    { required: true, message: '请输入文本信息', trigger: 'blur' },
    ...userNickNameRules
  ],

  buttonParamValueRules: [
    { required: true, message: '请输入参数', trigger: 'blur' },
    ...userNickNameRules
  ],

  qrUrlRules: [{ required: true, message: '请上传相关文件', trigger: 'blur' }],
  parseValueRules: [
    { required: true, message: '请输入数据', trigger: 'blur' },
    // { min: 1, max: 128, message: '长度在 1 到 128 个字符', trigger: 'blur' }
  ],

  fileUrlRules: [{ required: true, message: '请上传相关文件', trigger: 'blur' }],

  payeeAccountExpireTimeType: [{ required: true, message: '请选择限制类型', trigger: 'change' }],

  payeeAccountExpireTime: [{ required: true, message: '请选择过期时间', trigger: 'change' }],

  payeeAccountExpireDuration: [
    { required: true, message: '请输入时间', trigger: 'change' },
    expireDurationRule
  ]
}

export const configOrderRules = {}
