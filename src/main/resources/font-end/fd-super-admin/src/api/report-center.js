import request from '@/utils/request'

/*
 * 报表中心
 */
  
const tempBase = ''
/*
 * 分页查询租户代理日报信息 
 */

export function getTenantAgentReportPage(data,params) {
  return request({
    url: tempBase+'/statistics/dailyTenantAgentReport/getTenantAgentReportPage',
    method: 'post',
    data,
    params
  })
}
/*
 * 获取租户代理日报汇总信息 
 */

export function dailyTenantAgentReportSummary(data) {
  return request({
    url: tempBase+'/statistics/dailyTenantAgentReport/summary',
    method: 'post',
    data
  })
}
/*
 * 导出租户代理日报信息 
 */

export function dailyTenantAgentReportExport(data) {
  return request({
    url: tempBase+'/statistics/dailyTenantAgentReport/export',
    method: 'post',
    data,
    responseType: 'blob'
  })
}
/*
 * 生成租户代理日报信息 
 */

export function dailyTenantAgentReportGenerate(params) {
  return request({
    url: tempBase+'/statistics/dailyTenantAgentReport/generate',
    method: 'get',
    params
  })
}
/*
 * 分页查询平台日报信息 
 */

export function getPlatformReportPage(data,params) {
  return request({
    url: tempBase+'/statistics/dailyPlatformReport/getPlatformReportPage',
    method: 'post',
    data,
    params
  })
}
/*
 * 获取平台日报汇总信息 
 */

export function dailyPlatformReportSummary(data) {
  return request({
    url: tempBase+'/statistics/dailyPlatformReport/summary',
    method: 'post',
    data
  })
}
/*
 * 导出平台日报信息 --平台日报表
 */

export function dailyPlatformReportExport(data) {
  return request({
    url: tempBase+'/statistics/dailyPlatformReport/export',
    method: 'post',
    data,
    responseType: 'blob'
  })
}


/*
 * 生成平台日报信息 
 */

export function dailyPlatformReportGenerate(params) {
  return request({
    url: tempBase+'/statistics/dailyPlatformReport/generate',
    method: 'get',
    params
  })
}
/*
 * 分页查询商户代理报告信息 
 */

export function getMerchantAgentReportPage(data,params) {
  return request({
    url: tempBase+'/statistics/dailyMerchantAgentReport/getMerchantAgentReportPage',
    method: 'post',
    data,
    params
  })
}
/*
 * 获取商户代理报告汇总信息 
 */

export function dailyMerchantAgentReportSummary(data) {
  return request({
    url: tempBase+'/statistics/dailyMerchantAgentReport/summary',
    method: 'post',
    data
  })
}
/*
 * 导出商户代理报告信息 
 */

export function dailyMerchantAgentReportExport(data) {
  return request({
    url: tempBase+'/statistics/dailyMerchantAgentReport/export',
    method: 'post',
    data,
    responseType: 'blob'
  })
}
/*
 * 生成商户代理报告信息 
 */

export function dailyMerchantAgentReportGenerate(params) {
  return request({
    url: tempBase+'/statistics/dailyMerchantAgentReport/generate',
    method: 'get',
    params
  })
}
/*
 * 分页查询商户日报信息 
 */

export function getMerchantReportPage(data,params) {
  return request({
    url: tempBase+'/statistics/dailyMerchantReport/getMerchantReportPage',
    method: 'post',
    data,
    params
  })
}
/*
 * 获取商户日报汇总信息 
 */

export function dailyMerchantReportSummary(data) {
  return request({
    url: tempBase+'/statistics/dailyMerchantReport/summary',
    method: 'post',
    data
  })
}
/*
 * 导出商户日报信息 
 */

export function dailyMerchantReportExport(data) {
  return request({
    url: tempBase+'/statistics/dailyMerchantReport/export',
    method: 'post',
    data,
    responseType: 'blob'
  })
}
/*
 * 生成商户日报信息 
 */

