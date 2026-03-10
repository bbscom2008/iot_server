import request from '@/utils/request'

// const tempBase = '/'
const tempBase = ''




// 分页查询码商权限
export function getAuthList({ pageNum, pageSize }, data) {
  return request({
    url: tempBase + `/master/provider/getProviderPermissionListPage?pageNum=${pageNum}&pageSize=${pageSize}`,
    method: 'post',
    data
  })

}


// 修改码商权限
export function updateAuth(data) {
  return request({
    url: tempBase + `/master/provider/updateProviderPermission`,
    method: 'post',
    data
  })
}

// 全部修改码商权限
export function updateAllAuth( data) {
  return request({
    url:`/master/provider/allUpdateProviderPermission`,
    method: 'post',
    data
  }) 
}

// 批量修改码商权限
export function updateBatchAuth( data) {
  return request({
    url: tempBase + `/master/provider/batchUpdateProviderPermission`,
    method: 'post',
    data
  }) 
}
// 导出码商权限信息
export function exportProviderPermissionList( data) {
  return request({
    url:`/master/provider/exportProviderPermissionList`,
    method: 'post',
    data,
    responseType: 'blob'
  }) 
}