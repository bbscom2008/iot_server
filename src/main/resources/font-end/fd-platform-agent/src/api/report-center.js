import request from '@/utils/request'

/*
 * 报表中心
 */

export function platformDailyReport(data) {
  return request({
    url: '/report-center/platform-daily-report',
    method: 'post',
    data
  })
}

/*
 * 获取通道日报汇总信息
 */

export function dailyChannelReportSummary(data) {
  return request({
    url: '/master/dailyChannelReport/summary'
  })
}

/**
 * {
    "providerName": "",
    "startDate": "",
    "endDate": ""
  }
 * @param {*} data 
 * @returns 
 */
export const providerDailyReportSummary = (data) => {
  return request({
    url: '/master/providerDailyReport/summary',
    method: 'post',
    data
  })
}

/*
 * 分页查询通道日报信息
 */

export function dailyChannelReportPage(data) {
  return request({
    url: '/master/dailyChannelReport/page',
    method: 'post',
    data
  })
}
/*
 * 导出通道日报信息
 */

export function dailyChannelReportExport(data) {
  return request({
    url: '/master/dailyChannelReport/export',
    method: 'post',
    data
  })
}
/*
 * 生成通道日报信息
 */

export function dailyChannelReportGenerate(data) {
  return request({
    url: '/master/dailyChannelReport/generate',
    method: 'get',
    data
  })
}

/*
 * 获取产品日报汇总信息
 */

export function dailyProductReportSummary(data) {
  return request({
    url: '/master/dailyProductReport/summary',
    method: 'post',
    data
  })
}

/*
 * 分页查询产品日报信息
 */

export function dailyProductReportPage(data) {
  return request({
    url: '/master/dailyProductReport/page',
    method: 'post',
    data
  })
}

/*
 * 导出产品日报信息
 */

export function dailyProductReportExport(data) {
  return request({
    url: '/master/dailyProductReport/export',
    method: 'post',
    data
  })
}

/*
 * 生成产品日报信息
 */

export function dailyProductReportGenerate(data) {
  return request({
    url: '/master/dailyProductReport/generate',
    method: 'get',
    data
  })
}
/*
 * 获取产品类型日报汇总信息
 */

export function dailyProductTypeReportSummary(data) {
  return request({
    url: '/master/dailyProductTypeReport/summary',
    method: 'post',
    data
  })
}
/*
 * 分页查询产品类型日报信息
 */

export function dailyProductTypeReportPage(data) {
  return request({
    url: '/master/dailyProductTypeReport/page',
    method: 'post',
    data
  })
}
/*
 * 导出产品类型日报信息
 */

export function dailyProductTypeReportExport(data) {
  return request({
    url: '/master/dailyProductTypeReport/export',
    method: 'post',
    data
  })
}
/*
 * 生成产品类型日报信息
 */

export function dailyProductTypeReportGenerate(data) {
  return request({
    url: '/master/dailyProductTypeReport/generate',
    method: 'get',
    data
  })
}

/*
 * 获取收款信息日报汇总信息
 */

export function dailyPayeeAccountInfoReportSummary(data) {
  return request({
    url: '/master/dailyPayeeAccountInfoReport/summary',
    method: 'post',
    data
  })
}
/*
 * 分页查询收款信息日报信息
 */

export function dailyPayeeAccountInfoReportPage(data) {
  return request({
    url: '/master/dailyPayeeAccountInfoReport/page',
    method: 'post',
    data
  })
}
/*
 * 导出收款信息日报信息
 */

export function dailyPayeeAccountInfoReportExport(data) {
  return request({
    url: '/master/dailyPayeeAccountInfoReport/export',
    method: 'post',
    data
  })
}
/*
 * 生成收款信息日报信息
 */

export function dailyPayeeAccountInfoReportGenerate(data) {
  return request({
    url: '/master/dailyPayeeAccountInfoReport/generate',
    method: 'get',
    data
  })
}

////////最新接口字段   2025-3-27
//////////个人报表

/*
 * 分页查询租户代理日报信息  --平台代理
 */

export function getTenantAgentReportPage(data, params) {
  return request({
    url: '/report/dailyMerchantAgentReport/getTenantAgentReportPage',
    method: 'post',
    data,
    params
  })
}
/*
 * 导出租户代理日报信息 --平台代理
 */

export function dailyMerchantAgentReportExport(data) {
  return request({
    url: '/report/dailyMerchantAgentReport/export',
    method: 'post',
    data
  })
}
/*
 * 生成租户代理日报信息--平台代理
 */

export function dailyMerchantAgentReportGenerate(data) {
  return request({
    url: '/report/dailyMerchantAgentReport/generate',
    method: 'get',
    data
  })
}
/*
 * 获取租户代理日报汇总信息--平台代理
 */

export function dailyMerchantAgentReportSummary(data) {
  return request({
    url: '/report/dailyMerchantAgentReport/summary',
    method: 'post',
    data
  })
}
//////////平台日报表

