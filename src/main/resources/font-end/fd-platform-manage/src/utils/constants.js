



/**
 * 收款码不可用原因
 */
export const unavailableReasonOptions = [
  { label: '收款码未启用', value: 1 },
  { label: '码商未启用', value: 2 },
  { label: '码商未开启代收', value: 3 },
  { label: '码商可用余额不足', value: 4 },
  { label: '成功订单数已满', value: 5 },
  { label: '成功订单金额已满', value: 6 },
  { label: '码商已解绑产品', value: 7 },
  { label: '码商未绑定产品', value: 8 },
  // { label: '链接错误', value: 9 },
  // { label: '上游验证失败', value: 10 },
  // { label: '金额不匹配', value: 11 },
  // { label: '已支付,永久下线', value: 12 },
  // { label: '收款码已删除', value: 13 },
  // { label: '收款码已过期', value: 14 },
  // { label: '产品不存在', value: 15 },
  // { label: '产品未启用', value: 16 },
  // { label: '码商不存在', value: 17 },
  // { label: '码商已锁定', value: 18 }
]


/**
 * 收款码不可用原因
 */
export const remarkOptions = [

  { label: '已支付', value: 12 },
  { label: '金额不匹配', value: 11 },
  { label: '链接错误', value: 9 },
  { label: '上游验证失败', value: 10 },
  { label: '处理错误', value: 13 },
  { label: '解析失败', value: 19 },

  
]




/**
 * 平台信息
 */
export const platformInfo = {
  "shandian":{
    "name":"闪电支付",
    "tenantId":1061,
  },
  "sadan":{
    "name":"撒旦支付",
    "tenantId":1032,
  },
  "gerun":{
    "name":"格润支付",
    "tenantId":1070,
  },
  "xiaoliu":{
    "name":"小刘888支付",
    "tenantId":1019,
  }
}


/**
 * 订单状态
 */
export const orderStateOptions = [
        { label: '已生成', value: 0, type: 'info' },
        { label: '待接单', value: 1, type: 'info' },
        { label: '已接单', value: 2, type: '' },
        { label: '已成功', value: 3, type: 'success' },
        { label: '已取消', value: 4, type: 'warning' },
        { label: '已超时', value: 5, type: 'warning' },
        { label: '恶意拉单', value: 6, type: 'danger' },
        { label: '未出码', value: 7, type: 'danger' },
        { label: '无码订单', value: 8, type: 'danger' },
        { label: '冲正', value: 9, type: 'danger' },
        { label: '未访问', value: 10, type: 'danger' }
      ]
      


