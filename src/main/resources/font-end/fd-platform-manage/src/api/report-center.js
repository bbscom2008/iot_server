import request from '@/utils/request'

/*
 * 报表中心
 */



/////////////////////////////////////////最新接口字段+逻辑   2025-3-28
const tempBase = ''

/**
 * 获取码商开户信息
 * @returns 
 */
export function getProviderOpenInfo(providerId) {
  return request({
    url: `/master/provider/getProviderOpenInfo/${providerId}`,
    method: 'get'
  })
}


/*
 * 分页查询平台日报信息  --平台日报表
 */

export function getReportPage(data,params) {
  return request({
    url: tempBase+'/statistics/tenant/platformDailyReport/getReportPage',
    method: 'post',
    data,
    params
  })
}

/*
 * 获取平台日报汇总信息 --平台日报表
 */

export function summary(data) {
  return request({
    url: tempBase+'/statistics/tenant/platformDailyReport/summary',
    method: 'post',
    data
  })
}




/*
 * 导出平台日报信息 --平台日报表
 */

export function platformDailyReportExport(data) {
  return request({
    url: tempBase+'/statistics/tenant/platformDailyReport/export',
    method: 'post',
    data,
    responseType: 'blob'
  })
}
/*
 * 生成平台日报信息--平台日报表
 */

export function platformDailyReportGenerate(params) {
  return request({
    url: tempBase+'/statistics/tenant/platformDailyReport/generate',
    method: 'get',
    params
  })
}

/*
 * 分页查询商户代理日报信息  --平台日报表
 */

export function merchantAgentDailyReportGetReportPage(data,params) {
  return request({
    url: tempBase+'/statistics/tenant/merchantAgentDailyReport/getReportPage',
    method: 'post',
    data,
    params
  })
}
/*
 * 获取商户代理日报汇总信息  --平台日报表
 */

export function merchantAgentDailyReportSummary(data) {
  return request({
    url: tempBase+'/statistics/tenant/merchantAgentDailyReport/summary',
    method: 'post',
    data
  })
}
/*
 * 导出商户代理日报信息  --平台日报表
 */

export function merchantAgentDailyReportExport(data) {
  return request({
    url: tempBase+'/statistics/tenant/merchantAgentDailyReport/export',
    method: 'post',
    data,
    responseType: 'blob'
  })
}
/*
 * 生成商户代理日报信息  --平台日报表
 */

export function merchantAgentDailyReportGenerate(params) {
  return request({
    url: tempBase+'/statistics/tenant/merchantAgentDailyReport/generate',
    method: 'get',
    params
  })
}
/*
 * 分页查询商户日报信息 --平台日报表
 */

export function getMerchantReportPage(data,params) {
  return request({
    url: tempBase+'/statistics/tenant/merchantDailyReport/getReportPage',
    method: 'post',
    data,
    params
  })
}
/*
 * 获取商户日报汇总信息--平台日报表
 */

export function merchantDailyReportSummary(data) {
  return request({
    url: tempBase+'/statistics/tenant/merchantDailyReport/summary',
    method: 'post',
    data
  })
}
/*
 * 导出商户日报信息--平台日报表
 */

export function merchantDailyReportExport(data) {
  return request({
    url: tempBase+'/statistics/tenant/merchantDailyReport/export',
    method: 'post',
    data,
    responseType: 'blob'
  })
}
/*
 * 生成商户日报信息--平台日报表
 */

export function merchantDailyReportGenerate(params) {
  return request({
    url: tempBase+'/statistics/tenant/merchantDailyReport/generate',
    method: 'get',
    params
  })
}
/*
 * 分页查询码商日报信息--平台日报表
 */

export function providerDailyReportGetReportPage(data,params) {
  return request({
    url: tempBase+'/statistics/tenant/providerDailyReport/getReportPage',
    method: 'post',
    data,
    params
  })
}
/*
 * 获取码商日报汇总信息--平台日报表
 */

export function providerDailyReportSummary(data) {
  return request({
    url: tempBase+'/statistics/providerDailyReport/summary',
    // url: tempBase+'/statistics/tenant/providerDailyReport/summary',
    method: 'post',
    data
  })
}
/*
 * 导出码商日报信息--平台日报表
 */

export function providerDailyReportExport(data) {
  return request({
    url: tempBase+'/statistics/tenant/providerDailyReport/export',
    method: 'post',
    data,
    responseType: 'blob'
  })
}
/*
 * 生成码商日报信息--平台日报表
 */

export function providerDailyReportGenerate(params) {
  return request({
    url: tempBase+'/statistics/tenant/providerDailyReport/generate',
    method: 'get',
    params
  })
}

/*
 * 分页查询通道日报信息--平台日报表
 */

export function channelDailyReportGetReportPage(data,params) {
  return request({
    url: tempBase+'/statistics/tenant/channelDailyReport/getReportPage',
    method: 'post',
    data,
    params
  })
}
/*
 * 获取通道日报汇总信息--平台日报表
 */

export function channelDailyReportSummary(data) {
  return request({
    url: tempBase+'/statistics/tenant/channelDailyReport/summary',
    method: 'post',
    data
  })
}
/*
 * 导出通道日报信息--平台日报表
 */

export function channelDailyReportExport(data) {
  return request({
    url: tempBase+'/statistics/tenant/channelDailyReport/export',
    method: 'post',
    data,
    responseType: 'blob'
  })
}
/*
 * 生成通道日报信息--平台日报表
 */

export function channelDailyReportGenerate(params) {
  return request({
    url: tempBase+'/statistics/tenant/channelDailyReport/generate',
    method: 'get',
    params
  })
}

/*
 * 分页查询产品日报信息--平台日报表
 */

export function productDailyReportGetReportPage(data,params) {
  return request({
    url: tempBase+'/statistics/tenant/productDailyReport/getReportPage',
    method: 'post',
    data,
    params
  })
}
/*
 * 获取产品日报汇总信息--平台日报表
 */

export function productDailyReportSummary(data) {
  return request({
    url: tempBase+'/statistics/tenant/productDailyReport/summary',
    method: 'post',
    data
  })
}
/*
 * 导出产品日报信息--平台日报表
 */

export function productDailyReportExport(data) {
  return request({
    url: tempBase+'/statistics/tenant/productDailyReport/export',
    method: 'post',
    data,
    responseType: 'blob'
  })
}
/*
 * 生成产品日报信息--平台日报表
 */

export function productDailyReportGenerate(params) {
  return request({
    url: tempBase+'/statistics/tenant/productDailyReport/generate',
    method: 'get',
    params
  })
}

