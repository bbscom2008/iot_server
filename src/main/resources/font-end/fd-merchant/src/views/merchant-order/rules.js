import {
  rateCheck,
  accountRules,
  urlRules,
  integerRule,
  userNameRule,
  userNickNameRules,
  amountCheck,
  merchantOrderNoRule,
  googleCode
} from '@/utils/validate'

export const queryRules = {
  systemOrderNo: [integerRule],
  merchantOrderNo: [merchantOrderNoRule],
  maxPayAmount: [{ validator: amountCheck, trigger: 'blur' }],
  minPayAmount: [{ validator: amountCheck, trigger: 'blur' }],
  minOrderAmount: [{ validator: amountCheck, trigger: 'blur' }],
  maxOrderAmount: [{ validator: amountCheck, trigger: 'blur' }],
  confirmOrderUserName: [...userNickNameRules],
  merchantUserName: [...userNickNameRules],
  merchantUserNickName: [...userNickNameRules],
  merchantNo: [...userNickNameRules],
  createTime: [{ required: true, message: '请选择时间', trigger: 'change' }],

  create_time: [{ required: true, message: '请选择时间', trigger: 'change' }],
  systemOrderNo: [integerRule],
  payeeAccountName: [...userNickNameRules],
  providerName: [...userNickNameRules],
  transMemo: [...userNickNameRules],
  transAmount: [integerRule]
}
export const creatRules = {
  channelCode: [{ required: true, message: '请选择支付通道', trigger: 'change' }],
  googleCode: [{ required: true, message: '请输入google验证码', trigger: 'blur' },...googleCode]
}
export const orderRules = {
  commonDialogType: [
    {
      required: true,
      message: '请选择类型',
      trigger: 'change'
    }
  ],

  newPayAmount: [
    { required: true, message: '请输入金额', trigger: 'blur' },
    { validator: amountCheck, trigger: 'blur' }
  ],

  createTime: [{ required: true, message: '请选择时间', trigger: 'change' }],
  targetProviderId: [{ required: true, message: '请选择码商', trigger: 'change' }],
  auditResultRemark: [{ max: 255, message: '最大 255 个字符', trigger: 'blur' }],
  checkReason: [{ required: true, message: '请选择原因', trigger: 'change' }],
  otherCheckReson: [
    { required: true, message: '请输入原因', trigger: 'blur' },
    { max: 255, message: '最大 255 个字符', trigger: 'blur' }
  ],

  systemOrderNo: [integerRule],

  minOrderAmount: [{ validator: amountCheck, trigger: 'blur' }],
  maxOrderAmount: [{ validator: amountCheck, trigger: 'blur' }],
  minPayAmount: [{ validator: amountCheck, trigger: 'blur' }],
  maxPayAmount: [{ validator: amountCheck, trigger: 'blur' }],

  confirmOrderUserName: [userNameRule]
}
