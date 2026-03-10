import request from '@/utils/request'
import store from '@/store'
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

// 登出
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
 * 首页----获取码商账户汇总信息
 * @returns
 */

 export function  providerAccountSummary(userId) {
  // if(!store.state.userAccount.userId){
  //   store.dispatch('userAccount/getUserAccount')
  // }
   return request({
    url: tempBase + `/statistics/providerDashboard/providerAccountSummary/${userId}`,
    method: 'get'
  })
}
/**
 * 首页----查询码商今日代收订单数据分析
 * @returns
 */

export function getCollectOrderToday() {
  return request({
    url: tempBase + `/statistics/providerDashboard/getCollectOrderToday`,
    method: 'get'
  })
}
/**
 * 首页----查询码商昨日代收订单数据分析
 * @returns
 */

export function getCollectOrderYesterday() {
  return request({
    url: tempBase + `/statistics/providerDashboard/getCollectOrderYesterday`,
    method: 'get'
  })
}
/**
 * 首页----查询码商今日代付订单数据分析
 * @returns
 */

export function getPaymentToday() {
  return request({
    url: tempBase + `/statistics/providerDashboard/getPaymentToday`,
    method: 'get'
  })
}
/**
 * 首页----查询码商昨日代付订单数据分析
 * @returns
 */

export function getPaymentYesterdayYesterday() {
  return request({
    url: tempBase + `/statistics/providerDashboard/getPaymentYesterdayYesterday`,
    method: 'get'
  })
}

// 根据userId获得当前码商的权限
export function getProviderPermission(userId) {
  return request({
    url: tempBase + `/master/provider/getProviderPermissionByUserId/${userId}`,
    method: 'get'
  }) 
}


// 根据当前码商的userId获得所有下级码商(下拉框)
export function getProviderChildListByUserId(userId) {
  return request({
    url: tempBase + `/master/provider/getSubProviderOptionListByUserId/${userId}`,
    method: 'get'
  }) 
}

/**
 * 获取代收代款状态
 * @param {userId} userId 
 * @returns 
 */
export function getCollectAndPayment(userId) {

  return request({
    url:tempBase+ `/master/provider/getCollectAndPayment/${userId}`,
    method: 'get',
  })
}


/**
 * 首页----开启代收代付按钮, 以后只用于设置，不用于获取
 * @returns 
 */

export function getOrUpdateCollectAndPayment(userId,params) {
  // if(!store.state.user.personalInfo.providerId){
  //   store.dispatch('user/getProviderPersonalInfo')
  // }
  return request({
    url:tempBase+ `/master/provider/getOrUpdateCollectAndPayment/${userId}`,
    method: 'get',
    params
  })
}
/**
 * 首页----查询码商首页   待处理代付订单数量
 * @returns 
 */

export function getPaymentOrderPendingCountByProviderId() {
  // if(!store.state.user.personalInfo.providerId){
  //   store.dispatch('user/getProviderPersonalInfo')
  // }
  return request({
    url:tempBase+ `/order/provider/paymentOrder/getPaymentOrderPendingCountByProviderId/${store.state.user.personalInfo.providerId}`,
    method: 'get'
  })
}
/**
 * 首页----查询码商首页     待处理代收订单数量
 * @returns 
 */

export function getCollectOrderPendingCountByProviderId() {
  // if(!store.state.user.personalInfo.providerId){
  //   store.dispatch('user/getProviderPersonalInfo')
  // }
  return request({
    url:tempBase+ `/order/provider/collectOrder/getCollectOrderPendingCountByProviderId/${store.state.user.personalInfo.providerId}`,
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


// 校验交易密码
export function checkTradePassword(tradePassword) {
  return request({
    url:  `/order/tenant/collectOrder/checkTradePassword`,
    method: 'post',
    params: {tradePassword}
  })
}
