import { rulesCode, rulesName, userName, tradePwd, amountCheck, userNickNameRules,
  userNameValidate, googleCode } from '@/utils/validate'

export const passwordRules = {

  // 安全中心
  oldPassword: [
    { required: true, message: '请输入原登录密码', trigger: 'blur' },
    ...tradePwd
  ],
  newPassword: [
    { required: true, message: '请输入新登录密码', trigger: 'blur' },
    ...tradePwd
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    ...tradePwd
  ],
  googleCode: [
    { required: true, message: '请输入谷歌验证码', trigger: 'blur' },
    ...googleCode
  ],

  oldTradePwd: [
    { required: false, message: '请输入原交易密码', trigger: 'blur' },
    ...tradePwd
  ],
  newTradePwd: [
    { required: true, message: '请输入新交易密码', trigger: 'blur' },
    ...tradePwd
  ],
  loginPwd: [
    { required: true, message: '请输入登录密码', trigger: 'blur' },
    ...tradePwd
  ]

}
