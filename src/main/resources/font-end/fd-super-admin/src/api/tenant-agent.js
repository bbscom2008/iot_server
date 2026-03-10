import request from '@/utils/request'
import store from '@/store'
// const tempBase = '/myserver'
const tempBase = ''

// 租户代理-分页查询
export function getTenantAgentPage(page, data) {
  return request({
    url:
      tempBase +
      `/master/tenantAgent/getTenantAgentPage?pageNum=${page.pageNum}&pageSize=${page.pageSize}`,
    method: 'post',
    data
  })
}

// 租户代理-新增
export function addTenantAgent(data) {
  return request({
    url: tempBase + `/master/tenantAgent/add`,
    method: 'post',
    data
  })
}

// 租户代理-修改
export function updateTenantAgent(data) {
  return request({
    url: tempBase + `/master/tenantAgent/update`,
    method: 'post',
    data
  })
}

// 租户代理-删除
export function deleteTenantAgent(tenantAgentId) {
  return request({
    url: tempBase + `/master/tenantAgent/delete/${tenantAgentId}`,
    method: 'get'
  })
}
// 租户代理-校验租户代理用户名--账号是否存在
export function isTenantAgentUserNameExists(userName) {
  store.commit('app/setLoadingEnable', false)
  return request({
    url: tempBase + `/master/tenantAgent/isTenantAgentUserNameExists/${userName}`,
    method: 'get'
  })
}
// 租户代理-校验租户代理名称是否存在--名称是否存在
export function isTenantAgentUserNickNameExists(userId,params) {
  store.commit('app/setLoadingEnable', false)
  return request({
    url: tempBase + `/master/tenantAgent/isTenantAgentUserNickNameExists/${userId}`,
    method: 'get',
    params
  })
}
// 租户代理-通过用户ID获取租户代理开户信息
export function getTenantAgentOpenInfo(tenantAgentId) {
  return request({
    url: tempBase + `/master/tenantAgent/getTenantAgentOpenInfo/${tenantAgentId}`,
    method: 'get'
  })
}

// 租户代理-复制
export function copyTenantAgent(data) {
  return request({
    url: tempBase + `/master/tenantAgent/copy`,
    method: 'post',
    data
  })
}

// 租户代理-获取所有租户代理列表
export function getAllTenantAgentList() {
  return request({
    url: tempBase + `/master/tenantAgent/getTenantAgentList`,
    method: 'get'
  })
}

// 是否启用租户代理
export function isActiveTenantAgent(userId, isActive) {
  return request({
    url: tempBase + `/master/tenantAgent/isActive/${userId}`,
    method: 'get',
    params: {
      isActive
    }
  })
}

// 根据租户代理ID获取租户列表
export function getTenantListByAgentId( tenantAgentId,params) {
  return request({
    url:
      tempBase +
      `/master/tenant/getTenantListByTenantAgentIdPage/${tenantAgentId}`,
    method: 'get',
    params
  })
}
// 充值/扣款余额
export function availableBalance(data) {
  return request({
    url:
      tempBase +
      `/master/userAccount/availableBalance`,
    method: 'post',
    data
  })
}
// 冻结金额变动
export function freezeBalance(data) {
  return request({
    url:
      tempBase +
      `/master/userAccount/freezeBalance`,
    method: 'post',
    data
  })
}
// 重置租户登录密码
export function resetTenantAgentSecretKey(userId) {
  return request({
    url:
      tempBase +
      `/master/tenantAgent/resetTenantAgentSecretKey/${userId}`,
    method: 'get'
  })
}
// 重置租户谷歌密钥
export function resetTenantAgentGoogleAuthKey(userId) {
  return request({
    url:
      tempBase +
      `/master/tenantAgent/resetTenantAgentGoogleAuthKey/${userId}`,
    method: 'get'
  })
}
// 租户代理-详情
export function getTenantAgentById(userId) {
  return request({
    url:
      tempBase +
      `/master/tenantAgent/getTenantAgentById/${userId}`,
    method: 'get'
  })
}