/*
 * 分页查询平台日报信息
 */

export function getPlatformReportPage(data, params) {
  return request({
    url: '/report/dailyPlatformReport/getPlatformReportPage',
    method: 'post',
    data,
    params
  })
}
/*
 * 导出平台日报信息
 */

export function dailyPlatformReportExport(data) {
  return request({
    url: '/report/dailyPlatformReport/export',
    method: 'post',
    data,
    responseType: 'blob'
  })
}
/*
 * 生成平台日报信息
 */

export function dailyPlatformReportGenerate(data) {
  return request({
    url: '/report/dailyPlatformReport/generate',
    method: 'get',
    data
  })
}
/*
 * 获取平台日报汇总信息
 */

export function dailyPlatformReportSummary(data) {
  return request({
    url: '/report/dailyPlatformReport/summary',
    method: 'post',
    data
  })
}
////////平台列表

/*
 * 租户列表-分页查询
 */

export function getTenantAgentByUserIdPage(data, params) {
  return request({
    url: '/master/tenantAgent/getTenantAgentByUserIdPage',
    method: 'post',
    data,
    params
  })
}
//////账变记录

/*
 * 分页查询租户代理账变记录--平台代理账变记录
 */

export function getTenantAgentAccountChangePage(data, params) {
  return request({
    url: '/finance/getTenantAgentAccountChangePage',
    method: 'post',
    data,
    params
  })
}

///////////////提现申请
/**
 * 分页查询租户代理提现申请列表
 * @returns
 */
export function getTenantAgentWithdrawalPage(data, params) {
  return request({
    url: '/finance/tenantAgent/getTenantAgentWithdrawalPage',
    method: 'post',
    data,
    params
  })
}
/**
 * 新增租户代理提现申请
 * @returns
 */
export function tenantAgentWithdrawalAdd(data) {
  return request({
    url: '/finance/tenantAgent/withdrawal/add',
    method: 'post',
    data
  })
}
//////报表中心

/**
 * 分页查询个人日报信息
 * @returns
 */
export function personalDailyReportGetReportPage(data, params) {
  return request({
    url: '/statistics/platformAgent/personalDailyReport/getReportPage',
    method: 'post',
    data,
    params
  })
}
/**
 * 获取个人日报汇总信息
 * @returns
 */
export function personalDailyReportSummary(data) {
  return request({
    url: '/statistics/platformAgent/personalDailyReport/summary',
    method: 'post',
    data
  })
}
/**
 * 导出个人日报信息
 * @returns
 */
export function personalDailyReportExport(data) {
  return request({
    url: '/statistics/platformAgent/personalDailyReport/export',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

/**
 * 生成个人日报信息
 * @returns
 */
export function personalDailyReportGenerate(params) {
  return request({
    url: '/statistics/platformAgent/personalDailyReport/generate',
    method: 'get',
    params
  })
}

/**
 * 分页查询平台日报信息
 * @returns
 */
export function platformDailyReportGetReportPage(data, params) {
  return request({
    url: '/statistics/platformAgent/platformDailyReport/getReportPage',
    method: 'post',
    data,
    params
  })
}
/**
 * 获取平台日报汇总信息
 * @returns
 */
export function platformDailyReportSummary(data) {
  return request({
    url: '/statistics/platformAgent/platformDailyReport/summary',
    method: 'post',
    data
  })
}
/**
 * 导出平台日报信息
 * @returns
 */
export function platformDailyReportExport(data) {
  return request({
    url: '/statistics/platformAgent/platformDailyReport/export',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

/**
 * 生成平台日报信息
 * @returns
 */
export function platformDailyReportGenerate(params) {
  return request({
    url: '/statistics/platformAgent/platformDailyReport/generate',
    method: 'get',
    params
  })
}


////////////////////////今日报表
/**
 * 获取今日个人日报信息
 * @returns
 */
export function getOrderTodayReport(params) {
  return request({
    url: '/statistics/platformAgent/personalDailyReport/getOrderTodayReport',
    method: 'get',
    params
  })
}
/**
 * 获取今日个人日报汇总信息
 * @returns
 */
export function getOrderTodaySummaryReport(params) {
  return request({
    url: '/statistics/platformAgent/personalDailyReport/getOrderTodaySummaryReport',
    method: 'get',
    params
  })
}

/**
 * 获取今日平台日报信息
 * @returns
 */
export function getOrderTodayReportPlatform(params) {
  return request({
    url: '/statistics/platformAgent/platformDailyReport/getOrderTodayReport',
    method: 'get',
    params
  })
}
/**
 * 获取今日平台日报汇总信息
 * @returns
 */
export function getOrderTodaySummaryReportPlatform(params) {
  return request({
    url: '/statistics/platformAgent/platformDailyReport/getOrderTodaySummaryReport',
    method: 'get',
    params
  })
}
