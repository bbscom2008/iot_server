import request from '@/utils/request'
import store from '@/store'
// 
// const tempBase = '/'
// const tempBase = '/myserver'
const tempBase = ''

// 分页查询产品
export function getProductList({ pageNum, pageSize }, data) {
  return request({
    url: tempBase + `/master/product/getProductPage?pageNum=${pageNum}&pageSize=${pageSize}`,
    method: 'post',
    data
  })
}

// 是否启用产品
export function updateProductStatus(productId, isActive) {
  return request({
    url: tempBase + `/master/product/updateProductIsActive/${productId}?isActive=${isActive}`,
    method: 'get'
  })
}

// 新增产品
export function addProduct(data) {
  return request({
    url: tempBase + `/master/product/createProduct`,
    method: 'post',
    data
  })
}

// 修改产品
export function updateProduct(data) {
  return request({
    url: tempBase + `/master/product/updateProductByProductId`,
    method: 'post',
    data
  })
}

//根据产品ID删除产品
export function deleteProduct(productId) {
  return request({
    url: tempBase + `/master/product/deleteByProductId/${productId}`,
    method: 'post'
  })
}

// 浮动值设置
export function updateFloatAmount(data) {
  return request({
    url: tempBase + `/master/product/updateFloatAmountByProductId`,
    method: 'post',
    data
  })
}


// 通过租户ID获取产品信息（下拉框）
export function getProductListByTenantId() {
  return request({
    url: tempBase + `/master/product/getProductListByTenantId`,
    method: 'get'
  })
}

// 当前租户下产品名称是否重复（新增产品）
export function checkProductName(productName) {
  store.commit('app/setLoadingEnable', false)
  return request({
    url: tempBase + `/master/product/existsProductName/${productName}`,
    method: 'get'
  })
}

// 根据ID获取产品详情信息
export function getProductDetail(productId) {
  return request({
    url: tempBase + `/master/product/getProductById/${productId}`,
    method: 'get'
  }) 
}

// 通过码商ID获取产品信息（收款信息管理下拉框）
export function getProductListByProviderId(providerId) {
  return request({
    url: tempBase + `/master/product/getProductListByProviderId/${providerId}`,
    method: 'get'
  }) 
}

// 码商端-分页查询产品
export function getProductListByProvider({ pageNum, pageSize }, data) {
  return request({
    url: tempBase + `/master/product/getProductPageByProvider?pageNum=${pageNum}&pageSize=${pageSize}`,
    method: 'post',
    data
  }) 
}

// 是否启用产品与码商关联的数据
export function updateProductStatusByProvider(productProviderRelationId, isActive) {
  return request({
    url: tempBase + `/master/product/isActiveProductProviderRelation/${productProviderRelationId}?isActive=${isActive}`,
    method: 'get'
  })
}

// 查询所有产品类型信息（下拉框）
export function getAllProductType() {
  return request({
    url: tempBase + `/master/productType/getProductTypeList`,
    method: 'get'
  }) 
}