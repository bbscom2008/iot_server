import request from '@/utils/request'
import store from '@/store'

const tempBase = ''


// 查看产品监控列表 -- 
export function getProductMonitorList(tenantId) {
   return request({
    url: tempBase + `/master/monitor/product/getProductMonitorList?tenantId=${tenantId}`,
    method: 'get'
  })
}


// 查看码商监控列表 -- 
export function getProviderMonitorList(productId) {
   return request({
    url: tempBase + `/master/monitor/product/getProviderMonitorList/${productId}`,
    method: 'get'
  })
}



// 查询监控队列收款码列表
export function getPayeeAccountMonitorList(productId) {
   return request({
    url: tempBase + `/master/monitor/product/getPayeeAccountMonitorList/${productId}`,
    method: 'get'
  })
}



