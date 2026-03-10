import request from '@/utils/request'

import store from '@/store'

// const tempBase = '/myserver'
const tempBase = ''

//商户管理
/**
 * 商户管理---条件查询商户列表
 * @returns
 */
export function merchantPage(data) {
  return request({
    url: tempBase + '/merchant/page',
    method: 'post',
    data
  })
}

/**
 * 通道管理---条件查询通道管理
 * @returns
 */
export function channelPage(data) {
  return request({
    url: tempBase + '/channel/page',
    method: 'post',
    data
  })
}
/**
 * 通道管理---创建通道与产品关联
 * @returns
 */
export function createChannelProductRel(data) {
  return request({
    url: tempBase + '/channel/createChannelProductRel',
    method: 'post',
    data
  })
}

//最新接口字段修改   2025-3-21

/**
 * 商户管理--商户列表
 * @returns
 */
export function getMerchantPage(data) {
  return request({
    url: tempBase + '/master/merchant/getMerchantPage',
    method: 'post',
    data
  })
}
/**
 * 商户管理--商户下通道---配置通道
 * @returns
 */
export function getChannelMerchantRelPage(data) {
  return request({
    url: tempBase + '/master/MerchantChannelRelation/getChannelMerchantRelPage',
    method: 'post',
    data
  })
}
/**
 * 商户管理--商户管理---创建通道与商户关联
 * @returns
 */
export function createChannelMerchantRel(data) {
  return request({
    url: tempBase + '/master/MerchantChannelRelation/createChannelMerchantRel',
    method: 'post',
    data
  })
}
/**
 * 商户管理--查询当前商户密钥
 * @returns
 */
export function getMerchantKeyByMerchantId(data) {
  return request({
    url: tempBase + '/master/MerchantChannelRelation/getMerchantKeyByMerchantId',
    method: 'get',
    data
  })
}
/**
 * 商户管理--批量删除-解绑
 * @returns
 */
export function batchDeleteChannelMerchantRelation(data) {
  return request({
    url: tempBase + '/master/MerchantChannelRelation/batchDeleteChannelMerchantRelation',
    method: 'get',
    data
  })
}
/**
 * 商户管理--批量更新
 * @returns
 */
export function batchUpdateChannelMerchantRelation(data) {
  return request({
    url: tempBase + '/master/MerchantChannelRelation/batchUpdateChannelMerchantRelation',
    method: 'get',
    data
  })
}
/**
 * 商户管理--创建商户
 * @returns
 */
export function merchantAdd(data) {
  return request({
    url: tempBase + '/master/merchant',
    method: 'post',
    data
  })
}
/**
 * 商户管理--复制商户
 * @returns
 */
export function merchantCopy(data) {
  return request({
    url: tempBase + '/master/merchant/copy',
    method: 'post',
    data
  })
}
/**
 * 商户管理--是否启用商户
 * @returns
 */
export function merchantIsActive(data) {
  return request({
    url: tempBase + '/master/merchant/isActive',
    method: 'get',
    data
  })
}

//   /2025/3/24
/**
 * 商户管理--通道管理--通过通道id删除通道
 * @returns
 */
export function channeldDelete(data) {
  return request({
    url: tempBase + '/channel/delete?channelId=' + data,
    method: 'get'
  })
}
/**
 * 商户管理--通道管理--分页查询 当前通道下所有的关联产品
 * @returns
 */
export function getChannelProductRelRelationPage(data) {
  return request({
    url: tempBase + '/ChannelProductRelation/getChannelProductRelRelationPage',
    method: 'post',
    data
  })
}
/**
 * 商户管理--通道管理--批量删除当前通道下关联的产品数据
 * @returns
 */
export function batchDeleteChannelProductRel(data) {
  return request({
    url: tempBase + '/ChannelProductRelation/batchDeleteChannelProductRel',
    method: 'post',
    data
  })
}
/**
 * 商户管理--通道管理--更新通道下所有产品是否启用（修改全部）
 * @returns
 */
