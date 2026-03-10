import request from '@/utils/request'
import { isThreeDaysBefore,hasOnlyTwoValues } from '@/utils/index'
/**
 * 代收订单 页面 接口
 */

const tempBase = ''
// const tempBase = '/'

/**
 * 分页查询商户端代收订单列表
 */
export function getMerchantCollectOrderListPage(page, data) {
  // 要分 3 天前的,和 3 天内的.

  // let startTime = data.startTime
  // let endTime = data.endTime

  const { startTime, endTime, ...rest } = data
  if (hasOnlyTwoValues(rest)) {
    return request({
      url:
        tempBase +
        `/order/merchant/collectOrder/getMerchantCollectOrderHistoryListPage?pageNum=${page.pageNum}&pageSize=${page.pageSize}`,
      method: 'post',
      data: {
        ...rest,
        startTime,
        endTime
      }
    })
  } else if (isThreeDaysBefore(startTime, endTime)) {
    // 三天前的  分页查询商户端代收订单列表（3天前）
    return request({
      url:
        tempBase +
        `/order/merchant/collectOrder/getMerchantCollectOrderHistoryListPage?pageNum=${page.pageNum}&pageSize=${page.pageSize}`,
      method: 'post',
      data
    })
  } else {
    // 近3天的  分页查询商户端代收订单列表（近3天）
    return request({
      url:
        tempBase +
        `/order/merchant/collectOrder/getMerchantCollectOrderListPage?pageNum=${page.pageNum}&pageSize=${page.pageSize}`,
      method: 'post',
      data
    })
  }
}

// 导出商户端代收订单详情
export function exportMerchantCollectOrderDetail(data) {
  return request({
    url: tempBase + `/order/merchant/collectOrder/export`,
    method: 'post',
    data,
    responseType: 'blob'
  })
}
// 分页查询最近半小时的支付宝账单信息
export function getLastHalfHourAlipayBillPage(data,params) {
  return request({
    url: tempBase + `/master/alipayBill/getLastHalfHourAlipayBillPage`,
    method: 'post',
    data,
    params
  })
}

