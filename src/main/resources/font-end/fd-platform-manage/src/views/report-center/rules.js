import {userNickNameRules} from '@/utils/validate'

export const queryRules = {
  statisticDate: [{ required: true, message: '请选择时间', trigger: 'change' }],

  merchantAgentName: [
    { required: false, message: '请输入商户代理名称', trigger: 'blur' },
    ...userNickNameRules
  ],
  merchantName: [
    { required: false, message: '请输入商户名称', trigger: 'blur' },
    ...userNickNameRules
  ],
  providerName: [
    { required: false, message: '请输入码商名称', trigger: 'blur' },
    ...userNickNameRules
  ],
  channelName: [
    { required: false, message: '请输入通道名称', trigger: 'blur' },
    ...userNickNameRules
  ],
  productName: [
    { required: false, message: '请输入产品名称', trigger: 'blur' },
    ...userNickNameRules
  ],
}
