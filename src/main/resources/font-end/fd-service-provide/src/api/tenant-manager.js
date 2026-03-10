import request from '@/utils/request'
//租户管理

/*
 * 租户代理-分页查询
 */

export function tenantAgentPage() {
  return request({
    url: '/tenantAgent/page',
    method: 'post',
  })
}
/*
 * 租户代理--复制
 */

export function tenantAgentPage2() {
  return request({
    url: '/master/tenantAgent/copy',
    method: 'post',
  })
}
/*
 * 租户列表-分页查询
 */

export function tenantPage() {
  return request({
    url: '/tenant/page',
    method: 'post',
  })
}
/*
 * 租户列表-复制
 */

export function tenantCopy() {
  return request({
    url: '/master/tenant/copy',
    method: 'post',
  })
}
/*
 * 产品类型-分页查询
 */

export function tenantProductType() {
  return request({
    url: '/productType',
    method: 'get',
  })
}
/*
 * 租户团队报表-分页查询
 */

export function tenantTeamReportPage() {
  return request({
    url: '/tenantTeamReport/page',
    method: 'get',
  })
}
/*
 * 租户团队报表-获取汇总信息
 */

export function tenantTeamReportSummary() {
  return request({
    url: '/tenantTeamReport/summary',
    method: 'post',
  })
}