export function updateAllProductIsActiveByChannelId(data) {
  return request({
    url: tempBase + '/ChannelProductRelation/updateAllProductIsActiveByChannelId',
    method: 'post',
    data
  })
}
/**
 * 商户管理--通道管理--更新通道下该产品是否启用（修改一个）
 * @returns
 */
export function updateChannelProductRelation(data) {
  return request({
    url: tempBase + '/ChannelProductRelation/updateChannelProductRelation',
    method: 'post',
    data
  })
}

///////////////////最新接口+字段修改+逻辑   2025-4-7
/**
 * 通道管理--通道组合查询page分页
 * @returns
 */
export function getChannelListPage(data, params) {
  return request({
    url: tempBase + '/master/channel/getChannelListPage',
    method: 'post',
    data,
    params
  })
}
/**
 * 通道管理--是否启用通道
 * @returns
 */
export function channelActive(channelId, isActive) {
  return request({
    url: tempBase + `/master/channel/updateChannelIsActive/${channelId}?isActive=${isActive}`,
    method: 'put'
  })
}
/**
 * 通道管理--访问后匹配
 * @returns
 */
export function channelMatchAfterVisit(channelId, data) {
  return request({
    url:
      tempBase + `/master/channel/updateIsMatchAfterVisit/${channelId}?isMarchAfterVisit=${data}`,
    method: 'put'
  })
}
/**
 * 通道管理--创建通道
 * @returns
 */
export function channelCreate(data) {
  return request({
    url: tempBase + '/master/channel/createChannel',
    method: 'post',
    data
  })
}
/**
 * 通道管理--复制通道
 * @returns
 */
export function channelCopy(data) {
  return request({
    url: tempBase + '/master/channel/copyChannel',
    method: 'post',
    data
  })
}

// 根据ID获取通道
export function getChannelById(channelId) {
  return request({
    url: tempBase + `/master/channel/${channelId}`,
    method: 'get'
  })
}

// 判断通道编码是否存在
export function checkChannelCode(channelCode) {
  // 当前接口请求时，不显示loading
  store.commit('app/setLoadingEnable', false)

  return request({
    url: tempBase + `/master/channel/existChannelCode/${channelCode}`,
    method: 'get'
  })
}

/**
 * 通道管理-- 获取通道信息（下拉框）
 * @returns
 */
// export function channelOptions(data) {
//   return request({
//     url:tempBase+ '/master/channel/options',
//     method: 'get',
//     data
//   })
// }
/**
 * 通道管理-- 通过通道id删除通道
 * @returns
 */
export function channelDelete(channelId) {
  return request({
    url: tempBase + `/master/channel/${channelId}`,
    method: 'delete'
  })
}
/**
 * 通道管理-- 批量修改通道
 * @returns
 */
export function channelUpdateBatch(data) {
  return request({
    url: tempBase + '/master/channel/updateBatch',
    method: 'post',
    data
  })
}
/**
 * 通道管理-- 修改该平台下全部通道
 * @returns
 */
export function channelUpdateAll(data) {
  return request({
    url: tempBase + '/master/channel/updateAll',
    method: 'post',
    data
  })
}

/**
 * 通道管理-- 分页查询当前通道下所有的关联产品
 * @returns
 */
export function getProductPageByChannelId(data, params) {
  return request({
    url: tempBase + '/master/channelProductRelation/getProductPageByChannelId',
    method: 'post',
    data,
    params
  })
}
/**
 * 通道管理-- 新增当前通道下关联的产品数据
 * @returns
 */
export function createChannelProductRelation(data) {
  return request({
    url: tempBase + '/master/channelProductRelation/createChannelProductRelation',
    method: 'post',
    data
  })
}

// 修改-通道下该产品是否启用
export function updateChannelProductRelationActive(data) {
  return request({
    url: tempBase + '/master/channelProductRelation/updateChannelProductRelationIsActive',
    method: 'post',
    data
  })
}

