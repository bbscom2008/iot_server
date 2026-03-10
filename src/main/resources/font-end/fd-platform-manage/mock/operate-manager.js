const mockDb = require('./mockdb.js')

module.exports = [
  {
    /**
     * 获取支付通道列表
     */
    url: '/vue-element-admin/opm/channel-info-list',
    type: 'post',
    response: (config) => {
      return {
        code: 200,
        message: 'success',
        data: [
          {
            id: 63,
            productName: '支付宝',
            receipeInfoName: '支付宝二维码收款',
            astrictType: 0,
            astrictMoney: [0],
            astrictMoneyToday: 1000,
            todayAstrictOrder: 4300,
            addupSuccess: 1250,
            todaySuccess: 740,
            yesterdaySuccess: 680,
            createdTime: '2024-07-21 07:40:18',
            takeOrderState: true,
            authorState: true,
            comment: '备注信息'
          },
          {
            id: 66,
            productName: '微信',
            receipeInfoName: '微信二维码收款',
            astrictType: 1,
            astrictMoney: [100, 200, 300],
            astrictMoneyToday: 1250,
            todayAstrictOrder: 2300,
            addupSuccess: 1150,
            todaySuccess: 90,
            yesterdaySuccess: 780,
            createdTime: '2024-09-21 07:40:18',
            takeOrderState: true,
            authorState: true,
            comment: '备注信息2'
          },
          {
            id: 66,
            productName: '微信',
            receipeInfoName: '微信二维码收款',
            astrictType: 2,
            astrictMoney: [1000, 2000],
            astrictMoneyToday: 1250,
            todayAstrictOrder: 2300,
            addupSuccess: 1150,
            todaySuccess: 90,
            yesterdaySuccess: 780,
            createdTime: '2024-09-21 07:40:18',
            takeOrderState: true,
            authorState: true,
            comment: '备注信息2'
          }
        ]
      }
    }
  },
  {
    /**
     * 模板管理列表
     */
    url: '/vue-element-admin/opm/template-manager',
    type: 'post',
    response: (config) => {
      let ret = {
        "code": 200,
        "message": "success",
        "data": mockDb.templateManagerList
      }
      
      return ret;
    }
  },
  {
    /**
     * 系统配置列表
     */
    url: '/vue-element-admin/opm/system-setting',
    type: 'post',
    response: (config) => {
      let ret = {
        "code": 200,
        "message": "success",
        "data": mockDb.systemSettingList
      }
      
      return ret;
    }
  },

  {
    /**
     * 操作日志列表
     */
    url: '/vue-element-admin/opm/log-manager/operate-log',
    type: 'post',
    response: (config) => {
      let ret = {
        "code": 200,
        "message": "success",
        "total": 345,
        "data": mockDb.operateLogList
      }
      
      return ret;
    }
  },
  {
    /**
     * 字典管理列表
     */
    url: '/vue-element-admin/opm/dictionary-manage',
    type: 'post',
    response: (config) => {
      let ret = {
        "code": 200,
        "message": "success",
        "total": 20,
        "data": mockDb.dictionaryManageList
      }
      
      return ret;
    }
  },
  {
    /**
     * 用户登录列表
     */
    url: '/vue-element-admin/opm/log-manager/login-log',
    type: 'post',
    response: (config) => {
      let ret = {
        "code": 200,
        "message": "success",
        "total": 345,
        "data": mockDb.userLoginLogList
      }
      
      return ret;
    }
  },
  {
    /**
     * 产品管理
     */
    url: '/vue-element-admin/opm/product-manage',
    type: 'post',
    response: (config) => {
      let ret = {
        "code": 200,
        "message": "success",
        "total": 23,
        "data": mockDb.productManageList
      }
      
      return ret;
    }
  },
]
