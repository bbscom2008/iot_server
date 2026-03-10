import request from '@/utils/request'
import store from '@/store'
// 
// const tempBase = '/'
// const tempBase = '/myserver'
const tempBase = ''

//分页查询码商
export function getServiceList({pageNum,pageSize}, data) {
  return request({
    url: `${tempBase}/master/provider/getProviderPage?pageNum=${pageNum}&pageSize=${pageSize}`,
    method: 'post',
    data: data
  })

}

// 新增码商
export function addService(data) {
  return request({
    url: `${tempBase}/master/provider/add`,
    method: 'post',
    data: data
  }) 
}
// 修改码商
export function updateSingleProvider(data) {
  return request({
    url: `${tempBase}/master/provider/updateSingleProvider`,
    method: 'post',
    data: data
  }) 
}

// 复制码商
export function copyService(data) {
  return request({
    url: `${tempBase}/master/provider/copy`,
    method: 'post',
    data: data
  })
}


// 是否启用码商
export function isActiveService(providerId, isActive) {
  return request({
    url: `${tempBase}/master/provider/isActive/${providerId}?isActive=${isActive}`,
    method: 'get',
  }) 
}


// 通过租户ID获取码商信息（下拉框）
export function getServiceListByTenantId(tenantId) {
  return request({
    url: `${tempBase}/master/provider/getProviderOptionList/${tenantId}`,
    method: 'get', 
  })  
}
// 通过租户ID获取码商信息不包含子级（下拉框）-----修改的时候
export function getProviderOptionListExcludeChildren(tenantId,params) {
  return request({
    url: `${tempBase}/master/provider/getProviderOptionListExcludeChildren/${tenantId}`,
    method: 'get', 
    params
  })  
}


// 通过租户ID获取码商信息（下拉框）
export function getProviderOptionList(tenantId) {
  return request({
    url: `${tempBase}/master/provider/getProviderOptionList/${tenantId}`,
    method: 'get', 
  })  
}
// 通过租户ID和产品ID获取码商信息（下拉框）
export function getProviderOptionListByProductId(data) {
  store.commit('app/setLoadingEnable', false)
  return request({
    url: `${tempBase}/master/provider/getProviderOptionListByProductId`,
    method: 'post', 
    data
  })  
}


// 通过码商ID获取产品信息（下拉框）
export function getProductListByProviderId(providerId) {
  return request({
    url: `${tempBase}/master/ProviderProductRelation/getProductListByProviderId/${providerId}`,
    method: 'get'
  }) 
}

// 通过码商userId获取产品信息（下拉框）
export function getProductListByUserId(userId) {
  return request({
    url: `${tempBase}/master/ProviderProductRelation/getProductListByProviderUserId/${userId}`,
    method: 'get'
  }) 
}



// 全部修改码商
export function updateAllService( data) {
  return request({
    url: `${tempBase}/master/provider/updateProvider`,
    method: 'post',
    data: data
  })
}


// 批量修改码商
export function updateBatchService(data) {
  return request({
    url: `${tempBase}/master/provider/batchUpdateProvider`,
    method: 'post',
    data: data
  }) 
}


//---------------下面三个接口，多个地方共用-----------------------------------------------

//  用户账户余额变动
export function adjustAvailableBalance(data) {
  return request({
    url: `${tempBase}/master/userAccount/availableBalance`,
    method: 'post',
    data: data
  }) 
}

//   冻结金额变动
export function adjustFreezeBalance(data) {
  return request({
    url: `${tempBase}/master/userAccount/freezeBalance`,
    method: 'post',
    data: data
  })
}

//  最低接单金额变动
export function adjustMinAllowableCollectAmount(data) {
  return request({
    url: `${tempBase}/master/userAccount/minAllowableCollectAmount`,
    method: 'post',
    data: data
  })
}


// 代收押金金额变动
export function adjustDepositAmount(data) {
  return request({
    url: `${tempBase}/master/userAccount/collectDeposit`,
    method: 'post',
    data: data 
  }) 
}



