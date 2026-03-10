import request from '@/utils/request'

import store from '@/store'

const tempBase = ''

/**
 * 分页查询兑付列表
 * @returns
 */

export function getAcceptenceOrderPage(page, data) {
  return request.post(
    tempBase +
      `/master/acceptance/getAcceptancePage?pageNum=${page.pageNum}&pageSize=${page.pageSize}`,
    data
  )
}


//新增兑付申请
/**
 * 新增兑付申请
 * @returns
 */
export function createAcceptenceOrder(data) {
  return request.post(
    tempBase +
      `/master/acceptance/add`,
    data
  )
}

// 确认兑付申请
/**
 * 确认兑付申请
 * @param {object} data 兑付申请
 * @param {string} data.acceptanceOrderNo 兑付申请订单号
 * @returns
 */
export function confirmAcceptenceOrder(data) {
  return request.post(
    tempBase +
      `/master/acceptance/confirm`,
    data
  )
}


//审核兑付申请
/**
 * 审核兑付申请
 * @param {object} data 兑付申请
 * @param {string} data.acceptanceOrderNo 兑付申请订单号
 * @param {string} data.status 状态
 * @returns
 */
export function auditAcceptenceOrder(data) {
  return request.post(
    tempBase +
      `/master/acceptance/audit`,
    data
  )
}

// 取消兑付申请
/**
 * 取消兑付申请
 * @param {object} data 兑付申请
 * @param {string} data.acceptanceOrderNo 兑付申请订单号
 * @returns
 */
export function cancelAcceptenceOrder(data) {
  return request.post(
    tempBase +
      `/master/acceptance/cancel`,
    data
  )
}

//导出兑付列表
/**
 * 导出兑付列表
 * @param {object} data 兑付申请
 * @returns
 */
export function exportAcceptenceOrderList(data) {
  return request({
    url:`/master/acceptance/exportMerchantWithdrawal`,
    method: 'post',
    data,
    responseType: 'blob'
  }) 
}


