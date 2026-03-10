import request from '@/utils/request'
import { isThreeDaysBefore } from '@/utils/index'
/**
 * 代收订单 页面 接口
 */
// const tempBase = '/'
const tempBase = ''

/**
 * 分页查询商户端代付订单列表
 */
export function getMerchantPaymentOrderListPage({ pageNum, pageSize }, data) {

  // let startTime = data.startTime
  // let endTime = data.endTime

  // if (isThreeDaysBefore(startTime, endTime)) {
  //   // 三天前的  分页查询商户端代收订单列表（3天前）
  //   return request({
  //     url:
  //       tempBase +
  //       `/order/merchant/exceptionOrder/getMerchantCollectOrderHistoryListPage?pageNum=${pageNum}&pageSize=${pageSize}`,
  //     method: 'post',
  //     data
  //   })
  // } else {
  //   // 近3天的  分页查询商户端代收订单列表（近3天）
  //   return request({
  //     url:
  //       tempBase +
  //       `/order/merchant/exceptionOrder/getMerchantCollectOrderListPage?pageNum=${pageNum}&pageSize=${pageSize}`,
  //     method: 'post',
  //     data
  //   })
  // }

  return request.post(
    tempBase +
      `/order/exceptionOrder/getMerchantExceptionOrderListPage?pageNum=${pageNum}&pageSize=${pageSize}`,
    data
  )

}

// /order/merchant/paymentOrder/export

//导出商户端代付订单详情
export function exportMerchantExceptionOrderDetail(data) {
  return request({
    url: tempBase + `/order/merchant/exceptionOrder/export`,
    method: "post",
    data,
    responseType: "blob"
  }) 
}

// 超管或平台端-导出商户端异常订单列表
export function exportMerchantExceptionOrderList( data) {
  return request({
    url:`/order/exceptionOrder/exportMerchantExceptionOrderList`,
    method: 'post',
    data,
    responseType: 'blob'
  }) 
}



