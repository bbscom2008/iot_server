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
