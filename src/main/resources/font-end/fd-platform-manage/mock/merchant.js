const mockDb = require('./mockdb.js')

module.exports = [
  {
    /**
     * 获取支付通道列表
     */
    url: '/vue-element-admin/merchant/pay-channel-list',
    type: 'post',
    response: (config) => {
      return {
        code: 200,
        message: 'success',
        data: mockDb.channelList
      }
    }
  },
  {
    /**
     * 获取商户列表
     */
    url: '/vue-element-admin/merchant/merchant-info-list',
    type: 'post',
    response: (config) => {
      return {
        code: 200,
        message: 'success',
        data: [
          {
            id: 12313,
            merchantName: '镇远镖局',
            merchantUsername: 'abc123qq',
            canUseMoney: 8888,
            freezeMoney: 666,
            agentCashPleage: 1000,
            isEnable: true,
            secretKey: 'xksdfuiys56dy35dg36oi867',
            lastLoginTime: '2004-12-12 15:50:50'
          },
          {
            id: 12322,
            merchantName: '龙门客栈',
            merchantUsername: 'long123qq',
            canUseMoney: 8999,
            freezeMoney: 555,
            agentCashPleage: 1000,
            isEnable: true,
            secretKey: 'xksdfasdfe6dy35dg36oi867',
            lastLoginTime: '2004-12-22 18:50:50'
          }
        ]
      }
    }
  },

  {
    /**
     * 提现申请列表
     */
    url: '/vue-element-admin/merchant-cash/apply-for-list',
    type: 'post',
    response: (config) => {
      return {
        code: 200,
        message: 'success',
        data: [
          {
            id: 31,
            orderNum: '29',
            merchantName: '马兰图商号',
            merchantUsername: 'abc123',
            withDrawMoney: 6666,
            withDrawAddr: '招商银行',
            withDrawState: '已完成',
            withDrawTime: '2024-08-10 14:33:03',
            withDrawTips: '提现买车',
            verifier: '张三',
            verifyDesc: '符合规则，可以提现'
          },
          {
            id: 33,
            orderNum: 'xxx29123',
            merchantName: '威震山',
            merchantUsername: 'weizhen123',
            withDrawMoney: 8686,
            withDrawAddr: '中国银行',
            withDrawState: '已完成',
            withDrawTime: '2024-09-10 14:33:03',
            withDrawTips: '提现买房子',
            verifier: '张三',
            verifyDesc: '符合规则，可以提现'
          }
        ]
      }
    }
  }
]
