import request from '@/utils/request'
import store from '@/store'
//租户管理 // 平台管理页面

// const tempBase = '/myserver'
const tempBase = ''
// const tempBase = '/'
// const tempBase = ''

/**
 * 租户-分页查询 -- 平台管理页面
 */
export function getTenantPage(data, params) {
  return request({
    url: tempBase + '/master/tenant/getTenantPage',
    method: 'post',
    data,
    params
  })
}

// 获取当前租户下的所有收银台域名
// export function getTenantConfigList(tenantId) {
//   return request({
//     url: tempBase + `/master/tenant/getTenantConfigList/${tenantId}`,
//     method: 'get'
//   })
// }
export function getTenantConfigList() {
  return request({
    url: tempBase + `/master/tenant/getCashPageDomainUrlList`,
    method: 'get'
  })
}
// 判断租户账号是否存在
export function isExistTenantUserName(userName) {
  store.commit('app/setLoadingEnable', false)
  return request({
    url: tempBase + `/master/tenant/isExistTenantUserName/${userName}`,
    method: 'get'
  })
}
// 判断租户名称是否存在
export function isExistTenantName(tenantId, params) {
  store.commit('app/setLoadingEnable', false)
  return request({
    url: tempBase + `/master/tenant/isExistTenantName/${tenantId}`,
    method: 'get',
    params
  })
}

// 通过租户ID获取租户开户信息
export function getTenantInfoById(tenantId) {
  return request({
    url: tempBase + `/master/tenant/getTenantOpenInfo/${tenantId}`,
    method: 'get'
  })
}

// 租户-新增
export function addTenant(data) {
  return request({
    url: tempBase + '/master/tenant/add',
    method: 'post',
    data
  })
}

// 租户-复制
export function copyTenant(data) {
  return request({
    url: tempBase + '/master/tenant/copy',
    method: 'post',
    data
  })
}

// 租户-详情

export function getTenantById(tenantId) {
  return request({
    url: tempBase + `/master/tenant/getTenantById/${tenantId}`,
    method: 'get'
  })
}

// 租户-修改
export function updateTenant(data) {
  return request({
    url: tempBase + '/master/tenant/update',
    method: 'post',
    data
  })
}

// 租户-删除
export function deleteTenantById(tenantId, params) {
  return request({
    url: tempBase + `/master/tenant/delete/${tenantId}`,
    method: 'get',
    params
  })
}

//是否启用租户
export function isEnableTenant(tenantId, isActive) {
  return request({
    url: tempBase + `/master/tenant/isEnable/${tenantId}`,
    method: 'GET',
    params: {
      isActive: isActive
    }
  })
}

// 根据租户代理ID获取租户列表

export function getTenantListByTenantAgentIdPage(tenantAgentId) {
  return request({
    url: tempBase + `/master/tenant/getTenantListByTenantAgentIdPage/${tenantAgentId}`,
    method: 'GET'
  })
}

// 租户与产品类型关系-分页查询
export function getProductTypePage(data, params) {
  return request({
    url: tempBase + `/master/TenantProductType/getProductTypeTenantRelationListPage`,
    method: 'post',
    data,
    params
  })
}

// 租户与产品类型关系-添加
export function addProductType(data) {
  return request({
    url: tempBase + `/master/TenantProductType/addProductTypeTenantRelation`,
    method: 'post',
    data
  })
}

//查询所有产品类型信息（下拉框）
export function getProductTypeList(tenantId='') {
  return request({
    url: tempBase + `/master/productType/getProductTypeList?tenantId=${tenantId}`,
    method: 'get'
  })
}

// 批量解绑租户和产品类型关系
export function deleteProductType(data) {
  return request({
    url: tempBase + `/master/TenantProductType/batchDeleteProductTypeTenantRelation`,
    method: 'post',
    data
  })
}

// 解绑租户和产品类型关系
export function deleteProductTypeById(id) {
  return request({
    url: tempBase + `/master/TenantProductType/deleteProductTypeTenantRelation/${id}`,
    method: 'get'
  })
}

// 租户与产品类型关系-修改
export function updateProductType(data) {
  return request({
    url: tempBase + `/master/TenantProductType/updateProductTypeTenantRelation`,
    method: 'post',
    data
  })
}

// 批量租户与产品类型关系-修改
export function updateProductTypeList(data) {
  return request({
    url: tempBase + `/master/TenantProductType/batchUpdateProductTypeTenantRelation`,
    method: 'post',
    data
  })
}

// 全部租户与产品类型关系-修改
export function updateProductTypeAll(data) {
  return request({
    url: tempBase + `/master/TenantProductType/allUpdateProductTypeTenantRelation`,
    method: 'post',
    data
  })
}

// 超管端登陆获取所有租户的信息
export function getTenantInfo() {
  store.commit('app/setLoadingEnable', false)
  return request({
    url: tempBase + '/master/tenant/getTenantInfo',
    method: 'get'
  })
}

// 重置租户密码
export function resetTenantSecretKey(userId) {
  return request({
    url: tempBase + `/master/tenant/resetTenantSecretKey/${userId}`,
    method: 'get'
  })
}

// 重置租户谷歌密钥
export function resetTenantGoogleAuthKey(userId) {
  return request({
    url: tempBase + `/master/tenant/resetTenantGoogleAuthKey/${userId}`,
    method: 'get'
  })
}
// 重置用户交易密码
export function resetTradePassword(userId) {
  return request({
    url: tempBase + `/master/system/user/resetTradePassword/${userId}`,
    method: 'post'
  })
}

// 充值/扣款余额
export function rechargeBalance(data) {
  return request({
    url: tempBase + `/master/tenant/changeBalance`,
    method: 'post',
    data
  })
}

// 租户域名管理
export function updateTenantDomainPage(data) {
  return request({
    url: tempBase + `/master/tenant/updateTenantDomain`,
    method: 'post',
    data
  })
}

// 获取租户域名详情
export function getTenantDomainInfo(tenantId) {
  return request({
    url: tempBase + `/master/tenant/getTenantDomainByTenantId/${tenantId}`,
    method: 'get'
  })
}

//充值/扣除可用余额  用户账户余额变动
export function adjustAvailableBalance(data) {
  return request({
    url: `${tempBase}/master/userAccount/availableBalance`,
    method: 'post',
    data: data
  })
}

// 增加/减少冻结余额  冻结金额变动
export function adjustFreezeBalance(data) {
  return request({
    url: `${tempBase}/master/userAccount/freezeBalance`,
    method: 'post',
    data: data
  })
}



// 批量 全部修改平台
export function updatePatchTenantInfo(data) {
  return request({
    url: `${tempBase}/master/tenant/batchUpdateCashPageDomainUrl`,
    method: 'post',
    data: data
  })
}