/**
 * 通道管理-- 批量修改-通道下该产品是否启用
 * @returns
 */
export function updateBatchChannelProductRelationActive(data) {
  return request({
    url: tempBase + '/master/channelProductRelation/updateIsActiveByIds',
    method: 'post',
    data
  })
}
/**
 * 通道管理-- 全部修改-更新通道下关联的产品是否启用
 * @returns
 */
export function updateAllChannelProductRelationActiveByChannelId({ channelId, isActive }) {
  return request({
    url:
      tempBase +
      `/master/channelProductRelation/updateIsActiveByChannelId/${channelId}?isActive=${isActive}`,
    method: 'post'
  })
}

// 通道是否已关联该产品
export function existsChannelProductRelation(data) {
  return request({
    url: tempBase + '/master/channelProductRelation/isExistChannelProductRelation',
    method: 'post',
    data
  })
}

/**
 * 通道管理-- 解绑-删除当前通道产品关联数据
 * @returns
 */
export function deleteChannelProductRelationById(data) {
  return request({
    url: tempBase + '/master/channelProductRelation/deleteChannelProductRelationById?id=' + data,
    method: 'post'
  })
}
/**
 * 通道管理-- 批量解绑-批量删除当前通道下关联的产品数据
 * @returns
 */
export function deleteBatchChannelProductRelation(data) {
  return request({
    url: tempBase + '/master/channelProductRelation/deleteBatchChannelProductRelation',
    method: 'post',
    data
  })
}

// 通过租户ID获取通道信息
export function getChannelByTenantId(tenantId) {
  store.commit('app/setLoadingEnable', false)
  return request({
    url: tempBase + `/master/channel/getChannelListByTenantId/${tenantId}`,
    method: 'get'
  })
}

// 根据通道ID获取商户列表
export function getMerchantListByChannelIdTest(channelId) {
  return request({
    url: tempBase + `/master/merchant/getMerchantListByChannelId/${channelId}`,
    method: 'get'
  })
}

// 根据通道ID获取码商列表
export function getProviderListByChannelIdForTest(channelId, params) {
  return request({
    url: tempBase + `/master/provider/getProviderListByChannelId/${channelId}`,
    method: 'get',
    params
  })
}

// 测试订单 代收
export function testCollectOrder(data) {
  return request({
    // url: tempBase + `/order/api/v1/collectOrder/testCollectOrder`,
    url: tempBase + `/order/TestCollectOrder`,
    method: 'post',
    data
  })
}

// 测试订单 代付
export function testPaymentOrder(data) {
  return request({
    // url: tempBase + `/order/api/v1/collectOrder/testCollectOrder`,
    url: tempBase + `/order/TestPaymentOrder`,
    method: 'post',
    data
  })
}

// 根据通道ID获取产品列表
export function getProductListByChannelId(channelId) {
  return request({
    url: tempBase + `/master/product/getProductListByChannelId/${channelId}`,
    method: 'get'
  })
}

// 导出通道列表信息
export function channelExport(data) {
  return request({
    url: tempBase + `/master/channel/export`,
    method: 'post',
    data,
    responseType: 'blob'
  })
}


/**
 * 通道管理-- 修改通道是否码商优先
 * @param {*} channelId 
 * @param {*} data  { isOwnFirst } 0-否，1-是
 * @returns 
 */
export function updateIsOwnFirstById(channelId, isOwnFirst) {
  store.commit('app/setLoadingEnable', false)
  return request({
    url: tempBase + `/master/channel/updateIsOwnFirstById/${channelId}`,
    method: 'post',
    params: { isOwnFirst },
  })
}


/**
 * 只是修改通道下指定产品的权重
 * @param {*} param0 
 * 
 * weight 0 1 
 * @returns 
 */
export function updateChannelProductRelationWeight({id, weight}) {
  store.commit('app/setLoadingEnable', false)
  return request({
    url: tempBase + `/master/channelProductRelation/updateWeightById/${id}?weight=${weight}`,
    method: 'post',
  })
}
