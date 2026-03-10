import request from '@/utils/request'

const tempBase = ''

/**
 * 获得会话列表
 * @returns
 */
export function getHistoryConversation(providerId, page) {
  return request({
    url: tempBase + `/message/providers/${providerId}/conversations?pageSize=${page.pageSize}&pageNum=${page.pageNum}`,
    method: 'get',
  })
}


/**
 * 码商获得聊天页面的历史消息
 * @param {*} conversationId 
 * @param {*} page 
 * @returns 
 */
export function getHistoryMessage(conversationId, page) {
  return request({
    url: tempBase + `/message/conversations/${conversationId}/chatMessages?pageSize=${page.pageSize}&pageNum=${page.pageNum}`,
    method: 'get',
  })
}

/**
 * 码商获得聊天页面的历史消息
 * @param {*} orderId 订单ID
 * @param {*} page 
 * @returns 
 */
export function getHistoryMessageByOrderId(orderId, page) {
  return request({
    url: tempBase + `/message/admin/collectOrders/${orderId}/chatMessages?pageSize=${page.pageSize}&pageNum=${page.pageNum}`,
    method: 'get',
  })
}


/**
 * 客户端获得聊天页面的历史消息
 * @param {*} encryptOrderId 加密的串
 * @param {*} page 
 * @returns 
 */
export function getClientHistoryMessage(encryptOrderId, page) {
  return request({
    url: tempBase + `/message/collectOrders/${encryptOrderId}/chatMessages?pageSize=${page.pageSize}&pageNum=${page.pageNum}`,
    method: 'get',
  })
}


/**
 * 获取未读会话数，头像前的小红点
 * @param {*} providerId 
 * @returns 
 */
export function getUnreadCount(providerId) {
  return request({
    url: tempBase + `/message/providers/${providerId}/conversations/unreadCount`,
    method: 'get',
  })
}


/**
 * 关闭聊天会话
 * @param {Object} conversationId 会话ID
 */
export function closeConversation(conversationId){
	return request({
	  url: tempBase + `/message/conversations/${conversationId}/close`,
	  method: 'post',
	})
}



// 根据订单ID 查询订单详情
export function getOrderInfoByOrderId(orderId) {
  return request({
    url: `/order/tenant/collectOrder/getOrderInfo/${orderId}`,
    method: 'get',
  })
}
