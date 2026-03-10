import request from '@/utils/request'
//商户代理管理
/**
 * 分页查询商户代理信息
 * @returns 
 */
export function merchantAgentPage() {
  return request({
    url: '/master/merchantAgent/page',
    method: 'post',
  })
}
/**
 * 分页查询 商户代理--团队列表
 * @returns 
 */
export function merchantAgentReportPage() {
  return request({
    url: '/master/merchantAgentReport/page',
    method: 'post',
  })
}
/**
 * 分润配置
 * @returns 
 */
export function distributeProfitSetting() {
  return request({
    url: '/merchant-agent/distribute-profit-setting',
    method: 'post',
  })
}






//分端后--修改字段  最新完善  2025.3.20

/**
 * 商户报表
 * @returns 
 */
export function dailyMerchantReportPage() {
  return request({
    url: '/report/dailyMerchantReport/page',
    method: 'post',
  })
}
/**
 * 商户报表-汇总信息
 * @returns 
 */
export function dailyMerchantReportSummary() {
  return request({
    url: '/report/dailyMerchantReport/summary',
    method: 'post',
  })
}

/**
 * 商户代理-----账变记录
 * @returns 
 */
export function getMerchantAgentAccountChangePage(data,params) {
  return request({
    url: '/finance/getMerchantAgentAccountChangePage',
    method: 'post',
    data,
    params
  })
}
/**
 * 商户代理----提现申请列表
 * @returns 
 */
export function getMerchantAgentWithdrawalPage(data,params) {
  return request({
    url: '/finance/merchantAgent/getMerchantAgentWithdrawalPage',
    method: 'post',
    data,
    params
  })
}
/**
 * 商户代理----新增商户代理提现申请
 * @returns 
 */
export function merchantAgentWithdrawalAdd(data) {
  return request({
    url: '/finance/merchantAgent/withdrawal/add',
    method: 'post',
    data
  })
}
/**
 * 导出商户代理账变记录
 * @returns
 */
export function merchantAgentAccountChangeExport(data) {
  return request({
    timeout: 600000,
    url: '/finance/merchantAgentAccountChange/export',
    method: 'post',
    data,
    responseType: 'blob'
  })
}



