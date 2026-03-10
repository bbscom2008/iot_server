import {
  rulesCode,
  rulesName,
  userName,
  tradePwd,
  integerRule,
  userNickNameRules,
  userNameValidate,
  amountCheck,
  changeAmount
} from '@/utils/validate'

const checkRichText = (rule, value, callback) => {
  if ('<p><br></p>' == value) {
    // 富文本内容为空
    callback(new Error('请输入内容'))
  } else {
    callback()
  }
}
export const queryRules = {
  withdrawalApplyId: [integerRule],
  userNickName: [{ required: false, message: '请输入名称', trigger: 'blur' }, ...userNickNameRules],
  userName: [{ required: false, message: '请输入账号', trigger: 'blur' }, ...userNickNameRules],
  create_time: [{ required: true, message: '请选择时间', trigger: 'change' }]
}
export const merchantCashRules = {
  ////平台提现申请 +提现申请

  ///////////////
  userName: [{ required: true, message: '请输入账号', trigger: 'blur' }, ...userName],
  can_use_money: [{ required: true, message: '请输入可用余额', trigger: 'blur' }],
  withdrawalApplyId: [{ required: true, message: '请输入交易编号', trigger: 'blur' }],
  userNickName: [{ required: true, message: '请输入用户名称', trigger: 'blur' }, ...rulesName],
  withdrawalApplyAmount: [
    { required: true, message: '请输入提现金额', trigger: 'blur' },
    { validator: changeAmount, trigger: 'blur' }
  ],
  availableBalance: [{ required: true, message: '请输入可用余额', trigger: 'blur' }],
  payeeInfo: [
    { required: true, message: '请输入提现收款信息', trigger: 'blur' },
    { min: 1, max: 128, message: '长度在 1 到 128 个字符', trigger: 'blur' }
  ],
  withdrawalApplyDesc: [
    { required: true, message: '请输入提现说明', trigger: 'blur' },
    { min: 1, max: 128, message: '长度在 1 到 128 个字符', trigger: 'blur' }
  ],
  tradePwd: [{ required: true, message: '请输入交易密码', trigger: 'blur' }, ...tradePwd],
  googleCode: [
    { required: true, message: '请输入谷歌验证码', trigger: 'blur' },
    { min: 1, max: 6, message: '长度在 1 到 6 个字符', trigger: 'blur' }
  ],
  auditDesc: [
    { required: false, message: '请输入审核说明', trigger: 'blur' },
    { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' }
  ],
  tradePassword: [{ required: true, message: '请输入交易密码', trigger: 'blur' }, ...tradePwd]
}
