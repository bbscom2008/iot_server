import request from '@/utils/request'


// 分页查询码商端代付订单列表（近3天数据）
export function getPayOrderList(data, {pageNum, pageSize}) {
  return request({
    url: `/order/provider/paymentOrder/getPaymentOrderListPage?pageNum=${pageNum}&pageSize=${pageSize}`,
    method: 'post',
    data
  }) 
}



// 分页查询码商端代付订单列表（3天前数据）
export function getPayOrderListBefore(data, {pageNum, pageSize}) {
  return request({
    url: `/order/provider/paymentOrder/getPaymentOrderHistoryListPage?pageNum=${pageNum}&pageSize=${pageSize}`,
    method: 'post',
    data
  }) 
}


// 码商确认代付订单
export function confirmPayOrder(data) {
  return request({
    url: `/order/provider/paymentOrder/confirm`,
    method: 'post',
    data
  }) 
}

// 码商取消代付订单
export function cancelPayOrder(orderId) {
  return request({
    url: `/order/provider/paymentOrder/cancel/${orderId}`,
    method: 'post',
  })
}


// 码商驳回代付订单
export function rejectPayOrder(data) {
  return request({
    url: `/order/provider/paymentOrder/reject`,
    method: 'post',
    data
  })
}

// 分页查询代付订单抢单(待接单)列表
export function getPayOrderGrabList(data, {pageNum, pageSize}) {
  return request({
    url: `/order/provider/paymentOrder/getUnreceivedPaymentOrderListPage?pageNum=${pageNum}&pageSize=${pageSize}`,
    method: 'post',
    data
  })
}

// 码商代付订单接单
export function grabPayOrder(orderId) {
  return request({
    url: `/order/provider/paymentOrder/receive/${orderId}`,
    method: 'post',
  }) 
}


// 根据订单ID获取订单详情
export function getPaymentOrderDetail(orderId, params) {
  return request({
    url:    `/order/provider/paymentOrder/info/${orderId}`,
    method: 'get',
    params
  })
}
