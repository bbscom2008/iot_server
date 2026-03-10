import request from '@/utils/request'
import store from '@/store'
/*
 * 报表中心
 */

//////////////最新接口字段+逻辑  2025-3-29

/*
 * 分页查询码商日报信息  --码商日报表
 */

export function getProviderReportPage(data, params) {
  return request({
    url: '/report/providerDailyReport/getProviderReportPage',
    method: 'post',
    data,
    params
  })
}
/*
 * 获取码商日报汇总信息  --码商日报表
 */

export function providerDailyReportSummary(data) {
  return request({
    url: '/report/providerDailyReport/summary',
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

export function getProductReportPage(data, params) {
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

export function getPayeeAccountInfoReportPage(data, params) {
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

///////////////////////账变中心
/**
 * 分页查询码商账变记录
 * @returns
 */
export function getProviderAccountChangePage(data, params) {
  return request({
    url: '/finance/getProviderAccountChangePage',
    method: 'post',
    data,
    params
  })
}
/**
 * 分页查询码商下级账变记录
 * @returns
 */
export function getProviderSubordinateAccountChangePage(data, params) {
  return request({
    url: '/finance/getProviderSubordinateAccountChangePage',
    method: 'post',
    data,
    params
  })
}
/**
 * 导出码商账变记录
 * @returns
 */
export function providerAccountChangeExport(data) {
  return request({
    timeout: 600000,
    url: '/finance/providerAccountChange/export',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

///////////////////提现申请

/**
 * 分页查询码商提现申请列表
 * @returns
 */
export function getProviderWithdrawalPage(data, params) {
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
export function getProviderListPage(data, params) {
  return request({
    url: '/master/provider/getProviderListPage',
    method: 'post',
    data,
    params
  })
}
/**
 * 分页查询当前码商下关联的产品列表
 * @returns
 */
export function getProductProviderRel(data, params) {
  return request({
    url: '/master/ProviderProductRelation/getProductProviderRel',
    method: 'post',
    data,
    params
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
//判断码商名称是否存在
export function isExistProviderName(providerName) {
  store.commit('app/setLoadingEnable', false)
  return request({
    url: `/master/provider/isExistProviderName/${providerName} `,
    method: 'get'
  })
}
//判断码商账号是否存在
export function isExistProviderUserName(tenantId, params) {
   store.commit('app/setLoadingEnable', false)
   
  return request({
    url: `/master/provider/isExistProviderUserName/${tenantId}`,
    method: 'get',
    params
  })
}
// 通过租户ID获取码商信息（下拉框）
export function getProviderOptionList(tenantId) {
  return request({
    url: `/master/provider/getProviderOptionList/${tenantId}`,
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
 * 码商端余额划拨时获取下级码商的用户信息（下拉框）
 * @returns
 */
export function getTransferProviderByProviderId(providerId) {
  return request({
    url: `/master/provider/getTransferProviderByProviderId/${providerId}`,
    method: 'get'
  })
}
/**
 * 根据ID获取码商详情信息
 * @returns
 */
export function masterProvider(providerId) {
  return request({
    url: `/master/provider/${providerId}`,
    method: 'get'
  })
}
//查询码商祖级
export function getProviderLevel(providerId) {
  return request({
    url: `/master/provider/getProviderLevel/${providerId}`,
    method: 'get'
  })
}
/**
 * 获取上级码商的关联的产品（下拉框）
 * @returns
 */
export function getProductListByProviderId(parentId) {
  return request({
    url: `/master/ProviderProductRelation/getProductListByProviderId/${parentId}`,
    method: 'get'
  })
}

// 校验当前码商下新增关联的产品数据
export function checkProductProviderRelation(data) {
  return request({
    url: `/master/ProviderProductRelation/checkProductProviderRelation`,
    method: 'post',
    data
  })
}

// 分页查询日终日报信息---------报表中心
export function getReportPage(data, params) {
  return request({
    url: `/statistics/provider/EndOfDayReport/getReportPage`,
    method: 'post',
    data,
    params
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

// 分页查询团队日报信息---------报表中心
export function providerTeamReportGetReportPage(data, params) {
  return request({
    url: `/statistics/provider/providerTeamReport/getReportPage`,
    method: 'post',
    data,
    params
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

// 分页查询产品日报信息---------报表中心
export function productDailyReportGetReportPage(data, params) {
  return request({
    url: `/statistics/provider/productDailyReport/getReportPage`,
    method: 'post',
    data,
    params
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
// 分页查询收款信息日报信息---------报表中心
export function payeeAccountDailyReportGetReportPage(data, params) {
  return request({
    url: `/statistics/provider/payeeAccountDailyReport/getReportPage`,
    method: 'post',
    data,
    params
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

// 通过用户名获取码商信息（搜索框）
export function getProviderByUserName(params) {
  return request({
    url: `/master/provider/getProviderByUserName`,
    method: 'get',
    params
  })
}
/**
 * 码商下级账变记录导出
 * @returns
 */
export function providerSubordinateAccountChangeExport(data) {
  return request({
    timeout: 600000,
    url: '/finance/providerSubordinateAccountChange/export',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

// 获取父级产品名称-----s搜索栏
export function getProductListByParentId(parentId) {
  return request({
    url: `/master/provider/getProductListByProviderId/${parentId}`,
    method: 'get'
  })
}
// 获取父级产品名称-----码商配置产品时
export function getProductOptionsByProviderIdForProviderPage(providerId,params) {
  return request({
    url: `/master/ProviderProductRelation/getProductOptionsByProviderIdForProviderPage/${providerId}`,
    method: 'get',
    params
  })
}

