
import { ColumnType } from '@/views/my-tools/constant-gcode'


const columns = `

序号	index
用户名称	user_name
用户昵称	user_nick_name
是否启用	is_active
角色	roles
备注	remark
创建时间	create_time
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
