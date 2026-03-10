import request from '@/utils/request'
import { isThreeDaysBefore,hasOnlyTwoValues } from '@/utils/index'
import store from '@/store'
// 
// const tempBase = '/myserver'
// const tempBase = '/'
const tempBase = ''

// 分页查询租户端代收订单列表
export function getTenantCollectOrderListPage(page, data) {
  // 要分 3 天前的,和 3 天内的.

  // let startTime = data.startTime
  // let endTime = data.endTime

  const { startTime, endTime, tenantId, ...rest } = data
  if (hasOnlyTwoValues(rest)) {


    
    return request({
      url:
        tempBase +
        `/order/tenant/collectOrder/getTenantCollectOrderHistoryListPage?pageNum=${page.pageNum}&pageSize=${page.pageSize}`,
      method: 'post',
      data: {
        ...rest,
        tenantId,
        startTime,
        endTime
      }
    })



  } else if (isThreeDaysBefore(startTime, endTime)) {
    // 三天前的
    return request({
      url:
        tempBase +
        `/order/tenant/collectOrder/getTenantCollectOrderHistoryListPage?pageNum=${page.pageNum}&pageSize=${page.pageSize}`,
      method: 'post',
      data
    })
  } else {
    // 近3天的
    return request({
      url:
        tempBase +
        `/order/tenant/collectOrder/getTenantCollectOrderListPage?pageNum=${page.pageNum}&pageSize=${page.pageSize}`,
      method: 'post',
      data
    })
  }
}

// 管理员补单代收订单
export function repairCollectOrder(orderId) {
  return request({
    url: tempBase + `/order/tenant/collectOrder/repair/${orderId}`,
    method: 'post'
  })
}

// 管理员修改代收订单实付金额
export function modifyCollectOrderPayAmount(data) {
  return request({
    url: tempBase + `/order/tenant/collectOrder/modifyPayAmount`,
    method: 'post',
    data
  })
}

// 管理员取消代收订单
export function cancelCollectOrder(orderId) {
  return request({
    url: tempBase + `/order/tenant/collectOrder/cancel/${orderId}`,
    method: 'post'
  })
}


// 查询实时代收订单数据分析
export function getCollectOrderDataAnalysis(data) {
  return request({
    url: tempBase + `/order/tenant/collectOrder/realtime`,
    method: 'post',
    data
  }) 
}

// 查询昨日代收订单数据分析
export function getYesterdayCollectOrderDataAnalysis(tenantId) {
  return request({
    url: tempBase + `/order/tenant/collectOrder/yesterday?tenantId=${tenantId}`,
    method: 'get',
  }) 
}

//查询今日代收订单数据分析
export function getTodayCollectOrderDataAnalysis(tenantId) {
  return request({
    url: tempBase + `/order/tenant/collectOrder/today?tenantId=${tenantId}`,
    method: 'get',
  })
}

// 导出租户端代收订单数据
export function exportTenantCollectOrderData(data) {
  return request({
    url: tempBase + `/order/tenant/collectOrder/export`,
    method: 'post',
    data,
    responseType: 'blob'
  }) 
}

//获取订单详情, 详情第一页的数据
export function getCollectOrderDetail(orderId,params) {
  return request({
    url: tempBase + `/order/tenant/collectOrder/info/${orderId}`,
    method: 'get',
    params
  }) 
}
// 根据收款账户名称查询收款账户信息
export function getPayeeAccountByName(data) {
  store.commit('app/setLoadingEnable', false)
  return request({
    url: tempBase + `/master/payeeAccount/getPayeeAccountByName`,
    method: 'post',
    data
  })
}
// 确认代收订单
export function providerCollectOrderConfirm(orderId) {
  return request({
    url: tempBase + `/order/provider/collectOrder/confirm/${orderId}`,
    method: 'post'
  })
}
// 检查用户交易密码
export function checkTradePassword(tradePassword) {
  return request({
    url: tempBase + `/order/tenant/collectOrder/checkTradePassword?tradePassword=${tradePassword}`,
    method: 'post'
  })
}

// 获取订单提交信息详情
export function getSubmitInfoInfo(orderId,params) {
  return request({
    url: tempBase + `/order/tenant/collectOrder/getSubmitInfoInfo/${orderId}`,
    method: 'get',
    params
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


// 一键拉黑
export function addBlackList(data) {
  return request({
    url: tempBase + `/order/tenant/collectOrder/addBlackList`,
    method: 'post',
    data
  })
}

// 冲正
export function reversalOrder(orderId) {
   return request({
    url: tempBase + `/order/tenant/collectOrder/reverse/${orderId}`,
    method: 'post'
  })
}

// 查看订单收款信息 -- 
export function getOrderPayeeAccountInfo(orderId) {
   return request({
    url: tempBase + `/order/tenant/collectOrder/getPayeeAccountValueByOrderId/${orderId}`,
    method: 'get'
  })
}



