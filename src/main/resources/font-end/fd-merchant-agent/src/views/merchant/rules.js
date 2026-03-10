import {
    amountCheckRule,
    userNickNameRules,
  } from '@/utils/validate.js'
  
  export const queryRules = {
    userName: [...userNickNameRules],
    queryAmount: [amountCheckRule]
  }
  