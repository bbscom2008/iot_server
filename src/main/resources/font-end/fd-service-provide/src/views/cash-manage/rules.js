import {
  rateCheck,
  accountRules,
  integerRule,
  javaLongCheck,
  urlRules,
  rulesName,
  userName,
  userNickNameRules,
  userNameValidate,
  amountCheck
} from '@/utils/validate'

export const queryRules = {
  accountChangeRecordId: [integerRule],
  systemOrderNo: [integerRule],
  userNickName: [{ required: false, message: '请输入用户名称', trigger: 'blur' }, ...userNickNameRules],
  userName: [{ required: false, message: '请输入账号', trigger: 'blur' }, ...userNickNameRules],
  changeAmount: [{ validator: amountCheck, trigger: 'blur' }],
  create_time: [{ required: true, message: '请选择时间', trigger: 'change' }],
}

export const cashRules = {
  newPayAmount: [
    { required: true, message: '请输入金额', trigger: 'blur' },
    { validator: amountCheck, trigger: 'blur' }
  ],
  changeAmount: [{ validator: amountCheck, trigger: 'blur' }],

  createTime: [{ required: true, message: '请选择时间', trigger: 'change' }],
  exportTime: [{ required: true, message: '请选择时间', trigger: 'change' }],
  targetProviderId: [{ required: true, message: '请选择码商', trigger: 'change' }],
  auditResultRemark: [{ max: 255, message: '最大 255 个字符', trigger: 'blur' }],
  checkReason: [{ required: true, message: '请选择原因', trigger: 'change' }],
  otherCheckReson: [
    { required: true, message: '请输入原因', trigger: 'blur' },
    { max: 255, message: '最大 255 个字符', trigger: 'blur' }
  ]
}
