import request from '@/utils/request'

const tempBase = ''

// 获取收银台模板配置信息
export function getTemplateInfo(cashTemplateId) {
  return request({
    url: tempBase + `/master/templates/${cashTemplateId}`,
    method: 'get'
  }) 
}


// 查询收银台信息 查询收银台信息
// useCache: 是否使用缓存，默认true。传false可强制刷新数据
export function getPayCashInfo(ciphertext, useCache = true){
  return request({
    // url: tempBase + `/payCash/getPayCashInfo?ciphertext=${ciphertext}`,
    // url: tempBase + `/payCash/getPayCashInfo`,
    url: tempBase + `/payCash/page/getPayCashInfo/${ciphertext}`,
    method: 'get',
    params: {
      uc: useCache
    }
    // data:ciphertext
  })
}

// 查询收银台基础信息 查询收银台基础信息
// useCache: 是否使用缓存，默认true。传false可强制刷新数据
export function getBasePayCashInfo(ciphertext, useCache = true){
  return request({
    url: tempBase + `/payCash/page/getBasePayCashInfo/${ciphertext}`,
    method: 'get',
    params: {
      uc: useCache
    }
    // data:ciphertext
  })
}


// 收银台提交弹窗信息
export function submitPopupInfo(data){
  return request({
    url: tempBase + `/payCash/page/submitPopup`,
    method: 'post',
    data
  })
}


//收银台提交信息
export function submitCashInfo(data){
  return request({
    url: tempBase + `/payCash/page/submitInfo`,
    method: 'post',
    data
  })
}

// 新增订单操作日志
export function addOrderOperationLog(orderId, operationDesc){
  return request({
    url: tempBase + `/order/api/collectOrder/operationLog/add`,
    method: 'post',
    data: {
      orderId: orderId,
      userName: 'pay-cash-page',
      operationStatus: true,
      operationDesc: operationDesc,
    }
  })
}