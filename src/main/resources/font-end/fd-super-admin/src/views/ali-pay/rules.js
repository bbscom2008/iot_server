import { userNickNameRules, userName, rulesName, integerRule, changeAmount } from '@/utils/validate'
export const queryRules = {
  userNickName: [{ required: false, message: '请输入名称', trigger: 'blur' }, ...userNickNameRules],
  create_time: [{ required: true, message: '请选择时间', trigger: 'change' }],
  userName: [{ required: false, message: '请输入账号', trigger: 'blur' }, ...userNickNameRules],
  systemOrderNo: [integerRule],
  payeeAccountName: [...userNickNameRules],
  providerName: [...userNickNameRules],
  transMemo: [...userNickNameRules],
  transAmount: [
    { required: false, message: '请输入金额', trigger: 'blur' },
  ]
}
export const aliPayRules = {
  alipayAccount: [
    { required: true, message: '请输入支付宝账号', trigger: 'blur' },
    ...userNickNameRules
  ],
  alipayName: [
    { required: true, message: '请输入支付宝名称', trigger: 'blur' },
    ...userNickNameRules
  ],
  appId: [
    { required: true, message: '请输入APPID', trigger: 'blur' },
    { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur' }
  ],
  appName: [
    { required: true, message: '请输入应用名称', trigger: 'blur' },
    { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur' }
  ],
  privateKey: [
    { required: true, message: '请输入应用私钥', trigger: 'blur' },
    { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur' }
  ],
  alipayPublicKey: [
    { required: true, message: '请输入支付宝公钥', trigger: 'blur' },
    { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur' }
  ],
  authType: [{ required: true, message: '请选择认证类型', trigger: 'change' }],
  appCertPath: [{ required: true, message: '请上传应用证书', trigger: 'change' }],
  alipayCertPath: [{ required: true, message: '请上传支付宝公钥证书', trigger: 'change' }],
  alipayRootCertPath: [{ required: true, message: '请上传支付宝根证书', trigger: 'change' }],
  isActive: [{ required: true, message: '请选择', trigger: 'change' }]
}
