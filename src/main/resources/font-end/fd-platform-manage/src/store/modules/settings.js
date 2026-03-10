import variables from '@/styles/element-variables.scss'
import defaultSettings from '@/settings'

const { showSettings, tagsView, fixedHeader, sidebarLogo } = defaultSettings

const state = {
  theme: variables.theme,
  showSettings: showSettings,
  tagsView: tagsView,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo,
  collectOrderColumns:['序号', '订单号', '产品信息', '交易者信息', '金额', '收款信息', '付款人信息', '订单时间', '状态', '转账备注', '提交信息', '近半小时流水', '确认用户名'  ], // 代收订单 显示的列
  agentPayColumns: ['序号', '订单号', '产品信息', '交易者信息', '订单金额', '收款信息', '订单时间', '状态', '归属地', '转账凭证', '审核用户名' ], // 代付订单 显示的列
  productManageColumns:  ['序号', '产品名称', '产品类型', '交易类型', '收银台模板', '浮动金额', '超时时间', '超时限制',  '转账备注类型', '码商数量','收款信息数量', '自动类型', '是否启用', '接单模式'  ], // 产品管理默认显示的列
}

const mutations = {
  SET_collectOrderColumns: (state, value) => {
    state.collectOrderColumns = value
  },
  SET_agentPayColumns: (state, value) => {
    state.agentPayColumns = value
  },
  SET_productManageColumns: (state, value) => {
    state.productManageColumns = value
  },


  CHANGE_SETTING: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

