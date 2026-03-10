
import { ColumnType } from '@/views/my-tools/constant-gcode'


/**
 * 平台 日 报表
 */


const columns = `

序号	index
通道名称	channel_name
通道编码	channel_code
交易类型	trade_type
金额限制类型	limit_type
金额值	money
是否启用	is_active
是否访问收银台后才匹配订单	is_march_order_after_visit
备注	remark




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
