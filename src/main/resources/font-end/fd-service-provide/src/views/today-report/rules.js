import {  userNickNameRules } from '@/utils/validate'

export const queryRules = {
    statisticDate: [{ required: true, message: '请选择时间', trigger: 'change' }],
    productName: [...userNickNameRules],
    payeeAccountName: [...userNickNameRules],
}

