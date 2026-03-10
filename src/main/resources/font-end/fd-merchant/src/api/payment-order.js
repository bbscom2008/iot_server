
import request from '@/utils/request'

/**
 * 代付订单 页面 接口
 */


/**
 * 分页查询商户端代付订单列表
 */
export function getMerchantPaymentOrderListPage(data) {
    return request({
      url: '/merchant/order/paymentOrder/getMerchantPaymentOrderListPage',
      method: 'post',
      data
    })
  }