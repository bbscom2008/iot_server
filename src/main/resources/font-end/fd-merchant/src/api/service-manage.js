import request from '@/utils/request'

/**
 * 系统管理---分页查询租户配置
 * @returns 
 */
export function getTenantConfigPage(params) {
  return request({
    url:`/master/system/tenant/getTenantConfigPage`,
    method: 'post',
    params
  })
}
