import {userNickNameRules} from '@/utils/validate'

export const queryRules = {
  statisticDate: [{ required: true, message: '请选择时间', trigger: 'change' }],

  tenantAgentName: [
    { required: false, message: '请输入平台代理名称', trigger: 'blur' },
    ...userNickNameRules
  ],
  platformName: [
    { required: false, message: '请输入平台名称', trigger: 'blur' },
    ...userNickNameRules
  ],
  merchantName: [
    { required: false, message: '请输入名称', trigger: 'blur' },
    ...userNickNameRules
  ],
  providerName: [
    { required: false, message: '请输入码商名称', trigger: 'blur' },
    ...userNickNameRules
  ],
  productTypeName: [
    { required: false, message: '请输入产品类型名称', trigger: 'blur' },
    ...userNickNameRules
  ],
  productName: [
    { required: false, message: '请输入产品名称', trigger: 'blur' },
    ...userNickNameRules
  ],
}
