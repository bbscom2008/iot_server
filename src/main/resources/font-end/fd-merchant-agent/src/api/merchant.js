import request from '@/utils/request'

// export function payChannelList() {
//   return request({
//     url: '/merchant/pay-channel-list',
//     method: 'post',
//   })
// }
// export function payOrderList(data) {
//   return request({
//     url: '/merchantOrder/payOrderList',
//     data,
//     method: 'post',
//   })
// }
// export function rechargeList(data) {
//   return request({
//     url: '/merchantCash/rechargeList',
//     data,
//     method: 'post',
//   })
// }

// export function getMerchantInfoList() {
//   return request({
//     url: '/merchant/merchant-info-list',
//     method: 'post',
//   })
// }


//商户管理
/**
 * 商户管理---条件查询商户列表
 * @returns 
 */
export function merchantPage() {
  return request({
    url: '/merchant/page',
    method: 'post',
  })
}