//判断码商名称是否存在
export function isExistProviderName(providerName) {
  store.commit('app/setLoadingEnable', false)
  return request({
    url: `${tempBase}/master/provider/isExistProviderName/${providerName}`,
    method: 'get'
  })
}
//判断码商账号是否存在
export function isExistProviderUserName(tenantId,params) {
  store.commit('app/setLoadingEnable', false)
  return request({
    url: `${tempBase}/master/provider/isExistProviderUserName/${tenantId}`,
    method: 'get',
    params
  })
}
//查询码商祖级
export function getProviderLevel(providerId) {
  return request({
    url: `${tempBase}/master/provider/getProviderLevel/${providerId}`,
    method: 'get'
  })
}
//重置码商登录密码
export function resetProviderSecretKey(userId) {
  return request({
    url: `${tempBase}/master/provider/resetProviderSecretKey/${userId}`,
    method: 'get'
  })
}
//重置码商谷歌密钥
export function resetProviderGoogleAuthKey(userId) {
  return request({
    url: `${tempBase}/master/provider/resetProviderGoogleAuthKey/${userId}`,
    method: 'get'
  })
}

//平台端余额划拨时获取下级码商的用户信息（下拉框）
export function getPlatFromProviderByProviderId(tenantId,params) {
  return request({
    url: `${tempBase}/master/provider/getPlatFromProviderByProviderId/${tenantId}`,
    method: 'get',
    params
  })
}

/**
 * 余额划拨
 * @returns 
 */
export function transferBalance(data) {
  return request({
    url: '/master/userAccount/transfer',
    method: 'post',
    data
  })
}
/**
 * 删除码商
 * @returns 
 */
export function providerDelete(providerId) {
  return request({
    url:`/master/provider/delete/${providerId}`,
    method: 'get'
  })
}

// 根据ID获取码商详情信息
export function getProviderInfoDetailByProviderId(providerId) {
  return request({
    url: `${tempBase}/master/provider/${providerId}`,
    method: 'get'
  }) 
}

// 获取码商最顶级，如果没有，获取自身
export function getProviderTop(providerId) {
  return request({
    url: `${tempBase}/master/provider/getTopProviderByProviderId/${providerId}`,
    method: 'get'
  })
}


// 更新代收代付业务状态
export function updateCollectPayStatus(data) {
  return request({
    url: `${tempBase}/master/provider/getOrUpdateCollectAndPayment/${data.userId}?isCollectEnable=${data.isCollectEnable==1}&isPaymentEnable=${data.isPaymentEnable==1}`,
    method: 'get',
  })
}


// 全部码商添加产品数据
// export function allProvideAddProduct(data) {
//   return request({
//     url: `${tempBase}/master/ProviderProductRelation/allUpdateProviderProductData`,
//     method: 'post',
//     data: data 
//   }) 
// }


// 批量码商添加产品数据
// export function patchProvideAddProduct(data) {
//   return request({
//     url: `${tempBase}/master/ProviderProductRelation/batchUpdateProviderProductData`,
//     method: 'post',
//     data: data 
//   }) 
// }

// 全部 批量 码商 添加 产品
export function patchAllProvideAddProduct(data) {
  return request({
    url: `${tempBase}/master/ProviderProductRelation/createProvidersAndProducts`,
    method: 'post',
    data: data 
  }) 
}


// 批量解锁用户
export function patchUnlockUser(userIdList) {
  return request({
    url: `${tempBase}/master/system/user/batchUnlockUser?userIdList=${userIdList}`,
    method: 'get',
  }) 
}
// 码商列表统计:(选择平台下汇总)码商总数、可用余额总和、冻结余额总和
export function getProviderSum(data) {
  return request({
    url: `${tempBase}/master/provider/getProviderSum`,
    method: 'post',
    data
  }) 
}
// 根据租户ID获取码商最小允许接单的代收金额
export function getProviderMinAllowableCollectAmount(tenantId) {
  return request({
    url: `${tempBase}/master/provider/getProviderMinAllowableCollectAmount/${tenantId}  `,
    method: 'get'
  })
}
// 导出码商列表信息
export function providerExport(data) {
  return request({
    url: `${tempBase}/master/provider/export`,
    method: 'post',
    data,
    responseType: 'blob'
  })
}

// 全部修改 一级 码商
export function updateAllOneLevelService(data) {
  return request({
    url: `${tempBase}/master/provider/updateFirstLevel`,
    method: 'put',
    data
  })
}

// 全部 一级 码商 添加 产品
export function patchAllOneLevelProvideAddProduct(data) {
  return request({
    url: `${tempBase}/master/ProviderProductRelation/allFirstLevelProviderAddProduct`,
    method: 'post',
    data: data
  })
}