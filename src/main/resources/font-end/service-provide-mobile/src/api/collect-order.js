import request from '@/utils/request'


import { isThreeDaysBefore, hasOnlyTwoValues } from '@/utils/index'

const tempBase = ''

// 分页查询码商端代收订单列表（近3天数据）
export function getCollectOrderList(data, page) {


  
  const { startTime, endTime, operationType, ...rest } = data
  if (hasOnlyTwoValues(rest)) {
    return request({
      url:
        tempBase +
        `/order/provider/collectOrder/getProviderCollectOrderHistoryListPage?pageNum=${page.pageNum}&pageSize=${page.pageSize}`,
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
        `/order/provider/collectOrder/getProviderCollectOrderHistoryListPage?pageNum=${page.pageNum}&pageSize=${page.pageSize}`,
      method: 'post',
      data
    })
  } else {
    return request({
      url:
        tempBase +
        `/order/provider/collectOrder/getProviderCollectOrderListPage?pageNum=${page.pageNum}&pageSize=${page.pageSize}`,
      method: 'post',
      data
    })
  }

}

// 码商取消代收订单
export function cancelCollectOrder(orderId) {
  return request({
    url: `/order/provider/collectOrder/cancel/${orderId}`,
    method: 'post'
  })
}

// 码商确认代收订单
export function confirmCollectOrder(orderId) {
  return request({
    url: `/order/provider/collectOrder/confirm/${orderId}`,
    method: 'post'
  })
}

// 码商补单代收订单
export function supplementCollectOrder(orderId) {
  return request({
    url: `/order/provider/collectOrder/repair/${orderId}`,
    method: 'post'
  })
}


// 通过码商userId获取产品信息（下拉框）
export function getProductListByProviderUserId(userId) {
  return request({
    url: `/master/ProviderProductRelation/getProductListByProviderUserId/${userId}`,
    method: 'get'
  })
}

// 获取订单提交信息详情
export function getSubmitInfoInfo(orderId, params) {
  return request({
    url: `/order/tenant/collectOrder/getSubmitInfoInfo/${orderId}`,
    method: 'get',
    params
  })
}


// 分页查询最近半小时的支付宝账单信息
export function getLastHalfHourAlipayBillPage(data, params) {
  return request({
    url: `/master/alipayBill/getLastHalfHourAlipayBillPage`,
    method: 'post',
    data,
    params
  })
}


// // 根据订单ID 查询订单详情
export function getOrderInfoByOrderId(orderId) {
  return request({
    url: `/order/tenant/collectOrder/getOrderInfo/${orderId}`,
    method: 'get',
  })
}

// 一键拉黑
export function addBlackList(data) {
  return request({
    url: `/order/tenant/collectOrder/addBlackList`,
    method: 'post',
    data
  })
}