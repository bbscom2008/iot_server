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
 * 码商列表---新增码商
 * @returns 
 */
export function masterProviderCopy(data) {
  return request({
    url: '/master/provider/copy',
    method: 'post',
    data
  })
}