
import { ColumnType } from '@/views/my-tools/constant-gcode'


const columns = `

序号	index
产品类型名称	product_type_name
交易类型	trade_type
收银台模板	cash_page_template
是否为静态支付信息	is_payment_info_static
是否为自动确认订单	is_auto_confirm_order
是否启用	is_active
备注信息	remark
创建时间	create_time
更新时间	update_time



`

function getColumns() {
 let ttt =   columns.split('\n').filter(el=>el.trim().length>0).map((item, index) => {

    let kvs = item.split(/\s/)

    // console.log(item);
    // console.log(JSON.stringify(kvs));
    
    return {
      title: kvs[0].trim(),
      type: ColumnType.string,
      key: kvs[1].trim(),
      isSearch: false
    }
  })

  console.log('-getColumns-tt---', ttt);
  return ttt
  
}

export const columnList = getColumns()
