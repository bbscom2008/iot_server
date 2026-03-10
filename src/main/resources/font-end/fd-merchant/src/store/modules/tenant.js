import { getAllTenantList } from '@/api/tenant-manager'

import { getTenantConfigPage } from '@/api/service-manage'

const state = {
  tenantList: [], // 租户列表， 平台列表
  currTenantId: '', // 当前租户 ID, 平台ID
  selectTenantId: '',
  tenantInfo: {
    // 登陆页面，根据域名获得的相关信息
    tenantDomainId: 0,
    tenantId: 0,
    domainUrl: '',
    loginType: 0,
    userId: 0,
    isWatermark: false,
    tenantName: '',
    pcBackImage: {
      originalName: '',
      // fileUrl: 'http://127.0.0.1:8090/uploads/bbgg.png'
      fileUrl: ''
    },
    appBackImage: {
      originalName: '',
      fileUrl: ''
    }
  },
  tenantConfig: [] // 租户配置项
}


const mutations = {
  // SET_TENANT_LIST: (state, data) => {
  //   state.tenantList = data
  //   state.currTenantId = data[0].tenantId
  // }
  set_tenant_info:(state, data) =>{
    state.tenantInfo = data
  }
}

const actions = {

  async platformNotify({ commit, state, dispatch }) {

    if(state.tenantConfig.length == 0){
      state.tenantConfig = await dispatch('getTenantConfig')
    }

    const notifyConfig = state.tenantConfig.find(
      (item) => item.configKey === 'PlatformNotify'
    )
    return notifyConfig ? notifyConfig.configValue : ''
  },


  // 获得当前平台的配置
  async getTenantConfig({ commit, state }) {
    try {
      const res = await getTenantConfigPage({
        tenantId: state.tenantInfo.tenantId,
        pageSize: 1000,
        pageNum: 1
      })
      commit('SET_TENANT_CONFIG', res.data.list)
      return Promise.resolve(res.data.list)
    } catch (err) {
      console.log(err)
    }
  }
  // 获取所有租户列表
  // getTenantList({ commit, state }) {
  //   return new Promise((resolve, reject) => {
  //     if (state.tenantList.length == 0) {
  //       getAllTenantList()
  //         .then((res) => {
  //           commit('SET_TENANT_LIST', res.data.list)
  //           resolve(res.data.list)
  //         })
  //         .catch((error) => {
  //           reject(error)
  //         })
  //     } else {
  //       resolve(state.tenantList)
  //     }
  //   })
  // }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
