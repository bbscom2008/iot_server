import request from '@/utils/request'
import store from '@/store'
// 
// const tempBase = '/'
const tempBase = ''

//分页查询码商
export function getServiceTeamList( data,params) {
  return request({
    url: `${tempBase}/master/provider/getProviderPage`,
    method: 'post',
    data,
    params
  })

}
//根据租户id、支付类型、码商团队名称、码商id分页查询当天团队订单统计信息
export function teamManagementList( data,params) {
  return request({
    url: `${tempBase}/master/provider/teamManagementList`,
    method: 'post',
    data,
    params
  })

}
//根据码商id获取该码商及下级码商的收款账户信息
export function getPayeeAccountListPageByProviderId(providerId, params) {
  return request({
    url: `${tempBase}/master/payeeAccount/getPayeeAccountListPageByProviderId/${providerId}`,
    method: 'get',
    params
  })
}
//根据码商id获取该码商及下级
export function getProviderContainsSubByProviderId(providerId) {
  return request({
    url: `${tempBase}/master/provider/getProviderContainsSubByProviderId/${providerId}`,
    method: 'get'
  })
}
//根据码商id
export function getOneLinePayeeAccountListPageBySelfProviderId(providerId,params) {
  return request({
    url: `${tempBase}/master/payeeAccount/getOneLinePayeeAccountListPageBySelfProviderId/${providerId}`,
    method: 'get',
    params
  })
}