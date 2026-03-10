import request from '@/utils/request'

//微信

const tempBase = ''

/**
 * 分页查询微信账号
 */
export function getWechatPayAccountPage(data, params) {
  return request({
    url: tempBase + '/master/system/wechatPayAccount/getWechatPayAccountPage',
    method: 'post',
    data,
    params
  })
}
/**
 * 新增微信账号
 */
export function wechatPayAccountAdd(data) {
  return request({
    url: tempBase + '/master/system/wechatPayAccount/add',
    method: 'post',
    data
  })
}
/**
 * 根据wechatPayAccountId获取微信账号详细信息
 */
export function wechatPayAccount(wechatPayAccountId) {
  return request({
    url: tempBase + `/master/system/wechatPayAccount/${wechatPayAccountId}`,
    method: 'get'
  })
}
/**
 * 更新微信账号
 */
export function wechatPayAccountUpdate(data) {
  return request({
    url: tempBase + `/master/system/wechatPayAccount/update`,
    method: 'post',
    data
  })
}
/**
 * 是否启用
 */
export function wechatPayAccountEnable(wechatPayAccountId,params) {
  return request({
    url: tempBase + `/master/system/wechatPayAccount/enable/${wechatPayAccountId}`,
    method: 'get',
    params
  })
}
/**
 * 删除微信账号
 */
export function wechatPayAccountDelete(wechatPayAccountId) {
  return request({
    url: tempBase + `/master/system/wechatPayAccount/delete/${wechatPayAccountId}`,
    method: 'get'
  })
}
