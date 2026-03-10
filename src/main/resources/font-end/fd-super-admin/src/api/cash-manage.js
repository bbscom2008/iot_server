import request from '@/utils/request'

// const tempBase = '/'
const tempBase = ''
//账变中心

/////////////////////////最新接口字段+逻辑    2025-3-31

/**
 * 分页查询租户账变记录
 * @returns
 */
export function getTenantAccountChangePage(data, params) {
  return request({
    url: `/finance/getTenantAccountChangePage`,
    method: 'post',
    data,
    params
  })
}
/**
 * 分页查询商户代理账变记录
 * @returns
 */
export function getMerchantAgentAccountChangePage(data, params) {
  return request({
    url: '/finance/getMerchantAgentAccountChangePage',
    method: 'post',
    data,
    params
  })
}
/**
 * 分页查询商户账变记录
 * @returns
 */
export function getMerchantAccountChangePage(data, params) {
  return request({
    url: '/finance/getMerchantAccountChangePage',
    method: 'post',
    data,
    params
  })
}
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
 * 分页查询租户代理账变记录
 * @returns
 */
export function getTenantAgentAccountChangePage(data, params) {
  return request({
    url: '/finance/getTenantAgentAccountChangePage',
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

/**
 * 导出租户账变记录
 * @returns 
 */
export function tenantAccountChangeExport(data) {
  return request({
    timeout: 600000,
    url: '/finance/tenantAccountChange/export',
    method: 'post',
    data,
    responseType: 'blob'
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
/**
 * 导出商户代理账变记录
 * @returns
 */
export function merchantAgentAccountChangeExport(data) {
  return request({
    timeout: 600000,
    url: '/finance/merchantAgentAccountChange/export',
    method: 'post',
    data,
    responseType: 'blob'
  })
}
/**
 * 导出租户代理账变记录
 * @returns
 */
export function tenantAgentAccountChangeExport(data) {
  return request({
    timeout: 600000,
    url: '/finance/tenantAgentAccountChange/export',
    method: 'post',
    data,
    responseType: 'blob'
  })
}
