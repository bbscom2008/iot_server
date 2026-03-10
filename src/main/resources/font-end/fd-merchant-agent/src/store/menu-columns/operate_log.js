
import { ColumnType } from '@/views/my-tools/constant-gcode'


const columns = `

序号	index
系统模块	system_module
操作类型	handle_type
操作人员	handle_person
操作地址	handle_address
操作状态	handle_status
操作时间	handle_time

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
