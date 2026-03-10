/**
 *  gcode
 */
import { ColumnType } from '@/views/my-tools/constant-gcode'

import { columnList } from '../menu-columns/agiso'


const state = {
  columnList: columnList,
  columnType: ColumnType,

  roleList: [], // 角色列表
  templateList: [], // 支付模板列表
  currEditTemplateId: -1, // 当前编辑的模板的索引
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
