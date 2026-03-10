import request from '@/utils/request'
import store from '@/store'
const tempBase = '/'
//系统管理 最新接口字段修改  2025-3-21
/**
 * 系统管理---在线用户
 * @returns
 */
export function getOnlineUserPage(data, params) {
  return request({
    url: '/master/system/tenant/getOnlineUserPage',
    method: 'post',
    data,
    params
  })
}

/**
 * 系统管理---踢出用户
 * @returns
 */
export function onlineUserKickOut(userId) {
  return request({
    url: `/master/system/tenant/kickOut/${userId}`,
    method: 'post'
  })
}
/**
 * 系统管理---分页查询系统配置
 * @returns
 */
export function getSystemConfigPage(params) {
  // store.commit('app/setLoadingEnable', false)
  return request({
    url:'/master/system/config/getSystemConfigPage',
    method: 'post',
    params
  })
}

/**
 * 系统管理---分页查询角色
 * @returns
 */
export function getRolePage(data, params) {
  return request({
    url: '/master/system/role/getRolePage',
    method: 'post',
    data,
    params
  })
}
/**
 * 系统管理---新增角色
 * @returns
 */
export function systemRoleAdd(data) {
  return request({
    url: '/master/system/role/add',
    method: 'post',
    data
  })
}
/**
 * 系统管理---修改角色
 * @returns
 */
export function systemRoleUpdate(data) {
  return request({
    url: '/master/system/role/update',
    method: 'post',
    data
  })
}
/**
 * 系统管理---删除角色
 * @returns
 */
export function systemRoleDelete(roleId) {
  return request({
    url: `/master/system/role/delete/${roleId}`,
    method: 'get'
  })
}
/**
 * 系统管理---是否启用角色
 * @returns
 */
export function systemRoleEnable(roleId, params) {
  return request({
    url: `/master/system/role/enable/${roleId}`,
    method: 'get',
    params
  })
}
/**
 * 系统管理---角色编码唯一性校验
 * @returns
 */
export function checkRoleCode(roleCode, params) {
   store.commit('app/setLoadingEnable', false)
  return request({
    url: `/master/system/role/checkRoleCode/${roleCode}`,
    method: 'get',
    params
  })
}
/**
 * 系统管理---新增用户唯一性校验
 * @returns
 */
export function checkUserIsExists(userName) {
  store.commit('app/setLoadingEnable', false)
  return request({
    url: `/master/system/user/isExists/${userName}`,
    method: 'get'
  })
}

/**
 * 系统管理---分页查询用户
 * @returns
 */
export function getUserPage(data, params) {
  return request({
    url: '/master/system/user/getUserPage',
    method: 'post',
    data,
    params
  })
}
/**
 * 系统管理---获取角色的权限标记集合
 * @returns
 */
export function getRolePermissionCode(roleId) {
  return request({
    url: `/master/system/role/getRolePermissionCode/${roleId}`,
    method: 'get'
  })
}
/**
 * 系统管理---分配权限
 * @returns
 */
export function assignPermissions(data) {
  return request({
    url: '/master/system/role/assignPermissions',
    method: 'post',
    data
  })
}
/**
 * 系统管理---删除角色的角色权限(分配权限成功后 然后调用该接口 删除角色的角色权限  使用注意！！！！！)
 * @returns
 */
export function deleteRolePermission(data) {
  return request({
    url: '/master/system/role/deleteRolePermission',
    method: 'DELETE',
    data
  })
}

/**
 * 系统管理---新增用户
 * @returns
 */
export function systemUserAdd(data) {
  return request({
    url: '/master/system/user/add',
    method: 'post',
    data
  })
}
/**
 * 系统管理---修改用户
 * @returns
 */
export function systemUserUpdate(data) {
  return request({
    url: '/master/system/user/update',
    method: 'post',
    data
  })
}
/**
 * 系统管理--用户管理新增用户弹窗-获取所有角色信息
 * @returns
 */
export function getRoleList(params) {
  return request({
    url: '/master/system/role/getRoleList',
    method: 'get',
    params
  })
}
/**
 * 系统管理--获取用户开户信息
 * @returns
 */
export function userAccountInfo(userId) {
  return request({
    url: `/master/system/user/accountInfo/${userId}`,
    method: 'get'
  })
}
/**
 * 系统管理--重置用户谷歌密钥
 * @returns
 */
export function resetGoogleAuthKeys(userId) {
  return request({
    url: `/master/system/user/resetGoogleAuthKeys/${userId}`,
    method: 'post'
  })
}
/**
 * 系统管理--重置用户密码
 * @returns
 */
export function resetPassword(userId) {
  return request({
    url: `/master/system/user/resetPassword/${userId}`,
    method: 'post'
  })
}
/**
 * 系统管理--分页查询系统日志
 * @returns
 */
