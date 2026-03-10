import store from '@/store'
import request from '@/utils/request'

// const tempBase = '/'
const tempBase = ''
// const tempBase = '/'
//
// 分页查询收款信息
export function getPayeeAccountInfoListPage(page, data) {
  return request({
    url:
      tempBase +
      `/master/payeeAccount/getPayeeAccountListPage?pageNum=${page.pageNum}&pageSize=${page.pageSize}`,
    method: 'post',
    data
  })
}

// 码商端收款账户信息分页查询
export function getPayeeAccountInfoListPageByProvider(page, data) {
  return request({
    url:
      tempBase +
      `/master/payeeAccount/getPayeeAccountListPageForProvider?pageNum=${page.pageNum}&pageSize=${page.pageSize}`,
    method: 'post',
    data
  })
}

// 删除收款账户信息
export function deletePayeeAccountInfo(payeeAccountId) {
  return request({
    url: tempBase + `/master/payeeAccount/delete/${payeeAccountId}`,
    method: 'get'
  })
}

// 新增收款账户信息
export function addPayeeAccountInfo(data) {
  return request({
    url: tempBase + `/master/payeeAccount/createPayeeAccount`,
    method: 'post',
    data
  })
}

// 根据产品Id获取收款信息配置
export function getPayeeAccountInfoByProductId(productId) {
  store.commit('app/setLoadingEnable', true)
  return request({
    url: tempBase + `/master/payeeAccount/getPayeeAccountConfig/${productId}`,
    method: 'get'
  })
}

// 根据数据生成二维码
export function getPayeeAccountInfoQrCode(data) {
  return request({
    url: tempBase + `/master/payeeAccount/generatePayeeAccountQrCode`,
    method: 'post',
    data
  })
}

// 更新收款账户信息 
export function updatePayeeAccountInfo(data) {
  return request({
    url: tempBase + `/master/payeeAccount/updatePayeeAccountValue`,
    method: 'post',
    data
  })
}

// 收款账户信息是否启用
export function payeeAccountInfoEnable(payeeAccountId, isActive) {
  return request({
    url: tempBase + `/master/payeeAccount/isActive/${payeeAccountId}?isActive=${isActive}`,
    method: 'get',
   
  })
}

// 导入收款账户信息excel
export function payeeAccountInfoImportExcel(data) {
  return request({
    url: tempBase + `/master/payeeAccount/importPayeeAccountExcel`,
    method: 'post',
    data
  })
}

// 批量开启或关闭收款账户信息
export function payeeAccountInfoEnableBatch(data) {
  return request({
    url: tempBase + `/master/payee-account/batchUpdate`,
    method: 'post',
    data
  })
}

// 批量新增收款账户信息
export function payeeAccountInfoAddBatch(data) {
  return request({
    url: tempBase + `/master/payeeAccount/batchAdd`,
    method: 'post',
    data
  })
}

// 根据ID获取收款账户信息
export function getPayeeAccountInfoById(payeeAccountId) {
  return request({
    url: tempBase + `/master/payeeAccount/${payeeAccountId}`,
    method: 'get'
  })
}
// 判断收款账户信息名称是否存在
export function payeeAccountInfoNameIsExist(payeeAccountName, providerId) {
  store.commit('app/setLoadingEnable', false)
  return request({
    url: tempBase + `/master/payeeAccount/existsPayeeAccountName/${payeeAccountName}?providerId=${providerId}`,
    method: 'get'
  })
}

// 全部修改接单配置
export function updateAllPayeeAccountInfo(data) {
  return request({
    url: tempBase + `/master/acceptOrderConfig/allUpdateAcceptOrderConfig`,
    method: 'post',
    data
  })
}

// 批量修改接单配置
export function updatePayeeAccountInfoBatch(data) {
  return request({
    url: tempBase + `/master/acceptOrderConfig/batchUpdateAcceptOrderConfig`,
    method: 'post',
    data
  })
}

// 根据收款信息Id查询接单配置
export function getPayeeAccountInfoConfigByPayeeAccountId(payeeAccountId) {
  return request({
    url: tempBase + `/master/acceptOrderConfig/${payeeAccountId}`,
    method: 'get'
  })
}


