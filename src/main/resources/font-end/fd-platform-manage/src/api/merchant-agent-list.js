import request from '@/utils/request'
import store from '@/store'
//商户代理列表

// 分页查询商户代理信息
export function merchantAgentPage(page, data) {
  return request({
    url: `/master/merchantAgent/getMerchantAgentPage?pageNum=${page.pageNum}&pageSize=${page.pageSize}`,
    method: 'post',
    data
  })
}

// 通过商户代理id获取商户列表
export function getMerchantListByAgentId({ pageNum, pageSize }, merchantAgentId,tenantId) {
  return request({
    url: `/master/merchant/getByMerchantAgentIdPage/${merchantAgentId}?pageNum=${pageNum}&pageSize=${pageSize}&tenantId=${tenantId}`,
    method: 'get'
  })
}

// 创建商户代理
export function createMerchantAgent(data) {
  return request({
    url: '/master/merchantAgent/createMerchantAgent',
    method: 'post',
    data
  })
}

// 更新商户代理
export function updateMerchantAgent(data) {
  return request({
    url: '/master/merchantAgent/updateMerchantAgent',
    method: 'post',
    data
  })
}

// 删除商户代理
export function deleteMerchantAgent(merchantAgentId) {
  return request({
    url: `/master/merchantAgent/deleteMerchant/${merchantAgentId}`,
    method: 'get'
  })
}

//商户代理是否启用
export function merchantAgentIsEnable(merchantAgentId, isActive) {
  return request({
    url: `/master/merchantAgent/updateMerchantAgentIsActive/${merchantAgentId}?isActive=${isActive}`,
    method: 'post'
  })
}

// 获取商户代理列表(下拉框)
export function getMerchantAgentList(data) {
  return request({
    url: '/master/merchantAgent/getMerchantAgentList',
    method: 'post',
    data
  })
}

// 复制商户代理
export function copyMerchantAgent(data) {
  return request({
    url: `/master/merchantAgent/copyMerchantAgent`,
    method: 'POST',
    data
  })
}

// 重置登录密码
export function resetLoginPassword(merchantAgentId) {
  return request({
    url: `/master/merchantAgent/resetLoginPassword/${merchantAgentId}`,
    method: 'get'
  })
}

// 重置谷歌密钥
export function resetGoogleKey(merchantAgentId) {
  return request({
    url: `/master/merchantAgent/resetGoogleSecret/${merchantAgentId}`,
    method: 'get'
  })
}

// 获取商户代理开户信息
export function getMerchantAgentAccountInfo(merchantAgentId, tenantId) {
  return request({
    url: `/master/merchantAgent/getMerchantAgentOpenInfo/${merchantAgentId}?tenantId=${tenantId}`,
    method: 'post',
    
  })
}

// 充值/扣款余额
export function rechargeBalance(data) {
  return request({
    url: `/merchantAgent/changeBalance`,
    method: 'post',
    data
  })
}

// 判断商户代理账号是否存在
export function isExistMerchantAgentAccount(userName) {
  store.commit('app/setLoadingEnable', false)
  return request({
    url: `/master/merchantAgent/existsMerchantAgentName/${userName}`,
    method: 'get'
  })
}

// 根据商户代理ID获取商户代理信息
export function getMerchantAgentInfoById(merchantAgentId) {
  return request({
    url: `/master/merchantAgent/getMerchantAgentById/${merchantAgentId}`,
    method: 'get'
  })
}
// 重置用户交易密码
export function resetTradePassword(userId) {
  return request({
    url:  `/master/system/user/resetTradePassword/${userId}`,
    method: 'post'
  })
}
// 导出商户代理列表信息
export function merchantAgentExport(data) {
  return request({
    url:  `/master/merchantAgent/export`,
    method: 'post',
    data,
    responseType: 'blob'
  })
}