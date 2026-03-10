
import { ColumnType } from '@/views/my-tools/constant-gcode'


const columns = `

序号	index
用户名	user_name
用户昵称	user_nick_name
登录设备	login_shebei
登录IP	login_ip
最后登录时间	last_login_time
创建时间	created_time



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
