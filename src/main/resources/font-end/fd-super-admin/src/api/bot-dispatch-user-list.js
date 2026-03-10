import request from '@/utils/request'

const tempBase = ''

/**
 * 转发用户分页查询
 */
export function getBotDispatchUserPage({ pageNum, pageSize }, data) {
  return request({
    url: `/botDispatchUser/getBotDispatchUserPage?pageNum=${pageNum}&pageSize=${pageSize}`,
    method: 'post',
    data: data
  })
}

/**
 * 转发用户删除
 */
export function botDispatchUserDelete(botDispatchUserId) {
  return request({
    url:  `/botDispatchUser/delete/${botDispatchUserId}`,
    method: 'get'
  })
}

/**
 * 转发用户更细
 */
export function botDispatchUserUpdate(data) {
  return request({
    url: `/botDispatchUser/update`,
    method: 'post',
    data
  })
}

/**
 * 转发用户新增
 */
export function botDispatchUserAdd(data) {
  return request({
    url: `/botDispatchUser/add/`,
    method: 'post',
    data
  })
}

/**
 * 转发用户登录
 */
export function loginBotDispatchUser(data) {
  return request({
    url: `/botDispatchUser/login/`,
    method: 'post',
    data: data
  })
}

/**
 * 二部验证密码提交
 */
export function submitTwoStepPassword(data) {
  return request({
    url: `/botDispatchUser/submitTwoStepPassword/`,
    method: 'post',
    data: data
  })
}

/**
 * 转发用户登出
 */
export function logoutBotDispatchUser(botDispatchUserId) {
  return request({
    url: `/botDispatchUser/logout/${botDispatchUserId}`,
    method: 'get'
  })
}


