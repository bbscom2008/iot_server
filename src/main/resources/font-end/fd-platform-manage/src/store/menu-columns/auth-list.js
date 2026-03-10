
import { ColumnType } from '@/views/my-tools/constant-gcode'


const columns = `

序号	index
码商账号 	account
收款码名称 	name
支付宝码商账号 	alipay_account
APPID 	appid
商户UID 	merchant_uid
授权状态 	status
授权token 	token
创建时间	create_time
更新时间	update_time
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
