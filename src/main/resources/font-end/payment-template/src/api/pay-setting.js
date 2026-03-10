import request from '@/utils/request'

const tempBase = ''
// const tempBase = '/myserver'

// 设置服务商支付配置
export function setPaysetting({providerId, data}) {
  return request({
    url: tempBase + `/master/provider/pay/setting/${providerId}`,
    method: 'post',
    data
  })
}

//获取服务商支付配置
export function getPaysetting(providerId) {
  return request({
    url: tempBase + `/master/provider/pay/setting/${providerId}`,
    method: 'get',
  })
}
