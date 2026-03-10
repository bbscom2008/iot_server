import request from '@/utils/request'
import store from '@/store'
// const tempBase = '/myserver'
const tempBase = ''

// 分页查询联接类型-分页查询
export function getLinkTypePage(page, data) {
  return request({
    url:
      tempBase +
      `/master/linkType/getLinkTypePage?pageNum=${page.pageNum}&pageSize=${page.pageSize}`,
    method: 'post',
    data
  })
}
// 查询所有产品类型信息（下拉框）--不区分平台
export function getProductTypeList() {
  return request({
    url: tempBase + `/master/productType/getProductTypeList`,
    method: 'get'
  })
}
// 更新联接类型
export function linkTypeUpdate(data) {
  return request({
    url: tempBase + `/master/linkType/update`,
    method: 'post',
    data
  })
}
// 新增联接类型
export function linkTypeAdd(data) {
  return request({
    url: tempBase + `/master/linkType/add`,
    method: 'post',
    data
  })
}
// 删除联接类型
export function linkTypeDelete(linkTypeId) {
  return request({
    url: tempBase + `/master/linkType/delete/${linkTypeId}`,
    method: 'get'
  })
}
// 是否启用
export function linkTypeEnable(linkTypeId,params) {
  return request({
    url: tempBase + `/master/linkType/enable/${linkTypeId}`,
    method: 'get',
    params
  })
}