export const BankInfoList = [
  {
    icon: 'weixin-pay.png',
    name: '微信支付',
    url: '@/assets/img_bank/weixin-pay.png',
    value: '0' // 同  index
  },
  {
    icon: 'zhifu-pay.png',
    name: '支付宝支付',
    url: '@/assets/img_bank/zhifu-pay.png',
    value: '1' // 同  index
  },

  {
    icon: 'taobao.png',
    name: '淘宝支付',
    url: '@/assets/img_bank/taobao.png',
    value: '2' // 同  index
  },
  {
    icon: 'jingdong.png',
    name: '京东支付',
    url: '@/assets/img_bank/jingdong.png',
    value: '3' // 同  index
  },
  {
    icon: 'yinlian.png',
    name: '银联支付',
    url: '@/assets/img_bank/yinlian.png',
    value: '4' // 同  index
  },
  {
    icon: 'yunshanfu.png',
    name: '云闪付',
    url: '@/assets/img_bank/yunshanfu.png',
    value: '5' // 同  index
  },
  {
    icon: 'drmb.png',
    name: '数字人民币',
    url: '@/assets/img_bank/drmb.png',
    value: '6' // 同  index
  },
  {
    icon: 'qq.png',
    name: 'QQ支付',
    url: '@/assets/img_bank/qq.png',
    value: '7' // 同  index
  },

  {
    icon: 'pdd.png',
    name: '拼多多',
    url: '@/assets/img_bank/pdd.png',
    value: '8' // 同  index
  },

  {
    icon: 'douyin.png',
    name: '抖音',
    url: '@/assets/img_bank/douyin.png',
    value: '9' // 同  index
  },

  {
    icon: 'bank-card.png',
    name: '银行卡',
    url: '@/assets/img_bank/bank-card.png',
    value: '10' // 同  index
  },
  {
    icon: 'yidong.png',
    name: '移动',
    url: '@/assets/img_bank/yidong.png',
    value: '11' // 同  index
  },
  {
    icon: 'liantong.png',
    name: '联通',
    url: '@/assets/img_bank/liantong.png',
    value: '12' // 同  index
  },
  {
    icon: 'dianxin.png',
    name: '电信',
    url: '@/assets/img_bank/dianxin.png',
    value: '13' // 同  index
  },
    {
    icon: 'usdt_icon.png',
    name: 'USDT支付',
    url: '@/assets/img_bank/usdt_icon.png',
    value: '14' // 同  index
  },
  {
    icon: '',
    name: '上传logo',
    url: '',
    value: 'user' // 同  index
  },

  // {
  //   icon: 'BANK_ABC.png',
  //   name: '中国农业银行',
  //   url:'@/assets/img_bank/BANK_ABC.png'
  // },
  // {
  //   icon: 'BANK_ANTBANK.png',
  //   name: '蚂蚁银行',
  //   url:'@/assets/img_bank/BANK_ANTBANK.png'
  // },
  // {
  //   icon: 'BANK_BHB.png',
  //   name: '河北银行',
  //   url:'@/assets/img_bank/BANK_BHB.png'
  // },
  // {
  //   icon: 'BANK_BJBANK.png',
  //   name: '北京银行',
  //   url:'@/assets/img_bank/BANK_BJBANK.png'
  // },
  // {
  //   icon: 'BANK_BJRCB.png',
  //   name: '北京农商银行',
  //   url:'.@/assets/img_bank/BANK_BJRCB.png'
  // },
  // {
  //   icon: 'BANK_BOC.png',
  //   name: '中国银行',
  //   url:'@/assets/img_bank/BANK_BOC.png'
  // },
  // {
  //   icon: 'BANK_BOD.png',
  //   name: '东莞银行',
  //   url:'@/assets/img_bank/BANK_BOD.png'
  // },
  // {
  //   icon: 'BANK_BOHAIB.png',
  //   name: '渤海银行',
  //   url:'@/assets/img_bank/BANK_BOHAIB.png'
  // },
  // {
  //   icon: 'BANK_BOQH.png',
  //   name: '青海银行',
  //   url:'@/assets/img_bank/BANK_BOQH.png'
  // },
  // {
  //   icon: 'BANK_BOSZ.png',
  //   name: '苏州银行',
  //   url:'@/assets/img_bank/BANK_BOSZ.png'
  // },
  // {
  //   icon: 'BANK_BOYK.png',
  //   name: '营口银行',
  //   url:'@/assets/img_bank/BANK_BOYK.png'
  // },
  // {
  //   icon: 'BANK_BSB.png',
  //   name: '包商银行',
  //   url:'@/assets/img_bank/BANK_BSB.png'
  // },
  // {
  //   icon: 'BANK_CCB.png',
  //   name: '中国建设银行',
  //   url:'@/assets/img_bank/BANK_CCB.png'
  // },
  // {
  //   icon: 'BANK_CDCB.png',
  //   name: '成都银行',
  //   url:'@/assets/img_bank/BANK_CDCB.png'
  // },
  // {
  //   icon: 'BANK_CDRCB.png',
  //   name: '成都农村商业银行',
  //   url:'@/assets/img_bank/BANK_CDRCB.png'
  // },
  // {
  //   icon: 'BANK_CEB.png',
  //   name: '中国光大银行',
  //   url:'@/assets/img_bank/BANK_CEB.png'
  // },
  // {
  //   icon: 'BANK_CIB.png',
  //   name: '兴业银行',
  //   url:'@/assets/img_bank/BANK_CIB.png'
  // },
  // {
  //   icon: 'BANK_CMB.png',
  //   name: '招商银行',
  //   url:'@/assets/img_bank/BANK_CMB.png'
  // },
  // {
  //   icon: 'BANK_CMBC.png',
  //   name: '中国民生银行',
  //   url:'@/assets/img_bank/BANK_CMBC.png'
  // },
  // {
  //   icon: 'BANK_COMM.png',
  //   name: '交通银行',
  //   url:'@/assets/img_bank/BANK_COMM.png'
  // },
  // {
  //   icon: 'BANK_CQBANK.png',
  //   name: '重庆银行',
  //   url:'@/assets/img_bank/BANK_CQBANK.png'
  // },
  // {
  //   icon: 'BANK_CQRC.png',
  //   name: '重庆农村商业银行',
  //   url:'@/assets/img_bank/BANK_CQRC.png'
  // },
  // {
  //   icon: 'BANK_CZBANK.png',
  //   name: '浙商银行',
  //   url:'@/assets/img_bank/BANK_CZBANK.png'
  // },
  // {
  //   icon: 'BANK_DLB.png',
  //   name: '大连银行',
  //   url:'@/assets/img_bank/BANK_DLB.png'
  // },
  // {
  //   icon: 'BANK_EGBANK.png',
  //   name: '恒丰银行',
  //   url:'@/assets/img_bank/BANK_EGBANK.png'
  // },
  // {
  //   icon: 'BANK_GCB.png',
  //   name: '广州银行',
  //   url:'@/assets/img_bank/BANK_GCB.png'
  // },
  // {
  //   icon: 'BANK_GDB.png',
  //   name: '广发银行',
  //   url:'@/assets/img_bank/BANK_GDB.png'
  // },
  // {
  //   icon: 'BANK_GZB.png',
  //   name: '赣州银行',
  //   url:'@/assets/img_bank/BANK_GZB.png'
  // },
  // {
  //   icon: 'BANK_H3CB.png',
  //   name: '内蒙古银行',
  //   url:'@/assets/img_bank/BANK_H3CB.png'
  // },
  // {
  //   icon: 'BANK_HKB.png',
  //   name: '汉口银行',
  //   url:'@/assets/img_bank/BANK_HKB.png'
  // },
  // {
  //   icon: 'BANK_HRBANK.png',
  //   name: '哈尔滨银行',
  //   url:'@/assets/img_bank/BANK_HRBANK.png'
  // },
  // {
  //   icon: 'BANK_HSBANK.png',
  //   name: '徽商银行',
  //   url:'@/assets/img_bank/BANK_HSBANK.png'
  // },
  // {
  //   icon: 'BANK_HXBANK.png',
  //   name: '华夏银行',
  //   url:'@/assets/img_bank/BANK_HXBANK.png'
  // },
  // {
  //   icon: 'BANK_HZCB.png',
  //   name: '杭州银行',
  //   url:'@/assets/img_bank/BANK_HZCB.png'
  // },
  // {
  //   icon: 'BANK_ICBC.png',
  //   name: '中国工商银行',
  //   url:'@/assets/img_bank/BANK_ICBC.png'
  // },
  // {
  //   icon: 'BANK_JJBANK.png',
  //   name: '九江银行',
  //   url:'@/assets/img_bank/BANK_JJBANK.png'
  // },
  // {
  //   icon: 'BANK_JRCB.png',
  //   name: '江阴农商银行',
  //   url:'@/assets/img_bank/BANK_JRCB.png'
  // },
  // {
  //   icon: 'BANK_JSB.png',
  //   name: '晋商银行',
  //   url:'@/assets/img_bank/BANK_JSB.png'
  // },
  // {
  //   icon: 'BANK_JSBANK.png',
  //   name: '江苏银行',
  //   url:'@/assets/img_bank/BANK_JSBANK.png'
  // },
  // {
  //   icon: 'BANK_JSRCU.png',
  //   name: '江苏省农村信用社联合社',
  //   url:'@/assets/img_bank/BANK_JSRCU.png'
  // },
  // {
  //   icon: 'BANK_JXBANK.png',
  //   name: '嘉兴银行',
  //   url:'@/assets/img_bank/BANK_JXBANK.png'
  // },
  // {
  //   icon: 'BANK_NCB.png',
  //   name: '南昌银行',
  //   url:'@/assets/img_bank/BANK_NCB.png'
  // },
  // {
  //   icon: 'BANK_NJCB.png',
  //   name: '南京银行',
  //   url:'@/assets/img_bank/BANK_NJCB.png'
  // },
  // {
  //   icon: 'BANK_NXBANK.png',
  //   name: '宁夏银行',
  //   url:'@/assets/img_bank/BANK_NXBANK.png'
  // },
  // {
  //   icon: 'BANK_NYBANK.png',
  //   name: '广东南粤银行',
  //   url:'@/assets/img_bank/BANK_NYBANK.png'
  // },
  // {
  //   icon: 'BANK_PSBC.png',
  //   name: '中国邮政储蓄银行',
  //   url:'@/assets/img_bank/BANK_PSBC.png'
  // },
  // {
  //   icon: 'BANK_QLBANK.png',
  //   name: '齐鲁银行',
  //   url:'@/assets/img_bank/BANK_QLBANK.png'
  // },
  // {
  //   icon: 'BANK_SCB.png',
  //   name: '渣打银行',
  //   url:'@/assets/img_bank/BANK_SCB.png'
  // },
  // {
  //   icon: 'BANK_SDB.png',
  //   name: '深圳发展银行',
  //   url:'@/assets/img_bank/BANK_SDB.png'
  // },
  // {
  //   icon: 'BANK_SHBANK.png',
  //   name: '上海银行',
  //   url:'@/assets/img_bank/BANK_SHBANK.png'
  // },
  // {
  //   icon: 'BANK_SHRCB.png',
  //   name: '上海农商银行',
  //   url:'@/assets/img_bank/BANK_SHRCB.png'
  // },
  // {
  //   icon: 'BANK_SJBANK.png',
  //   name: '盛京银行',
  //   url:'@/assets/img_bank/BANK_SJBANK.png'
  // },
  // {
  //   icon: 'BANK_SPABANK.png',
  //   name: '平安银行',
  //   url:'@/assets/img_bank/BANK_SPABANK.png'
  // },
  // {
  //   icon: 'BANK_SPDB.png',
  //   name: '浦发银行',
  //   url:'@/assets/img_bank/BANK_SPDB.png'
  // },
  // {
  //   icon: 'BANK_SRBANK.png',
  //   name: '上饶银行',
  //   url:'@/assets/img_bank/BANK_SRBANK.png'
  // },
  // {
  //   icon: 'BANK_SXCB.png',
  //   name: '绍兴银行',
  //   url:'@/assets/img_bank/BANK_SXCB.png'
  // },
  // {
  //   icon: 'BANK_TCCB.png',
  //   name: '天津银行',
  //   url:'@/assets/img_bank/BANK_TCCB.png'
  // },
  // {
  //   icon: 'BANK_TLBANK.png',
  //   name: '铁岭银行',
  //   url:'@/assets/img_bank/BANK_TLBANK.png'
  // },
  // {
  //   icon: 'BANK_TZCB.png',
  //   name: '台州银行',
  //   url:'@/assets/img_bank/BANK_TZCB.png'
  // },
  // {
  //   icon: 'BANK_URMQCCB.png',
  //   name: '乌鲁木齐市商业银行',
  //   url:'@/assets/img_bank/BANK_URMQCCB.png'
  // },
  // {
  //   icon: 'BANK_WHCCB.png',
  //   name: '威海市商业银行',
  //   url:'@/assets/img_bank/BANK_WHCCB.png'
  // },
  // {
  //   icon: 'BANK_WZCB.png',
  //   name: '温州银行',
  //   url:'@/assets/img_bank/BANK_WZCB.png'
  // },
  // {
  //   icon: 'BANK_XTB.png',
  //   name: '邢台银行',
  //   url:'@/assets/img_bank/BANK_XTB.png'
  // },
  // {
  //   icon: 'BANK_YDRCB.png',
  //   name: '尧都农商银行',
  //   url:'@/assets/img_bank/BANK_YDRCB.png'
  // },
  // {
  //   icon: 'alipay1.png',
  //   name: '支付宝',
  //   url:'@/assets/img_bank/alipay1.png'
  // },
  // {
  //   icon: 'alipay2.png',
  //   name: '支付宝',
  //   url:'@/assets/img_bank/alipay2.png'
  // },
  // {
  //   icon: 'alipay3.png',
  //   name: '支付宝',
  //   url:'@/assets/img_bank/alipay3.png'
  // },
  // {
  //   icon: 'weixin1.png',
  //   name: '微信',
  //   url:'@/assets/img_bank/weixin1.png'
  // },
  // {
  //   icon: 'weixin2.png',
  //   name: '微信',
  //   url:'@/assets/img_bank/weixin2.png'
  // },
  // {
  //   icon: 'weixin3.png',
  //   name: '微信',
  //   url:'@/assets/img_bank/weixin3.png'
  // },
]
