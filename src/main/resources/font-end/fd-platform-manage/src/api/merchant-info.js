import request from '@/utils/request'
import store from '@/store'


//商户代理管理

const tempBase = ''
// const tempBase = '/myserver'

// 分页查询获取商户列表
export function merchantAgentPage({ pageNum, pageSize }, data) {
  return request({
    url: `${tempBase}/master/merchant/getMerchantListPage?pageNum=${pageNum}&pageSize=${pageSize}`,
    method: 'post',
    data
  })
}

// 获取商户下拉列表 (当前租户下的)
export function getMerchantList(data) {
  return request({
    url: `${tempBase}/master/merchant/getMerchantListByTenantId`,
    method: 'post',
    data
  })
}

// 创建商户
export function createMerchant(data) {
  return request({
    url: `${tempBase}/master/merchant/createMerchant`,
    method: 'post',
    data
  })
}
// 复制商户
export function copyMerchant(data) {
  return request({
    url: `${tempBase}/master/merchant/copyMerchant`,
    method: 'post',
    data
  })
}

// 更新商户
export function updateMerchant(data) {
  return request({
    url: `${tempBase}/master/merchant/updateMerchant`,
    method: 'post',
    data
  })
}

// 根据商户ID删除商户
export function deleteMerchant(merchantId) {
  return request({
    url: `${tempBase}/master/merchant/deleteMerchantByMerchantId/${merchantId}`,
    method: 'get'
  })
}

//全部批量结算
export function settleAll(data) {
  return request({
    url: `${tempBase}/finance/settlement/allSettlement`,
    method: 'post',
    data
  })
}

// 商户结算
export function settleMerchant(merchantId) {
  return request({
    url: `${tempBase}/finance/settlement/${merchantId}`,
    method: 'post'
  })
}

// 批量修改商户启用状态
export function updateMerchantActiveStatus(data) {
  return request({
    url: `${tempBase}/master/merchant/batchUpdateMerchantIsActive`,
    method: 'post',
    data
  })
}

// 全量修改商户激活状态 全量修改商户启用状态
export function updateMerchantActiveStatusAll(isActive, tenantId) {
  return request({
    url: `${tempBase}/master/merchant/allUpdateMerchantIsActive?isActive=${isActive}&tenantId=${tenantId}`,
    method: 'post'
  })
}

// 是否启用商户 是否启用商户
export function updateMerchantIsActive(merchantId, isActive) {
  return request({
    url: `${tempBase}/master/merchant/updateMerchantIsActive/${merchantId}?isActive=${isActive}`,
    method: 'get'
  })
}

// 获取商户开户信息
export function getMerchantBankInfo(merchantId, tenantId) {
  return request({
    url: `${tempBase}/master/merchant/getMerchantOpenInfoByMerchantId/${merchantId}?tenantId=${tenantId}`,
    method: 'post',
  })
}

// 重置商户密钥
export function resetMerchantSecretKey(merchantId) {
  return request({
    url: `${tempBase}/master/merchant/resetMerchantSecret/${merchantId}`,
    method: 'post'
  })
}

// 重置登录密码
export function resetMerchantLoginPassword(merchantId) {
  return request({
    url: `${tempBase}/master/merchant/resetLoginPassword/${merchantId}`,
    method: 'post'
  })
}

// 重置谷歌密钥
export function resetMerchantGoogleSecret(merchantId) {
  return request({
    url: `${tempBase}/master/merchant/resetGoogleSecret/${merchantId}`,
    method: 'post'
  })
}


//分页查询指定码商列表
export function getMerchantListByTenantId( { pageNum, pageSize}, data) {
  return request({
    url: `${tempBase}/master/merchantProviderRelation/getMerchantProviderRelationPage?pageNum=${pageNum}&pageSize=${pageSize}`,
    method: 'post',
    data
  })
}

// 商户指定码商
export function addMerchantProviderRelation(data) {
  return request({
    url: `${tempBase}/master/merchantProviderRelation`,
    method: 'post',
    data
  }) 
}

