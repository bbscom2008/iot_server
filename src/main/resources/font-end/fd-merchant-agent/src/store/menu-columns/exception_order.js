
import { ColumnType } from '@/views/my-tools/constant-gcode'


const columns = `
序号	index
商户订单号	merchant_order_no
商户号	merchant_num
商户用户名	merchant_user_name
商户名称	merchant_name
通道名称	channel_name
订单金额	order_money
异常说明	expect_info
创建时间	create_time



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
