import {
  rateCheck,
  accountRules,
  urlRules,
  integerRule,
  userNameRule,
  userNickNameRules,
  amountCheck,
  merchantOrderNoRule,
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

export const orderRules = {
  payerName: [
    {
      required: true,
      message: '请输入付款人姓名',
      trigger: 'blur'
    },
    ...userNickNameRules
  ],
  payerIp: [
    {
      required: true,
      message: '请输入付款人IP',
      trigger: 'blur'
    },
    ...userNickNameRules
  ],
  commonDialogType: [
    {
      required: true,
      message: '请选择类型',
      trigger: 'change'
    }
  ],
  tradePassword: [{ required: true, message: '请输入交易密码', trigger: 'blur' }, ...tradePwd],
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
  transferDesc: [{ max: 255, message: '最大 255 个字符', trigger: 'blur' }],

  rejectReson: [{ required: true, message: '请选择原因', trigger: 'change' }],
  auditResultRemark: [
    { required: true, message: '请选择原因', trigger: 'blur' },
    { max: 255, message: '最大 255 个字符', trigger: 'blur' }
  ],

  createTime: [{ required: true, message: '请选择时间', trigger: 'change' }],

  // transferVoucher: [{ required: true, message: '请选择文件', trigger: 'blur' }]
}

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
  payeeAccountName: [...userNickNameRules],
  providerName: [...userNickNameRules],
  transMemo: [...userNickNameRules]
}
