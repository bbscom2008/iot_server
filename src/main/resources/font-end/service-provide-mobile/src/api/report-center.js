import request from '@/utils/request'

/*
 * 报表中心
 */

/*
 * 分页查询码商日报信息  --码商日报表
 */
export function getProviderReportPage(data) {
  return request({
    url: '/statistics/providerDailyReport/getProviderReportPage',
    method: 'post',
    data,
  })
}
/*
 * 获取码商日报汇总信息  --码商日报表
 */

export function providerDailyReportSummary(data) {
  return request({
    url: '/statistics/providerDailyReport/summary',
    method: 'post',
    data
  })
}







/*
 * 导出码商日报信息  --码商日报表
 */

export function providerDailyReportExport(data) {
  return request({
    url: '/report/providerDailyReport/export',
    method: 'post',
    data
  })
}
/*
 * 生成码商日报信息  --码商日报表
 */

export function providerDailyReportGenerate(data) {
  return request({
    url: '/report/providerDailyReport/generate',
    method: 'get',
    data
  })
}

/*
 * 分页查询产品日报信息  --产品日报表
 */

export function getProductReportPage(data,params) {
  return request({
    url: '/report/dailyProductReport/getProductReportPage',
    method: 'post',
    data,
    params
  })
}
/*
 * 获取产品日报汇总信息  --产品日报表
 */

export function dailyProductReportSummary(data) {
  return request({
    url: '/report/dailyProductReport/summary',
    method: 'post',
    data
  })
}
/*
 * 导出产品日报信息  --产品日报表
 */

export function dailyProductReportExport(data) {
  return request({
    url: '/report/dailyProductReport/export',
    method: 'post',
    data
  })
}
/*
 * 生成产品日报信息  --产品日报表
 */

export function dailyProductReportGenerate(data) {
  return request({
    url: '/report/dailyProductReport/generate',
    method: 'get',
    data
  })
}

/*
 * 分页查询收款信息日报信息  --收款信息日报表
 */

export function getPayeeAccountInfoReportPage(data,params) {
  return request({
    url: '/report/dailyPayeeAccountInfoReport/getPayeeAccountInfoReportPage',
    method: 'post',
    data,
    params
  })
}
/*
 * 获取收款信息日报汇总信息  --收款信息日报表
 */

export function dailyPayeeAccountInfoReportSummary(data) {
  return request({
    url: '/report/dailyPayeeAccountInfoReport/summary',
    method: 'post',
    data
  })
}
/*
 * 导出收款信息日报信息  --收款信息日报表
 */

export function dailyPayeeAccountInfoReportExport(data) {
  return request({
    url: '/report/dailyPayeeAccountInfoReport/export',
    method: 'post',
    data
  })
}
/*
 * 生成收款信息日报信息  --收款信息日报表
 */

export function dailyPayeeAccountInfoReportGenerate(data) {
  return request({
    url: '/report/dailyPayeeAccountInfoReport/generate',
    method: 'get',
    data
  })
}

//-----------------  报表中心  ---   702 新  

// 分页查询收款信息日报信息---------报表中心
export function payeeAccountDailyReportGetReportPage(data, page) {
  return request({
    url: `/statistics/provider/payeeAccountDailyReport/getReportPage?pageNum=${page.pageNum}&pageSize=${page.pageSize}`,
    method: 'post',
    data,
  })
}

// 获取收款信息日报汇总信息---------报表中心
export function payeeAccountDailyReportSummary(data) {
  return request({
    url: `/statistics/provider/payeeAccountDailyReport/summary`,
    method: 'post',
    data
  })
}

// 导出收款信息日报信息---------报表中心
export function payeeAccountDailyReportExport(data) {
  return request({
    url: `/statistics/provider/payeeAccountDailyReport/export`,
    method: 'post',
    data,
    responseType: 'blob'
  })
}

// 生成收款信息日报信息---------报表中心
export function payeeAccountDailyReportGenerate(params) {
  return request({
    url: `/statistics/provider/payeeAccountDailyReport/generate`,
    method: 'get',
    params
  })
}


