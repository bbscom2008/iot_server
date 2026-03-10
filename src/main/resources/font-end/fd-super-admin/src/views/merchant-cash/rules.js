import { rulesCode, rulesName, userName, tradePassword, tradePwd } from '@/utils/validate'
import {
  rateCheck,
  accountRules,
  integerRule,
  javaLongCheck,
  urlRules,
  amountCheck,
  userNickNameRules,
  userNameValidate
} from '@/utils/validate'
export const queryRules = {
  withdrawalApplyId: [integerRule],
  userNickName: [{ required: false, message: '请输入名称', trigger: 'blur' }, ...userNickNameRules],
  create_time: [{ required: true, message: '请选择时间', trigger: 'change' }],
  userName: [{ required: false, message: '请输入账号', trigger: 'blur' }, ...userNickNameRules]
}
export const merchantCashRules = {
  userName: [{ required: true, message: '请输入账号', trigger: 'blur' }, ...userName],
  can_use_money: [{ required: true, message: '请输入可用余额', trigger: 'blur' }],
  withdrawalApplyId: [{ required: true, message: '请输入交易编号', trigger: 'blur' }, integerRule],
  withdrawalApplyAmount: [
    { required: true, message: '请输入提现金额', trigger: 'blur' },
    { validator: amountCheck, trigger: 'blur' }
  ],
  payeeInfo: [
    { required: true, message: '请输入提现收款信息', trigger: 'blur' },
    { min: 1, max: 128, message: '长度在 1 到 128 个字符', trigger: 'blur' }
  ],
  accountChangeRecordId: [integerRule],

  changeAmount: [{ validator: amountCheck, trigger: 'blur' }],

  auditDesc: [
    { required: false, message: '请输入审核说明', trigger: 'blur' },
    { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' }
  ],
  tradePassword: [{ required: true, message: '请输入交易密码', trigger: 'blur' }, ...tradePwd],
  userNickName: [{ required: true, message: '请输入用户名称', trigger: 'blur' }, ...rulesName]
}
