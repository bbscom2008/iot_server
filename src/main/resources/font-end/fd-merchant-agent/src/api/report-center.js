import request from '@/utils/request'

/*
 * 分页查询商户报表信息-报表中心
 */

export function getReportPage(data, params) {
  return request({
    url: '/statistics/merchantAgent/merchantReport/getReportPage',
    method: 'post',
    data,
    params
  })
}
/*
 * 获取商户报表汇总信息-报表中心
 */

export function merchantReportSummary(data) {
  return request({
    url: '/statistics/merchantAgent/merchantReport/summary',
    method: 'post',
    data
  })
}
/*
 * 导出商户报表信息-报表中心
 */

export function merchantReportExport(data) {
  return request({
    url: '/statistics/merchantAgent/merchantReport/export',
    method: 'post',
    data,
    responseType: 'blob'
  })
}
/*
 * 生成商户报表信息-报表中心
 */

export function merchantReportGenerate(params) {
  return request({
    url: '/statistics/merchantAgent/merchantReport/generate',
    method: 'get',
    params
  })
}
///////////////////今日报表
/*
 * 获取今日商户日报信息
 */

export function getOrderTodayReport(params) {
  return request({
    url: '/statistics/merchantAgent/merchantReport/getOrderTodayReport',
    method: 'get',
    params
  })
}
/*
 * 获取今日商户日报汇总信息
 */

export function getOrderTodaySummaryReport(params) {
  return request({
    url: '/statistics/merchantAgent/merchantReport/getOrderTodaySummaryReport',
    method: 'get',
    params
  })
}
