import request from '@/utils/request'
import store from '@/store'

/**
* 风险中心--查询 指定 银行地址 
* @returns 
*/
export function paymentBankRegionById(bankRegionRuleId) {
  return request({
    url: `/master/paymentBankRegionRule/${bankRegionRuleId}`,
    method: 'get',
  })
}
/**
 * 风险中心--分页查询 银行地址 
 * @returns 
 */
export function getPaymentBankRegionRulePage(data) {
  return request({
    url: '/master/paymentBankRegionRule/getPaymentBankRegionRulePage',
    method: 'post',
    data,
  })
}


/**
 * 风险中心-- 新增 银行地址 
 * @returns 
 */
export function addPaymentBankRegionRule(data) {
  return request({
    url: '/master/paymentBankRegionRule/add',
    method: 'post',
    data,
  })
}


/**
 * 风险中心-- 修改 银行地址 
 * @returns 
 */
export function updatePaymentBankRegionRule(data) {
  return request({
    url: '/master/paymentBankRegionRule/update',
    method: 'put',
    data,
  })
}

/**
 * 风险中心-- 删除 银行地址 
 * @returns 
 */
export function deletePaymentBankRegionRule(bankRegionRuleId) {
  return request({
    url: `/master/paymentBankRegionRule/${bankRegionRuleId}`,
    method: 'delete',
  })
}
