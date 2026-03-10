import {
  rulesCode,
  rulesName,
  userName,
  userNickNameRules,
  userNameValidate,
  codeRule,
  rulesCodeValidate,
  amountCheck000
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
  userNickName: [
    { required: false, message: '请输入用户名称', trigger: 'blur' },
    ...userNickNameRules
  ],
  userName: [{ required: false, message: '请输入账号', trigger: 'blur' }, ...userNickNameRules],
  roleName: [{ required: false, message: '请输入角色名称', trigger: 'blur' }, ...userNickNameRules],

  roleCode: [{ required: false, message: '请输入角色编码', trigger: 'blur' }, ...userNickNameRules]
}

export const sysMangerRules = {
  roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }, ...rulesName],

  roleCode: [{ required: true, message: '请输入角色编码', trigger: 'blur' }, codeRule],
  isActive: [{ required: true, message: '请选择状态', trigger: 'change' }],
  roleId: [{ required: true, message: '请选择角色', trigger: 'change' }],

  ///////////////

  userName: [{ required: true, message: '请输入账号', trigger: 'blur' }, ...userName],
  userNickName: [{ required: true, message: '请输入用户名称', trigger: 'blur' }, ...rulesName]
}
export const riskRules = {
  word: [{ required: true, message: '请输入敏感词', trigger: 'blur' }, ...rulesName],

  isActive: [{ required: true, message: '请选择是否启用', trigger: 'change' }]
}
export const settingRules = {
  configName: [
    { required: true, message: '请输入配置名称', trigger: 'blur' },
    // { min: 1, max: 128, message: '长度在 1 到 128 个字符', trigger: 'blur' }
  ],
  configValue: [
    { required: true, message: '请输入配置键值', trigger: 'blur' },
    // { min: 1, max: 128, message: '长度在 1 到 128 个字符', trigger: 'blur' }
  ],
  configValueAmount: [
    { required: true, message: '请输入配置键值', trigger: 'blur' },
    { validator: amountCheck000, trigger: 'blur' }
  ],
  configValueSelect: [{ required: true, message: '请选择', trigger: 'change' }],
  configValueSettle: [{ required: true, message: '请选择', trigger: 'blur' }],

    // 黑名单配置
  isAutoBlockEnable:[{ required: true, message: '请选择', trigger: 'chage' }],
  duration: [{ required: true, message: '请输入时长范围', trigger: 'blur' }],
  count: [{ required: true, message: '请输入次数', trigger: 'blur' }],
  
}
