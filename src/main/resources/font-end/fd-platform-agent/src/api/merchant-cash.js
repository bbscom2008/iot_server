import request from '@/utils/request'
//提现管理

/**
 * 分页查询租户代理提现申请列表
 * @returns 
 */
export function tenantAgentWithdrawalPage(data) {
  return request({
    url: '/finance/tenantAgent/withdrawal/page',
    method: 'post',
    data
  })
}

/**
 * 新增租户代理提现申请
 * @returns 
 */
export function tenantAgentWithdrawalAdd(data) {
  return request({
    url: '/finance/tenantAgent/withdrawal/add',
    method: 'post',
    data
  })
}
/**
 * 审核驳回-审核通过-租户代理提现申请
 * @returns 
 */
export function tenantAgentWithdrawalAudit(data) {
  return request({
    url: '/finance/tenantAgent/withdrawal/audit',
    method: 'get',
    data
  })
}

/**
 * 分页查询租户提现申请列表
 * @returns 
 */
export function tenantWithdrawalPage(data) {
    return request({
      url: '/finance/tenant/withdrawal/page',
      method: 'post',
      data
    })
  }
/**
 * 新增租户提现申请
 * @returns 
 */
export function tenantWithdrawalAdd(data) {
    return request({
      url: '/finance/tenant/withdrawal/add',
      method: 'post',
      data
    })
  }
/**
 * 审核驳回-审核通过-租户提现申请
 * @returns 
 */
export function tenantWithdrawalAudit(data) {
    return request({
      url: '/finance/tenant/withdrawal/audit',
      method: 'get',
      data
    })
  }
  
/**
 * 分页查询商户代理提现申请列表
 * @returns 
 */
export function merchantAgentWithdrawalPage(data) {
    return request({
      url: '/finance/merchantAgent/withdrawal/page',
      method: 'post',
      data
    })
  }
/**
 * 新增商户代理提现申请
 * @returns 
 */
export function merchantAgentWithdrawalAdd(data) {
    return request({
      url: '/finance/merchantAgent/withdrawal/add',
      method: 'post',
      data
    })
  }
/**
 * 审核驳回-审核通过-商户代理提现申请
 * @returns 
 */
export function merchantAgentWithdrawalAudit(data) {
    return request({
      url: '/finance/merchantAgent/withdrawal/audit',
      method: 'get',
      data
    })
  }



/**
 * 分页查询商户提现申请列表
 * @returns 
 */
export function merchantWithdrawalPage(data) {
    return request({
      url: '/finance/merchant/withdrawal/page',
      method: 'post',
      data
    })
  }
/**
 * 新增商户提现申请
 * @returns 
 */
export function merchantWithdrawalAdd(data) {
    return request({
      url: '/finance/merchant/withdrawal/add',
      method: 'post',
      data
    })
  }
/**
 * 审核驳回-审核通过-商户提现申请
 * @returns 
 */
export function merchantWithdrawalAudit(data) {
    return request({
      url: '/finance/merchant/withdrawal/audit',
      method: 'get',
      data
    })
  }
/**
 * 分页查询码商提现申请列表
 * @returns 
 */
export function provideWithdrawalPage(data) {
    return request({
      url: '/finance/provide/withdrawal/page',
      method: 'post',
      data
    })
  }
/**
 * 新增码商提现申请
 * @returns 
 */
export function provideWithdrawalAdd(data) {
    return request({
      url: '/finance/provide/withdrawal/add',
      method: 'post',
      data
    })
  }
/**
 * 审核驳回-审核通过-码商提现申请
 * @returns 
 */
export function provideWithdrawalAudit(data) {
    return request({
      url: '/finance/provide/withdrawal/audit',
      method: 'get',
      data
    })
  }
