import Cookies from 'js-cookie'
import storage from '@/utils/storage'

function getOrderId(){
  return storage.getItem('sessionStorage_orderId')
}

// function getCiphertext(){
//   return localStorage.getItem('ciphertext')
// }


const state = {
  sidebar: {
    // opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    opened: true,
    withoutAnimation: false
  },
  device: 'desktop',
  size: Cookies.get('size') || 'medium',
  loading: false, // 全局加载框
  loadingText: '加载中...', // 全局加载框文字
  loadingEnable: true, // 加载框是否启用
  orderInfo: null,
  orderId: getOrderId(),
  ciphertext: '',

}

const mutations = {
  setCiphertext: (state, ciphertext) => {
    state.ciphertext = ciphertext
    // localStorage.setItem('ciphertext', ciphertext)
  },
  setOrderId: (state, orderId) => {
    state.orderId = orderId
    storage.setItem('sessionStorage_orderId', orderId)
  },
  setOrderInfo: (state, orderInfo) => {
    state.orderInfo = orderInfo
  },
  setLoadingEnable: (state, flag) => {
    state.loadingEnable = flag
  },

  show_loading: (state, loadingText) => {
    if (!state.loadingEnable) {
      return
    }
    state.loading = true
    if (loadingText) {
      state.loadingText = loadingText
    }
  },
  hide_loading(state) {
    state.loading = false
    state.loadingText = '加载中...'
    state.loadingEnable = true
  },

  TOGGLE_SIDEBAR: (state) => {
    state.sidebar.opened = true
    // state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_SIZE: (state, size) => {
    state.size = size
    Cookies.set('size', size)
  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setSize({ commit }, size) {
    commit('SET_SIZE', size)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
