import request from '@/utils/request'


//码商管理


//最新接口字段   2025/3/24
/**
 * 码商列表---分页查询码商
 * @returns 
 */
export function getProviderListPage(data) {
  return request({
    url: '/master/provider/getProviderListPage',
    method: 'post',
    data
  })
}
/**
 * 码商列表---复制码商
 * @returns 
 */
export function providerCopy(data) {
  return request({
    url: '/master/provider/copy',
    method: 'post',
    data
  })
}
/**
 * 码商列表---新增码商
 * @returns 
 */
export function masterProvider(data) {
  return request({
    url: '/master/provider',
    method: 'post',
    data
  })
}
/**
 * 码商列表---分页查询当前码商下关联的产品列表
 * @returns 
 */
export function getProductProviderRel(data) {
  return request({
    url: '/master/ProviderProductRelation/getProductProviderRel',
    method: 'post',
    data
  })
}
/**
 * 码商列表---新增当前码商下关联的产品数据
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
 * 码商列表---批量删除当前服务下关联的产品数据
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
 * 码商列表---全部修改当前码商下关联的产品数据(全部修改)
 * @returns 
 */
export function UpdateProductProviderRelationByProviderId(data) {
  return request({
    url: '/master/ProviderProductRelation/UpdateProductProviderRelationByProviderId',
    method: 'post',
    data
  })
}
/**
 * 码商列表---批量修改当前码商下关联的产品数据(批量修改)
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
 * 码商列表---查询当前码商下子级数据
 * @returns 
 */
export function providerProviderId(data) {
  return request({
    url: '/master/provider/{providerId}',
    method: 'post',
    data
  })
}
/**
 * 码商权限---分页查询码商权限
 * @returns 
 */
export function getProviderPermissionListPage(data) {
  return request({
    url: '/master/provider/getProviderPermissionListPage',
    method: 'post',
    data
  })
}
/**
 * 码商权限---修改码商权限
 * @returns 
 */
export function updateProviderPermission(data) {
  return request({
    url: '/master/provider/updateProviderPermission',
    method: 'post',
    data
  })
}
/**
 * 码商权限---全部修改码商权限
 * @returns 
 */
export function updateProviderPermissionByTenantId(data) {
  return request({
    url: '/master/provider/updateProviderPermissionByTenantId/{tenantId}',
    method: 'post',
    data
  })
}
/**
 * 产品列表---分页查询产品
 * @returns 
 */
export function productList(data) {
  return request({
    url: '/master/product/list',
    method: 'post',
    data
  })
}
/**
 * 产品列表---新增产品
 * @returns 
 */
export function productAdd(data) {
  return request({
    url: '/master/product/add',
    method: 'post',
    data
  })
}
/**
 * 产品列表---根据产品ID删除产品
 * @returns 
 */
export function productDelete(data) {
  return request({
    url: '/master/product/delete/{productId}',
    method: 'post',
    data
  })
}