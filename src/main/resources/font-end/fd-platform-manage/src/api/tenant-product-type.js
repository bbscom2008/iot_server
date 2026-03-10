import request from '@/utils/request'
import store from '@/store'

// const tempBase = '/myserver'
// const tempBase = '/'
const tempBase = ''

// 产品类型-分页查询
export function getProductTypePage(page,data) {
  return request({
    url: tempBase+`/master/productType/getProductTypePage?pageNum=${page.pageNum}&pageSize=${page.pageSize}`,
    method: 'post',
    data
  })
}

//产品类型-新增
export function addProductType(data) {
  return request({
    url: tempBase+'/master/productType/add',
    method: 'post',
    data
  })
}

// 产品类型-修改
export function updateProductType(data) {
  return request({
    url: tempBase+'/master/productType/update',
    method: 'post',
    data
  }) 
}

  //产品类型-删除
  export function deleteProductType(productTypeId) {
    return request({
      url: tempBase+`/master/productType/delete/${productTypeId}`,
      method: 'get',
    })
  }

  // 产品类型-修改状态
  // 操作类型 0-是否为静态支付信息，1-是否为自动确认订单，2-是否启用 修改类型
  export function updateProductTypeStatus(productTypeId,params) {
    return request({
      url: tempBase+`/master/productType/isActive/${productTypeId}`,
      method: 'get',
      params
    })  
  }

  // 产品类型名称-判断是否存在
  export function checkProductTypeNameUnique(productTypeName) {
    store.commit('app/setLoadingEnable', false)
    store.commit('app/setLoadingEnable', false)
    return request({
      url: tempBase+`/master/productType/isProductTypeNameExists/${productTypeName}`,
      method: 'get',
    })  
  }

  // 产品类型编码-判断是否存在
  export function checkProductTypeCodeUnique(productTypeCode) {
    store.commit('app/setLoadingEnable', false)
    store.commit('app/setLoadingEnable', false)
    return request({
      url: tempBase+`/master/productType/isProductTypeCodeExists/${productTypeCode}`,
      method: 'get',
    })
  }