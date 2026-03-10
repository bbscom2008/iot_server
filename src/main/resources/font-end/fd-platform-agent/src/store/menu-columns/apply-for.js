
import { ColumnType } from '@/views/my-tools/constant-gcode'


/**
 * 平台 日 报表
 */


const columns = `

用户名	user_name
用户昵称	user_nick_name
提现金额	withdrawal_apply_amount
提现收款信息	payee_info
提现状态	withdrawal_apply_status
提现说明	withdrawal_apply_desc
审核状态	audit_status
审核说明	audit_desc
备注信息	remark
创建时间	create_time
更新时间	update_time


`

function getColumns() {
 let ttt =   columns.split('\n').filter(el=>el.trim().length>0).map((item, index) => {

    let kvs = item.split('\t')
    return {
      title: kvs[0].trim(),
      type: ColumnType.string,
      key: kvs[1].trim(),
      isSearch: false
    }
  })

  // console.log('-getColumns-tt---', ttt);
  return ttt
  
}

export const columnList = getColumns()