// 删除商户码商关联关系
export function deleteMerchantProviderRelation(id) {
  return request({
    url: `${tempBase}/master/merchantProviderRelation/${id}`,
    method: 'delete'
  })
}

// 解绑选中的码商 批量删除商户码商关联关系
export function deleteMerchantProviderRelationBatch(ids) {
  // return request({
  //   url: `${tempBase}/merchantProviderRelation/batchDelete`,
  //   method: 'post',
  //   data
  // })
  return request({
    url: `${tempBase}/master/merchantProviderRelation/deleteBath`,
    data: ids,
    method: 'post'
  })


}

// 判断商户码商关联关系是否存在
export function isMerchantProviderRelationExist(merchantId, providerId) {
  store.commit('app/setLoadingEnable', false)
  return request({
    url: `${tempBase}/master/merchantProviderRelation/existsMerchantProviderRelation`,
    method: 'get',
    params: { merchantId, providerId }
  })
}

// 解绑所有的码商 根据商户ID删除所有码商关联关系 全量删除商户码商关联关系
export function deleteMerchantProviderRelationAll(merchantId) {
  return request({
    url: `${tempBase}/master/merchantProviderRelation/deleteAll/${merchantId}`,
    method: 'delete'
  })
}

// 分页查询当前商户下相关联的通道数据
export function getMerchantChannelPage({ pageNum, pageSize }, data) {
  return request({
    url: `${tempBase}/master/MerchantChannelRelation/getChannelMerchantRelationPage?pageNum=${pageNum}&pageSize=${pageSize}`,
    method: 'post',
    data
  }) 
}

// 创建通道与商户关联
export function addMerchantChannelRelation(data) {
  return request({
    url: `${tempBase}/master/MerchantChannelRelation/createChannelMerchantRelRelation`,
    method: 'post',
    data
   })
}
// 创建通道与商户关联--通道列表
export function createChannelMerchantRelation(data) {
  return request({
    url: `${tempBase}/master/MerchantChannelRelation/createChannelMerchantRelation`,
    method: 'post',
    data
   })
}

// 修改单条商户通道关联的数据
export function updateMerchantChannelRelation(data) {
  return request({
    url: `${tempBase}/master/MerchantChannelRelation/updateChannelMerchantRelationById`,
    method: 'post',
    data
  }) 
}

// 单条删除当前商户下相关联的通道
export function deleteMerchantChannelRelation(id) {
  return request({
    url: `${tempBase}/master/MerchantChannelRelation/deleteChannelMerchantRelationById/${id}`,
    method: 'post'
    })
}

// 更新当前商户下所有的通道费率信息
export function updateMerchantChannelRelationAll(data) {
  return request({
    url: `${tempBase}/master/MerchantChannelRelation/updateAllChannelMerchantRelationByMerchantId`,
    method: 'post',
    data
  })
}

// 批量更新当前商户下关联的通道信息
export function updateMerchantChannelRelationBatch(data) {
  return request({
    url: `${tempBase}/master/MerchantChannelRelation/updateBatchChannelMerchantRelation`,
    method: 'post',
    data
  })
}

// 批量删除关联的通道数据
export function deleteMerchantChannelRelationBatch(ids) {
  return request({
    url: `${tempBase}/master/MerchantChannelRelation/deleteBatchChannelMerchantRelation`,
    method: 'post',
    data: [...ids] 
  }) 
}


// 商户端--获取商户信息
export function getMerchantInfo() {
  return request({
    url: `${tempBase}/master/merchant/getMerchantInfoDetailForMerchant`,
    method: 'get'
    })
}

// 通过商户代理id获取商户列表
export function getMerchantListByMerchantProxyId({ pageNum, pageSize }, data) {
  return request({
    url: `${tempBase}/master/merchant/getByMerchantAgentIdPage/${merchantAgentId}?pageNum=${pageNum}&pageSize=${pageSize}`,
    method: 'get',
    data 
  }) 
}

