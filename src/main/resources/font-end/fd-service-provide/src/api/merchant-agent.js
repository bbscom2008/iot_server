import request from '@/utils/request'
//商户代理管理
/**
 * 分页查询商户代理信息
 * @returns 
 */
export function merchantAgentPage(data) {
  return request({
    url: '/master/merchantAgent/page',
    method: 'post',
    data
  })
}
/**
 * 复制商户代理
 * @returns 
 */
export function merchantAgentCopy(data) {
  return request({
    url: '/master/merchantAgent/copy',
    method: 'post',
    data
  })
}
/**
 * 分页查询 商户代理--团队列表
 * @returns 
 */
export function merchantAgentReportPage(data) {
  return request({
    url: '/master/merchantAgentReport/page',
    method: 'post',
    data
  })
}
/**
 * 分润配置
 * @returns 
 */
export function distributeProfitSetting(data) {
  return request({
    url: '/merchant-agent/distribute-profit-setting',
    method: 'post',
    data
  })
}
