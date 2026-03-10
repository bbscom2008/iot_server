import request from '@/utils/request'


// 获取个人信息
export function getProviderInfoDetailByProvider() {
  return request({
    url: '/master/provider/getProviderInfoDetailByProvider',
    method: 'get',
  })
}