// 判断商户账号是否存在
export function isMerchantAccountExist(userName) {

  store.commit('app/setLoadingEnable', false)

  return request({
    url: `${tempBase}/master/merchant/existsMerchantName/${userName}`,
    method: 'get'
  }) 
}

// 查询商户白名单
export function getMerchantWhiteList(merchantId) {
  return request({
    url: `${tempBase}/master/merchantWhiteList/${merchantId}`,
    method: 'get',
  }) 
}



// 修改商户白名单
export function updateMerchantWhiteList(data) {
  return request({
    url: `${tempBase}/master/merchantWhiteList`,
    method: 'put',
    data: data
  })
}

// 获取所有反查配置
export function getMerchantReverseConfig() {
  return request({
    url: `${tempBase}/master/merchantReverseCheck/getAllReverseCheck`,
    method: 'get',
  }) 
}

// 根据商户id获取反查配置
export function getMerchantReverseConfigByMerchantId(merchantId) {
  return request({
    url: `${tempBase}/master/merchantReverseCheck/getReverseCheckByMerchantId/${merchantId}`,
    method: 'get',
  })  
}
// 更新商户反查配置
export function updateMerchantReverseConfig(data) {
  return request({
    url: `${tempBase}/master/merchantReverseCheck`,
    method: 'put',
    data: data
  }) 
}


// 批量 全部  商户添加通道
// 批量码商添加产品数据
export function patchAllMerchantAddChannel(data) {
  return request({
    url: `${tempBase}/master/MerchantChannelRelation/createMerchantsAndChannels`,
    method: 'post',
    data: data 
  }) 
}

// 商户结算记录
export function getSettleRecordListPage(data,params) {
  return request({
    url: `${tempBase}/finance/settlement/getSettleRecordListPage`,
    method: 'post',
    data: data ,
    params
  }) 
}
// 商户结算记录导出
export function exportSettleRecord(data) {
  return request({
    url: `${tempBase}/finance/settlement/exportSettleRecord`,
    method: 'post',
    data: data ,
    responseType: 'blob'
  }) 
}
// 商户列表导出
export function merchantExport(data) {
  return request({
    url: `${tempBase}/master/merchant/export`,
    method: 'post',
    data: data ,
    responseType: 'blob'
  }) 
}
// 商户列表统计: 商户总数、可用余额总和、冻结金额总和、预付商户金额总和
export function getMerchantSum(data) {
  return request({
    url: `${tempBase}/master/merchant/getMerchantSum`,
    method: 'post',
    data: data 
  }) 
}

// 商户批量结算
export function batchSettlement(merchantIdList) {
  return request({
    url: `${tempBase}/finance/settlement/batchSettlement`,
    method: 'post',
    data: {
      merchantIdList
    }
  }) 
}
// 分页查询当前通道下的商户通道关联关系
export function getMerchantPageByChannelId({ pageNum, pageSize }, data) {
  return request({
    url: `${tempBase}/master/MerchantChannelRelation/getMerchantPageByChannelId?pageNum=${pageNum}&pageSize=${pageSize}`,
    method: 'post',
    data
  }) 
}
// 全部更新当前通道下的所有商户通道关联关系
export function updateAllChannelMerchantRelationByChannelId(data) {
  return request({
    url: `${tempBase}/master/MerchantChannelRelation/updateAllChannelMerchantRelationByChannelId`,
    method: 'post',
    data
  })
}
// 根据通道ID获取未关联此通道的商户列表
export function getExcludeMerchantListByChannelId(channelId) {
  return request({
    url: `${tempBase}/master/merchant/getExcludeMerchantListByChannelId/${channelId}`,
    method: 'get',
  }) 
}

// (全量)批量修改商户的启用状态和通道费率
export function updateBatchMerchant(data) {
  return request({
    url: `${tempBase}/master/merchant/updateBatchMerchant`,
    method: 'post',
    data
  })
}