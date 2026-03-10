import request from '@/utils/request'

/*
 * 今日报表
 */

///获取今日商户日报信息

export function merchantDailyReport(params) {
  return request({
    url: '/statistics/merchant/merchantDailyReport/getOrderTodayReport',
    method: 'get',
    params
  })
}
///获取今日商户日报汇总信息

export function merchantDailyReportSummary(params) {
  return request({
    url: '/statistics/merchant/merchantDailyReport/getOrderTodaySummaryReport',
    method: 'get',
    params
  })
}
///获取今日通道日报信息

export function channelDailyReport(params) {
  return request({
    url: '/statistics/merchant/channelDailyReport/getOrderTodayReport',
    method: 'get',
    params
  })
}
///获取今日通道日报汇总信息

export function channelDailyReportSummary(params) {
  return request({
    url: '/statistics/merchant/channelDailyReport/getOrderTodaySummaryReport',
    method: 'get',
    params
  })
}