export function dailyMerchantReportGenerate(params) {
  return request({
    url: tempBase+'/statistics/dailyMerchantReport/generate',
    method: 'get',
    params
  })
}
/*
 * 分页查询码商日报信息 
 */

export function getProviderReportPage(data,params) {
  return request({
    url: tempBase+'/statistics/providerDailyReport/getProviderReportPage',
    method: 'post',
    data,
    params
  })
}
/*
 * 获取码商日报汇总信息 
 */

export function providerDailyReportSummary(data) {
  return request({
    url: tempBase+'/statistics/providerDailyReport/summary',
    method: 'post',
    data
  })
}
/*
 * 导出码商日报信息 
 */

export function providerDailyReportExport(data) {
  return request({
    url: tempBase+'/statistics/providerDailyReport/export',
    method: 'post',
    data,
    responseType: 'blob'
  })
}
/*
 * 生成码商日报信息 
 */

export function providerDailyReportGenerate(params) {
  return request({
    url: tempBase+'/statistics/providerDailyReport/generate',
    method: 'get',
    params
  })
}
/*
 * 分页查询产品类型日报信息 
 */

export function getProductTypeReportPage(data,params) {
  return request({
    url: tempBase+'/statistics/dailyProductTypeReport/getProductTypeReportPage',
    method: 'post',
    data,
    params
  })
}
/*
 * 获取产品类型日报汇总信息 
 */

export function dailyProductTypeReportSummary(data) {
  return request({
    url: tempBase+'/statistics/dailyProductTypeReport/summary',
    method: 'post',
    data
  })
}
/*
 * 导出产品类型日报信息 
 */

export function dailyProductTypeReportExport(data) {
  return request({
    url: tempBase+'/statistics/dailyProductTypeReport/export',
    method: 'post',
    data,
    responseType: 'blob'
  })
}
/*
 * 生成产品类型日报信息 
 */

export function dailyProductTypeReportGenerate(params) {
  return request({
    url: tempBase+'/statistics/dailyProductTypeReport/generate',
    method: 'get',
    params
  })
}
/*
 * 分页查询通道日报信息 
 */

export function getChannelReportPage(data,params) {
  return request({
    url: tempBase+'/statistics/dailyChannelReport/getChannelReportPage',
    method: 'post',
    data,
    params
  })
}
/*
 * 获取通道日报汇总信息 
 */

export function dailyChannelReportSummary(data) {
  return request({
    url: tempBase+'/statistics/dailyChannelReport/summary',
    method: 'post',
    data
  })
}
/*
 * 导出通道日报信息 
 */

export function dailyChannelReportExport(data) {
  return request({
    url: tempBase+'/statistics/dailyChannelReport/export',
    method: 'post',
    data,
    responseType: 'blob'
  })
}
/*
 * 生成通道日报信息 
 */

export function dailyChannelReportGenerate(params) {
  return request({
    url: tempBase+'/statistics/dailyChannelReport/generate',
    method: 'get',
    params
  })
}
/*
 * 分页查询产品日报信息 
 */

export function getProductReportPage(data,params) {
  return request({
    url: tempBase+'/statistics/dailyProductReport/getProductReportPage',
    method: 'post',
    data,
    params
  })
}
/*
 * 获取产品日报汇总信息 
 */

export function dailyProductReportSummary(data) {
  return request({
    url: tempBase+'/statistics/dailyProductReport/summary',
    method: 'post',
    data
  })
}
/*
 * 导出产品日报信息 
 */

export function dailyProductReportExport(data) {
  return request({
    url: tempBase+'/statistics/dailyProductReport/export',
    method: 'post',
    data,
    responseType: 'blob'
  })
}
/*
 * 生成产品日报信息 
 */

export function dailyProductReportGenerate(params) {
  return request({
    url: tempBase+'/statistics/dailyProductReport/generate',
    method: 'get',
    params
  })
}
