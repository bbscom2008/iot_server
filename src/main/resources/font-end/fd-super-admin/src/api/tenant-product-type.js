import request from '@/utils/request'
import store from '@/store'
// const tempBase = '/myserver'
const tempBase = ''

// 产品类型-分页查询
export function getProductTypePage(page, data) {
  return request({
    url:
      tempBase +
      `/master/productType/getProductTypePage?pageNum=${page.pageNum}&pageSize=${page.pageSize}`,
    method: 'post',
    data
  })
}

//产品类型-新增
export function addProductType(data) {
  return request({
    url: tempBase + '/master/productType/add',
    method: 'post',
    data
  })
}

// 产品类型-修改
export function updateProductType(data) {
  return request({
    url: tempBase + '/master/productType/update',
    method: 'post',
    data
  })
}

//产品类型-删除
export function deleteProductType(productTypeId) {
  return request({
    url: tempBase + `/master/productType/delete/${productTypeId}`,
    method: 'get'
  })
}

// 产品类型-修改状态
// 操作类型 0-是否为静态支付信息，1-是否为自动确认订单，2-是否启用 修改类型
export function updateProductTypeStatus(productTypeId, params) {
  return request({
    url: tempBase + `/master/productType/isActive/${productTypeId}`,
    method: 'get',
    params
  })
}

// 产品类型名称-判断是否存在
export function checkProductTypeNameUnique(productTypeId, params) {
  store.commit('app/setLoadingEnable', false)
  return request({
    url: tempBase + `/master/productType/isProductTypeNameExists/${productTypeId}`,
    method: 'get',
    params
  })
}

// 产品类型编码-判断是否存在
export function checkProductTypeCodeUnique(productTypeCode, params) {
  store.commit('app/setLoadingEnable', false)

  return request({
    url: tempBase + `/master/productType/isProductTypeCodeExists/${productTypeCode}`,
    method: 'get',
    params
  })
}

// 获取所有支付类型
export function getPayTypeList() {
  return request({
    url: tempBase + `/master/productType/getPayTypeList`,
    method: 'get'
  })
}
// 产品类型是否被租户绑定
export function hasTenantExistsByProductTypeId(productTypeId) {
  store.commit('app/setLoadingEnable', false)
  return request({
    url: tempBase + `/master/productType/hasTenantExistsByProductTypeId/${productTypeId}`,
    method: 'get'
  })
}

// 是否有产品已经浮动
export function hasProductIsEnableFloatingByProductTypeId(productTypeId) {
  store.commit('app/setLoadingEnable', false)
  return request({
    url: tempBase + `/master/productType/hasProductIsEnableFloatingByProductTypeId/${productTypeId}`,
    method: 'get'
  })
}
// 根据租户ID和租户配置key获取租户配置value
export function getTenantConfigValueByTenantConfigKey(tenantId,params) {
  return request({
    url: tempBase + `/master/system/tenant/getTenantConfigValueByTenantConfigKey/${tenantId}`,
    method: 'get',
    params
  })
}


// 指定产品类型同步到平台
export function syncProductTypeToTenant(productTypeId) {
  return request({
    url: tempBase + `/master/TenantProductType/syncProductTypeToTenant`,
    method: 'post',
    data: {
      productTypeId,
    }
  })
}
