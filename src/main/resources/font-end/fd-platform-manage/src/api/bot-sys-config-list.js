import request from '@/utils/request'

const tempBase = ''

/**
 * 分页查询机器人系统配置
 */
export function getBotSysConfigPage({ pageNum, pageSize }, data) {
  return request({
    url: `/bot/botSysConfig/getBotSysConfigPage?pageNum=${pageNum}&pageSize=${pageSize}`,
    method: 'post',
    data
  })
}

/**
 * 更新机器人系统配置（暂时只能更新ConfigValue）
 */
export function botSysConfigUpdate(data) {
  return request({
    url: `/bot/botSysConfig/update`,
    method: 'post',
    data
  })
}

/**
 * 机器人重新注册
 */
export function botRegisterAgain(tenantId) {
  return request({
    url: `/bot/botSysConfig/botRegisterAgain/${tenantId}`,
    method: 'post'
  })
}


/**
 * 新增配置
 *  
 */
export function addBotConfig(data) {
  return request({
    url: `/bot/botSysConfig/add`,
    method: 'post',
    data
  })
}


/**
 * 删除配置
 */
export function deleteBotConfig(botConfigId) {
  return request({
    url: `/delete/${botConfigId}`,
    method: 'get',
  })
}



