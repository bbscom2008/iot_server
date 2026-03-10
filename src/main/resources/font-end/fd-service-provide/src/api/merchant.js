import request from '@/utils/request'


//商户管理
/**
 * 商户管理---条件查询商户列表
 * @returns 
 */
export function merchantPage(data) {
  return request({
    url: '/merchant/page',
    method: 'post',
    data
  })
}
/**
 * 商户管理---新增商户
 * @returns 
 */
export function masterMerchant(data) {
  return request({
    url: '/master/merchant',
    method: 'post',
    data
  })
}
/**
 * 商户管理---复制商户
 * @returns 
 */
export function masterMerchantCopy(data) {
  return request({
    url: '/master/merchant/copy',
    method: 'post',
    data
  })
}
/**
 * 商户管理---创建通道与商户关联
 * @returns 
 */
export function createChannelMerchantRel(data) {
  return request({
    url: '/master/merchant/createChannelMerchantRel',
    method: 'post',
    data
  })
}
/**
 * 通道管理---条件查询通道管理
 * @returns 
 */
export function channelPage(data) {
  return request({
    url: '/channel/page',
    method: 'post',
    data
  })
}
/**
 * 通道管理---新增通道
 * @returns 
 */
export function channelAdd(data) {
  return request({
    url: '/channel',
    method: 'post',
    data
  })
}
/**
 * 通道管理---复制通道
 * @returns 
 */
export function channelCopy(data) {
  return request({
    url: '/channel/copy',
    method: 'post',
    data
  })
}
/**
 * 通道管理---创建通道与产品关联
 * @returns 
 */
export function createChannelProductRel(data) {
  return request({
    url: '/channel/createChannelProductRel',
    method: 'post',
    data
  })
}

