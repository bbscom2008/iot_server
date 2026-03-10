import request from '@/utils/request'

//支付宝

const tempBase = ''

/**
 * 分页查询支付宝账号
 */
export function getAlipayAccountPage(data, params) {
  return request({
    url: tempBase + '/master/system/alipayAccount/getAlipayAccountPage',
    method: 'post',
    data,
    params
  })
}
/**
 * 新增支付宝账号
 */
export function alipayAccountAdd(data) {
  return request({
    url: tempBase + '/master/system/alipayAccount/add',
    method: 'post',
    data
  })
}
/**
 * 分页查询支付宝授权信息
 */
export function getAlipayAuthPage(data, params) {
  return request({
    url: tempBase + '/master/system/alipayAuth/getAlipayAuthPage',
    method: 'post',
    data,
    params
  })
}
/**
 * 根据alipayAccountId获取支付宝账号详细信息
 */
export function alipayAccount(alipayAccountId) {
  return request({
    url: tempBase + `/master/system/alipayAccount/${alipayAccountId}`,
    method: 'get'
  })
}
/**
 * 更新支付宝账号
 */
export function alipayAccountUpdate(data) {
  return request({
    url: tempBase + `/master/system/alipayAccount/update`,
    method: 'post',
    data
  })
}
/**
 * 是否启用
 */
export function alipayAccountEnable(alipayAccountId, params) {
  return request({
    url: tempBase + `/master/system/alipayAccount/enable/${alipayAccountId}`,
    method: 'get',
    params
  })
}
/**
 * 删除支付宝账号
 */
export function alipayAccountDelete(alipayAccountId) {
  return request({
    url: tempBase + `/master/system/alipayAccount/delete/${alipayAccountId}`,
    method: 'get'
  })
}

/**
 * 分页查询支付宝账单
 */
export function getAlipayBillPage(data, params) {
  return request({
    url: tempBase + `/master/alipayBill/getAlipayBillPage`,
    method: 'post',
    data,
    params
  })
}
/**
 * 删除支付宝账单
 */
export function alipayBillDelete(alipayBillId, tenantId) {
  return request({
    url: tempBase + `/master/alipayBill/delete/${alipayBillId}?tenantId=${tenantId}`,
    method: 'get'
  })
}
/**
 * 根据alipayBillId获取支付宝账单详细信息
 */
export function alipayBillInfo(alipayBillId, tenantId) {
  return request({
    url: tempBase + `/master/alipayBill/${alipayBillId}?tenantId=${tenantId}`,
    method: 'get'
  })
}
/**
 * 同步导出支付宝账单数据
 */
export function alipayBillExport(data) {
  return request({
    url: tempBase + `/master/alipayBill/export`,
    method: 'post',
    data,
    responseType: 'blob',
    timeout: 600000
  })
}
