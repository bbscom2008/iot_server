
import { ColumnType } from '@/views/my-tools/constant-gcode'


/**
 * 平台 日 报表
 */


const columns = `

产品名称	product_name
产品类型	product_type_id
收银台页面模板	cash_page_templ_id
是否开启浮动	is_float_enable
浮动最大值	float_max
浮动最小值	float_min
是否允许浮动重复	float_allow_duplicate
浮动排除值	float_exclude
订单超时时间	order_expire_time
备注类型	transfer_remark_type
是否启用	is_active


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
