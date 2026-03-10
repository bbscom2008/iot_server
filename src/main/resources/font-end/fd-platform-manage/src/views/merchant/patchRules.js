import {userNameValidate,amountCheck, fixedAmountCheckRule} from '@/utils/validate.js'



export const patchRules = {
    //通道管理
    limitType:[
        { required: true, message: '请选择金额限制类型', trigger: 'change' }
    ],
    fixedAmount:[
        { required: true, message: '请输入固定金额', trigger: 'blur' },
        fixedAmountCheckRule
    ],
    minAmount:[
        { required: true, message: '请输入最小金额', trigger: 'blur' },
        { validator: amountCheck, trigger: 'blur' }
    ],
    maxAmount:[
        { required: true, message: '请输入最大金额', trigger: 'blur' },
        { validator: amountCheck, trigger: 'blur' }
    ],


}