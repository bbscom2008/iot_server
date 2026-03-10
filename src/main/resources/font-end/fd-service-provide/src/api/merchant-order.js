import request from '@/utils/request'
// 订单管理



/**
 * 码商补单代收订单
 * @returns
 */
export function collectOrderRepair(data) {
  return request({
    url: '/order/provider/collectOrder/repair',
    method: 'post',
    data
  })
}
/**
 * 导出码商端代收订单详情
 * @returns
 */
export function collectOrderExport(data) {
  return request({
    url: '/order/provider/collectOrder/export',
    method: 'post',
    data
  })
}

// 代付
/**
 * 分页查询码商端代付订单列表
 * @returns
 */
/**
 * 码商驳回代付订单
 * @returns
 */
export function orderPaymentOrderReject(data) {
  return request({
    url: '/order/provider/paymentOrder/reject',
    method: 'post',
    data
  })
}
/**
 * 码商取消代付订单
 * @returns
 */
export function orderPaymentOrderCancel(data) {
  return request({
    url: '/order/provider/paymentOrder/cancel',
    method: 'post',
    data
  })
}
/**
 * 码商确认代付订单
 * @returns
 */
export function orderPaymentOrderConfirm(data) {
  return request({
    url: '/order/provider/paymentOrder/confirm',
    method: 'post',
    data
  })
}
/**
 * 导出码商端代付订单详情
 * @returns
 */
export function orderPaymentOrderExport(data) {
  return request({
    url: '/order/provider/paymentOrder/export',
    method: 'post',
    data
  })
}
// 代付抢单
/**
 * 分页查询代付订单抢单(待接单)列表
 * @returns
 */
export function getUnreceivedPaymentOrderListPage(data) {
  return request({
    url: '/order/provider/paymentOrder/getUnreceivedPaymentOrderListPage',
    method: 'post',
    data
  })
}
/**
 * 码商代付订单接单
 * @returns
 */
export function getUnreceivedPaymentOrderReceive(data) {
  return request({
    url: '/order/provider/paymentOrder/receive',
    method: 'post',
    data
  })
}
