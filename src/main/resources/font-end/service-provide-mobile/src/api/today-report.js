import request from '@/utils/request'

/*
 * 今日报表
 */

/*
 * 获取今日码商日报信息
 */

export function EndOfDayReport(params) {
  console.log('----params---', params);
  return request({
    url: '/statistics/provider/EndOfDayReport/getOrderTodayReport',
    method: 'get',
    params
  })
}
/*
 * 获取今日码商日报汇总信息
 */

export function EndOfDayReportSummary(params) {
  return request({
    url: '/statistics/provider/EndOfDayReport/getOrderTodaySummaryReport',
    method: 'get',
    params
  })
}
/*
 * 获取今日码商团队日报信息
 */

export function providerTeamReport(params) {
  return request({
    url: '/statistics/provider/providerTeamReport/getOrderTodayReport',
    method: 'get',
    params
  })
}
/*
 * 获取今日码商日报汇总信息
 */

export function providerTeamReportSummary(params) {
  return request({
    url: '/statistics/provider/providerTeamReport/getOrderTodaySummaryReport',
    method: 'get',
    params
  })
}
/*
 * 获取今日产品日报信息
 */

export function productDailyReport(params) {
  return request({
    url: '/statistics/provider/productDailyReport/getOrderTodayReport',
    method: 'get',
    params
  })
}
/*
 * 获取今日产品日报汇总信息
 */

export function productDailyReportSummary(params) {
  return request({
    url: '/statistics/provider/productDailyReport/getOrderTodaySummaryReport',
    method: 'get',
    params
  })
}
/*
 * 获取今日收款信息日报信息
 */

export function payeeAccountDailyReport(params) {
  return request({
    url: '/statistics/provider/payeeAccountDailyReport/getOrderTodayReport',
    method: 'get',
    params
  })
}
/*
 * 获取今日收款信息日报汇总信息
 */

export function payeeAccountDailyReportSummary(params) {
  return request({
    url: '/statistics/provider/payeeAccountDailyReport/getOrderTodaySummaryReport',
    method: 'get',
    params
  })
}