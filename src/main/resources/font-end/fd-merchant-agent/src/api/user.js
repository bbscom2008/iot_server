import request from '@/utils/request'

import store from '@/store'

/**
 * 获取平台信息
 * @returns
 */

// const tempBase = '/nginxapi'
const tempBase = ''
// const tempBase = '/myserver'

/**
 * 登录
 * @returns
 */
export function login(data, deviceType) {
  return request({
    url: tempBase + '/auth/login',
    method: 'post',
    headers: { 'Device-Type': deviceType },
    data
  })
}
/**
 * 绑定谷歌验证码
 * @returns
 */
export function bindGoogleCode(data) {
  return request({
    url: tempBase + '/auth/google/bindGoogleCode?googleCode=' + data,
    method: 'post'
  })
}
/**
 * 获取用户谷歌密钥
 * @returns
 */
export function getGoogleAuthKeyQr() {
  return request({
    url: tempBase + '/auth/google/getGoogleAuthKeyQr',
    method: 'get'
  })
}
/**
 * 修改用户登录密码
 * @returns
 */
export function changeLoginPassword(data) {
  return request({
    url: tempBase + '/auth/changeLoginPassword',
    method: 'post',
    data
  })
}
/**
 * 修改用户交易密码
 * @returns
 */

export function changeTradePassword(data) {
  return request({
    url: tempBase + '/auth/changeTradePassword',
    method: 'post',
    data
  })
}

// 登出 ,  不要 userId 4.30号
export function logout() {
  return request({
    url: tempBase + `/auth/logout`,
    method: 'get'
  })
}

export function getLoginUserInfo() {
  return request({
    url: tempBase + '/getLoginUserInfo',
    method: 'get'
  })
}

export function getInfo(token) {
  return request({
    url: tempBase + '/user/info',
    method: 'get',
    params: { token }
  })
}

export function getPageSetting(data) {
  return request({
    url: tempBase + '/user/pageSetting',
    data,
    method: 'post'
  })
}

export function getDashBoard(data) {
  return request({
    url: tempBase + '/home/dashboard',
    data,
    method: 'post'
  })
}

export function getUserList(data) {
  return request({
    url: tempBase + '/userRole/userList',
    data,
    method: 'post'
  })
}
export function getRoleList(data) {
  return request({
    url: tempBase + '/userRole/roleList',
    data,
    method: 'post'
  })
}
export function addRole(data) {
  return request({
    url: tempBase + '/userRole/addRole',
    data,
    method: 'post'
  })
}

/**
 * 首页----根据域名url 获取获取平台配置
 * @returns
 */

export function getTenantDomainByDomainName(params) {
  return request({
    url: tempBase + '/master/tenant/getTenantDomainByDomainName',
    method: 'get',
    params
  })
}

/**
 * 首页----查询账户信息--可用余额
 * @returns
 */

export function getUserAccount() {
  return request({
    url: tempBase + '/master/userAccount/getUserAccount',
    method: 'get'
  })
}

/**
 * 首页----获取平台账户汇总信息
 * @returns
 */

export function tenantAccountSummary(tenantId) {
  return request({
    url: tempBase + `/statistics/tenantDashboard/tenantAccountSummary/${tenantId}`,
    method: 'get'
  })
}

/**
 * 首页----查询平台今日代收订单数据分析
 * @returns
 */

export function getCollectOrderToday(params) {
  return request({
    url: tempBase + `/statistics/tenantDashboard/getCollectOrderToday`,
    method: 'get',
    params
  })
}
/**
 * 首页----查询平台昨日代收订单数据分析
 * @returns
 */

export function getCollectOrderYesterday(params) {
  return request({
    url: tempBase + `/statistics/tenantDashboard/getCollectOrderYesterday`,
    method: 'get',
    params
  })
}
/**
 * 首页----查询平台今日代付订单数据分析
 * @returns
 */

