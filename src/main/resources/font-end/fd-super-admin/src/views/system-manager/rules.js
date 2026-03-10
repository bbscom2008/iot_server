import { rulesCode, rulesName, userName, accountRules, userNickNameRules ,codeRule,amountCheck,amountCheck000} from '@/utils/validate'

export const queryRules = {
  createTime: [{ required: true, message: '请选择时间', trigger: 'change' }],
  requestTime: [{ required: true, message: '请选择时间', trigger: 'change' }],
  handle_time: [{ required: true, message: '请选择时间', trigger: 'change' }],
  userName: [...userNickNameRules],
  userNickName: [...userNickNameRules],
  domain: [
    // { max: 128, message: '最长128位', trigger: 'blur' }
  ],
  bucketName: [
    // { max: 128, message: '最长128位', trigger: 'blur' }
  ],
  roleName: [{ required: false, message: '请输入角色名称', trigger: 'blur' }, ...userNickNameRules],

  roleCode: [{ required: false, message: '请输入角色编码', trigger: 'blur' }, ...userNickNameRules]
}

export const settingRules = {
  configName: [
    { required: true, message: '请输入配置名称', trigger: 'blur' },
    // { min: 1, max: 128, message: '长度在 1 到 128 个字符', trigger: 'blur' }
  ],

  configKey: [
    { required: true, message: '请输入配置键名', trigger: 'blur' },
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

  remark: [
    { required: false, message: '请输入配置说明', trigger: 'blur' },
    // { min: 1, max: 128, message: '长度在 1 到 128 个字符', trigger: 'blur' }
  ],
  configType: [{ required: true, message: '请选择参数类型', trigger: 'change' }],
  configValueSwitch: [{ required: true, message: '请选择', trigger: 'change' }],
  configValueSelect: [{ required: true, message: '请选择', trigger: 'change' }],
  configValueSettle: [{ required: true, message: '请选择', trigger: 'blur' }],

  // 黑名单配置
  isAutoBlockEnable:[{ required: true, message: '请选择', trigger: 'chage' }],
  duration: [{ required: true, message: '请输入时长范围', trigger: 'blur' }],
  count: [{ required: true, message: '请输入次数', trigger: 'blur' }],
}

export const sysMangerRules = {
  roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }, ...rulesName],

  roleCode: [{ required: true, message: '请输入角色编码', trigger: 'blur' }, codeRule],
  isActive: [{ required: true, message: '请选择状态', trigger: 'change' }],
  roleId: [{ required: true, message: '请选择角色', trigger: 'change' }],

  ///////////////

  ossName: [{ required: true, message: '请输入名称', trigger: 'blur' }, ...userNickNameRules],
  userName: [{ required: true, message: '请输入账号', trigger: 'blur' }, ...userName],
  userNickName: [{ required: true, message: '请输入用户名称', trigger: 'blur' }, ...rulesName],
  endpoint: [
    { required: true, message: '请输入访问地址', trigger: 'blur' },
    // { max: 128, message: '最长128位', trigger: 'blur' }
  ],
  region: [
    { required: true, message: '请输入访问区域', trigger: 'blur' },
    // { max: 128, message: '最长128位', trigger: 'blur' }
  ],
  bucketName: [
    { required: true, message: '请输入桶名称', trigger: 'blur' },
    // { max: 128, message: '最长128位', trigger: 'blur' }
  ],
  accessKey: [
    { required: true, message: '请输入访问密钥', trigger: 'blur' },
    // { max: 128, message: '最长128位', trigger: 'blur' }
  ],
  secretKey: [
    { required: true, message: '请输入密钥', trigger: 'blur' },
    // { max: 128, message: '最长128位', trigger: 'blur' }
  ],
  basePath: [
    { required: true, message: '请输入根路径', trigger: 'blur' },
    // { max: 128, message: '最长128位', trigger: 'blur' }
  ],
  domain: [
    { required: true, message: '请输入访问域名', trigger: 'blur' },
    // { max: 128, message: '最长128位', trigger: 'blur' }
  ]
}
