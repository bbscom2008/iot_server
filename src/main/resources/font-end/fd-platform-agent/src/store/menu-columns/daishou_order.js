
import { ColumnType } from '@/views/my-tools/constant-gcode'


const columns = `

序号      index
系统订单号  system_order_num
商户订单号  merchant_order_num
订单金额  merchant_order_money
实付金额  pay_order_money
通道名称  channel_name
产品名称  product_name
收款信息  shoukuan_info
商户      trans_merchant_no
码商    trans_product_no  
创建时间  create_time
确认时间  confirm_time
通知时间  notice_time
过期时间  ood_time
订单状态  order_state
通知状态  notice_state
订单确认用户名  order_confirm_user_name
付款信息  payment_info
提交信息  submit_info
操作      opt


`

function getColumns() {
 let ttt =   columns.split('\n').filter(el=>el.trim().length>0).map((item, index) => {

    let kvs = item.trim().split(/\s+/)
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
