// export const uploadServiceUrl = 'http://18.136.207.197:8001/master/system/file'
export const uploadServiceUrl = '/wxapi/master/system/file'



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
 * 刷新的选 项
 */
export const refreshOptions = [
  {
    label: '不刷新',
    value: 0
  },
  {
    label: '每5秒刷新一次',
    value: 5
  },
  {
    label: '每10秒刷新一次',
    value: 10
  },
  {
    label: '每30秒刷新一次',
    value: 30
  },
  {
    label: '每1分钟刷新一次',
    value: 60
  }
]

/**
 * 二维码生成方式
 */
export const parseTypeOptions = [
  { label: '原图', value: 0 },
  // { label: '上传并解析', value: 1 },
  { label: '直接配置数据', value: 2 }
]

/**
 * 业务类型，用于区分账变记录的不同业务场景（如订单类、业务类等）。
 */
export const businessTypeOptions = [
  { label: '订单类', value: 0 },
  { label: '业务类', value: 1 }
]

/**
 * 账变类型，用于区分账变的具体操作类型（如充值、扣款、提现等）。
账变类型（0-充值、1-扣款、2-提现、3-冲正、4-余额划拨、5-结算、6-押金、7-订单交易、8-订单手续费、9-下级分佣、10-冻结、11-解冻）
 */
export const changeTypeOptions = [
  { label: '充值', value: 0, type: 'success' },
  { label: '扣款', value: 1, type: '' },
  { label: '提现', value: 2, type: 'success' },
  { label: '冲正', value: 3, type: '' },
  { label: '余额划拨', value: 4, type: 'success' },
  { label: '结算', value: 5, type: '' },
  { label: '押金', value: 6, type: 'success' },
  { label: '订单交易', value: 7, type: '' },
  { label: '订单手续费', value: 8, type: 'success' },
  { label: '下级分佣', value: 9, type: 'success' },
  { label: '冻结', value: 10, type: 'success' },
  { label: '解冻', value: 11, type: 'success' }
]

/**
 * 订单状态
 */
export const orderStateOptions = [
  {
    label: '已生成',
    value: 0,
    type: 'info'
  },
  {
    label: '待接单',
    value: 1,
    type: 'info'
  },
  {
    label: '已接单',
    value: 2,
    type: 'success'
  },
  {
    label: '已成功',
    value: 3,
    type: 'success'
  },
  {
    label: '已取消',
    value: 4,
    type: 'warning'
  },
  {
    label: '已超时',
    value: 5,
    type: 'warning'
  },
  {
    label: '恶意拉单',
    value: 6,
    type: 'error'
  },
  {
    label: '未出码',
    value: 7,
    type: 'error'
  },
  {
    label: '无码订单',
    value: 8,
    type: 'error'
  },
  {
    label: '冲正',
    value: 9,
    type: 'info'
  },
   {
    label: '无访问取消',
    value: 10,
    type: 'info'
  }
]

/**
 * 订单通知状态
 */
export const notifyStatusOptions = [
  { label: '未通知', value: 0, type: 'info' },
  { label: '通知成功', value: 1, type: 'success' },
  { label: '通知失败', value: 2, type: 'danger' }
  // { label: '响应成功', value: 3, type: 'success' },
  // { label: '响应失败', value: 4, type: 'warning' }
]

/**
 * 通知状态
 */
export const notifyStatusSimpleOptions = [
  { label: '未通知', value: 0, type: 'info' },
  { label: '通知成功', value: 1, type: 'success' },
  { label: '通知失败', value: 2, type: 'danger' }
]

/**
 * 限额类型（0-无限制，1-固定金额，2-范围金额）
 **/
export const limitAmountTypeOptions = [
  { label: '无限制', value: 0, type: 'info' },
  { label: '固定金额', value: 1, type: 'info' },
  { label: '范围金额', value: 2, type: 'info' }
]

/**
 * 过期时间（0-无限制，1-固定金额，2-范围金额）
 **/
export const payeeAccountExpireTimeTypeOptions = [
  { label: '无限制', value: 0, type: 'info' },
  { label: '指定时间', value: 1, type: 'info' },
  { label: '指定时长', value: 2, type: 'info' }
]

/**
 * 是否启用
 */
export const isActiveOptions = [
  { label: '启用', value: 1, type: 'success' },
  { label: '禁用', value: 0, type: 'error' }
]

/**
 * 是否可用
 */
export const isAvailableOptions = [
  { label: '可用', value: 1, type: 'success' },
  { label: '不可用', value: 0, type: 'error' }
]

/**
 * 业务类型 2
 */
export const balanceTypeOptions = [
  { label: '扣款', value: 1, type: 'success' },
  { label: '充值', value: 0, type: 'success' }
]

/**
 * 提现状态（0-申请中、1-审核通过、2-审核驳回）
 */
export const withdrawalApplyStatusOtions = [
  { label: '申请中', value: 0, type: 'info' },
  { label: '审核通过', value: 1, type: 'success' },
  { label: '审核驳回', value: 2, type: 'error' }
]

/**
 * 交易类型（0-代收，1-代付）,可用值:0,1,示例值(1)
 */
export const tradeTypeOtions = [
  { label: '代收', value: 0, type: 'success' },
  { label: '代付', value: 1, type: 'error' }
]

// 转账备注类型（0-随机6位数字 1-随机字符串 2-随机邮箱 3-随机手机号 4-随机QQ号）
export const transferRemarkTypeOptions = [
  { label: '随机6位数字', value: 0 },
  { label: '随机字符串', value: 1 },
  { label: '随机邮箱', value: 2 },
  { label: '随机手机号', value: 3 },
  { label: '随机QQ号', value: 4 }
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
