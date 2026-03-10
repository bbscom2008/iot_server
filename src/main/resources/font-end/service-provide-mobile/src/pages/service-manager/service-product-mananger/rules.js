import {
  userNameRule,
  passwordRule,
  googleCodeRule,
  integerRule,
  amountCheck,
  userNickNameRule
} from '@/utils/validate.js'

export const queryRules = {

  productName: {
    rules: [userNickNameRule]
  },
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
