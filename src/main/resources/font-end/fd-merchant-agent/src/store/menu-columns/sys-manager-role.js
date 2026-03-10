
import { ColumnType } from '@/views/my-tools/constant-gcode'


const columns = `

序号	index
角色名称	role_name
角色编码	role_code
是否启用	is_active
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
