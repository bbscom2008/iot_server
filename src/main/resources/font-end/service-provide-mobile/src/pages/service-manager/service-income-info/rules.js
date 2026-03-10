import {
  userNameRule,
  passwordRule,
  googleCodeRule,
  integerRule,
  fixedAmountCheckRule,
  dailyMaxCountRule,
  amountCheck,
  userNickNameRule
} from '@/utils/validate.js'

export const queryRules = {
  userName: {
    rules: [userNickNameRule]
  },
  payeeAccountName: {
    rules: [userNickNameRule]
  },
  createTime: {
    rules: [
      {
        required: true,
        errorMessage: '请选择时间'
      }
    ]
  }
}

export const formDataRules = {
  withdrawalApplyAmount: {
    rules: [
      {
        required: true,
        errorMessage: '请输入提现金额'
      },
      amountCheck
    ]
  },
  payeeInfo: {
    rules: [
      {
        required: true,
        errorMessage: '请输入提现收款信息'
      },
      { maxLength: 128, errorMessage: '最长128个字符' }
    ]
  },
  withdrawalApplyDesc: {
    rules: [
      {
        required: true,
        errorMessage: '请输入提现说明'
      },
      { maxLength: 128, errorMessage: '最长128个字符' }
    ]
  },
  tradePwd: {
    rules: [
      {
        required: true,
        errorMessage: '请输入交易密码'
      },
      passwordRule
    ]
  },
  googleCode: {
    rules: [
      {
        required: true,
        errorMessage: '请输入谷歌密钥'
      },
      googleCodeRule
    ]
  }
}

export const incomeInfoRules = {
  providerId: {
    rules: [
      {
        required: true,
        errorMessage: '请选择供应商'
      }
    ]
  },
  textValueRules: [
    {
      required: true,
      errorMessage: '请输入'
    }
  ],
  buttonParamValueRules: [
    {
      required: true,
      errorMessage: '请输入'
    }
  ],
  qrUrlRules: [
    {
      required: true,
      errorMessage: '请选择图片'
    }
  ],
  fileUrlRules: [
    {
      required: true,
      errorMessage: '请选择文件'
    }
  ],
  parseValueRules: [
    {
      required: true,
      errorMessage: '请输入数据'
    }
  ],
  'payeeAccountConfig.qrConfig.parseValue': [
    {
      required: true,
      errorMessage: '请输入数据'
    }
  ],
  fixedAmount: {
    rules: [
      {
        required: true,
        errorMessage: '请输入固定金额'
      },
      fixedAmountCheckRule
    ],
    trigger: 'blur'
  },
  dailyMaxAmount: {
    rules: [
      {
        required: true,
        errorMessage: '请输入每日最大提现金额'
      },
      // amountCheck
    ],
    trigger: 'blur'
  },
  dailyMaxCount: {
    rules: [
      {
        required: true,
        errorMessage: '请输入每日最大提现次数'
      },
      // dailyMaxCountRule,
    ]
  },
  payeeAccountExpireTime: {
    rules: [
      {
        required: true,
        errorMessage: '请选择过期时间'
      }
    ],
    trigger: 'change'
  },
  payeeAccountExpireDuration: {
    rules: [
      {
        required: true,
        errorMessage: '请输入过期时长'
      },
      {
        required: true,
        errorMessage: '请输入过期时长'
      },
      integerRule
    ],
    trigger: 'blur'
  },
}
