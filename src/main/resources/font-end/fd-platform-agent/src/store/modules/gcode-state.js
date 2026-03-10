/**
 *  gcode
 */
import { ColumnType } from '@/views/my-tools/constant-gcode'

// import { columnList } from '../menu-columns/default'
// import { columnList } from '../menu-columns/tenant-manager'
// // import { columnList } from '../menu-columns/tenant-manager-peizhi'
// import { columnList } from '../menu-columns/product-type'
// import { columnList } from '../menu-columns/tenant-agent'
// import { columnList } from '../menu-columns/pay_channel_list'
// import { columnList } from '../menu-columns/merchant_info'
// import { columnList } from '../menu-columns/sys-manager-role'
// import { columnList } from '../menu-columns/merchant-agent-list'
// import { columnList } from '../menu-columns/apply-for'
// import { columnList } from '../menu-columns/operate_log'
// import { columnList } from '../menu-columns/exception_order'
import { columnList } from '../menu-columns/agiso'
// import { columnList } from '../menu-columns/online_user'
// import { columnList } from '../menu-columns/service_income_info'
// import { columnList } from '../menu-columns/daishou_order'
// import { columnList } from '../menu-columns/tenement-change-record'
// import { columnList } from '../menu-columns/service_team'
// import { columnList } from '../menu-columns/user-manage'
// import { columnList } from '../menu-columns/platmorfday'
// import { columnList } from '../menu-columns/merchant_daily_report'
// import { columnList } from '../menu-columns/service_daily_report'
// import { columnList } from '../menu-columns/channel_daily_report'
// import { columnList } from '../menu-columns/product_daily_report'
// import { columnList } from '../menu-columns/product_type_daily'
// import { columnList } from '../menu-columns/income_info_daily'

const state = {
  columnList: columnList,
  columnType: ColumnType,

  roleList: [], // 角色列表
  templateList: [], // 支付模板列表
  currEditIndex: -1, // 当前编辑的模板的索引
}

const mutations = {

  // 角色列表
  setRoleList(state, list) {
    state.roleList = list
  },

  addTemplateList(state, obj) {

    let index = state.templateList.findIndex(item => item.id === obj.id)
    if (index !== -1) {
      state.templateList.splice(index, 1)
    }
    state.templateList.unshift(obj)
  },

  removeTemplateList(state, index) {
    state.templateList.splice(index, 1)
  },


}

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
