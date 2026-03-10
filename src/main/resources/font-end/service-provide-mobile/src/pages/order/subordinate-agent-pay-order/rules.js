import {
	userNameRule,
	passwordRule,
	googleCodeRule,
	integerRule,
	amountCheck,
	userNickNameRule
} from '@/utils/validate.js'



export const queryRules = {
  accountChangeRecordId: {
		rules: [
      // {maxLength:20, errorMessage:"最长20位"},
			integerRule
		]
	},
	systemOrderNo: {
		rules: [
			// {maxLength:20, errorMessage:"最长20位"},
			integerRule
		]
	},
	merchantOrderNo: {
		rules: [
			userNickNameRule
		]
	},
	changeAmount: {
		rules: [
			amountCheck
		]
	},
	confirmOrderUserName:{
		rules: [
			userNickNameRule
		]
	},
	createTime: {
		rules: [{
			required: true,
			errorMessage: '请选择时间'
		}
		]	
	},
	startTime: {
    rules: [
      {
        required: true,
        errorMessage: '请选择开始时间'
      }
    ],
    trigger: 'change'
  },
  endTime: {
    rules: [
      {
        required: true,
        errorMessage: '请选择结束时间'
      }
    ],
    trigger: 'change'
  }
}


export const rules = {
	username: {
		rules: [{
				required: true,
				errorMessage: '请输入用户名'
			},
			userNameRule
		]
	},
	password: {
		rules: [{
				required: true,
				errorMessage: '请输入密码'
			},
			passwordRule
		]
	},
	googleCode: {
		rules: [
			googleCodeRule
		]
	},
}