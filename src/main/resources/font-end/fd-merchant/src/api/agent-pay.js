import request from '@/utils/request'
import { isThreeDaysBefore,hasOnlyTwoValues } from '@/utils/index'
/**
 * 代收订单 页面 接口
 */
const tempBase = ''
// const tempBase = '/'
/**
 * 分页查询商户端代付订单列表
 * @returns
 */
export function getMerchantPaymentOrderListPage({ pageNum, pageSize }, data) {
  // let startTime = data.startTime
  // let endTime = data.endTime
  const { startTime, endTime, ...rest } = data
  if (hasOnlyTwoValues(rest)) {
    return request({
      url:
        tempBase +
        `/order/merchant/paymentOrder/getMerchantPaymentOrderHistoryListPage?pageNum=${pageNum}&pageSize=${pageSize}`,
      method: 'post',
      data: {
        ...rest,
        startTime,
        endTime
      }
    })
  } else
  if (isThreeDaysBefore(startTime, endTime)) {
    // 3 天前的
    return request({
      url:
        tempBase +
        `/order/merchant/paymentOrder/getMerchantPaymentOrderHistoryListPage?pageNum=${pageNum}&pageSize=${pageSize}`,
      method: 'post',
      data
    })
  } else {
    // 近3天的

    return request({
      url:
        tempBase +
        `/order/merchant/paymentOrder/getMerchantPaymentOrderListPage?pageNum=${pageNum}&pageSize=${pageSize}`,
      method: 'post',
      data
    })
  }
}

//导出商户端代付订单详情
export function exportMerchantPaymentOrderDetail(data) {
  return request({
    url: tempBase + `/order/merchant/paymentOrder/export`,
    method: 'post',
    data,
    responseType: 'blob'
  })
}
