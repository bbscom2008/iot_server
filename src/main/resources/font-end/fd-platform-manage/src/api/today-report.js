
import request from '@/utils/request'

/*
 * 今日报表中心
 */

const tempBase = ''
/*
 * 获取今日平台日报信息
 */

export function getOrderTodayReport(params) {
  return request({
    url: tempBase+'/statistics/tenant/platformDailyReport/getOrderTodayReport',
    method: 'get',
    params
  })
}
/*
 * 获取今日平台日报汇总信息
 */

export function getOrderTodaySummaryReport(params) {
  return request({
    url: tempBase+'/statistics/tenant/platformDailyReport/getOrderTodaySummaryReport',
    method: 'get',
    params
  })
}
/*
 * 获取今日商户代理日报信息
 */

export function merchantAgentDailyReport(params) {
  return request({
    url: tempBase+'/statistics/tenant/merchantAgentDailyReport/getOrderTodayReport',
    method: 'get',
    params
  })
}
/*
 * 获取今日商户代理日报汇总信息
 */

export function merchantAgentDailyReportSummary(params) {
  return request({
    url: tempBase+'/statistics/tenant/merchantAgentDailyReport/getOrderTodaySummaryReport',
    method: 'get',
    params
  })
}
/*
 * 获取今日商户日报信息
 */

export function merchantDailyReport(params) {
  return request({
    url: tempBase+'/statistics/tenant/merchantDailyReport/getOrderTodayReport',
    method: 'get',
    params
  })
}
/*
 * 获取今日商户日报汇总信息
 */

export function merchantDailyReportSummary(params) {
  return request({
    url: tempBase+'/statistics/tenant/merchantDailyReport/getOrderTodaySummaryReport',
    method: 'get',
    params
  })
}
/*
 * 获取今日码商日报信息
 */

export function providerDailyReport(params) {
  return request({
    url: tempBase+'/statistics/tenant/providerDailyReport/getOrderTodayReport',
    method: 'get',
    params
  })
}
/*
 * 获取今日码商日报汇总信息
 */

export function providerDailyReportSummary(params) {
  return request({
    url: tempBase+'/statistics/tenant/providerDailyReport/getOrderTodaySummaryReport',
    method: 'get',
    params
  })
}
/*
 * 获取今日通道日报信息
 */

export function channelDailyReport(params) {
  return request({
    url: tempBase+'/statistics/tenant/channelDailyReport/getOrderTodayReport',
    method: 'get',
    params
  })
}
/*
 * 获取今日通道日报汇总信息
 */

export function channelDailyReportSummary(params) {
  return request({
    url: tempBase+'/statistics/tenant/channelDailyReport/getOrderTodaySummaryReport',
    method: 'get',
    params
  })
}
/*
 * 获取今日产品日报信息
 */

export function productDailyReport(params) {
  return request({
    url: tempBase+'/statistics/tenant/productDailyReport/getOrderTodayReport',
    method: 'get',
    params
  })
}
/*
 * 获取今日产品日报汇总信息
 */

export function productDailyReportSummary(params) {
  return request({
    url: tempBase+'/statistics/tenant/productDailyReport/getOrderTodaySummaryReport',
    method: 'get',
    params
  })
}