export function getPaymentToday(params) {
  return request({
    url: tempBase + `/statistics/tenantDashboard/getPaymentToday`,
    method: 'get',
    params
  })
}

/**
 * 首页----查询平台昨日代付订单数据分析
 * @returns
 */

export function getPaymentYesterdayYesterday(params) {
  return request({
    url: tempBase + `/statistics/tenantDashboard/getPaymentYesterdayYesterday`,
    method: 'get',
    params
  })
}
// 首页-----------------------------------
/**
 * 首页----获取商户代理账户汇总信息
 * @returns
 */

export function merchantAgentAccountSummary(userId) {
  return request({
    url: tempBase + `/statistics/merchantAgentDashboard/merchantAgentAccountSummary/${userId}`,
    method: 'get'
  })
}
/**
 * 首页----获取商户代理账户汇总信息
 * @returns
 */

export function getCollectAndPaymentOrderYesterday(params) {
  return request({
    url: tempBase + `/statistics/merchantAgentDashboard/getCollectAndPaymentOrderYesterday`,
    method: 'get',
    params
  })
}
/**
 * 首页----获取商户代理账户汇总信息
 * @returns
 */

export function getOrderTodayAnalytics(params) {
  return request({
    url: tempBase + `/statistics/merchantAgentDashboard/getOrderTodayAnalytics`,
    method: 'get',
    params
  })
}

/////////////商户列表
// 分页查询获取商户列表
export async function getMerchantListPage({ pageNum, pageSize }, data) {
  if (!store.state.user.merchantAgentId) {
   await store.dispatch('user/merchantAgentInfo')
  }
  return request({
    url: `${tempBase}/master/merchant/getByMerchantAgentIdPage/${store.state.user.merchantAgentId}?pageNum=${pageNum}&pageSize=${pageSize}`,
    method: 'post',
    data
  })
}


// 根据商户代理ID和用户名和用户昵称分页查询商户信息
export function getMerchantListByMerchantAgentId({ pageNum, pageSize }, data) {
  return request({
    url: `${tempBase}/master/merchant/getMerchantListByMerchantAgentIdAndByConditionPage?pageNum=${pageNum}&pageSize=${pageSize}`,
    method: 'post',
    data
  }) 
}

// 获取商户下拉列表 (当前租户下的)
export function getMerchantList(data) {
  return request({
    url: `${tempBase}/master/merchant/getMerchantListByTenantId`,
    method: 'post',
    data
  })
}
// 通过商户代理ID获取商户信息
export async function getMerchantListByMerchantAgentIdSelect(data) {
  if (!store.state.user.merchantAgentId) {
    await store.dispatch('user/merchantAgentInfo')
   }
  return request({
    url: `${tempBase}/master/merchant/getMerchantListByMerchantAgentId`,
    method: 'post',
    data:{
      merchantAgentId:store.state.user.merchantAgentId
    }
  })
}
// 商户代理端查询商户代理个人信息
export function merchantAgentInfo() {
  return request({
    url: `${tempBase}/master/merchantAgent`,
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

// 商户列表统计: 商户总数、可用余额总和、冻结金额总和、预付商户金额总和
export async function getMerchantSum(data) {
  if (!store.state.user.merchantAgentId) {
    await store.dispatch('user/merchantAgentInfo')
   }
  return request({
    url: `${tempBase}/master/merchant/getMerchantSumByMerchantAgentId`,
    method: 'post',
    data
  }) 
}
// 根据商户代理ID和用户名和用户昵称分页导出商户列表信息
export async function exportByMerchantAgentIdAndByCondition(data) {
  if (!store.state.user.merchantAgentId) {
    await store.dispatch('user/merchantAgentInfo')
   }
  return request({
    url: `${tempBase}/master/merchant/exportByMerchantAgentIdAndByCondition`,
    method: 'post',
    data,
    responseType: 'blob'
  }) 
}