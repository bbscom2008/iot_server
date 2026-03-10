import request from '@/utils/request'

/*
 * 报表中心
 */

//////////////最新接口字段+逻辑  2025-3-29




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



// ///////////////////提现申请 

// /**
//  * 分页查询码商提现申请列表
//  * @returns 
//  */
// export function getProviderWithdrawalPage(data,params) {
//   return request({
//     url: '/finance/provide/getProviderWithdrawalPage',
//     method: 'post',
//     data,
//     params
//   })
// }
// /**
//  * 新增码商提现申请
//  * @returns 
//  */
// export function provideWithdrawalAdd(data) {
//   return request({
//     url: '/finance/provide/withdrawal/add',
//     method: 'post',
//     data
//   })
// }
// /////////////团队管理

// /**
//  * 分页查询码商
//  * @returns 
//  */
// export function getProviderListPage(data,params) {
//   return request({
//     url: '/master/provider/getProviderListPage',
//     method: 'post',
//     data,
//     params
//   })
// }

// /**
//  * 新增码商
//  * @returns 
//  */
// export function masterProviderAdd(data) {
//   return request({
//     url: '/master/provider',
//     method: 'post',
//     data
//   })
// }
// /**
//  * 复制码商
//  * @returns 
//  */
// export function masterProviderCopy(data) {
//   return request({
//     url: '/master/provider/copy',
//     method: 'post',
//     data
//   })
// }
