import { userNickNameRules } from '@/utils/validate'

export const queryRules = {
  create_time: [{ required: true, message: '请选择时间', trigger: 'change' }],
  expire_time: [{ required: true, message: '请选择时间', trigger: 'change' }],
  statisticDate: [{ required: true, message: '请选择时间', trigger: 'change' }],
  platformName: [
    { required: false, message: '请输入平台名称', trigger: 'blur' },
    ...userNickNameRules
  ],
  tenantName :[
    { required: false, message: '请输入平台名称', trigger: 'blur' },
    ...userNickNameRules
  ],
}
