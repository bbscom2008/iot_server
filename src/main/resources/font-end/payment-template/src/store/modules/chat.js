import { getToken, setToken, removeToken } from '@/utils/auth'



const state = {
    messageList:[],
    currChatOrderId:'',
    isChatRoomClose: false,

  }

const mutations = {
  set_chat_close: (state, isClose) => {
    state.isChatRoomClose = isClose
  },
  add_message: (state, message) => {
    state.messageList.push(message)
  },
  
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    // const { username, password } = userInfo
    // return new Promise((resolve, reject) => {
    //   login({ username: username.trim(), password: password }).then(response => {
    //     const { data } = response
    //     commit('SET_TOKEN', data.token)
    //     setToken(data.token)
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  },

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

