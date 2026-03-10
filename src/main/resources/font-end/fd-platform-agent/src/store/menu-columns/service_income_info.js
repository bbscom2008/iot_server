
import { ColumnType } from '@/views/my-tools/constant-gcode'


/**
 * 平台 日 报表
 */


const columns = `
序号	index
码商名称	product_name
匹配结果	pipei_result
结果说明	result_info
匹配时间	pipei_time


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
