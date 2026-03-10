import request from '@/utils/request'
import store from '@/store'
// 
// const tempBase = '/'
// const tempBase = '/myserver'
const tempBase = ''

// 分页查询码商
export function getServiceList({ pageNum, pageSize }, data) {
  return request({
    url: `${tempBase}/master/provider/getProviderPage?pageNum=${pageNum}&pageSize=${pageSize}`,
    method: 'post',
    data: data
  })
}

// 新增码商
export function addService(data) {
  return request({
    // url: `${tempBase}/master/provider/add`, 
    url: `${tempBase}/master/provider/addServiceProvider`, // 
    method: 'post',
    data: data
  })
}

// 复制码商
export function copyService(data) {
  return request({
    url: `${tempBase}/master/provider/copyServiceProvider`,
    method: 'post',
    data: data
  })
}

// 是否启用码商
export function isActiveService(providerId, isActive) {
  return request({
    url: `${tempBase}/master/provider/isActive/${providerId}?isActive=${isActive}`,
    method: 'get'
  })
}

// 通过租户ID获取码商信息（下拉框）
// export function getServiceListByTenantId() {
//   return request({
//     url: `${tempBase}/master/provider/getProviderOptionList/${tenantId}`,
//     method: 'get'
//   })
// }

// 通过租户ID获取码商信息（下拉框）
export function getProviderOptionList(tenantId) {
  return request({
    url: `${tempBase}/master/provider/getProviderOptionList/${tenantId}`,
    method: 'get'
  })
}


// 全部修改码商
export function updateAllService(data) {
  return request({
    url: `${tempBase}/master/provider/updateProvider`,
    method: 'post',
    data: data
  })
}

// 批量修改码商
export function updateBatchService(data) {
  return request({
    url: `${tempBase}/master/provider/batchUpdateProvider`,
    method: 'post',
    data: data
  })
}

// ---------------下面三个接口，多个地方共用-----------------------------------------------

//  用户账户余额变动
export function adjustAvailableBalance(data) {
  return request({
    url: `${tempBase}/master/userAccount/availableBalance`,
    method: 'post',
    data: data
  })
}

//   冻结金额变动
export function adjustFreezeBalance(data) {
  return request({
    url: `${tempBase}/master/userAccount/freezeBalance`,
    method: 'post',
    data: data
  })
}

//  最低接单金额变动
export function adjustMinAllowableCollectAmount(data) {
  return request({
    url: `${tempBase}/master/userAccount/minAllowableCollectAmount`,
    method: 'post',
    data: data
  })
}

// 判断码商名称是否存在
export function isExistProviderName(providerName) {
  // store.commit('app/setLoadingEnable', false)
  return request({
    url: `${tempBase}/master/provider/isExistProviderName/${providerName}`,
    method: 'get'
  })
}
// 判断码商账号是否存在
export function isExistProviderUserName(tenantId,params) {
  store.commit('setLoadingEnable', false)
  return request({
    url: `${tempBase}/master/provider/isExistProviderUserName/${tenantId}`,
    method: 'get',
    params
  })
}
// 查询码商祖级
export function getProviderLevel(providerId) {
  return request({
    url: `${tempBase}/master/provider/getProviderLevel/${providerId}`,
    method: 'get'
  })
}

// 根据ID获取码商详情信息
export function getProviderInfoDetailByProviderId(providerId) {
  return request({
    url: `${tempBase}/master/provider/${providerId}`,
    method: 'get'
  }) 
}

// 根据租户ID获取码商最小允许接单的代收金额
export function getProviderMinAllowableCollectAmount(tenantId) {
  return request({
    url: `${tempBase}/master/provider/getProviderMinAllowableCollectAmount/${tenantId}  `,
    method: 'get'
  })
}

/**
 * 系统管理---分页查询租户配置
 * @returns 
 */
export function getTenantConfigPage(params) {
  return request({
    url:`/master/system/tenant/getTenantConfigPage?tenantId=${params.tenantId}&pageSize=${params.pageSize}&pageNum=${params.pageNum}`,
    method: 'post',
    params
  })
}