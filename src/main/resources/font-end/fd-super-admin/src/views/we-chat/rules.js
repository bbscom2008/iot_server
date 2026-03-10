import { userNickNameRules, userName, rulesName } from '@/utils/validate'
export const queryRules = {
  mchId: [...userNickNameRules],
  create_time: [{ required: true, message: '请选择时间', trigger: 'change' }]
}
export const weChatRules = {
    mchId: [
    { required: true, message: '请输入微信商户号', trigger: 'blur' },
    ...userNickNameRules
  ],
  subMchId: [
    { required: false, message: '请输入特约商户号', trigger: 'blur' },
    ...userNickNameRules
  ],
  appId: [
    { required: true, message: '请输入应用ID', trigger: 'blur' },
    { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur' }
  ],
  subAppId: [
    { required: false, message: '请输入子应用ID', trigger: 'blur' },
    { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur' }
  ],

  apiKeyV3: [
    { required: true, message: '请输入apiv3秘钥', trigger: 'blur' },
    { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur' }
  ],
  authType: [{ required: true, message: '请选择认证类型', trigger: 'change' }],
  payPublicKeyId: [
    { required: true, message: '请输入微信支付公钥id', trigger: 'blur' },
    { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur' }
  ],
  payPublicKeyPath: [{ required: true, message: '请上传微信支付公钥路径', trigger: 'change' }],
  apiCertPath: [{ required: true, message: '请上传微信Api证书', trigger: 'change' }],
  apiKeyPath: [{ required: true, message: '请上传私钥文件', trigger: 'change' }],
  certSerialNo: [
    { required: true, message: '请输入证书序列号', trigger: 'blur' },
    { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur' }
  ],
  isActive: [{ required: true, message: '请选择', trigger: 'change' }]
}
