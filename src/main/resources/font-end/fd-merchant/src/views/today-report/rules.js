import {  userNickNameRules } from '@/utils/validate'

export const queryRules = {
    statisticDate: [{ required: true, message: '请选择时间', trigger: 'change' }],
    channelName: [
        { required: false, message: '请输入通道名称', trigger: 'blur' },
        ...userNickNameRules
      ],
}

