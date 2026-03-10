

import request from '@/utils/request'


//订单管理
/**
 * 代收订单---分页查询代收订单列表
 * @returns 
 */
export function collectOrderPage(data) {
  return request({
    url: '/order/collectOrder/page',
    method: 'post',
    data
  })
}