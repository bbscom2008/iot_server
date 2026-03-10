import request from '@/utils/request'

const tempBase = ''

/**
 * 机器人用户分页查询
 */
export function getBotBindGroupRelationPage({pageNum,pageSize}, data) {
  return request({
    url: `/bot/botBindGroupRelation/getBotBindGroupRelationPage?pageNum=${pageNum}&pageSize=${pageSize}`,
    method: 'post',
    data: data
  })
}
