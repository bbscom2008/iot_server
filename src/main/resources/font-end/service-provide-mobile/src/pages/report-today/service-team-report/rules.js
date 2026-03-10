import {
	userNameRule,
	passwordRule,
	googleCodeRule,
	integerRule,
	amountCheck,
	userNickNameRule
} from '@/utils/validate.js'



export const queryRules = {
	systemOrderNo: {
		rules: [
			{maxLength:20, errorMessage:"最长20位"},
			integerRule
		]
	},
	merchantOrderNo: {
		rules: [
			userNickNameRule
		]
	},
	providerName: {
		rules: [
			userNickNameRule
		]
	},
	minOrderAmount: {
		rules: [
			amountCheck
		]
	},
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