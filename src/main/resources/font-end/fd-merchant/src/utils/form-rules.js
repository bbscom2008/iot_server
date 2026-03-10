
const validateWithdrawalAmount = (rule, value, callback) => {
    console.log(value)
        if (!value) {
          callback(new Error('请输入提现金额'))
        } else {
          callback()
        }
      }

export const myRules = {

    
    userName:[
        {required:true,message:'请输入用户名',trigger:'blur'},
    ],
    availableBalance:[
        {required:true,message:'请输入可用余额',trigger:'blur'},
    ],
    withdrawalAmount:[
        {required:true,message:'请输入提现金额',validator: validateWithdrawalAmount},
    ],
    withdrawalReceiptInfo:[
        {required:true,message:'请输入提现收款信息',trigger:'blur'},
    ],
    withdrawalExplanation:[
        {required:true,message:'请输入提现说明',trigger:'blur'},
    ],
    oldTradePwd:[
        {required:true,message:'请输入交易密码',trigger:'blur'},
    ],
    googleAuthKey:[
        {required:true,message:'请输入谷歌验证码',trigger:'blur'},
    ],
}