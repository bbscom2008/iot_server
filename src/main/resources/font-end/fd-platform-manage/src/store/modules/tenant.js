import { getAllTenantList } from '@/api/tenant-manager'

import {
  getTenantConfigPage,
} from '@/api/system-manager'

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
  currTenantConfig: null // 当前租户配置
}

const mutations = {
  // SET_TENANT_LIST: (state, data) => {
  //   state.tenantList = data
  //   state.currTenantId = data[0].tenantId
  // }
  set_tenant_info:(state, data) =>{
    state.tenantInfo = data
  },
  set_watermark:(state, data) =>{
    state.tenantInfo.isWatermark = data
  }
}

const actions = {
//  获取平台配置
  getTenantConfig({ commit, state }) {

    if(state.currTenantConfig){
      return Promise.resolve(state.currTenantConfig)
    }

    return new Promise((resolve, reject) => {

      getTenantConfigPage({
        tenantId: state.selectTenantId,
        pageNum: 1,
        pageSize: 100
      }).then((res) => {
        state.currTenantConfig = res.data.list
        resolve(state.currTenantConfig)
      }).catch((error) => {
        reject(error)
      })
    })
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
