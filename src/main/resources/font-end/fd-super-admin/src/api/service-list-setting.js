import request from '@/utils/request'

// 
// const tempBase = '/'
// const tempBase = '/myserver'
const tempBase = ''

// 分页查询当前码商下关联的产品列表
export function getProductProviderRel(data,params) {
  return request({
    url: `${tempBase}/master/ProviderProductRelation/getProductProviderRel`,
    method: 'post',
    data,
    params
  })
}
// 分页查询当前产品下关联的码商列表
export function getProviderProductRelation(data,params) {
  return request({
    url: `${tempBase}/master/ProviderProductRelation/getProviderProductRelation`,
    method: 'post',
    data,
    params
  })
}
// 获取上级码商的关联的产品（下拉框）
// export function getProductListByUpperProviderId(parentId) {
//   return request({
//     url: `${tempBase}/master/provider/getProductListByProviderId/${parentId}`,
//     method: 'get'
//   })
// }


// 新增当前码商下关联的产品数据
export function addProduct(data) {
  return request({
    url: `${tempBase}/master/ProviderProductRelation/createProviderProductRelation`,
    method: 'post',
    data: data
  })
}
// 新增当前产品下关联的码商数据
export function createProductProviderRelation(data) {
  return request({
    url: `${tempBase}/master/ProviderProductRelation/createProductProviderRelation`,
    method: 'post',
    data
  })
}
// 获取产品名称-----s搜索栏
export function getProductListByProviderId(providerId) {
  return request({
    url: `${tempBase}/master/ProviderProductRelation/getProductListByProviderId/${providerId}`,
    method: 'get'
  })
}
// 获取父级产品名称-----s搜索栏
export function getProductListByParentId(parentId) {
  return request({
    url: `${tempBase}/master/provider/getProductListByProviderId/${parentId}`,
    method: 'get'
  })
}

// 获取父级产品名称-----码商配置产品时
export function getProductOptionsByProviderIdForProviderPage(providerId,params) {
  return request({
    url: `/master/ProviderProductRelation/getProductOptionsByProviderIdForProviderPage/${providerId}`,
    method: 'get',
    params
  })
}



// 批量解绑当前服务下关联的产品数据
export function batchUnbindProduct(data) {
  return request({
    url: `${tempBase}/master/ProviderProductRelation/batchDeleteProductProviderRelRelation`,
    method: 'post',
    data: data
  }) 
}

//解绑当前服务下关联的产品数据
export function unbindProduct(id) {
  return request({
    url: `${tempBase}/master/ProviderProductRelation/deleteProductProviderRelRelation/${id}`,
    method: 'get',
  })
}

// 修改当前码商下关联的产品数据
export function updateProduct(data) {
  return request({
    url: `${tempBase}/master/ProviderProductRelation/UpdateProductProviderRelationById`,
    method: 'post',
    data: data
  }) 
}

// 批量修改选中的关联的产品数据
export function batchUpdateProduct(data) {
  return request({
    url: `${tempBase}/master/ProviderProductRelation/batchUpdateProductProviderRelation`,
    method: 'post',
    data: data
  }) 
}


// 全部修改当前码商下关联的产品数据
export function allUpdateProduct(data) {
  return request({
    url: `${tempBase}/master/ProviderProductRelation/updateProductProviderRelationByProviderId`,
    method: 'post',
    data: data
  })
}
// 全部修改当前产品下关联的码商数据
export function updateProductProviderRelationByProductId(data) {
  return request({
    url: `${tempBase}/master/ProviderProductRelation/updateProductProviderRelationByProductId`,
    method: 'post',
    data: data
  })
}
// // 校验当前码商下新增关联的产品数据
// export function checkProductProviderRelation(data) {
//   return request({
//     url: `${tempBase}/master/ProviderProductRelation/checkProductProviderRelation`,
//     method: 'post',
//     data
//   })
// }




// 通过租户ID获取产品信息（下拉框）
export function getProductListByTenantId(tenantId) {
  return request({
    url: tempBase + `/master/product/getProductListByTenantId?tenantId=${tenantId}`,
    method: 'get'
  })
}
// 通过租户ID获取产品信息包含未启用（下拉框）
export function getProductListByTenantIdContainsNotActive(tenantId) {
  return request({
    url: tempBase + `/master/product/getProductListByTenantIdContainsNotActive?tenantId=${tenantId}`,
    method: 'get'
  })
}