import { amountCheck, accountRules, userNickNameRules , passwordPattern} from '@/utils/validate.js'



export const queryRules = {
  userName: [
   ...userNickNameRules
  ],
  userNickName: [
    ...userNickNameRules
  ],
  createTime: [
    {required: true, message: '请选择时间', trigger: 'change' } 
  ]
}


export const merchantRules = {
  merchantId: [
    { required: true, message: '请输入租户名称', trigger: 'blur' },
    { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' }
  ],
  merchantRate: [
    { required: true, message: '请输入商户费率', trigger: 'blur' },
    { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' }
  ],
  merchantAgentProfitRate: [
    { required: true, message: '请输入代理分润比例', trigger: 'blur' },
    { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' }
  ],
  merchantPerTransactionFee: [
    { required: true, message: '请输入费用金额', trigger: 'blur' },
    { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' }
  ],

  // roleCode:[
  //     { required: true, message: '请输入角色编码', trigger: 'blur' },
  //     { pattern: /^[a-zA-Z][a-zA-Z0-9]{0,31}$/, message: '以字母开头，数字、字母1到32 位', trigger: 'blur' },
  // ],

  channelId: [{ required: true, message: '请选择通道名称', trigger: 'change' }],
  isActive: [{ required: true, message: '请选择是否启用', trigger: 'change' }],

  userNickName: [
    { required: true, message: '请输入名称', trigger: 'blur' },
    { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' }
  ],

  merchantAgentId: [{ required: true, message: '请选择代理', trigger: 'change' }],

  //通道管理
  channelName: [
    { required: true, message: '请输入通道名称', trigger: 'blur' },
    { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' }
  ],
  channelCode: [
    { required: true, message: '请输入通道编码', trigger: 'blur' },
    // {
    //   pattern: /^[a-zA-Z][a-zA-Z0-9]{0,31}$/,
    //   message: '以字母开头，数字、字母组成，长度1到32 位',
    //   trigger: 'blur'
    // }
  ],

  tradeType: [{ required: true, message: '请选择交易类型', trigger: 'change' }],
  limitType: [{ required: true, message: '请选择金额限制类型', trigger: 'change' }],
  productId: [{ required: true, message: '请选择产品', trigger: 'change' }],
  fixedAmount: [
    { required: true, message: '请输入固定金额', trigger: 'blur' },
    { validator: amountCheck, trigger: 'blur' }
  ],
  minAmount: [
    { required: true, message: '请输入最小金额', trigger: 'blur' },
    { validator: amountCheck, trigger: 'blur' }
  ],
  maxAmount: [
    { required: true, message: '请输入最大金额', trigger: 'blur' },
    { validator: amountCheck, trigger: 'blur' }
  ],
  isMarchOrderAfterVisit: [{ required: true, message: '请选择是否访问后匹配', trigger: 'change' }],

  amount: [
    { required: true, message: '请输入金额', trigger: 'blur' },
    { validator: amountCheck, trigger: 'blur' }
  ],
  tradePassword: [
    { required: true, message: '请输入交易密码', trigger: 'blur' },
    passwordPattern
  ]
}
