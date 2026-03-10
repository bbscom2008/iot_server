import request from '@/utils/request'

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
    url: `${tempBase}/master/provider`,
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


// 通过租户ID获取码商信息（下拉框）
export function getProviderOptionList(tenantId) {
  return request({
    url: `${tempBase}/master/provider/getProviderOptionList/${tenantId}`,
    method: 'get', 
  })  
}


// 全部修改码商
export function updateAllService(tenantId, data) {
  return request({
    url: `${tempBase}/master/provider/updateProviderByTenantId/${tenantId}`,
    method: 'post',
    data: data
  })
}


// 批量修改码商
export function updateBatchService(tenantId, data) {
  return request({
    url: `${tempBase}/master/provider/batchUpdateProvider/${tenantId}`,
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