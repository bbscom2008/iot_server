import request from '@/utils/request'

// 
// const tempBase = '/myserver'
const tempBase = ''
// const tempBase = '/'

//--------------------------详情----------

// 查询订单费用
export function getCollectOrderFee(orderId) {
  return request({
    url: tempBase + `/order/tenant/log/fee/${orderId}`,
    method: 'get'
  })
}

// 查询订单 访问记录
export function getCollectOrderVisitLog(orderId, { pageNum, pageSize }) {
  return request({
    url: tempBase + `/order/tenant/log/visitLog/${orderId}?pageNum=${pageNum}&pageSize=${pageSize}`,
    method: 'get'
  })
}

// 查询订单 操作记录
export function getCollectOrderOperateLog(orderId, { pageNum, pageSize }) {
  return request({
    url:
      tempBase +
      `/order/tenant/log/operationLog/${orderId}?pageNum=${pageNum}&pageSize=${pageSize}`,
    method: 'get'
  })
}

// 查询订单通知记录
export function getCollectOrderNotifyLog(orderId) {
  return request({
    url:
      tempBase + `/order/tenant/log/notifyLog/${orderId}`,
    method: 'get'
  })
}

// 查询订单匹配记录
export function getCollectOrderMatchLog(orderId, { pageNum, pageSize }) {
  return request({
    url: tempBase + `/order/tenant/log/matchLog/${orderId}?pageNum=${pageNum}&pageSize=${pageSize}`,
    method: 'get'
  })
}

// 查询订单聊天记录
export function getCollectOrderChatLog(orderId) {
  return request({
    url: tempBase + `/order/tenant/log/chatLog/${orderId}`,
    method: 'get'
  })
}

// 查询订单请求记录
export function getCollectOrderRequestLog(orderId) {
  return request({
    url: tempBase + `/order/tenant/log/requestLog/${orderId}`,
    method: 'get'
  }) 
}