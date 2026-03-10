import request from '@/utils/request'
import { isThreeDaysBefore, hasOnlyTwoValues } from '@/utils/index'
// 
const tempBase = ''
// const tempBase = '/'

// 分页搜索代付订单
export function getPaymentOrderListPage(page, data) {
  // let startTime = data.startTime
  // let endTime = data.endTime

  const { startTime, endTime, tenantId, ...rest } = data
  if (hasOnlyTwoValues(rest)) {
    return request({
      url:
        tempBase +
        `/order/tenant/paymentOrder/getPaymentOrderHistoryListPage?pageNum=${page.pageNum}&pageSize=${page.pageSize}`,
      method: 'post',
      data: {
        ...rest,
        tenantId,
        startTime,
        endTime
      }
    })
  } else if (isThreeDaysBefore(startTime, endTime)) {
    // 3 天前的
    return request({
      url:
        tempBase +
        `/order/tenant/paymentOrder/getPaymentOrderHistoryListPage?pageNum=${page.pageNum}&pageSize=${page.pageSize}`,
      method: 'post',
      data
    })
  } else {
    // 近3天的

    return request({
      url:
        tempBase +
        `/order/tenant/paymentOrder/getPaymentOrderListPage?pageNum=${page.pageNum}&pageSize=${page.pageSize}`,
      method: 'post',
      data
    })
  }
}

// 查询实时代付订单数据分析
export function getPaymentOrderDataAnalysis(data) {
  return request({
    url: tempBase + `/order/tenant/paymentOrder/realtime`,
    method: 'post',
    data
  })
}

// 导出租户端代付订单数据
export function exportPaymentOrderData(data) {
  return request({
    url: tempBase + `/order/tenant/paymentOrder/export`,
    method: 'post',
    data,
    responseType: 'blob'
  })
}

// 补单代付订单
export function repairPaymentOrder(orderId) {
  return request({
    url: tempBase + `/order/tenant/paymentOrder/repair/${orderId}`,
    method: 'post'
  })
}

// 驳回代付订单
export function rejectPaymentOrder(data) {
  return request({
    url: tempBase + `/order/tenant/paymentOrder/reject`,
    method: 'post',
    data
  })
}

// 审核代付订单
export function auditPaymentOrder(data) {
  return request({
    url: tempBase + `/order/tenant/paymentOrder/audit`,
    method: 'post',
    data
  })
}

// 分配代付订单
export function assignPaymentOrder(data) {
  return request({
    url: tempBase + `/order/tenant/paymentOrder/allocation`,
    method: 'post',
    data
  })
}

// 查询昨日代付订单数据分析
export function getYesterdayPaymentOrderDataAnalysis(tenantId) {
  return request({
    url: tempBase + `/order/tenant/paymentOrder/yesterday?tenantId=${tenantId}`,
    method: 'get'
  })
}

// 查询今日代付订单数据分析
export function getTodayPaymentOrderDataAnalysis(tenantId) {
  return request({
    url: tempBase + `/order/tenant/paymentOrder/today?tenantId=${tenantId}`,
    method: 'get'
  })
}

/**
 * 通知商户  代收
 * @param {string} orderId 订单ID
 * @returns
 */
export function notifyMerchantByOrderId(orderId) {
  return request.post(tempBase + `/order/notify/merchant?orderId=${orderId}`)
}

/**
 * 通知商户  代付
 * @param {string} orderId 订单ID
 * @returns
 */
export function notifyMerchantByPaymentOrderId(orderId) {
  return request.post(tempBase + `/order/notify/payment/merchant?orderId=${orderId}`)
}

/**
 * 批量通知商户  代收订单批量通知商户
 * @returns
 */
export function batchNotifyMerchants(tenantId) {
  return request.post(tempBase + `/order/notify/batch?tenantId=${tenantId}`)
}

/**
 * 批量通知商户  代付订单批量通知商户
 * @returns
 */
export function batchNotifyPaymentMerchants(tenantId) {
  return request.post(tempBase + `/order/notify/payment/batch?tenantId=${tenantId}`)
}

// 查询代付订单详情, 详情第一页
export function getPaymentOrderDetail(orderId, params) {
  return request({
    url: tempBase + `/order/tenant/paymentOrder/info/${orderId}`,
    method: 'get',
    params
  })
}

// 查询银行卡归属地
export function queryCardAddr(cardNo) {
  return request({
    url: tempBase + `/master/bankCardInfo/geBankCardInfoByCardNo/${cardNo}`,
    method: 'get'
  })
}

export function paymentOrderReject(data) {
  return request({
    url: '/order/provider/paymentOrder/reject',
    method: 'post',
    data
  })
}
