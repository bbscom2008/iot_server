import request from '@/utils/request'


//码商管理

/**
 * 码商列表---分页查询码商
 * @returns 
 */
export function providerGetProviderPage(data) {
  return request({
    url: '/master/provider/getProviderPage',
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
 * 码商列表---复制码商
 * @returns 
 */
export function masterProviderCopy(data) {
  return request({
    url: '/master/provider/copy',
    method: 'post',
    data
  })
}
/**
 * 码商列表---创建产品与码商关联
 * @returns 
 */
export function providerCreateProductProviderRel(data) {
  return request({
    url: '/master/provider/createProductProviderRel',
    method: 'post',
    data
  })
}
/**
 * 码商列表---用户账户余额变动
 * @returns 
 */
export function financeUserAccountAvailableBalance(data) {
  return request({
    url: '/finance/userAccount/availableBalance',
    method: 'post',
    data
  })
}
/**
 * 产品管理---分页查询产品
 * @returns 
 */
export function productGetProductPage(data) {
  return request({
    url: '/master/product/getProductPage',
    method: 'post',
    data
  })
}
/**
 * 产品管理---新增产品
 * @returns 
 */
export function masterProduct(data) {
  return request({
    url: '/master/product',
    method: 'post',
    data
  })
}

/**
 * 收款码列表---分页查询收款信息
 * @returns 
 */
export function getPayeeAccountInfoPage(data) {
  return request({
    url: '/master/payee-account/getPayeeAccountInfoPage',
    method: 'post',
    data
  })
}
/**
 * 收款码列表---新增收款账户信息
 * @returns 
 */
export function masterPayeeAccount(data) {
  return request({
    url: '/master/payee-account',
    method: 'post',
    data
  })
}

/**
 * 系统管理---分页查询租户配置
 * @returns 
 */
export function getTenantConfigPage(params) {
  return request({
    url:`/master/system/tenant/getTenantConfigPage`,
    method: 'post',
    params
  })
}
