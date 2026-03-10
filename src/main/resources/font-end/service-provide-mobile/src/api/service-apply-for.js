import request from '@/utils/request'

/*
 * 提现申请
 */

// 分页查询码商提现申请列表
export function getWithdrawApplyPage(data, { pageNum, pageSize }) {
  return request({
    url: `/finance/provide/getProviderWithdrawalPage?pageNum=${pageNum}&pageSize=${pageSize}`,
    method: 'post',
    data
  })
}

// 新增码商提现申请
export function addWithdrawApply(data) {
  return request({
    url: `/finance/provide/withdrawal/add`,
    method: 'post',
    data
  })
}

// 审核驳回/审核通过/码商提现申请
export function auditWithdrawApply(data) {
  return request({
    url: `/finance/provide/withdrawal/audit`,
    method: 'post',
    data
  })
}
