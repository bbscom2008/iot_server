
import { ColumnType } from '@/views/my-tools/constant-gcode'


/**
 * 平台 日 报表
 */


const columns = `

选择框	selection
序号	index
用户名	tenant_name
商户昵称	merchant_nickname
用户类型	user_type
可用余额	available_balance
冻结金额	freeze_balance
代收押金	income_yajin
商户号	merchant_num
商户密钥	merchant_key
是否启用	is_active
备注信息	remark
创建时间（自动生成）	create_time
更新时间（自动更新）	update_time


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
