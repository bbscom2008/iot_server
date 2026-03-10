import variables from '@/styles/element-variables.scss'
import defaultSettings from '@/settings'

import { startWebSocket, closeWebSocket } from '@/utils/notify'

const { showSettings, tagsView, fixedHeader, sidebarLogo } = defaultSettings

const state = {
  theme: variables.theme,
  showSettings: showSettings,
  tagsView: tagsView,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo,
  isAutoFlush: false, // 是否自动刷新

  notifySound: false,
  // isStartByUser: false, // 是否是用户点击启动的
}

const mutations = {
  CHANGE_NotifySound: (state, value) => {
    state.notifySound = value
    if(value){
      // 手动点击，启动的
      // state.isStartByUser = true
      startWebSocket() // 有启动声音
    }else{
      closeWebSocket()
    }

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

