import request from '@/utils/request'
/**
 * 登录
 * @returns 
 */
export function login(data,deviceType) {
  return request({
    url: '/auth/login',
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
    url: '/auth/google/bindGoogleCode?googleCode='+data,
    method: 'post'
  })
}
/**
 * 获取用户谷歌密钥
 * @returns 
 */
export function getGoogleAuthKeyQr() {
  return request({
    url:'/auth/google/getGoogleAuthKeyQr',
    method: 'get'
  })
}
/**
 * 修改用户登录密码
 * @returns 
 */
export function changeLoginPassword(data) {
  return request({
    url: '/auth/changeLoginPassword',
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
    url: '/auth/changeTradePassword',
    method: 'post',
    data
  })
}

// 登出 
export function logout(userId) {
  return request({
    url: `/auth/logout/${userId}`,
    method: 'get',
  })
}

export function getLoginUserInfo(){
  return request({
    url: '/getLoginUserInfo',
    method: 'get', 
  })
}


export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}


export function getPageSetting(data) {
  return request({
    url:'/user/pageSetting',
    data,
    method: 'post'
  })
}


export function getDashBoard(data) {
  return request({
    url:'/home/dashboard',
    data,
    method: 'post'
  })
}


export function getUserList(data) {
  return request({
    url:'/userRole/userList',
    data,
    method: 'post'
  })
}
export function getRoleList(data) {
  return request({
    url:'/userRole/roleList',
    data,
    method: 'post'
  })
}
export function addRole(data) {
  return request({
    url:'/userRole/addRole',
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
    url: '/master/tenant/getTenantDomainByDomainName',
    method: 'get',
    params
  })
}


