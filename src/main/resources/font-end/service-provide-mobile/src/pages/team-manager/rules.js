import {
	userNameRule,
	passwordRule,
	googleCodeRule,
	integerRule,
	amountCheck,
	userNickNameRule,
  countRules2,
  groupIdListRule,
  authIdListRule
} from '@/utils/validate.js'



export const queryRules = {
  userName: {
		rules: [
			userNickNameRule
		]
	},
	userNickName: {
		rules: [
			userNickNameRule
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
}


export const formDataRules = {
	userName: {
		rules: [{
				required: true,
				errorMessage: '请输入用户名'
			},
			userNameRule
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
  maxConcurrentOrdersCount:{
    rules: [{
    		required: true,
    		errorMessage: '请输入最大接单数'
    	},
    	countRules2
    ]
  },
  minAllowableCollectAmount:{
    rules: [{
    		required: true,
    		errorMessage: '请输入最低接单金额'
    	},
    	amountCheck
    ]
  },
  botUserName:{
		rules: [
			userNickNameRule
		]
	},
  groupIdList:{
    rules: [
    	groupIdListRule
    ]
  },
  personOperatorAuthList:{
    rules: [
    	authIdListRule
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
