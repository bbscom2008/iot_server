import request from '@/utils/request'

// const tempBase = ''
// const tempBase = '/'
const tempBase = ''

/**
 * 分页搜索异常订单
 * @param {string} pageNum 页码
 * @param {string} pageSize 每页大小
 * @param {object} data 异常订单
 * @param {string} data.merchantOrderNo 商户订单号
 * @param {string} data.merchantUserName 商户用户名
 * @param {string} data.merchantUserNickName 商户名称
 * @param {object} data.startTime 开始时间
 * @param {object} data.endTime 结束时间
 * @returns
 */
export function getExceptionOrderListPage(page, data) {
  return request.post(
    tempBase +
      `/order/exceptionOrder/getExceptionOrderListPage?pageNum=${page.pageNum}&pageSize=${page.pageSize}`,
    data
  )
}
// 超管或平台端-导出异常订单列表
export function exportExceptionOrderList( data) {
  return request({
    url:`/order/exceptionOrder/exportExceptionOrderList`,
    method: 'post',
    data,
    responseType: 'blob'
  }) 
}