// 分页查询产品日报信息---------报表中心
export function productDailyReportGetReportPage(data, page) {
  return request({
    url: `/statistics/provider/productDailyReport/getReportPage?pageNum=${page.pageNum}&pageSize=${page.pageSize}`,
    method: 'post',
    data,
  })
}

// 获取产品日报汇总信息---------报表中心
export function productDailyReportSummary(data) {
  return request({
    url: `/statistics/provider/productDailyReport/summary`,
    method: 'post',
    data
  })
}

// 导出产品日报信息---------报表中心
export function productDailyReportExport(data) {
  return request({
    url: `/statistics/provider/productDailyReport/export`,
    method: 'post',
    data,
    responseType: 'blob'
  })
}
// 生成产品日报信息---------报表中心
export function productDailyReportGenerate(params) {
  return request({
    url: `/statistics/provider/productDailyReport/generate`,
    method: 'get',
    params
  })
}



// 分页查询团队日报信息---------报表中心
export function providerTeamReportGetReportPage(data, page) {
  return request({
    url: `/statistics/provider/providerTeamReport/getReportPage?pageNum=${page.pageNum}&pageSize=${page.pageSize}`,
    method: 'post',
    data,
  })
}

// 获取团队日报汇总信息---------报表中心
export function providerTeamReportSummary(data) {
  return request({
    url: `/statistics/provider/providerTeamReport/summary`,
    method: 'post',
    data
  })
}
// 导出团队日报信息---------报表中心
export function providerTeamReportExport(data) {
  return request({
    url: `/statistics/provider/providerTeamReport/export`,
    method: 'post',
    data,
    responseType: 'blob'
  })
}
// 生成团队日报信息---------报表中心
export function providerTeamReportGenerate(params) {
  return request({
    url: `/statistics/provider/providerTeamReport/generate`,
    method: 'get',
    params
  })
}


// 分页查询日终日报信息---------报表中心
export function getReportPage(data, page) {
  return request({
    url: `/statistics/provider/EndOfDayReport/getReportPage?pageNum=${page.pageNum}&pageSize=${page.pageSize}`,
    method: 'post',
    data,
  })
}

// 获取日终日报汇总信息---------报表中心
export function EndOfDayReportSummary(data) {
  return request({
    url: `/statistics/provider/EndOfDayReport/summary`,
    method: 'post',
    data
  })
}

// 导出日终日报信息---------报表中心
export function EndOfDayReportExport(data) {
  return request({
    url: `/statistics/provider/EndOfDayReport/export`,
    method: 'post',
    data,
    responseType: 'blob'
  })
}

// 生成日终日报信息---------报表中心
export function EndOfDayReportGenerate(params) {
  return request({
    url: `/statistics/provider/EndOfDayReport/generate`,
    method: 'get',
    params
  })
}








//----------------------



///////////////////////账变中心
/**
 * 分页查询码商账变记录
 * @returns 
 */
export function getProviderAccountChangePage(data, {pageNum,pageSize }) {
  return request({
    url: `/finance/getProviderAccountChangePage?pageNum=${pageNum}&pageSize=${pageSize}`,
    method: 'post',
    data
  })
}
/**
 * 分页查询码商下级账变记录
 * @returns 
 */
export function getProviderSubordinateAccountChangePage(data,{pageNum,pageSize }) {
  return request({
    url: '/finance/getProviderSubordinateAccountChangePage',
    method: 'post',
    data,
  })
}



///////////////////提现申请 

/**
 * 分页查询码商提现申请列表
 * @returns 
 */
export function getProviderWithdrawalPage(data,params) {
  return request({
    url: '/finance/provide/getProviderWithdrawalPage',
    method: 'post',
    data,
    params
  })
}
/**
 * 新增码商提现申请
 * @returns 
 */
export function provideWithdrawalAdd(data) {
  return request({
    url: '/finance/provide/withdrawal/add',
    method: 'post',
    data
  })
}
/////////////团队管理

