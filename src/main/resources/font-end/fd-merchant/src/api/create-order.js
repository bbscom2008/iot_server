import request from '@/utils/request'

const tempBase = ''

/**
 * 代付订单excel数据文件上传
 * @returns
 */
export function paymentOrderImport(file) {
    const formData = new FormData()
    formData.append('file', file)
  return request({
    url: tempBase + '/order/manual/merchant/paymentOrder/import',
    method: 'post',
    data: formData
  })
}

/**
 * 手动创建代付订单
 * @returns
 */
export function createManualMerchantPaymentOrder(data) {
  return request({
    url: tempBase + '/order/manual/merchant/paymentOrder/createManualMerchantPaymentOrder',
    method: 'post',
    data
  })
}
/**
 * 下载模板
 * @returns
 */
export function downloadExcelTemplate() {
  return request({
    url: tempBase + '/order/manual/merchant/paymentOrder/downloadExcelTemplate',
    method: 'post',
    responseType: 'blob'
  })
}
