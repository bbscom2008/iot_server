import request from '@/utils/request'

const tempBase = ''

/**
 * 机器人用户分页查询
 */
export function getBotUserPage({pageNum,pageSize}, data) {
  return request({
    url: `/bot/botUser/getBotUserPage?pageNum=${pageNum}&pageSize=${pageSize}`,
    method: 'post',
    data: data
  })
}

/**
 * 机器人用户删除
 */
export function botUserDelete(botUserId) {
  return request({
    url:  `/bot/botUser/delete/${botUserId}`,
    method: 'get'
  })
}

/**
 * 机器人用户更细
 */
export function botUserUpdate(data) {
  return request({
    url: `/bot/botUser/update`,
    method: 'post',
    data
  })
}


/**
 * 机器人用户新增
 */
export function botUserAdd(data) {
  return request({
    url: `/bot/botUser/add`,
    method: 'post',
    data
  })
}
