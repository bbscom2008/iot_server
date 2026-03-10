import { getUserAccount } from '@/api/user'

import store from '@/store'

const state = {
  availableBalance: 0,
  freezeBalance: 0,
  userId:''
}

const mutations = {
  SET_USER_ACCOUNT: (state, data) => {
    state.availableBalance = Number(data.availableBalance).toFixed(2)
    state.freezeBalance = Number(data.freezeBalance).toFixed(2)
    state.userId =  data.userId
    // 存储到 user 中
    store.state.user.userInfo = data

  }
}

const actions = {
  // 获取可用余额//冻结金额
  getUserAccount({ commit, state }) {
    return new Promise((resolve, reject) => {
        getUserAccount()
          .then((res) => {
            console.log(res,'res-----')
            commit('SET_USER_ACCOUNT', res.data)
            resolve(res.data)
          })
          .catch((error) => {
            reject(error)
          })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
