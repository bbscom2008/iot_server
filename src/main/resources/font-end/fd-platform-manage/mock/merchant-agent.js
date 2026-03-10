const mockDb = require('./mockdb.js')

module.exports = [
  {
    /**
     * 商户代理列表
     */
    url: '/vue-element-admin/merchant-agent/merchant-agent-list',
    type: 'post',
    response: (config) => {
      let ret = {
        "code": 200,
        "message": "success",
        "total": 66,
        "data": mockDb.merchantAgentList
      }
      
      return ret;
    }
  },
  {
    /**
     * 分润配置列表
     */
    url: '/vue-element-admin/merchant-agent/distribute-profit-setting',
    type: 'post',
    response: (config) => {
      let ret = {
        "code": 200,
        "message": "success",
        "total": 32,
        "data": mockDb.distributeProfitList
      }
      
      return ret;
    }
  },
]
