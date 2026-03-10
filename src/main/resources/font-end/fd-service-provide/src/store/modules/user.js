import { login, logout, getLoginUserInfo, getCollectAndPayment } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

import { getProviderPermission } from '@/api/user.js'
import store from '@/store'

import { getProviderInfoDetailByProvider } from '@/api/personal-info.js'

const state = {
  token: getToken(),
  name: '',
  tenantId: '',
  avatar: '',
  introduction: '',

  roles: [],
  SecurityCenterFlag: false,//安全中心开关
  pageSetting: {}, // 页面配置
  swIncome: 0, // 导航栏中 开启代收
  swPay: 0, // 导航栏中 开启代付
  userName: '', // 用户名
  userInfo: {
    userId: '' // 用户id
  },
  providerPermission: {}, // 码商权限
  personalInfo: {} // 码商个人信息
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_TENANTID: (state, tenantId) => {
    state.tenantId = tenantId
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  setPageSetting: (state, data) => {
    state.pageSetting = data
  },
  SET_USER_SWINCOME: (state, data) => {
    state.swIncome = data == true ? 1 : 0
  },
  SET_USER_SWPAY: (state, data) => {
    state.swPay = data == true ? 1 : 0
  },
  setProviderPermission: (state, data) => {
    state.providerPermission = data
  },
  setProviderPersonalInfo: (state, data) => {
    state.personalInfo = data
    store.dispatch('userAccount/getPaymentOrderPendingCount')
    store.dispatch('userAccount/getCollectOrderPendingCount')

    // 获得未读会话数量
    store.dispatch('chat/getNewMessageCount')
  },
  SET_SECURITY_CENTER_FLAG: (state, flag) => {
    state.SecurityCenterFlag = flag
  }
}

const actions = {
  // 开启代收代付
  getOrUpdateCollectAndPayment({ commit, state }) {
    return new Promise((resolve, reject) => {

      getCollectAndPayment(state.userInfo.userId)
        .then((res) => {
          commit('SET_USER_SWINCOME', res.data.isCollectEnable)
          commit('SET_USER_SWPAY', res.data.isPaymentEnable)
          resolve(res.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  loadUserProviderPermission({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      if (!state.providerPermission.userId) {
        getProviderPermission(state.userInfo.userId)
          .then((response) => {
            commit('setProviderPermission', response.data)
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      } else {
        resolve()
      }
    })
  },
  getProviderPersonalInfo({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      // 如果有个人信息就不请求接口
      if (state.personalInfo.providerId) {
        store.dispatch('userAccount/getPaymentOrderPendingCount')
        store.dispatch('userAccount/getCollectOrderPendingCount')

        // 获得未读会话数量
        store.dispatch('chat/getNewMessageCount')

        resolve()
        return
      }
      getProviderInfoDetailByProvider()
        .then((response) => {
          commit('setProviderPersonalInfo', response.data)
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // user login
  // login({ commit }, userInfo) {
  //   commit('SET_TOKEN', 'data.token')
  //   setToken('data.token')
  //   commit('SET_NAME', userInfo.username)

  //   return new Promise((resolve, reject) => {
  //     resolve('')

  //     // login(userInfo).then(response => {
  //     //   const { data } = response
  //     //   if(data.token){
  //     //     commit('SET_TOKEN', data.token)
  //     //     setToken(data.token)
  //     //   }
  //     //   commit('SET_NAME', userInfo.username)
  //     //   resolve(data)
  //     // }).catch(error => {
  //     //   reject(error)
  //     // })
  //   })
  // },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      // getLoginUserInfo()
      //   .then((response) => {

      //     console.log('----getLoginUserInfo-------');
      //     console.log(response);

      let data = {
        roles: ['admin'],
        introduction: 'I am a super administrator',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: 'Super Admin'
      }

      // const { data } = response

      if (!data) {
        reject('Verification failed, please Login again.')
      }

      const { roles, name, avatar, introduction } = data

      // roles must be a non-empty array
      if (!roles || roles.length <= 0) {
        reject('getInfo: roles must be a non-null array!')
      }

      commit('SET_ROLES', roles)
      commit('SET_NAME', name)
      commit('SET_AVATAR', avatar)
      commit('SET_INTRODUCTION', introduction)
      resolve(data)
      // })
      // .catch((error) => {
      //   reject(error)
      // })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout()
      // .then(() => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resetRouter()
      store.state.userAccount.userId = ''
      store.state.user.personalInfo.providerId = ''
      // reset visited views and cached views
      // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
      dispatch('tagsView/delAllViews', null, { root: true })

      router.push(`/login`)
      resolve()
      // })
      // .catch((error) => {
      //   reject(error)
      // })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