/**
 * 分页查询码商
 * @returns 
 */
export function getProviderListPage(data,pages) {
  return request({
    url: `/master/provider/getProviderListPage?pageNum=${pages.pageNum}&pageSize=${pages.pageSize}`,
    method: 'post',
    data,
  })
}
/**
 * 分页查询当前码商下关联的产品列表
 * @returns 
 */
export function getProductProviderRel(data,{pageNum, pageSize}) {
  return request({
    url: `/master/ProviderProductRelation/getProductProviderRel?pageNum=${pageNum}&pageSize=${pageSize}`,
    method: 'post',
    data,
  })
}
/**
 * 新增码商
 * @returns 
 */
export function masterProviderAdd(data) {
  return request({
    url: '/master/provider/addServiceProvider',
    method: 'post',
    data
  })
}
/**
 * 复制码商
 * @returns 
 */
export function masterProviderCopy(data) {
  return request({
    url: '/master/provider/copyServiceProvider',
    method: 'post',
    data
  })
}


// 通过租户ID获取码商信息（下拉框）
export function getProviderOptionList(tenantId) {
  return request({
    url: '/master/provider/getProviderOptionList/'+tenantId,
    method: 'get',
  })
}

// 根据当前码商的userId获得所有下级码商(下拉框)
export function getProviderChildListByUserId(userId) {
  return request({
    url:  `/master/provider/getSubProviderOptionListByUserId/${userId}`,
    method: 'get'
  }) 
}



/**
 * 新增当前码商下关联的产品数据
 * @returns 
 */
export function createProviderProductRelation(data) {
  return request({
    url: '/master/ProviderProductRelation/createProviderProductRelation',
    method: 'post',
    data
  })
}
/**
 * 批量解绑当前服务下关联的产品数据
 * @returns 
 */
export function batchDeleteProductProviderRelRelation(data) {
  return request({
    url: '/master/ProviderProductRelation/batchDeleteProductProviderRelRelation',
    method: 'post',
    data
  })
}
/**
 * 解绑当前服务下关联的产品数据
 * @returns 
 */
export function deleteProductProviderRelRelation(id) {
  return request({
    url: `/master/ProviderProductRelation/deleteProductProviderRelRelation/${id}`,
    method: 'get'
  })
}

/**
 * 批量修改选中的关联的产品数据
 * @returns 
 */
export function batchUpdateProductProviderRelation(data) {
  return request({
    url: '/master/ProviderProductRelation/batchUpdateProductProviderRelation',
    method: 'post',
    data
  })
}
/**
 * 全部修改当前码商下关联的产品数据
 * @returns 
 */
export function updateProductProviderRelationByProviderId(data) {
  return request({
    url: '/master/ProviderProductRelation/updateProductProviderRelationByProviderId',
    method: 'post',
    data
  })
}
/**
 * 修改当前码商下关联的产品数据
 * @returns 
 */
export function UpdateProductProviderRelationById(data) {
  return request({
    url: '/master/ProviderProductRelation/UpdateProductProviderRelationById',
    method: 'post',
    data
  })
}

/**
 * 余额划拨
 * @returns 
 */
export function transferBalance(data) {
  return request({
    url: '/master/userAccount/transfer',
    method: 'post',
    data
  })
}

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
/**
 * 查询码商祖级
 * @returns 
 */
export function getProviderLevel(providerId) {
  return request({
    url: `/master/provider/getProviderLevel/${providerId}`,
    method: 'get',
  })
}


// 通过码商ID获取产品信息（下拉框）
export function getProductListByProviderIdWhenConfigProduct(providerId) {
  return request({
    url: `/master/ProviderProductRelation/getProductOptionsByProviderIdForProviderPage/${providerId}`,
    method: 'get'
  }) 
}


/**
 * 修改码商
 * @returns
 */
export function updateSingleProvider(data) {
  return request({
    url: '/master/provider/updateSingleProvider',
    method: 'post',
    data
  })
}
