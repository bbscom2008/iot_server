import request from '@/utils/request'
import { isThreeDaysBefore, hasOnlyTwoValues } from '@/utils/index'
/**
 * 订单管理 - 代付订单 页面的相关接口
 */

// const tempBase = '/'
const tempBase = ''

/**
 * 码商  驳回  代付订单
 */
export function paymentOrderReject(data) {
  return request({
    url: '/order/provider/paymentOrder/reject',
    method: 'post',
    data
  })
}

/**
 * 码商代付订单  接单
 */
export function paymentOrderReceiveOrderId(orderId) {
  return request({
    url: `/order/provider/paymentOrder/receive/${orderId}`,
    method: 'post'
  })
}

/**
 * 码商代付订单  批量接单
 */
export function batchReceivePaymentOrder(data) {
  return request({
    url: '/order/provider/paymentOrder/batchReceive',
    method: 'post',
    data
  })
}

/**
 * 分页查询  代付订单抢单  (待接单)  列表
 */
export function getUnreceivedPaymentOrderListPage(page, data) {
  return request({
    url: `/order/provider/paymentOrder/getUnreceivedPaymentOrderListPage?pageNum=${page.pageNum}&pageSize=${page.pageSize}`,
    method: 'post',
    data
  })
}

// 分页查询  码商端代付订单列表
export function getProviderPaymentOrderListPage(page, data) {
  // const startTime = data.startTime
  // const endTime = data.endTime

  const { startTime, endTime,operationType, ...rest } = data
  if (hasOnlyTwoValues(rest)) {
    return request({
      url:
        tempBase +
        `/order/provider/paymentOrder/getPaymentOrderHistoryListPage?pageNum=${page.pageNum}&pageSize=${page.pageSize}`,
      method: 'post',
      data: {
        ...rest,
        startTime,
        endTime,
        operationType
      }
    })
  } else if (isThreeDaysBefore(startTime, endTime)) {
    return request({
      url:
        tempBase +
        `/order/provider/paymentOrder/getPaymentOrderHistoryListPage?pageNum=${page.pageNum}&pageSize=${page.pageSize}`,
      method: 'post',
      data
    })
  } else {
    return request({
      url:
        tempBase +
        `/order/provider/paymentOrder/getPaymentOrderListPage?pageNum=${page.pageNum}&pageSize=${page.pageSize}`,
      method: 'post',
      data
    })
  }
}

// 导出  码商端代付订单详情
export function exportProviderPaymentOrderDetail(data) {
  return request({
    url: `/order/provider/paymentOrder/export`,
    method: 'post',
    data,
    responseType: 'blob'
  })
}

//  码商 确认  代付订单
export function providerPaymentOrderConfirm(data) {
  return request({
    url: `/order/provider/paymentOrder/confirm/`,
    method: 'post',
    data
  })
}

// 码商  取消  代付订单
export function providerPaymentOrderCancel(orderId) {
  return request({
    url: `/order/provider/paymentOrder/cancel/${orderId}`,
    method: 'post'
  })
}

// 根据订单ID获取订单详情
export function getPaymentOrderDetail(orderId, params) {
  return request({
    url: tempBase + `/order/provider/paymentOrder/info/${orderId}`,
    method: 'get',
    params
  })
}
