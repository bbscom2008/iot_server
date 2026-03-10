import request from '@/utils/request'
import store from '@/store'

// 
// const tempBase = '/'
const tempBase = ''
// const tempBase = '/myserver'

// 创建收银台模板
export function createTemplate(data) {
  return request({
    url: tempBase + '/master/templates',
    method: 'post',
    data
  })
}

// 修改模板配置
//  type  的  值  ：  base
//  /**
//      * 基础
//      */
//  BASE("base"),

//  /**
//   * 组件
//   */
//  COMPONENT("component"),

//  /**
//   * 提交
//   */
//  SUBMIT("submit"),

//  /**
//   * 文本
//   */
//  TEXT("text"),

//  /**
//   * 按钮
//   */
//  BUTTON("button"),

//  /**
//   * 二维码
//   */
//  QR("qr"),

//  /**
//   * 文件
//   */
//  FILE("file");
export function updateTemplate(cashTemplateId, data, types) {
  return request({
    url: tempBase + `/master/templates?cashTemplateId=${cashTemplateId}&types=${types}`,
    method: 'put',
    data
  })
}

// 删除收银台模板
export function deleteTemplate(cashTemplateId) {
  return request({
    url: tempBase + `/master/templates?cashTemplateId=${cashTemplateId}`,
    method: 'delete'
  })
}

// 分页查询收银台模板列表
export function getTemplateList({ pageNum, pageSize }, data) {
  return request({
    url: tempBase + `/master/templates/getCashTemplateListPage?pageNum=${pageNum}&pageSize=${pageSize}`,
    method: 'post',
    data
  })
}

// 复制模板
export function copyTemplate(cashTemplateId) {
  return request({
    url: tempBase + `/master/templates/copy?cashTemplateId=${cashTemplateId}`,
    method: 'post'
  })
}

// 获取收银台模板配置信息
export function getTemplateInfo(cashTemplateId) {
  return request({
    url: tempBase + `/master/templates/${cashTemplateId}`,
    method: 'get'
  }) 
}

// 检查收银台模板名称是否唯一
export function checkTemplateNameUnique(cashTemplateName) {
  store.commit('app/setLoadingEnable', false)
  return request({
    url: tempBase + `/master/templates/checkTempleNameUnique?cashTemplateName=${cashTemplateName}`,
    method: 'get'
  }) 
}


// 检查相同按钮参数是否唯一
// export function checkButtonParamUnique(cashTemplateId, paramCode) {
//   return request({
//     url: tempBase + `/templates/checkButtonParamUnique?cashTemplateId=${cashTemplateId}&paramCode=${paramCode}`,
//     method: 'post'
//   }) 
// }


// 获取所有收银台模板
export function getAllTemplate(tenantId) {
  return request({
    url: tempBase + `/master/templates/getAllCashTemplate/${tenantId}`,
    method: 'get'
  }) 
}

// 校验修改收银台模板配置权限
export function checkTemplateUpdatePermission(cashTemplateId) {
  return request({
    url: tempBase + `/master/templates/checkUpdatePermission/${cashTemplateId}`,
    method: 'get'
  }) 
}