import request from '@/utils/request'
import store from '@/store'
/**
 * 登录
 * @returns
 */

// const tempBase = '/myserver'
const tempBase = ''
/**
 * 首页----查询账户信息--userId
 * @returns
 */

export function getUserAccount() {
  store.commit('app/setLoadingEnable', false)
  return request({
    url: tempBase + '/master/userAccount/getUserAccount',
    method: 'get'
  })
}

/**
 * 登录
 * @returns 
 */
export function login(data,deviceType) {
  return request({
    url:tempBase+ '/auth/login',
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
 * 登出
 * @returns
 */
export function logout() {
  return request({
    url: tempBase + '/auth/logout' ,
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
    url:tempBase+ '/master/tenant/getTenantDomainByDomainName',
    method: 'get',
    params
  })
}


//获取超管端账户汇总信息
export function accountSummary(params) {
  return request({
    url: tempBase + `/statistics/dashboard/accountSummary`,
    method: 'get',
    params
  })
}
//查询超管端今日代收订单数据分析
export function getCollectOrderToday(params) {
  return request({
    url: tempBase + `/statistics/dashboard/getCollectOrderToday`,
    method: 'get',
    params
  })
}
//查询超管端昨日代收订单数据分析
export function getCollectOrderYesterday(params) {
  return request({
    url: tempBase + `/statistics/dashboard/getCollectOrderYesterday`,
    method: 'get',
    params
  })
}
//查询超管端今日代付订单数据分析
export function getPaymentToday(params) {
  return request({
    url: tempBase + `/statistics/dashboard/getPaymentToday`,
    method: 'get',
    params
  })
}
//查询超管端昨日代付订单数据分析
export function getPaymentYesterdayYesterday(params) {
  return request({
    url: tempBase + `/statistics/dashboard/getPaymentYesterdayYesterday`,
    method: 'get',
    params
  })
}
