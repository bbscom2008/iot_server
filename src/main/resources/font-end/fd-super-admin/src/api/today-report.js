import request from '@/utils/request'

/*
 * 报表中心
 */

const tempBase = ''
/*
 * 获取今日租户代理日报信息 --平台代理今日报表
 */

export function getOrderTodayReport(params) {
  return request({
    url: tempBase + '/statistics/dailyTenantAgentReport/getOrderTodayReport',
    method: 'get',
    params
  })
}

/*
 * 获取今日租户代理日报汇总信息 --平台代理今日报表
 */

export function getOrderTodaySummaryReport(params) {
  return request({
    url: tempBase + '/statistics/dailyTenantAgentReport/getOrderTodaySummaryReport',
    method: 'get',
    params
  })
}
/*
 * 获取今日平台日报汇总信息 
 */

export function dailyPlatformReportSummary(params) {
  return request({
    url: tempBase + '/statistics/dailyPlatformReport/getOrderTodaySummaryReport',
    method: 'get',
    params
  })
}
/*
 * 获取今日平台日报信息 
 */

export function getTenantTodayReport(params) {
  return request({
    url: tempBase + '/statistics/dailyPlatformReport/getTenantTodayReport',
    method: 'get',
    params
  })
}

/*
 * 获取今日商户代理日报汇总信息 --商户代理日报
 */

export function dailyMerchantAgentReportSummary(params) {
  return request({
    url: tempBase + '/statistics/dailyMerchantAgentReport/getOrderTodaySummaryReport',
    method: 'get',
    params
  })
}
/*
 * 获取今日商户代理日报信息 --商户代理日报
 */

export function dailyMerchantAgentReport(params) {
  return request({
    url: tempBase + '/statistics/dailyMerchantAgentReport/getOrderTodayReport',
    method: 'get',
    params
  })
}


/*
 * 获取今日商户日报汇总信息 --商户日报
 */

export function dailyMerchantReportSummary(params) {
  return request({
    url: tempBase + '/statistics/dailyMerchantReport/getOrderTodaySummaryReport',
    method: 'get',
    params
  })
}
/*
 * 获取今日商户日报信息 --商户日报
 */

export function dailyMerchantReport(params) {
  return request({
    url: tempBase + '/statistics/dailyMerchantReport/getOrderTodayReport',
    method: 'get',
    params
  })
}
/*
 * 获取今日码商日报汇总信息 --码商日报
 */

export function providerDailyReportSummary(params) {
  return request({
    url: tempBase + '/statistics/providerDailyReport/getOrderTodaySummaryReport',
    method: 'get',
    params
  })
}
/*
 * 获取今日码商日报信息 --码商日报
 */

export function providerDailyReport(params) {
  return request({
    url: tempBase + '/statistics/providerDailyReport/getOrderTodayReport',
    method: 'get',
    params
  })
}
/*
 * 获取今日产品类型日报汇总信息 --产品类型日报
 */

export function dailyProductTypeReportSummary(params) {
  return request({
    url: tempBase + '/statistics/dailyProductTypeReport/getOrderTodaySummaryReport',
    method: 'get',
    params
  })
}
/*
 * 获取今日产品类型日报信息 --产品类型日报
 */

export function dailyProductTypeReport(params) {
  return request({
    url: tempBase + '/statistics/dailyProductTypeReport/getOrderTodayReport',
    method: 'get',
    params
  })
}
/*
 * 获取今日通道日报汇总信息 --通道日报
 */

export function dailyChannelReportSummary(params) {
  return request({
    url: tempBase + '/statistics/dailyChannelReport/getOrderTodaySummaryReport',
    method: 'get',
    params
  })
}
/*
 * 获取今日通道日报信息 --通道日报
 */

export function dailyChannelReport(params) {
  return request({
    url: tempBase + '/statistics/dailyChannelReport/getOrderTodayReport',
    method: 'get',
    params
  })
}
/*
 * 获取今日产品日报汇总信息 --产品日报
 */

export function dailyProductReportSummary(params) {
  return request({
    url: tempBase + '/statistics/dailyProductReport/getOrderTodaySummaryReport',
    method: 'get',
    params
  })
}
/*
 * 获取今日产品日报信息 --产品日报
 */

export function dailyProductReport(params) {
  return request({
    url: tempBase + '/statistics/dailyProductReport/getOrderTodayReport',
    method: 'get',
    params
  })
}

//---------  导出今日报表


/*
 * 导出码商日报信息 
 */

export function dailyServiceReportExportToday(data) {
  return request({
    url: tempBase+'/statistics/providerDailyReport/exportToday',
    method: 'post',
    data,
    responseType: 'blob'
  })
}


/*
 * 导出通道日报信息 
 */

export function channelReportExportToday(data) {
  return request({
    url: tempBase+'/statistics/dailyChannelReport/exportToday',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

/*
 * 导出产品日报信息 
 */

export function dailyProductReportExportToday(data) {
  return request({
    url: tempBase+'/statistics/dailyProductReport/exportToday',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

/*
 * 导出租户代理日报信息 
 */

export function tenantAgentReportExportToday(data) {
  return request({
    url: tempBase+'/statistics/dailyTenantAgentReport/exportToday',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

/*
 * 导出商户代理报告信息 
 */

export function dailyMerchantAgentReportExportToday(data) {
  return request({
    url: tempBase+'/statistics/dailyMerchantAgentReport/exportToday',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

/*
 * 导出平台日报信息 
 */

export function dailyPlatformReportExportToday(data) {
  return request({
    url: tempBase+'/statistics/dailyPlatformReport/exportToday',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

/*
 * 导出商户日报信息 
 */

export function dailyMerchantReportExportToday(data) {
  return request({
    url: tempBase+'/statistics/dailyMerchantReport/exportToday',
    method: 'post',
    data,
    responseType: 'blob'
  })

}

/*
 * 导出产品类型日报信息 
 */

export function dailyProductTypeReportExportToday(data) {
  return request({
    url: tempBase+'/statistics/dailyProductTypeReport/exportToday',
    method: 'post',
    data,
    responseType: 'blob'
  })
}