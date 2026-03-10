
import { ColumnType } from '@/views/my-tools/constant-gcode'


const columns = `

序号	index
代理账号	user_name
代理名称	user_nick_name
商户账号	tenant_name
商户名称	tenant_admin_user_name
商户可用余额	available_balance
商户冻结金额	freeze_balance
创建时间	create_time
过期时间	expire_time
操作	opt


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
