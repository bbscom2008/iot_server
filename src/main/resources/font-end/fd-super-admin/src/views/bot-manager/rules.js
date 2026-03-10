import {
  rulesCode,
  rulesName,
  userName,
  userNickNameRules,
  userNameValidate,
  rulesCodeValidate
} from '@/utils/validate'

export const botUserMangerRules = {
  botUserName: [{ required: true, message: '请输用户名', trigger: 'blur' }, {
    pattern: /^[a-zA-Z\d_]*$/,
    message: '用户名只能为字母、数字、下划线',
    trigger: 'blur'
  }],
  botUserType: [{ required: true, message: '请选择类型', trigger: 'change' }],
  botChatId: [{ required: true, message: '请输入群组ID', trigger: 'blur' }, {
    pattern: /^-\d+$/,
    message: '群组ID为负号开头数字',
    trigger: 'blur'
  }]
}

export const botDispatchUserMangerRules = {
  botDispatchUserName: [{ required: true, message: '请输转发用户名', trigger: 'blur' }, {
    pattern: /^[a-zA-Z\d_]*$/,
    message: '用户名只能为字母、数字、下划线',
    trigger: 'blur'
  }]
}

export const twoStepPasswordRules = { password: [{ required: true, message: '二步验证密码不能为空', trigger: 'blur' }] }
