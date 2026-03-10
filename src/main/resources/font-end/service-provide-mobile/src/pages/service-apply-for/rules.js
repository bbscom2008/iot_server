import {
  userNameRule,
  passwordRule,
  googleCodeRule,
  integerRule,
  amountCheck,
  userNickNameRule
} from '@/utils/validate.js'

export const queryRules = {
  withdrawalApplyId: {
    rules: [integerRule]
  },
  systemOrderNo: {
    rules: [
      // {maxLength:20, errorMessage:"最长20位"},
      integerRule
    ]
  },
  merchantOrderNo: {
    rules: [userNickNameRule]
  },
  createTime: {
    rules: [
      {
        required: true,
        errorMessage: '请选择日期'
      }
    ]
  }
}

export const rules = {
  username: {
    rules: [
      {
        required: true,
        errorMessage: '请输入用户名'
      },
      userNameRule
    ]
  },
  password: {
    rules: [
      {
        required: true,
        errorMessage: '请输入密码'
      },
      passwordRule
    ]
  },
  googleCode: {
    rules: [googleCodeRule]
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
