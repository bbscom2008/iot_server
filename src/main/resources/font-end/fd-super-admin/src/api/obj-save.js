import request from '@/utils/request'

// const tempBase = '/myserver'
// const tempBase = '/'
const tempBase = ''

// 分页查询对象存储配置
export function getObjSavePage(page, data) {
  return request({
    url:
      tempBase +
      `/master/system/oss/getSysOssConfigPage?pageNum=${page.pageNum}&pageSize=${page.pageSize}`,
    method: 'post',
    data
  })
}

//新增对象存储配置信息
export function addObjSave(data) {
  return request({
    url: tempBase + '/master/system/oss',
    method: 'post',
    data
  })
}

// 修改对象存储配置信息
export function updateObjSave(data) {
  return request({
    url: tempBase + '/master/system/oss',
    method: 'put',
    data
  })
}

// 根据ID获取对象存储配置信息
export function getObjSaveById(sysOssConfigId) {
  return request({
    url: tempBase + `/master/system/oss/${sysOssConfigId}`,
    method: 'get'
  })
}

// 删除对象存储配置信息
export function deleteObjSave(sysOssConfigId) {
  return request({
    url: tempBase + `/master/system/oss/${sysOssConfigId}`,
    method: 'delete'
  })
}

// 获取所有对象存储配置信息
export function getAllObjSave() {
  return request({
    url: tempBase + '/master/system/oss/getAllSysOssConfig',
    method: 'get'
  })
}

// 修改是否启用对象存储
export function updateObjSaveStatus(sysOssConfigId, isActive) {
  return request({
    url: tempBase + `/master/system/oss/updateIsActive/${sysOssConfigId}`,
    method: 'post',
    params: {
      isActive
    }
  })
}


// 获取所有对象存储配置信息
export function getAllObjSaveType() {
  return request({
    url: tempBase + '/master/system/oss/getAllSysOssConfig',
    method: 'get'
   }) 
}