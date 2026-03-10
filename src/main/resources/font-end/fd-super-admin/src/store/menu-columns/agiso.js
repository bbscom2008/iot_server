
import { ColumnType } from '@/views/my-tools/constant-gcode'


const columns = `

序号	index
阿奇索账号 	account
APPID 	appid
平台来源 	platform_source
用户名称 	user_name
店铺名称 	merchant_name
过期时间 	expire_time
是否启用 	is_enable

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
