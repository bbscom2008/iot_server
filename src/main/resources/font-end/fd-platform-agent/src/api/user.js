import request from '@/utils/request'

const tempBase = ''
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
/**
 * 退出登录
 * @returns
 */
export function logout() {
  return request({
    url: tempBase + '/auth/logout',
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
 * 首页----查询账户信息--可用余额
 * @returns
 */

export function getUserAccount(params) {
  return request({
    url: tempBase + '/master/userAccount/getUserAccount',
    method: 'get',
    params
  })
}
/**
 * 首页----获取商户代理账户汇总信息
 * @returns
 */

export function tenantAgentAccountSummary(userId) {
  return request({
    url: tempBase + `/statistics/tenantAgentDashboard/tenantAgentAccountSummary/${userId}`,
    method: 'get'
  })
}

/**
 * 首页----查询商户代理昨日代收和代付订单数据分析
 * @returns
 */

export function getCollectAndPaymentOrderYesterday(params) {
  return request({
    url: tempBase + `/statistics/tenantAgentDashboard/getCollectAndPaymentOrderYesterday`,
    method: 'get',
    params
  })
}

/**
 * 首页----查询商户代理今日订单数据分析
 * @returns
 */

export function getOrderTodayAnalytics(params) {
  return request({
    url: tempBase + `/statistics/tenantAgentDashboard/getTodayAnalytics`,
    method: 'get',
    params
  })
}
/**
 * 根据域名url 获取获取平台配置
 * @returns
 */

export function getTenantDomainByDomainName(params) {
  return request({
    url: tempBase + `/master/tenant/getTenantDomainByDomainName`,
    method: 'get',
    params
  })
}
/**
 * 查询租户代理端的个人信息
 * @returns
 */

export function getTenantAgentInfo() {
  return request({
    url: tempBase + `/master/tenantAgent/getTenantAgentInfo`,
    method: 'get'
  })
}
