import request from '@/utils/request'

/*
 * 报表中心
 */

///最新接口字段+逻辑   2025-3-29


/*
 * 分页查询商户日报信息  --商户日报表
 */

export function getMerchantReportPage(data,params) {
  return request({
    url: '/report/dailyMerchantReport/getMerchantReportPage',
    method: 'post',
    data,
    params
  })
}
/*
 * 获取商户日报汇总信息  --商户日报表
 */

export function dailyMerchantReportSummary(data) {
  return request({
    url: '/report/dailyMerchantReport/summary',
    method: 'post',
    data
  })
}
/*
 * 导出商户日报信息  --商户日报表
 */

export function dailyMerchantReportExport(data) {
  return request({
    url: '/report/dailyMerchantReport/export',
    method: 'post',
    data
  })
}
/*
 * 生成商户日报信息  --商户日报表
 */

export function dailyMerchantReportGenerate(data) {
  return request({
    url: '/report/dailyMerchantReport/generate',
    method: 'get',
    data
  })
}

/*
 * 分页查询通道日报信息  --通道日报表
 */

export function getChannelReportPage(data,params) {
  return request({
    url: '/report/dailyChannelReport/getChannelReportPage',
    method: 'post',
    data,
    params
  })
}
/*
 * 获取通道日报汇总信息  --通道日报表
 */

export function dailyChannelReportSummary(data) {
  return request({
    url: '/report/dailyChannelReport/summary',
    method: 'post',
    data
  })
}
/*
 * 导出通道日报信息  --通道日报表
 */

export function dailyChannelReportExport(data) {
  return request({
    url: '/report/dailyChannelReport/export',
    method: 'post',
    data
  })
}
/*
 * 生成通道日报信息  --通道日报表
 */

export function dailyChannelReportGenerate(data) {
  return request({
    url: '/report/dailyChannelReport/generate',
    method: 'get',
    data
  })
}


//////////////////账变记录

/**
 * 分页查询商户账变记录
 * @returns 
 */
export function getMerchantAccountChangePage(data,params) {
  return request({
    url: '/finance/getMerchantAccountChangePage',
    method: 'post',
    data,
    params
  })
}
/**
 * 导出商户账变记录
 * @returns 
 */
export function merchantAccountChangeExport(data) {
  return request({
    timeout: 600000,
    url: '/finance/merchantAccountChange/export',
    method: 'post',
    data,
    responseType: 'blob'
  })
}


/////////////提现管理
/**
 * 新增商户提现申请
 * @returns 
 */
export function merchantWithdrawalAdd(data) {
  return request({
    url: '/finance/merchant/withdrawal/add',
    method: 'post',
    data
  })
}

/**
 * 分页查询商户提现申请列表
 * @returns 
 */
export function getMerchantWithdrawalPage(data,params) {
  return request({
    url: '/finance/merchant/getMerchantWithdrawalPage',
    method: 'post',
    data,
    params
  })
}



////报表中心

/**
 * 分页查询商户日报表信息
 * @returns 
 */
export function merchantDailyReportGetReportPage(data,params) {
  return request({
    url: '/statistics/merchant/merchantDailyReport/getReportPage',
    method: 'post',
    data,
    params
  })
}
/**
 * 获取商户日报表汇总信息
 * @returns 
 */
export function merchantDailyReportSummary(data) {
  return request({
    url: '/statistics/merchant/merchantDailyReport/summary',
    method: 'post',
    data
  })
}
/**
 * 导出商户日报表信息
 * @returns 
 */
export function merchantDailyReportExport(data) {
  return request({
    url: '/statistics/merchant/merchantDailyReport/export',
    method: 'post',
    data,
    responseType: 'blob'
  })
}


/**
 * 生成商户日报表信息
 * @returns 
 */
export function merchantDailyReportGenerate(params) {
  return request({
    url: '/statistics/merchant/merchantDailyReport/generate',
    method: 'get',
    params
  })
}




/**
 * 分页查询通道日报信息
 * @returns 
 */
export function channelDailyReportGetReportPage(data,params) {
  return request({
    url: '/statistics/merchant/channelDailyReport/getReportPage',
    method: 'post',
    data,
    params
  })
}

/**
 * 获取通道日报汇总信息
 * @returns 
 */
export function channelDailyReportSummary(data) {
  return request({
    url: '/statistics/merchant/channelDailyReport/summary',
    method: 'post',
    data
  })
}
/**
 * 导出通道日报信息
 * @returns 
 */
export function channelDailyReportExport(data) {
  return request({
    url: '/statistics/merchant/channelDailyReport/export',
    method: 'post',
    data,
    responseType: 'blob'
  })
}
/**
 * 生成通道日报信息
 * @returns 
 */
export function channelDailyReportGenerate(params) {
  return request({
    url: '/statistics/merchant/channelDailyReport/generate',
    method: 'get',
    params
  })
}



























































































































































































/**
 * 获取平台日报汇总信息
 * {
  "platformName": "",
  "startDate": "",
  "endDate": ""
}
 * @param {*} data 
 * @returns 
 */
  export const dailyPlatformReportSummary = (data)=> {
    console.log('---api-11--');
    
    return request({
      url: '/master/providerDailyReport/summary',
      method: 'post',
      data
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
export const providerDailyReportSummary = (data)=> {
  return request({
    url: '/master/providerDailyReport/summary',
    method: 'post',
    data
  })
}






