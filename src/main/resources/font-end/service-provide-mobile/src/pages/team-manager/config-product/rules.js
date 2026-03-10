import {
	userNameRule,
	passwordRule,
	googleCodeRule,
	integerRule,
	amountCheck,
	rateRule,
	userNickNameRule
} from '@/utils/validate.js'



export const queryRules = {

	productName: {
		rules: [
			userNickNameRule
		]
	},
	
}


export const formDataRules = {
	
	productIds: {
		rules: [{
				required: true,
				errorMessage: '请选择产品名称'
			},
		]
	},
	productId: {
		rules: [{
				required: true,
				errorMessage: '请选择产品名称'
			},
		]
	},
	providerRate: {
		rules: [{
				required: true,
				errorMessage: '请输入费率'
			},
			rateRule
		]
	},
	providerPerTransactionFee: {
		rules: [{
				required: true,
				errorMessage: '请输入费率'
			},
			amountCheck
		]
	},
	
	userNickName: {
		rules: [{
				required: true,
				errorMessage: '请输入码商名称'
			},
			userNickNameRule
		]
	},

}



export const balanceRules = {
	changeAmount: {
		rules: [{
				required: true,
				errorMessage: '请输入金额'
			},
			amountCheck
		]
	},
	tradePassword: {
		rules: [{
				required: true,
				errorMessage: '请输入交易密码'
			},
			passwordRule
		]
	},

}
