
import { ColumnType } from '@/views/my-tools/constant-gcode'


const columns = `

用户名	user_name
用户昵称	user_nick_name
业务类型	business_type
账变类型	change_type
账变金额	change_amount
账变后账户余额	balance_after_change
系统订单号	system_order_no
商户订单号	merchant_order_no
备注信息	remark
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
