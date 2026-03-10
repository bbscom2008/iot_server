



/**
 * 平台信息
 */
export const platformInfo = {
  "shandian":{
    "name":"闪电支付",
    "tenantId":1061,
  },
  "shandian888":{
    "name":"闪电888",
    "nick-name":"闪电发财",
    "tenantId":1056,
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


// 客户选择的 支付方式 
export const paymentMethods = [
  {
    id: "alipay",
    name: "支付宝",
    description: "扫码、转帐、小荷包、支转卡、群红包等",
    icon: "alipay1.png",
    enabled: 1,
    tags: ["strongly_recommended", "high_success_rate"],
    
  },

  {
    id: "qq",
    name: "QQ收款",
    description: "QQ红包、群红包、支持微信支付",
    icon: "qq.png",
    enabled: 1,
    tags: ["strongly_recommended", "high_success_rate"],
  },
  {
    id: "douyin",
    name: "抖音扫码",
    description: "扫码支付,快捷,成功率高",
    icon: "douyin.png",
    enabled: 1,
    tags: ["strongly_recommended", "high_success_rate"],
    
  },
  {
    id: "weixin",
    name: "微信",
    description: "扫码、转账、群红包等",
    icon: "weixin2.png",
    enabled: 1,
    tags: [],
    
  },
  {
    id: "jingdong",
    name: "京东",
    description: "上分更方便快捷",
    icon: "jingdong.png",
    enabled: 1,
    tags: [ "no_risk", "instant_credit"],
    
  },
  {
    id: "woqianbao",
    name: "沃钱包",
    description: "联通沃钱包支付",
    icon: "woqianbao.png",
    enabled: 1,
    tags: [ "no_risk", "instant_credit"],
    
  },
  {
    id: "dingtalk",
    name: "钉钉扫码",
    description: "钉钉扫码支付",
    icon: "dingding.png", 
    enabled: 1,
    tags: [ "no_risk", "instant_credit"],
    

  },
  {
    id: "yizhifu",
    name: "翼支付",
    description: "中国电信旗下翼支付,成功率高",
    icon: "yizhifu.png",
    enabled: 1,
    tags: [ "no_risk", "instant_credit"],
    

  },
  {
    id: "drmb",
    name: "数字人民币",
    description: "秒到账、禁止修改金额",
    icon: "drmb.png",
    enabled: 1,
    tags: [ "no_risk", "instant_credit"],
    
  },

  {
    id: "fenxiangshenghuo",
    name: "纷享生活",
    description: "上分更方便快捷",
    icon: "fenxiangshenghuo.jpg",
    enabled: 1,
    tags: [ "no_risk", "instant_credit"],
    
  },
  {
    id: "yidonghebao",
    name: "移动和包",
    description: "扫码、转账，禁止充话费",
    icon: "yidonghebao.png", // 使用移动和包图标替代
    enabled: 1,
    tags: [ "no_risk", "instant_credit"],
    
  },
]