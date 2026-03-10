import request from '@/utils/request'


// const tempBase = '/nginxapi'
const tempBase = ''
// const tempBase = '/myserver'


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
    url:tempBase+ '/auth/google/bindGoogleCode?googleCode='+data,
    method: 'post'
  })
}
/**
 * 获取用户谷歌密钥
 * @returns 
 */
export function getGoogleAuthKeyQr() {
  return request({
    url:tempBase+'/auth/google/getGoogleAuthKeyQr',
    method: 'get'
  })
}
/**
 * 修改用户登录密码
 * @returns 
 */
export function changeLoginPassword(data) {
  return request({
    url:tempBase+ '/auth/changeLoginPassword',
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
    url:tempBase+ '/auth/changeTradePassword',
    method: 'post',
    data
  })
}

// 登出 ,  不要 userId 4.30号
export function logout() {
  return request({
    url:tempBase+ `/auth/logout`,
    method: 'get',
  })
}

export function getLoginUserInfo(){
  return request({
    url:tempBase+ '/getLoginUserInfo',
    method: 'get', 
  })
}


export function getInfo(token) {
  return request({
    url:tempBase+ '/user/info',
    method: 'get',
    params: { token }
  })
}


export function getPageSetting(data) {
  return request({
    url:tempBase+'/user/pageSetting',
    data,
    method: 'post'
  })
}


export function getDashBoard(data) {
  return request({
    url:tempBase+'/home/dashboard',
    data,
    method: 'post'
  })
}


export function getUserList(data) {
  return request({
    url:tempBase+'/userRole/userList',
    data,
    method: 'post'
  })
}
export function getRoleList(data) {
  return request({
    url:tempBase+'/userRole/roleList',
    data,
    method: 'post'
  })
}
export function addRole(data) {
  return request({
    url:tempBase+'/userRole/addRole',
    data,
    method: 'post',
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

/**
 * 首页----查询账户信息--可用余额
 * @returns 
 */

export function getUserAccount() {
  return request({
    url:tempBase+ '/master/userAccount/getTenantUserAccount',
    method: 'get'
  })
}


/**
 * 首页----获取平台账户汇总信息
 * @returns 
 */

export function tenantAccountSummary(tenantId) {
  return request({
    url:tempBase+ `/statistics/tenantDashboard/tenantAccountSummary/${tenantId}`,
    method: 'get'
  })
}


/**
 * 首页----查询平台今日代收订单数据分析
 * @returns 
 */

export function getCollectOrderToday(params) {
  return request({
    url:tempBase+ `/statistics/tenantDashboard/getCollectOrderToday`,
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
    url:tempBase+ `/statistics/tenantDashboard/getCollectOrderYesterday`,
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
    url:tempBase+ `/statistics/tenantDashboard/getPaymentToday`,
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
    url:tempBase+ `/statistics/tenantDashboard/getPaymentYesterdayYesterday`,
    method: 'get',
    params
  })
}


/**
 * 首页----开启代收代付按钮， 该方法只用于设置，
 * @returns 
 */

export function getOrUpdateCollectAndPayment(tenantId,params) {
  return request({
    url:tempBase+ `/master/tenant/getOrUpdateCollectAndPayment/${tenantId}`,
    method: 'get',
    params
  })
}

/**
 * 首页----开启代收代付按钮， 获取状态，
 * @returns 
 */

export function getCollectAndPayment(tenantId) {
  return request({
    url:tempBase+ `/master/tenant/getCollectAndPayment/${tenantId}`,
    method: 'get',
  })
}



/**
 * 平台端--获取平台的登录信息------个人中心
 * @returns 
 */

export function getTenantLoginDetail() {
  return request({
    url:tempBase+ `/master/tenant/getTenantLoginDetail`,
    method: 'get'
  })
}
/**
 * 平台端--租户登录信息-修改------个人中心
 * @returns 
 */

export function updateTenantLoginDetail(data) {
  return request({
    url:tempBase+ `/master/tenant/updateTenantLoginDetail`,
    method: 'post',
    data
  })
}