// 判断收款账户信息是否可用
export function payeeAccountInfoIsAvailable(payeeAccountId) {


  store.commit('app/setLoadingEnable', false)

  return request({
    url: tempBase + `/master/payeeAccount/checkIsAvailable/${payeeAccountId}`,
    method: 'get'
  }) 
}
// 更新是否可用状态
export function updateIsAvailable(payeeAccountId) {
  store.commit('app/setLoadingEnable', false)
  return request({
    url: tempBase + `/master/payeeAccount/updateIsAvailable/${payeeAccountId}`,
    method: 'get'
  }) 
}


// 新增收款信息时通过码商ID获取产品信息（下拉框）
export function getProductInfoListByProviderId(providerId) {
  return request({
    url: tempBase + `/master/ProviderProductRelation/getPayeeAccountProductListByProviderId/${providerId}`,
    method: 'get'
    })
}



// 收款码列表列表获取收款信息统计信息
export function getPayeeAccountInfoCount(payeeAccountId) {
  return request({
    url: tempBase + `/statistics/dailyPayeeAccountInfoReport/getSummaryTodayAndYesterdayByPayeeAccountId?payeeAccountId=${payeeAccountId}`,
    method: 'get',
  })
}


// 获取支付宝授权地址
export function getAliPayAuthUrl(payeeAccountId) {
  return request({
    url: tempBase + `/master/system/alipayAuth/getAlipayAuthUrl`,
    method: 'post',
    data: { payeeAccountId }
  })  
}

// 获得监控地址信息
export function getMonitorAddrInfo(payeeAccountId) {
  return request({
    url: tempBase + `/master/payeeAccount/getAppMonitorUrl/${payeeAccountId}`,
    method: 'get',
  })  
}

// 查询收款信息是否有被使用 
export function isExistCollectorderTaken(payeeAccountId) {
  // store.commit('app/setLoadingEnable', false)
  return request({
    url: tempBase + `/master/payeeAccount/isExistCollectOrderTaken/${payeeAccountId}`,
    method: 'get',
  })  
}

// 根据产品Id获取产品详情信息
export function getProductById(productId) {
  return request({
    url: tempBase + `/master/product/getProductById/${productId}`,
    method: 'get'
  })
}
// 收款账户信息接单下线
export function isOneTimeAcceptIsActive(payeeAccountId,isOneTimeAccept) {
  store.commit('app/setLoadingEnable', false)
  return request({
    url: tempBase + `/master/payeeAccount/isOneTimeAccept/${payeeAccountId}?isOneTimeAccept=${isOneTimeAccept}`,
    method: 'get',
  })  
}


// 根据payeeAccountId批量删除收款账户信息
export function payeeAccountBatchDelete(data) {
  return request({
    url: tempBase + `/master/payeeAccount/batchDelete`,
    method: 'post',
    data
  })  
}
// 码商端-导出收款账户信息
export function exportPayeeAccountListForProvider( data) {
  return request({
    url:`/master/payeeAccount/exportPayeeAccountListForProvider`,
    method: 'post',
    data,
    responseType: 'blob'
  }) 
}
// 生成Excel模板
export function generateExcelTemplate(formData) {
  return request({
    url: `/master/payeeAccount/generateExcelTemplate/${formData.get('productId')}`,
    method: 'post',
    data: formData,
    responseType: 'blob',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    timeout: 300000
  })
}

// 批量导入Excel
export function importPayeeAccountExcel(file, productId, providerId, tenantId) {
  const formData = new FormData()
  formData.append('tenantId', tenantId)
  formData.append('excelFile', file)

  return request({
    url: `/master/payeeAccount/importPayeeAccountExcel/${productId}/${providerId}`,
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    timeout: 120000
  })
}

/**
 * 批量新增收款账户信息
 *
 * @param payeeAccountBatchCreateDTO 请求参数
 * @return 响应结果
 */
export function batchCreatePayeeAccount(payeeAccountBatchCreateDTO) {
  return request({
    url: tempBase + `/master/payeeAccount/batchAdd`,
    method: 'post',
    data: payeeAccountBatchCreateDTO
  })
}



 /*
  * 通过服务商Id获取收款信息（下拉框）
  */
 export function getPayeeAccountListByProviderId(providerId) {
  return request({
    url: tempBase + `/master/payeeAccount/getPayeeAccountOptionListByProviderId/${providerId}`,
    method: 'get'
  })
}
