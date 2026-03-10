import request from '@/utils/request'
import { isThreeDaysBefore, hasOnlyTwoValues } from '@/utils/index'
import store from '@/store'
/**
 * 订单管理 - 代收订单 页面的相关接口
 *

 */

// const tempBase = '/'
const tempBase = ''

// 分页查询码商端代收订单列表
export function getProviderCollectOrderListPage(page, data) {
  // const startTime = data.startTime
  // const endTime = data.endTime

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

// 导出码商端代收订单详情
export function exportProviderCollectOrderDetail(data) {
  return request({
    url: tempBase + `/order/provider/collectOrder/export`,
    method: 'post',
    data,
    responseType: 'blob'
  })
}
// 码商补单代收订单
export function providerCollectOrderRepay(orderId) {
  return request({
    url: tempBase + `/order/provider/collectOrder/repair/${orderId}`,
    method: 'post'
  })
}

// 码商确认代收订单
export function providerCollectOrderConfirm(orderId,params) {
  return request({
    url: tempBase + `/order/provider/collectOrder/confirm/${orderId}`,
    method: 'post',
    params
  })
}

// 码商确认下级代收订单
export function providerCollectOrderConfirmSubOrder(orderId, providerId,params) {
  return request({
    url:
      tempBase + `/order/provider/collectOrder/confirmSubOrder/${orderId}?providerId=${providerId}`,
    method: 'get',
    params
  })
}

// 码商取消代收订单
export function providerCollectOrderCancel(orderId) {
  return request({
    url: tempBase + `/order/provider/collectOrder/cancel/${orderId}`,
    method: 'post'
  })
}

// 码商取消下级代收订单
export function providerCollectOrderCancelSubOrder(orderId, providerId) {
  return request({
    url:
      tempBase + `/order/provider/collectOrder/cancelSubOrder/${orderId}?providerId=${providerId}`,
    method: 'get'
  })
}
// 根据收款账户名称查询收款账户信息
export function getPayeeAccountByName(data) {
  store.commit('app/setLoadingEnable', false)
  return request({
    url: tempBase + `/master/payeeAccount/getPayeeAccountByName`,
    method: 'post',
    data
  })
}
// 根据收款账户名称查询收款账户信息----下级代收订单
export function getPayeeAccountByNameAndPermission(data) {
  store.commit('app/setLoadingEnable', false)
  return request({
    url: tempBase + `/master/payeeAccount/getPayeeAccountByNameAndPermission`,
    method: 'post',
    data
  })
}

// 检查用户交易密码
export function checkTradePassword(tradePassword) {
  return request({
    url: tempBase + `/order/tenant/collectOrder/checkTradePassword?tradePassword=${tradePassword}`,
    method: 'post'
  })
}

// 获取订单提交信息详情
export function getSubmitInfoInfo(orderId, params) {
  return request({
    url: tempBase + `/order/tenant/collectOrder/getSubmitInfoInfo/${orderId}`,
    method: 'get',
    params
  })
}

// 分页查询最近半小时的支付宝账单信息
export function getLastHalfHourAlipayBillPage(data, params) {
  return request({
    url: tempBase + `/master/alipayBill/getLastHalfHourAlipayBillPage`,
    method: 'post',
    data,
    params
  })
}

// 查看订单收款信息 -- 
export function getOrderPayeeAccountInfo(orderId) {
  store.commit('app/setLoadingEnable', false)
   return request({
    url: tempBase + `/order/tenant/collectOrder/getPayeeAccountValueByOrderId/${orderId}`,
    method: 'get'
  })
}

// 根据订单ID 查询订单详情
export function getOrderInfoByOrderId(orderId) {
  return request({
    url: `/order/tenant/collectOrder/getOrderInfo/${orderId}`,
    method: 'get',
  })
}


// 一键拉黑
export function addBlackList(data) {
  return request({
    url: tempBase + `/order/tenant/collectOrder/addBlackList`,
    method: 'post',
    data
  })
}