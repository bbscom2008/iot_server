import request from '@/utils/request'

/*
 * 运营管理
 */

export function channelInfoList() {
  return request({
    url: '/opm/channel-info-list',
    method: 'post',
  })
}


export function templateManagerList() {
  return request({
    url: '/opm/template-manager',
    method: 'post',
  })
}

export function getOperateLogList() {
  return request({
    url: '/opm/log-manager/operate-log',
    method: 'post',
  })
}

export function systemSettingList() {
  return request({
    url: '/opm/system-setting',
    method: 'post',
  })
}
export function dictionaryManageList() {
  return request({
    url: '/opm/dictionary-manage',
    method: 'post',
  })
}


export function userLoginLogList() {
  return request({
    url: '/opm/log-manager/login-log',
    method: 'post',
  })
}
export function productManageList() {
  return request({
    url: '/opm/product-manage',
    method: 'post',
  })
}
