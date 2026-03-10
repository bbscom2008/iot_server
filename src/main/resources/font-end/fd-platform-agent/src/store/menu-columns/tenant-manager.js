
import { ColumnType } from '@/views/my-tools/constant-gcode'


const columns = `

序号	index
租户名称	tenant_name
租户域名	tenant_domain
收银台域名	cash_page_domain
可用余额	available_balance
冻结金额	freeze_balance
PC端背景图	pc_back_image
手机端背景图	app_back_image
数据库地址	db_url
数据库用户名	db_username
数据库密码	db_password
过期时间	expire_time
是否启用	is_active
备注信息	remark
创建时间	create_time
更新时间	update_time

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
