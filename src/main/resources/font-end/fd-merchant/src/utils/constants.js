/**
 * 订单状态
 */
export const orderStateOptions =  [
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
    url:'@/assets/img_bnak/weixin-pay.png'
  },
  {
    icon: 'zhifu-pay.png',
    name: '支付宝支付',
    url:'@/assets/img_bnak/zhifu-pay.png'
  },
  {
    icon: 'BANK_ABC.png',
    name: '中国农业银行',
    url:'@/assets/img_bnak/BANK_ABC.png'
  },
  {
    icon: 'BANK_ANTBANK.png',
    name: '蚂蚁银行',
    url:'@/assets/img_bnak/BANK_ANTBANK.png'
  },
  {
    icon: 'BANK_BHB.png',
    name: '河北银行',
    url:'@/assets/img_bnak/BANK_BHB.png'
  },
  {
    icon: 'BANK_BJBANK.png',
    name: '北京银行',
    url:'@/assets/img_bnak/BANK_BJBANK.png'
  },
  {
    icon: 'BANK_BJRCB.png',
    name: '北京农商银行',
    url:'.@/assets/img_bnak/BANK_BJRCB.png'
  },
  {
    icon: 'BANK_BOC.png',
    name: '中国银行',
    url:'@/assets/img_bnak/BANK_BOC.png'
  },
  {
    icon: 'BANK_BOD.png',
    name: '东莞银行',
    url:'@/assets/img_bnak/BANK_BOD.png'
  },
  {
    icon: 'BANK_BOHAIB.png',
    name: '渤海银行',
    url:'@/assets/img_bnak/BANK_BOHAIB.png'
  },
  {
    icon: 'BANK_BOQH.png',
    name: '青海银行',
    url:'@/assets/img_bnak/BANK_BOQH.png'
  },
  {
    icon: 'BANK_BOSZ.png',
    name: '苏州银行',
    url:'@/assets/img_bnak/BANK_BOSZ.png'
  },
  {
    icon: 'BANK_BOYK.png',
    name: '营口银行',
    url:'@/assets/img_bnak/BANK_BOYK.png'
  },
  {
    icon: 'BANK_BSB.png',
    name: '包商银行',
    url:'@/assets/img_bnak/BANK_BSB.png'
  },
  {
    icon: 'BANK_CCB.png',
    name: '中国建设银行',
    url:'@/assets/img_bnak/BANK_CCB.png'
  },
  {
    icon: 'BANK_CDCB.png',
    name: '成都银行',
    url:'@/assets/img_bnak/BANK_CDCB.png'
  },
  {
    icon: 'BANK_CDRCB.png',
    name: '成都农村商业银行',
    url:'@/assets/img_bnak/BANK_CDRCB.png'
  },
  {
    icon: 'BANK_CEB.png',
    name: '中国光大银行',
    url:'@/assets/img_bnak/BANK_CEB.png'
  },
  {
    icon: 'BANK_CIB.png',
    name: '兴业银行',
    url:'@/assets/img_bnak/BANK_CIB.png'
  },
  {
    icon: 'BANK_CMB.png',
    name: '招商银行',
    url:'@/assets/img_bnak/BANK_CMB.png'
  },
  {
    icon: 'BANK_CMBC.png',
    name: '中国民生银行',
    url:'@/assets/img_bnak/BANK_CMBC.png'
  },
  {
    icon: 'BANK_COMM.png',
    name: '交通银行',
    url:'@/assets/img_bnak/BANK_COMM.png'
  },
  {
    icon: 'BANK_CQBANK.png',
    name: '重庆银行',
    url:'@/assets/img_bnak/BANK_CQBANK.png'
  },
  {
    icon: 'BANK_CQRC.png',
    name: '重庆农村商业银行',
    url:'@/assets/img_bnak/BANK_CQRC.png'
  },
  {
    icon: 'BANK_CZBANK.png',
    name: '浙商银行',
    url:'@/assets/img_bnak/BANK_CZBANK.png'
  },
  {
    icon: 'BANK_DLB.png',
    name: '大连银行',
    url:'@/assets/img_bnak/BANK_DLB.png'
  },
  {
    icon: 'BANK_EGBANK.png',
    name: '恒丰银行',
    url:'@/assets/img_bnak/BANK_EGBANK.png'
  },
  {
    icon: 'BANK_GCB.png',
    name: '广州银行',
    url:'@/assets/img_bnak/BANK_GCB.png'
  },
  {
    icon: 'BANK_GDB.png',
    name: '广发银行',
    url:'@/assets/img_bnak/BANK_GDB.png'
  },
  {
    icon: 'BANK_GZB.png',
    name: '赣州银行',
    url:'@/assets/img_bnak/BANK_GZB.png'
  },
  {
    icon: 'BANK_H3CB.png',
    name: '内蒙古银行',
    url:'@/assets/img_bnak/BANK_H3CB.png'
  },
  {
    icon: 'BANK_HKB.png',
    name: '汉口银行',
    url:'@/assets/img_bnak/BANK_HKB.png'
  },
  {
    icon: 'BANK_HRBANK.png',
    name: '哈尔滨银行',
    url:'@/assets/img_bnak/BANK_HRBANK.png'
  },
  {
    icon: 'BANK_HSBANK.png',
    name: '徽商银行',
    url:'@/assets/img_bnak/BANK_HSBANK.png'
  },
  {
    icon: 'BANK_HXBANK.png',
    name: '华夏银行',
    url:'@/assets/img_bnak/BANK_HXBANK.png'
  },
  {
    icon: 'BANK_HZCB.png',
    name: '杭州银行',
    url:'@/assets/img_bnak/BANK_HZCB.png'
  },
  {
    icon: 'BANK_ICBC.png',
    name: '中国工商银行',
    url:'@/assets/img_bnak/BANK_ICBC.png'
  },
  {
    icon: 'BANK_JJBANK.png',
    name: '九江银行',
    url:'@/assets/img_bnak/BANK_JJBANK.png'
  },
  {
    icon: 'BANK_JRCB.png',
    name: '江阴农商银行',
    url:'@/assets/img_bnak/BANK_JRCB.png'
  },
  {
    icon: 'BANK_JSB.png',
    name: '晋商银行',
    url:'@/assets/img_bnak/BANK_JSB.png'
  },
  {
    icon: 'BANK_JSBANK.png',
    name: '江苏银行',
    url:'@/assets/img_bnak/BANK_JSBANK.png'
  },
  {
    icon: 'BANK_JSRCU.png',
    name: '江苏省农村信用社联合社',
    url:'@/assets/img_bnak/BANK_JSRCU.png'
  },
  {
    icon: 'BANK_JXBANK.png',
    name: '嘉兴银行',
    url:'@/assets/img_bnak/BANK_JXBANK.png'
  },
  {
    icon: 'BANK_NCB.png',
    name: '南昌银行',
    url:'@/assets/img_bnak/BANK_NCB.png'
  },
  {
    icon: 'BANK_NJCB.png',
    name: '南京银行',
    url:'@/assets/img_bnak/BANK_NJCB.png'
  },
  {
    icon: 'BANK_NXBANK.png',
    name: '宁夏银行',
    url:'@/assets/img_bnak/BANK_NXBANK.png'
  },
  {
    icon: 'BANK_NYBANK.png',
    name: '广东南粤银行',
    url:'@/assets/img_bnak/BANK_NYBANK.png'
  },
  {
    icon: 'BANK_PSBC.png',
    name: '中国邮政储蓄银行',
    url:'@/assets/img_bnak/BANK_PSBC.png'
  },
  {
    icon: 'BANK_QLBANK.png',
    name: '齐鲁银行',
    url:'@/assets/img_bnak/BANK_QLBANK.png'
  },
  {
    icon: 'BANK_SCB.png',
    name: '渣打银行',
    url:'@/assets/img_bnak/BANK_SCB.png'
  },
  {
    icon: 'BANK_SDB.png',
    name: '深圳发展银行',
    url:'@/assets/img_bnak/BANK_SDB.png'
  },
  {
    icon: 'BANK_SHBANK.png',
    name: '上海银行',
    url:'@/assets/img_bnak/BANK_SHBANK.png'
  },
  {
    icon: 'BANK_SHRCB.png',
    name: '上海农商银行',
    url:'@/assets/img_bnak/BANK_SHRCB.png'
  },
  {
    icon: 'BANK_SJBANK.png',
    name: '盛京银行',
    url:'@/assets/img_bnak/BANK_SJBANK.png'
  },
  {
    icon: 'BANK_SPABANK.png',
    name: '平安银行',
    url:'@/assets/img_bnak/BANK_SPABANK.png'
  },
  {
    icon: 'BANK_SPDB.png',
    name: '浦发银行',
    url:'@/assets/img_bnak/BANK_SPDB.png'
  },
  {
    icon: 'BANK_SRBANK.png',
    name: '上饶银行',
    url:'@/assets/img_bnak/BANK_SRBANK.png'
  },
  {
    icon: 'BANK_SXCB.png',
    name: '绍兴银行',
    url:'@/assets/img_bnak/BANK_SXCB.png'
  },
  {
    icon: 'BANK_TCCB.png',
    name: '天津银行',
    url:'@/assets/img_bnak/BANK_TCCB.png'
  },
  {
    icon: 'BANK_TLBANK.png',
    name: '铁岭银行',
    url:'@/assets/img_bnak/BANK_TLBANK.png'
  },
  {
    icon: 'BANK_TZCB.png',
    name: '台州银行',
    url:'@/assets/img_bnak/BANK_TZCB.png'
  },
  {
    icon: 'BANK_URMQCCB.png',
    name: '乌鲁木齐市商业银行',
    url:'@/assets/img_bnak/BANK_URMQCCB.png'
  },
  {
    icon: 'BANK_WHCCB.png',
    name: '威海市商业银行',
    url:'@/assets/img_bnak/BANK_WHCCB.png'
  },
  {
    icon: 'BANK_WZCB.png',
    name: '温州银行',
    url:'@/assets/img_bnak/BANK_WZCB.png'
  },
  {
    icon: 'BANK_XTB.png',
    name: '邢台银行',
    url:'@/assets/img_bnak/BANK_XTB.png'
  },
  {
    icon: 'BANK_YDRCB.png',
    name: '尧都农商银行',
    url:'@/assets/img_bnak/BANK_YDRCB.png'
  },
  {
    icon: 'alipay1.png',
    name: '支付宝',
    url:'@/assets/img_bnak/alipay1.png'
  },
  {
    icon: 'alipay2.png',
    name: '支付宝',
    url:'@/assets/img_bnak/alipay2.png'
  },
  {
    icon: 'alipay3.png',
    name: '支付宝',
    url:'@/assets/img_bnak/alipay3.png'
  },
  {
    icon: 'weixin1.png',
    name: '微信',
    url:'@/assets/img_bnak/weixin1.png'
  },
  {
    icon: 'weixin2.png',
    name: '微信',
    url:'@/assets/img_bnak/weixin2.png'
  },
  {
    icon: 'weixin3.png',
    name: '微信',
    url:'@/assets/img_bnak/weixin3.png'
  },
]