export function getSystemLogPage(data, params) {
  return request({
    url: '/master/system/log/getSystemLogPage',
    method: 'post',
    data,
    params
  })
}
/**
 * 系统管理--根据logId获取系统日志
 * @returns
 */
export function getSystemLogClassify(logId) {
  return request({
    url: `/master/system/log/${logId}`,
    method: 'get'
  })
}
/**
 * 系统管理--删除用户
 * @returns
 */
export function userDelete(userId) {
  return request({
    url: `/master/system/user/delete/${userId}`,
    method: 'get'
  })
}
/**
 * 系统管理--是否启用用户
 * @returns
 */
export function userEnable(userId, params) {
  return request({
    url: `/master/system/user/enable/${userId}`,
    method: 'get',
    params
  })
}
/**
 * 系统管理--解锁用户
 * @returns
 */
export function userUnlock(params) {
  return request({
    url: '/master/system/user/batchUnlockUser',
    method: 'get',
    params
  })
}
/**
 * 系统管理--分页查询登录日志
 * @returns
 */
export function getLoginLogPage(data, params) {
  return request({
    url: '/master/system/loginLog/getLoginLogPage',
    method: 'post',
    data,
    params
  })
}
/**
 * 系统管理--分页查询租户配置
 * @returns
 */
export function getTenantConfigPage(params) {
  return request({
    url: '/master/system/tenant/getTenantConfigPage',
    method: 'post',
    params
  })
}
/**
 * 系统管理--更新租户配置
 * @returns
 */
export function systemTenantUpdate(data) {
  store.commit('app/setLoadingEnable', false)

  return request({
    url: '/master/system/tenant/update',
    method: 'post',
    data
  })
}
/**
 * 系统管理--分页查询敏感词
 * @returns
 */
export function sensitiveWordPage(data, params) {
  return request({
    url: '/master/sensitive/word/page',
    method: 'post',
    data,
    params
  })
}
/**
 * 系统管理--设置风险IP是否启用
 * @returns
 */
export function sensitiveIpEnable(riskIpId,params) {
  return request({
    url: `/master/risk/ip/enable/${riskIpId}`,
    method: 'get',
    params
  })
}
/**
 * 系统管理--设置敏感词是否启用
 * @returns
 */
export function sensitiveWordEnable(sensitiveWordId,params) {
  return request({
    url: `/master/sensitive/word/enable/${sensitiveWordId}`,
    method: 'get',
    params
  })
}
/**
 * 系统管理--新增敏感词
 * @returns
 */
export function sensitiveWordAdd(data) {
  return request({
    url: '/master/sensitive/word/add',
    method: 'post',
    data
  })
}
/**
 * 系统管理--检查敏感词是否唯一
 * @returns
 */
export function sensitiveWordExists(word) {
  store.commit('app/setLoadingEnable', false)
  return request({
    url: `/master/sensitive/word/exists?word=${word}`,
    method: 'get'
  })
}
/**
 * 系统管理--删除敏感词
 * @returns
 */
export function sensitiveWordDelete(id) {
  return request({
    url: `/master/sensitive/word/${id}`,
    method: 'DELETE'
  })
}
/**
 * 系统管理--分页查询风险IP
 * @returns
 */
export function sensitiveIpPage(data, params) {
  return request({
    url: '/master/risk/ip/page',
    method: 'post',
    data,
    params
  })
}
/**
 * 系统管理--新增风险IP
 * @returns
 */
export function sensitiveIpAdd(data) {
  return request({
    url: '/master/risk/ip/add',
    method: 'post',
    data
  })
}
/**
 * 系统管理--检查IP地址是否唯一
 * @returns
 */
export function sensitiveIpExists(ip) {
  store.commit('app/setLoadingEnable', false)
  return request({
    url: `/master/risk/ip/exists?ip=${ip}`,
    method: 'get'
  })
}
/**
 * 系统管理--删除风险IP
 * @returns
 */
export function sensitiveIpDelete(id) {
  return request({
    url: `/master/risk/ip/${id}`,
    method: 'DELETE'
  })
}
//////////////////////////////////


/**
 * 系统管理---新增租户配置
 * @returns 
 */
export function systemTenantAdd(data) {
  return request({
    url:'/master/system/tenant/add',
    method: 'post',
    data
  })
}

/**
 * 系统管理---新增平台配置唯一性校验
 * @returns 
 */
export function tenantConfigIsExists(configKey,params) {
  store.commit('app/setLoadingEnable', false)
  return request({
    url:`/master/system/tenant/tenantConfigIsExists/${configKey}`,
    method: 'get',
    params
  })
}