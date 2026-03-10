
import { ColumnType } from '@/views/my-tools/constant-gcode'


/**
 * 平台 日 报表
 */


const columns = `

序号	index
产品类型名称	product_type_name
平台名称	platform_name
统计日期	tongji_date
订单数量	order_number
订单金额	order_money
成功订单数	succ_order_count
成功订单金额	succ_order_money
实付金额	shifu_money
成功率	succ_lv
系统费用	system_cost
商户费用	merchant_cost
码商费用	provider_cost
平台利润	platform_lirun

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
