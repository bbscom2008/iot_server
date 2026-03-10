import { rateCheck, accountRules, urlRules,integerRule,userNameRule,
   userNickNameRules,  amountCheck, merchantOrderNoRule,tradePwd } from '@/utils/validate'




export const queryRules = {
  systemOrderNo: [
    integerRule
  ],
  merchantOrderNo: [
    merchantOrderNoRule
  ],
  maxPayAmount: [
    { validator: amountCheck, trigger: 'blur' } 
  ],
  minPayAmount: [
    { validator: amountCheck, trigger: 'blur' }
  ],
  minOrderAmount: [
    { validator: amountCheck, trigger: 'blur' }
  ],
  maxOrderAmount: [
    { validator: amountCheck, trigger: 'blur' }
  ],
  confirmOrderUserName: [
    ...userNickNameRules 
  ],
  merchantUserName: [
    ...userNickNameRules
  ],
  merchantUserNickName: [
    ...userNickNameRules 
  ],
  merchantNo:[
    ...userNickNameRules
  ],
  createTime: [
    { required: true, message: '请选择时间', trigger: 'change' } 
  ],


  create_time: [{ required: true, message: '请选择时间', trigger: 'change' }],
  payeeAccountName: [...userNickNameRules],
  providerName: [...userNickNameRules],
  transMemo: [...userNickNameRules]
  
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
  black:[
    { required: true, message: '请选择', trigger: 'change' }
  ],
  createTime: [
    { required: true, message: '请选择时间', trigger: 'change' }
  ],
  targetProviderId: [
    { required: true, message: '请选择码商', trigger: 'change' } 
  ],
  auditResultRemark: [
     { required: true, message: '请选择原因', trigger: 'blur' },
    { max: 255, message: '最大 255 个字符', trigger: 'blur' }
  ],
  checkReason: [
    { required: true, message: '请选择原因', trigger: 'change' } 
  ],
  otherCheckReson: [
    { required: true, message: '请输入原因', trigger: 'blur' },
    { max: 255, message: '最大 255 个字符', trigger: 'blur' }
  ],

  
   transferVoucher: [
    { required: true, message: '请选择文件', trigger: 'blur' },
  ],
    rejectReson: [
    { required: true, message: '请选择原因', trigger: 'change' }
  ],
  

  systemOrderNo: [
    integerRule
  ],
  tradePassword: [{ required: true, message: '请输入交易密码', trigger: 'blur' }, ...tradePwd],
  minOrderAmount: [
    { validator: amountCheck, trigger: 'blur' }
  ],
  maxOrderAmount: [
    { validator: amountCheck, trigger: 'blur' }
  ],
  minPayAmount: [
    { validator: amountCheck, trigger: 'blur' }
  ],
  maxPayAmount: [
    { validator: amountCheck, trigger: 'blur' }
  ],

  confirmOrderUserName: [
    userNameRule
  ]
}


