const userList = [
    {
      id: 6260027865541384,
      username: 'doggie',
      roles: [
        {
          roleId: 97851018,
          roleName: 'MiRQL'
        },
        {
          roleId: 88480647,
          roleName: 'sqqxJkupr'
        }
      ],
      status: 1,
      isBindGoogleCode: 1,
      comment: '至响场养片门务将义。当水积保率。如和约开。',
      createBy: 'Dugs',
      createTime: '2025-08-07 03:06:21'
    },
    {
      id: 4169104068739556,
      username: 'doggie',
      roles: [
        {
          roleId: 31121979,
          roleName: 'oXqPsm'
        }
      ],
      status: 1,
      isBindGoogleCode: 0,
      comment: '少你先发写段。而非住并。复文七代东合确家。',
      createBy: 'kvpDe',
      createTime: '2024-09-03 13:19:29'
    },
    {
      id: 6199039438916984,
      username: 'doggie',
      roles: [
        {
          roleId: 46450957,
          roleName: 'dBbEvabV'
        },
        {
          roleId: 42717583,
          roleName: 'myxHFlzpNG'
        }
      ],
      status: 1,
      isBindGoogleCode: 1,
      comment: '以节交确花打。将矿队。数数观热效历义据水。',
      createBy: 'JhNcM',
      createTime: '2024-06-23 17:33:41'
    }
  ]
  
  // const dashBoardData = {
    // agentPayData: [
    //   {
    //     totalOrderCount: 16883,
    //     totalOrderAmount: 46220.52,
    //     finishOrderCount: 9251,
    //     finishOrderAmount: 2831.66,
    //     successRate: 92,
    //     systemServiceCharge: 1220
    //   },
    //   {
    //     totalOrderCount: 17393,
    //     totalOrderAmount: 38395.07,
    //     finishOrderCount: 11572,
    //     finishOrderAmount: 11162.55,
    //     successRate: 99,
    //     systemServiceCharge: 9631
    //   }
    // ],
    // agentIncomeData: [
    //   {
    //     totalOrderCount: 4393,
    //     totalOrderAmount: 51730.77,
    //     finishOrderCount: 12403,
    //     finishOrderAmount: 7086.98,
    //     successRate: 97,
    //     systemServiceCharge: 18133
    //   },
    //   {
    //     totalOrderCount: 13503,
    //     totalOrderAmount: 92330.32,
    //     finishOrderCount: 13758,
    //     finishOrderAmount: 13217.56,
    //     successRate: 98,
    //     systemServiceCharge: 12224
    //   }
    // ]
  // }
  const dashBoardData = {
    income: [
      [
        {
          id: '1',
          label: '订单数量',
          num: '4393',
          unit: '个',
          bg: '#cccccc',
          icon: 'dingdan'
        },
        {
          id: '2',
          label: '订单金额',
          num: '36544',
          unit: '元',
          bg: '#cccccc',
          icon: 'dingdanjine'
        },
        {
          id: '3',
          label: '成功率',
          num: '36',
          unit: '%',
          bg: '#99cccc',
          icon: 'a-chenggongshuai1x'
        },
        {
          id: '4',
          label: '利润',
          num: '14587',
          unit: '元',
          bg: '#99cccc',
          icon: 'a-shourulirunzhuanqiantourubaochougongzi'
        },
        {
          id: '5',
          label: '成交订单数量',
          num: '9658',
          unit: '个',
          bg: '#99cc99',
          icon: 'hetong-dingdanshuliang'
        },
        {
          id: '6',
          label: '成交订单金额',
          num: '25468',
          unit: '元',
          bg: '#99cc99',
          icon: 'chengjiaodingdanjine'
        }
      ],
      [
        {
          id: '1',
          label: '订单数量',
          num: '6528',
          unit: '个',
          bg: '#cccccc',
          icon: 'dingdan'
        },
        {
          id: '2',
          label: '订单金额',
          num: '16548',
          unit: '元',
          bg: '#cccccc',
          icon: 'dingdanjine'
        },
        {
          id: '3',
          label: '成功率',
          num: '65',
          unit: '%',
          bg: '#99cccc',
          icon: 'a-chenggongshuai1x'
        },
        {
          id: '4',
          label: '利润',
          num: '3625',
          unit: '元',
          bg: '#99cccc',
          icon: 'a-shourulirunzhuanqiantourubaochougongzi'
        },
        {
          id: '5',
          label: '成交订单数量',
          num: '9865',
          unit: '个',
          bg: '#99cc99',
          icon: 'hetong-dingdanshuliang'
        },
        {
          id: '6',
          label: '成交订单金额',
          num: '25486',
          unit: '元',
          bg: '#99cc99',
          icon: 'chengjiaodingdanjine'
        }
      ]
    ],
    pay: [
       [
            {
              id: '1',
              label: '订单数量',
              num: '1526',
              unit: '个',
              bg: '#63B8FF',
              icon: 'dingdan'
            },
            {
              id: '2',
              label: '订单金额',
              num: '24356',
              unit: '元',
              bg: '#FF4500',
              icon: 'dingdanjine'
            },
            {
              id: '3',
              label: '成功率',
              num: '52',
              unit: '%',
              bg: '#388E8E',
              icon: 'a-chenggongshuai1x'
            },
            {
              id: '4',
              label: '利润',
              num: '9852',
              unit: '元',
              bg: '#7CCD7C',
              icon: 'a-shourulirunzhuanqiantourubaochougongzi'
            },
            {
              id: '5',
              label: '成交订单数量',
              num: '1523',
              unit: '个',
              bg: '#EEC900',
              icon: 'hetong-dingdanshuliang'
            },
            {
              id: '6',
              label: '成交订单金额',
              num: '7586',
              unit: '元',
              bg: '#4A708B',
              icon: 'chengjiaodingdanjine'
            }
          ],
          [
            {
              id: '1',
              label: '订单数量',
              num: '8495',
              unit: '个',
              bg: '#63B8FF',
              icon: 'dingdan'
            },
            {
              id: '2',
              label: '订单金额',
              num: '9586',
              unit: '元',
              bg: '#FF4500',
              icon: 'dingdanjine'
            },
            {
              id: '3',
              label: '成功率',
              num: '42',
              unit: '%',
              bg: '#388E8E',
              icon: 'a-chenggongshuai1x'
            },
            {
              id: '4',
              label: '利润',
              num: '1542',
              unit: '元',
              bg: '#7CCD7C',
              icon: 'a-shourulirunzhuanqiantourubaochougongzi'
            },
            {
              id: '5',
              label: '成交订单数量',
              num: '3564',
              unit: '个',
              bg: '#EEC900',
              icon: 'hetong-dingdanshuliang'
            },
            {
              id: '6',
              label: '成交订单金额',
              num: '7948',
              unit: '元',
              bg: '#4A708B',
              icon: 'chengjiaodingdanjine'
            }
          ]
    ]
  }
  const roleList = [
    {
      id: 6260027865541384,
      rolename: 'doggie',
      description: '锄禾日当午',
      createTime: '2025-08-07 03:06:21'
    },
    {
      id: 4169104068739556,
      rolename: 'miaomi',
      description: '汗滴禾下土',
      createTime: '2024-09-03 13:19:29'
    },
    {
      id: 6199039438916984,
      rolename: 'peiqi',
      description: '谁知盘中餐',
      createTime: '2024-06-23 17:33:41'
    },
    {
      id: 2689541619903257,
      rolename: 'milaoshu',
      description: '粒粒皆辛苦',
      createTime: '2024-06-23 17:26:38'
    }
  ]
  
  /**
   * 通道列表
   */
  const channelList = [
    {
      id: 13123,
      channelName: '支付宝',
      channelcode: 856,
      astrictType: 1,
      money: [100, 200],
      rate: 3,
      enable: true,
      comment: '支付宝扫码支付'
    },
    {
      id: 13223,
      channelName: '微信',
      channelcode: 858,
      astrictType: 0,
      money: [0],
      rate: 4,
      enable: true,
      comment: '微信扫码支付'
    },
    {
      id: 14423,
      channelName: '银联',
      channelcode: 866,
      astrictType: 2,
      money: [1000, 2000],
      rate: 3.5,
      enable: true,
      comment: '银联转账'
    },
    {
      id: 14723,
      channelName: '支付宝面对面',
      channelcode: 896,
      astrictType: 2,
      money: [500, 1000],
      rate: 3,
      enable: true,
      comment: '支付宝面对面'
    }
  ]
  
  const payOrderList = [
    {
      id: 6260027865541384,
      platformorder: '111',
      merchantOrder: '666',
      orderAmount: '600',
      handPay: '6',
      payee: '大黑',
      payAccount: '16598251648',
      payAddress: '河南省郑州市金水区',
      status: '1',
      orderSource: '商户',
      tranAccess: '支付宝',
      callbackStatus: '成功',
      orderTime: '2025-08-07 03:06:21',
      updateTime: '2025-08-07 03:06:21',
      remark: '支付宝扫码转账'
    },
    {
      id: 6260027865536258,
      platformorder: '112',
      merchantOrder: '667',
      orderAmount: '695',
      handPay: '6.95',
      payee: '小白',
      payAccount: '17765982369',
      payAddress: '河南省郑州市金水区',
      status: '2',
      orderSource: '平台',
      tranAccess: '微信',
      callbackStatus: '成功',
      orderTime: '2025-08-07 03:06:21',
      updateTime: '2025-08-07 03:06:21',
      remark: '微信扫码转账'
    },
    {
      id: 6260027862365123,
      platformorder: '113',
      merchantOrder: '668',
      orderAmount: '263',
      handPay: '2.63',
      payee: '花花',
      payAccount: '18965231568',
      payAddress: '河南省郑州市金水区',
      status: '3',
      orderSource: '平台',
      tranAccess: '银联',
      callbackStatus: '成功',
      orderTime: '2025-08-07 03:06:21',
      updateTime: '2025-08-07 03:06:21',
      remark: '银联转账'
    },
    {
      id: 6260027865541384,
      platformorder: '114',
      merchantOrder: '669',
      orderAmount: '2674',
      handPay: '3',
      payee: '虹虹',
      payAccount: '13621356896',
      payAddress: '河南省郑州市金水区',
      status: '4',
      orderSource: '商户',
      tranAccess: 'pos',
      callbackStatus: '成功',
      orderTime: '2025-08-07 03:06:21',
      updateTime: '2025-08-07 03:06:21',
      remark: 'pos转账'
    },
    {
      id: 6260027836213623,
      platformorder: '115',
      merchantOrder: '670',
      orderAmount: '642',
      handPay: '6.42',
      payee: '法师',
      payAccount: '13124589662',
      payAddress: '河南省郑州市金水区',
      status: '5',
      orderSource: '平台',
      tranAccess: '支付宝',
      callbackStatus: '成功',
      orderTime: '2025-08-07 03:06:21',
      updateTime: '2025-08-07 03:06:21',
      remark: '支付宝面对面'
    }
  ]
  
  const rechargeList = [
    {
      id: 6260027865541384,
      dealNumber: '36256',
      rechargeType: '代收进单',
      rechargeAccount: '13625698745',
      otherAccount: '12563145824',
      rechargeMoney: '3241.01',
      rechargeRemain: '362.35',
      rechargeTime: '2025-08-07 03:06:21',
      systemOrder: '246825614',
      merchantOrder: '23156482',
      remark: '银联转账'
    },
    {
      id: 6254138786546002,
      dealNumber: '65123',
      rechargeType: '代收撤单',
      rechargeAccount: '14578693245',
      otherAccount: '13625412568',
      rechargeMoney: '1638.25',
      rechargeRemain: '697.64',
      rechargeTime: '2025-08-07 03:06:21',
      systemOrder: '521462468',
      merchantOrder: '68314252',
      remark: '微信转账'
    },
    {
      id: 2738606260554841,
      dealNumber: '32485',
      rechargeType: '手动加款',
      rechargeAccount: '18365674925',
      otherAccount: '15564213824',
      rechargeMoney: '4163.5',
      rechargeRemain: '547',
      rechargeTime: '2025-08-07 03:06:21',
      systemOrder: '321501074',
      merchantOrder: '32102356',
      remark: '支付宝转账'
    },
    {
      id: 8724660138655402,
      dealNumber: '12045',
      rechargeType: '手动扣款',
      rechargeAccount: '10245698236',
      otherAccount: '13243146986',
      rechargeMoney: '584.5',
      rechargeRemain: '469',
      rechargeTime: '2025-08-07 03:06:21',
      systemOrder: '351001224',
      merchantOrder: '30120468',
      remark: '银行卡转账'
    }
  ]
  
  const templateManagerList = [
    {
      id: 11,
      img: 'http://jeequan.oss-cn-beijing.aliyuncs.com/jeepay/img/paypal.png',
      title: '支付宝'
    },
    {
      id: 12,
      img: 'http://jeequan.oss-cn-beijing.aliyuncs.com/jeepay/img/paypal.png',
      title: '微信'
    },
    {
      id: 13,
      img: 'http://jeequan.oss-cn-beijing.aliyuncs.com/jeepay/img/paypal.png',
      title: '银联收款'
    },
    {
      id: 14,
      img: 'http://jeequan.oss-cn-beijing.aliyuncs.com/jeepay/img/paypal.png',
      title: '扫一扫'
    },
    {
      id: 15,
      img: 'http://jeequan.oss-cn-beijing.aliyuncs.com/jeepay/img/paypal.png',
      title: 'pos转账'
    },
    {
      id: 16,
      img: 'http://jeequan.oss-cn-beijing.aliyuncs.com/jeepay/img/paypal.png',
      title: '支付宝扫一扫'
    },
    {
      id: 17,
      img: 'http://jeequan.oss-cn-beijing.aliyuncs.com/jeepay/img/paypal.png',
      title: '微信转账'
    },
    {
      id: 18,
      img: 'http://jeequan.oss-cn-beijing.aliyuncs.com/jeepay/img/paypal.png',
      title: '小喇叭'
    }
  ]
  
  /**
   * 操作日志列表
   */
  const operateLogList = [
    {
      operId: '1888844042864918529',
      tenantId: '000000',
      title: '租户管理',
      businessType: 1,
      businessTypes: null,
      method: 'org.dromara.system.controller.system.SysTenantController.add()',
      requestMethod: 'POST',
      operatorType: 1,
      operName: 'admin',
      deptName: '研发部门',
      operUrl: '/system/tenant',
      operIp: '114.228.2.223',
      operLocation: '中国|江苏省|常州市|电信',
      operParam:
        '{"createDept":null,"createBy":null,"createTime":null,"updateBy":null,"updateTime":null,"id":"1888844041547907074","tenantId":null,"contactUserName":"11111","contactPhone":"17167765678","companyName":"测试租户","username":"ceshi123","licenseNumber":"","address":"","domain":"","intro":"","remark":"","packageId":"1887802477035880449","expireTime":null,"accountCount":0,"status":"0"}',
      jsonResult: '{"code":200,"msg":"操作成功","data":null}',
      status: 0,
      errorMsg: '',
      operTime: '2025-02-10 14:54:48',
      costTime: 321
    },
    {
      operId: '1888837361556750338',
      tenantId: '000000',
      title: '代码生成',
      businessType: 8,
      businessTypes: null,
      method: 'org.dromara.generator.controller.GenController.batchGenCode()',
      requestMethod: 'GET',
      operatorType: 1,
      operName: 'admin',
      deptName: '研发部门',
      operUrl: '/tool/gen/batchGenCode',
      operIp: '123.232.8.42',
      operLocation: '中国|山东省|济南市|联通',
      operParam: '{"tableIdStr":"1888832712049131521"}',
      jsonResult: '',
      status: 0,
      errorMsg: '',
      operTime: '2025-02-10 14:28:15',
      costTime: 35
    },
    {
      operId: '1888832712426618881',
      tenantId: '000000',
      title: '代码生成',
      businessType: 6,
      businessTypes: null,
      method: 'org.dromara.generator.controller.GenController.importTableSave()',
      requestMethod: 'POST',
      operatorType: 1,
      operName: 'admin',
      deptName: '研发部门',
      operUrl: '/tool/gen/importTable',
      operIp: '60.169.8.172',
      operLocation: '中国|安徽省|芜湖市|电信',
      operParam: '{"tables":"sys_oss_config","dataName":"master"}',
      jsonResult: '{"code":200,"msg":"操作成功","data":null}',
      status: 0,
      errorMsg: '',
      operTime: '2025-02-10 14:09:46',
      costTime: 102
    },
    {
      operId: '1888830040487198721',
      tenantId: '000000',
      title: '流程实例管理',
      businessType: 1,
      businessTypes: null,
      method: 'org.dromara.workflow.controller.FlwInstanceController.invalid()',
      requestMethod: 'POST',
      operatorType: 1,
      operName: 'admin',
      deptName: '研发部门',
      operUrl: '/workflow/instance/invalid',
      operIp: '36.135.113.7',
      operLocation: '中国|移动',
      operParam: '{"id":"1887430725982191617","comment":""}',
      jsonResult: '{"code":200,"msg":"操作成功","data":true}',
      status: 0,
      errorMsg: '',
      operTime: '2025-02-10 13:59:09',
      costTime: 66
    },
    {
      operId: '1888830020052549633',
      tenantId: '000000',
      title: '任务管理',
      businessType: 1,
      businessTypes: null,
      method: 'org.dromara.workflow.controller.FlwTaskController.completeTask()',
      requestMethod: 'POST',
      operatorType: 1,
      operName: 'admin',
      deptName: '研发部门',
      operUrl: '/workflow/task/completeTask',
      operIp: '221.231.219.188',
      operLocation: '中国|江苏省|南京市|电信',
      operParam:
        '{"taskId":"1888626116215930882","fileId":"1888829505159790594","flowCopyList":[],"messageType":["1"],"message":null,"notice":null,"variables":{},"ext":null}',
      jsonResult: '{"code":200,"msg":"操作成功","data":null}',
      status: 0,
      errorMsg: '',
      operTime: '2025-02-10 13:59:04',
      costTime: 114
    },
    {
      operId: '1888829505210122241',
      tenantId: '000000',
      title: 'OSS对象存储',
      businessType: 1,
      businessTypes: null,
      method: 'org.dromara.system.controller.system.SysOssController.upload()',
      requestMethod: 'POST',
      operatorType: 1,
      operName: 'admin',
      deptName: '研发部门',
      operUrl: '/resource/oss/upload',
      operIp: '221.231.219.188',
      operLocation: '中国|江苏省|南京市|电信',
      operParam: '',
      jsonResult:
        '{"code":200,"msg":"操作成功","data":{"url":"http://106.119.167.29:9000/ruoyi/2025/02/10/3be5457468f749c3beeff9cf08902893.png","fileName":"wallhaven-x8r9wl_20250208171114A001.png","ossId":"1888829505159790594"}}',
      status: 0,
      errorMsg: '',
      operTime: '2025-02-10 13:57:01',
      costTime: 30
    },
    {
      operId: '1888829468040200194',
      tenantId: '000000',
      title: '代码生成',
      businessType: 2,
      businessTypes: null,
      method: 'org.dromara.generator.controller.GenController.synchDb()',
      requestMethod: 'GET',
      operatorType: 1,
      operName: 'admin',
      deptName: '研发部门',
      operUrl: '/tool/gen/synchDb/1887854544848912386',
      operIp: '60.169.8.172',
      operLocation: '中国|安徽省|芜湖市|电信',
      operParam: '{}',
      jsonResult: '{"code":200,"msg":"操作成功","data":null}',
      status: 0,
      errorMsg: '',
      operTime: '2025-02-10 13:56:53',
      costTime: 91
    },
    {
      operId: '1888829323378655233',
      tenantId: '000000',
      title: '代码生成',
      businessType: 8,
      businessTypes: null,
      method: 'org.dromara.generator.controller.GenController.batchGenCode()',
      requestMethod: 'GET',
      operatorType: 1,
      operName: 'admin',
      deptName: '研发部门',
      operUrl: '/tool/gen/batchGenCode',
      operIp: '121.15.177.191',
      operLocation: '中国|广东省|深圳市|电信',
      operParam: '{"tableIdStr":"1888495834955481089"}',
      jsonResult: '',
      status: 0,
      errorMsg: '',
      operTime: '2025-02-10 13:56:18',
      costTime: 28
    },
    {
      operId: '1888828571126038529',
      tenantId: '000000',
      title: '租户管理',
      businessType: 1,
      businessTypes: null,
      method: 'org.dromara.system.controller.system.SysTenantController.add()',
      requestMethod: 'POST',
      operatorType: 1,
      operName: 'admin',
      deptName: '研发部门',
      operUrl: '/system/tenant',
      operIp: '36.148.187.106',
      operLocation: '中国|湖南省|长沙市|移动',
      operParam:
        '{"createDept":null,"createBy":null,"createTime":null,"updateBy":null,"updateTime":null,"id":"1888828569905496066","tenantId":null,"contactUserName":"mq","contactPhone":"18712344321","companyName":"tongxiao","username":"mq","licenseNumber":"","address":"3213","domain":"","intro":"","remark":"","packageId":"1888828323561439233","expireTime":"2025-02-12 00:00:00","accountCount":2,"status":"0"}',
      jsonResult: '{"code":200,"msg":"操作成功","data":null}',
      status: 0,
      errorMsg: '',
      operTime: '2025-02-10 13:53:19',
      costTime: 295
    },
    {
      operId: '1888828323611770882',
      tenantId: '000000',
      title: '租户套餐',
      businessType: 1,
      businessTypes: null,
      method: 'org.dromara.system.controller.system.SysTenantPackageController.add()',
      requestMethod: 'POST',
      operatorType: 1,
      operName: 'admin',
      deptName: '研发部门',
      operUrl: '/system/tenant/package',
      operIp: '36.148.187.106',
      operLocation: '中国|湖南省|长沙市|移动',
      operParam:
        '{"createDept":null,"createBy":null,"createTime":null,"updateBy":null,"updateTime":null,"packageId":"1888828323561439233","packageName":"恭喜发财","menuIds":[1,100,1001,1002,1003,1004,1005,1006,1007,101,1008,1009,1010,1011,1012,102,1013,1014,1015,1016,103,1017,1018,1019,1020,104,1021,1022,1023,1024,1025,105,1026,1027,1028,1029,1030,106,1031,1032,1033,1034,1035,107,1036,1037,1038,1039,108,500,1040,1041,1042,501,1043,1044,1045,1050,118,1600,1601,1602,1603,1620,1621,1622,1623,123,1061,1062,1063,1064,1065,2,109,1046,1047,1048,113,117,120,3,115,1055,1056,1058,1057,1059,1060,5,1500,1501,1502,1503,1504,1505,1506,1507,1508,1509,1510,1511,11638,11639,11640,11641,11642,11643,11616,11622,11623,11624,11625,11626,11627,11620,11630,11621,11631,"1887424258675802114",11618,11629,11619,11632,11633],"remark":"","menuCheckStrictly":true,"status":null}',
      jsonResult: '{"code":200,"msg":"操作成功","data":null}',
      status: 0,
      errorMsg: '',
      operTime: '2025-02-10 13:52:20',
      costTime: 18
    }
  ]
            const systemSettingList=[
              {
                "id": 1,
                "settingValue": "",
                "settingText": "日切设置-代付提单",
                "type": 2,
                "ReceiveOrder": true,
                "BussinessHour": "00:00-00:00"
              },
              {
                "id": 2,
                "settingValue": "111111111111",
                "settingText": "登录配置-管理员登录设备数量",
                "type": 1,
                "ReceiveOrder": "",
                "BussinessHour": ""
              },
              {
                "id": 3,
                "settingValue": "",
                "settingText": "日切设置-支付提单",
                "type":2,
                "ReceiveOrder": true,
                "BussinessHour": "00:00-00:00"
              },
              {
                "id":4,
                "settingValue": "222222222222",
                "settingText": "登录配置-商户登录设备数量",
                "type":1,
                "ReceiveOrder": "",
                "BussinessHour": ""
              },
              {
                "id": 5,
                "settingValue": "",
                "settingText": "日切设置-代收提单",
                "type":2,
                "ReceiveOrder": true,
                "BussinessHour": "00:00-00:00"
              },
            ]
            const dictionaryManageList=[
              {
                "id": 5,
                "name": "菜单状态",
                "type": "sys_show_hide",
                "remark": "菜单状态列表",
                "createdTime": "2025-02-10 14:28:15"
              },
              {
                "id": 6,
                "name": "系统开关",
                "type": "sys_normal_disable",
                "remark": "系统开关列表",
                "createdTime": "2025-02-10 14:28:15"
              },
              {
                "id": 7,
                "name": "通知类型",
                "type": "sys_oper_type",
                "remark": "通知类型列表",
                "createdTime": "2025-02-10 14:28:15"
              },
              {
                "id": 8,
                "name": "设备类型",
                "type": "sys_device_type",
                "remark": "设备类型列表",
                "createdTime": "2025-02-10 14:28:15"
              },
              {
                "id": 9,
                "name": "授权类型",
                "type": "sys_grant_type",
                "remark": "授权类型列表",
                "createdTime": "2025-02-10 14:28:15"
              },
            ]
  
  /**
   * 用户登录日志列表
   */
  const userLoginLogList = [
        {
            "infoId": "1888880953847414786",
            "tenantId": "000000",
            "userName": "admin",
            "clientKey": "pc",
            "deviceType": "pc",
            "status": "0",
            "ipaddr": "58.56.96.30",
            "loginLocation": "中国|山东省|济南市|电信",
            "browser": "Chrome",
            "os": "Windows 10 or Windows Server 2016",
            "msg": "登录成功",
            "loginTime": "2025-02-10 17:21:28"
        },
        {
            "infoId": "1888880937749676034",
            "tenantId": "000000",
            "userName": "admin",
            "clientKey": "pc",
            "deviceType": "pc",
            "status": "0",
            "ipaddr": "36.110.47.57",
            "loginLocation": "中国|北京|北京市|电信",
            "browser": "Chrome",
            "os": "Windows 10 or Windows Server 2016",
            "msg": "登录成功",
            "loginTime": "2025-02-10 17:21:24"
        },
        {
            "infoId": "1888880898629402626",
            "tenantId": "000000",
            "userName": "admin",
            "clientKey": "pc",
            "deviceType": "pc",
            "status": "0",
            "ipaddr": "58.56.96.30",
            "loginLocation": "中国|山东省|济南市|电信",
            "browser": "Chrome",
            "os": "Windows 10 or Windows Server 2016",
            "msg": "退出成功",
            "loginTime": "2025-02-10 17:21:15"
        },
        {
            "infoId": "1888880820128808961",
            "tenantId": "000000",
            "userName": "admin",
            "clientKey": "pc",
            "deviceType": "pc",
            "status": "0",
            "ipaddr": "123.149.1.156",
            "loginLocation": "中国|河南省|郑州市|电信",
            "browser": "MSEdge",
            "os": "Windows 10 or Windows Server 2016",
            "msg": "登录成功",
            "loginTime": "2025-02-10 17:20:56"
        },
        {
            "infoId": "1888880746032234497",
            "tenantId": "000000",
            "userName": "admin",
            "clientKey": "pc",
            "deviceType": "pc",
            "status": "0",
            "ipaddr": "1.202.39.146",
            "loginLocation": "中国|北京|北京市|电信",
            "browser": "Chrome",
            "os": "Windows 10 or Windows Server 2016",
            "msg": "登录成功",
            "loginTime": "2025-02-10 17:20:38"
        },
        {
            "infoId": "1888880695276961794",
            "tenantId": "000000",
            "userName": "admin",
            "clientKey": "pc",
            "deviceType": "pc",
            "status": "0",
            "ipaddr": "223.104.176.217",
            "loginLocation": "中国|辽宁省|大连市|移动",
            "browser": "Chrome",
            "os": "OSX",
            "msg": "登录成功",
            "loginTime": "2025-02-10 17:20:26"
        },
        {
            "infoId": "1888880644743987201",
            "tenantId": "000000",
            "userName": "admin",
            "clientKey": "pc",
            "deviceType": "pc",
            "status": "0",
            "ipaddr": "59.61.151.111",
            "loginLocation": "中国|福建省|福州市|电信",
            "browser": "Chrome",
            "os": "Windows 10 or Windows Server 2016",
            "msg": "登录成功",
            "loginTime": "2025-02-10 17:20:14"
        },
        {
            "infoId": "1888880567245832193",
            "tenantId": "000000",
            "userName": "admin",
            "clientKey": "pc",
            "deviceType": "pc",
            "status": "0",
            "ipaddr": "58.56.96.30",
            "loginLocation": "中国|山东省|济南市|电信",
            "browser": "Chrome",
            "os": "Windows 10 or Windows Server 2016",
            "msg": "登录成功",
            "loginTime": "2025-02-10 17:19:56"
        },
        {
            "infoId": "1888880378422460418",
            "tenantId": "000000",
            "userName": "admin",
            "clientKey": "pc",
            "deviceType": "pc",
            "status": "0",
            "ipaddr": "111.59.18.190",
            "loginLocation": "中国|广西|南宁市|移动",
            "browser": "Chrome",
            "os": "Windows 10 or Windows Server 2016",
            "msg": "登录成功",
            "loginTime": "2025-02-10 17:19:11"
        },
        {
            "infoId": "1888880260520574978",
            "tenantId": "000000",
            "userName": "admin",
            "clientKey": "pc",
            "deviceType": "pc",
            "status": "0",
            "ipaddr": "124.128.169.154",
            "loginLocation": "中国|山东省|济南市|联通",
            "browser": "MSEdge",
            "os": "Windows 10 or Windows Server 2016",
            "msg": "登录成功",
            "loginTime": "2025-02-10 17:18:42"
        }
    ]
    const platformDailyReportList=[
      {
        "id": 5,
        "time": "2025-02-10",
        "topUpMoney": "88",
        "topUpCount": "36",
        "topUpHand": "5.98",
        "issueMoney": "62",
        "issueCount": "15",
        "issueHand": "6.83",
        "payMoney": "75",
        "payCount": "56",
        "payRate": "42%",
        "replacePay": "46",
        "replaceCount": "23",
        "replaceRate": "32%",
        "agentMoney": "20",
        "incomeCost": "10",
        "replaceCost": "8",
        "dayAllMoney": "8847"
      },
      {
        "id": 5,
        "time": "2025-02-10",
        "topUpMoney": "88",
        "topUpCount": "36",
        "topUpHand": "5.98",
        "issueMoney": "62",
        "issueCount": "15",
        "issueHand": "6.83",
        "payMoney": "75",
        "payCount": "56",
        "payRate": "42%",
        "replacePay": "46",
        "replaceCount": "23",
        "replaceRate": "32%",
        "agentMoney": "20",
        "incomeCost": "10",
        "replaceCost": "8",
        "dayAllMoney": "8847"
      },
      {
        "id": 5,
        "time": "2025-02-10",
        "topUpMoney": "487",
        "topUpCount": "326",
        "topUpHand": "241.2",
        "issueMoney": "36",
        "issueCount": "45",
        "issueHand": "13.65",
        "payMoney": "855",
        "payCount": "458",
        "payRate": "34%",
        "replacePay": "259",
        "replaceCount": "214",
        "replaceRate": "18%",
        "agentMoney": "20",
        "incomeCost": "10",
        "replaceCost": "8",
        "dayAllMoney": "3625"
      },
      {
        "id": 5,
        "time": "2025-02-10",
        "topUpMoney": "145",
        "topUpCount": "62",
        "topUpHand": "6.2",
        "issueMoney": "254",
        "issueCount": "32",
        "issueHand": "12.5",
        "payMoney": "365",
        "payCount": "215",
        "payRate": "9%",
        "replacePay": "127",
        "replaceCount": "21",
        "replaceRate": "5.9%",
        "agentMoney": "20",
        "incomeCost": "10",
        "replaceCost": "8",
        "dayAllMoney": "1248"
      },
    ]
    const merchantAgentList=[
      {
        "id": 5,
        "createdTime": "2025-02-10 14:28:15",
        "loginName": "loopy",
        "remainMoney": "666.00",
        "tel": "13652845796",
        "status": "1"
      },
      {
        "id": 6,
        "createdTime": "2025-02-10 14:28:15",
        "loginName": "login",
        "remainMoney": "1254.36",
        "tel": "19656241547",
        "status": "2"
      },
      {
        "id": 7,
        "createdTime": "2025-02-10 14:28:15",
        "loginName": "peiqi",
        "remainMoney": "324.56",
        "tel": "13256947512",
        "status": "1"
      },
      {
        "id": 8,
        "createdTime": "2025-02-10 14:28:15",
        "loginName": "ally",
        "remainMoney": "965.15",
        "tel": "15746985698",
        "status": "2"
      },
    ]
    const distributeProfitList=[
      {
        "id": 115,
        "createdTime": "2025-02-10 14:28:15",
        "merchantName": "美丽商超",
        "passage": "通道1",
        "payType": "支付宝",
        "merchantRate": "6‰",
        "OwnAgent": "代理1",
        "agentPart": "265"
      },
      {
        "id": 116,
        "createdTime": "2025-02-10 14:28:15",
        "merchantName": "瑜伽馆",
        "passage": "通道2",
        "payType": "微信",
        "merchantRate": "5‰",
        "OwnAgent": "代理2",
        "agentPart": "365"
      },
      {
        "id": 117,
        "createdTime": "2025-02-10 14:28:15",
        "merchantName": "健身房",
        "passage": "通道3",
        "payType": "银联",
        "merchantRate": "3‰",
        "OwnAgent": "代理3",
        "agentPart": "698"
      },
      {
        "id": 118,
        "createdTime": "2025-02-10 14:28:15",
        "merchantName": "洞箫馆",
        "passage": "通道4",
        "payType": "pos",
        "merchantRate": "6‰",
        "OwnAgent": "代理4",
        "agentPart": "547"
      },
    ]
    const productManageList=[
      {
        "id": 5,
        "productType": "产品类型1",
        "cashTemplate": "收银台模板1",
        "transferType": "随机字符串",
        "isNotStatic": false,
        "isNotAuto": true,
        "isNotEnable": true,
        "remark": "我是一个备注"
      },
      {
        "id": 6,
        "productType": "产品类型2",
        "cashTemplate": "收银台模板2",
        "transferType": "随机6位数字默认",
        "isNotStatic": false,
        "isNotAuto": true,
        "isNotEnable": false,
        "remark": "又有一个备注"
      },
      {
        "id": 7,
        "productType": "产品类型3",
        "cashTemplate": "收银台模板3",
        "transferType": "随机邮箱",
        "isNotStatic": true,
        "isNotAuto": false,
        "isNotEnable": true,
        "remark": "还是一个备注"
      },
      {
        "id":8,
        "productType": "产品类型4",
        "cashTemplate": "收银台模板4",
        "transferType": "随机手机号",
        "isNotStatic": true,
        "isNotAuto":false,
        "isNotEnable": false,
        "remark": "再来一个备注"
      },
      {
        "id": 9,
        "productType": "产品类型5",
        "cashTemplate": "收银台模板5",
        "transferType": "随机QQ号",
        "isNotStatic": false,
        "isNotAuto": true,
        "isNotEnable": true,
        "remark": "最后一个备注"
      },
    ]
    const cashVisitList=[
      {
        "id": 11,
        "cash_page_url": "地址1",
        "visit_time": "2025-02-10 14:28:15",
        "device_type": "1",
        "ip": "192.168.3.2"
      },
      {
        "id": 12,
        "cash_page_url": "地址2",
        "visit_time": "2025-02-10 14:28:15",
        "device_type": "0",
        "ip": "192.168.3.2"
      },
      {
        "id": 13,
        "cash_page_url": "地址3",
        "visit_time": "2025-02-10 14:28:15",
        "device_type": "3",
        "ip": "192.168.3.2"
      },
      {
        "id": 14,
        "cash_page_url": "地址4",
        "visit_time": "2025-02-10 14:28:15",
        "device_type": "2",
        "ip": "192.168.3.2"
      },
      {
        "id": 15,
        "cash_page_url": "地址4",
        "visit_time": "2025-02-10 14:28:15",
        "device_type": "5",
        "ip": "192.168.3.2"
      },
      {
        "id": 17,
        "cash_page_url": "地址5",
        "visit_time": "2025-02-10 14:28:15",
        "device_type": "4",
        "ip": "192.168.3.2"
      },
      {
        "id": 16,
        "cash_page_url": "地址6",
        "visit_time": "2025-02-10 14:28:15",
        "device_type": "6",
        "ip": "192.168.3.2"
      },
    ]
  module.exports = {
    userList,
    dashBoardData,
    roleList,
    payOrderList,
    channelList,
    rechargeList,
    templateManagerList,
    systemSettingList,
    operateLogList,
    dictionaryManageList,
    userLoginLogList,
    platformDailyReportList,
    merchantAgentList,
    distributeProfitList,
    productManageList,
    cashVisitList
  }
  