import {
	userNameRule,
	passwordRule,
	googleCodeRule 
} from '@/utils/validate.js'


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