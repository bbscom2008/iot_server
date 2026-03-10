import { login, logout, getLoginUserInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import store from '@/store'
const state = {
  token: getToken(),
  name: '',
  tenantId: '',
  avatar: '',
  introduction: '',

  roles: [],
  SecurityCenterFlag: false, //安全中心开关
  pageSetting: {}, // 页面配置
  swIncome: 0, // 导航栏中 开启代收
  swPay: 0, // 导航栏中 开启代付
  userName: '', // 用户名
  userInfo: {
    userId: '' // 用户id
  }
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
  }
}

const actions = {
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
