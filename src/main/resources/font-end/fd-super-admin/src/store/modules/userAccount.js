import { getUserAccount } from '@/api/user'

import store from '@/store'

const state = {
  availableBalance: null,
  freezeBalance: null,
  collectDeposit: 0,

  tempFlag: false // 临时变量，用于解决 路由跳转 时，短时间内 调用 2 次 getUserAccount 接口的问题
}

const mutations = {
  SET_USER_ACCOUNT: (state, data) => {
    state.availableBalance = Number(data.availableBalance).toFixed(2)
    state.freezeBalance =  Number(data.freezeBalance).toFixed(2)
    state.collectDeposit =  Number(data.collectDeposit).toFixed(2)
    // 存储到 user 中
    store.state.user.userInfo = data
  }
}

const actions = {
  // 获取可用余额//冻结金额
  getUserAccount({ commit, state }) {
    // 因为 路由导致短时间会 调用 2 次，
    if (state.tempFlag) {
      return Promise.resolve()
    }
    state.tempFlag = true
    setTimeout(() => {
      state.tempFlag = false
    }, 1000)

    return new Promise((resolve, reject) => {
        getUserAccount()
          .then((res) => {
            console.log(res, 'res-----')
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
