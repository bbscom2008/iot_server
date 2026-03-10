import { getUserAccount,getPaymentOrderPendingCountByProviderId ,getCollectOrderPendingCountByProviderId} from '@/api/user'

import store from '@/store'

const state = {
  userId:'',
  availableBalance: null,
  freezeBalance: null,
  tempFlag: false, // 临时变量，用于解决 路由跳转 时，短时间内 调用 2 次 getUserAccount 接口的问题
  paymentOrder:null,  ///待处理代付订单数量
  collectOPrder:null,  ///待处理代收订单数量
}

const mutations = {
  SET_USER_ACCOUNT: (state, data) => {
    state.availableBalance = Number(data.availableBalance).toFixed(2)
    state.freezeBalance = Number(data.freezeBalance).toFixed(2)
    state.userId = data.userId
    // 存储到 user 中
    store.state.user.userInfo = data

    console.log('=======SET_USER_ACCOUNT======');
    
    // 获得当前码商的权限
    store.dispatch('user/loadUserProviderPermission')
    // 获得当前码商的个人信息
    store.dispatch('user/getProviderPersonalInfo')
    //查询是否开启代收代付
    store.dispatch('user/getOrUpdateCollectAndPayment')
  },
  SET_USER_PAYMENT: (state, data) => {
    state.paymentOrder = Number(data)
  },
  SET_USER_COLLECTORDER: (state, data) => {
    state.collectOPrder = Number(data)
  },
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
    }, 2000)

    // 页面跳转时，更新余额
    // if(store.state.user.userInfo && store.state.user.userInfo.userId){
    //   // 已经有了就不再获取
    //   return Promise.resolve()
    // }


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
  },
  // 获取查询码商首页    待处理代付订单数量
  getPaymentOrderPendingCount({ commit, state }) {
    return new Promise((resolve, reject) => {
      getPaymentOrderPendingCountByProviderId()
          .then((res) => {
            commit('SET_USER_PAYMENT', res.data)
            resolve(res.data)
          })
          .catch((error) => {
            reject(error)
          })
    })
  },
  // 获取查询码商首页    待处理代收订单数量
  getCollectOrderPendingCount({ commit, state }) {
    return new Promise((resolve, reject) => {
      getCollectOrderPendingCountByProviderId()
          .then((res) => {
            commit('SET_USER_COLLECTORDER', res.data)
            resolve(res.data)
          })
          .catch((error) => {
            reject(error)
          })
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
