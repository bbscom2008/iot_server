
import { ColumnType } from '@/views/my-tools/constant-gcode'


const columns = `

多选框	selection
租户名称	tenant_name
产品类型名称	type_name
系统费率	system_fee
是否启用	is_active
操作	operation
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
