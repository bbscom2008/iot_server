import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex)

// https://webpack.js.org/guides/dependency-management/#requirecontext
const modulesFiles = require.context('./modules', true, /\.js$/)

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

const store = new Vuex.Store({
  modules,
  getters,
  plugins: [
    createPersistedState({
      
      // 'user.userInfo',
      paths: [

        'chat.newMessageCount',
        'chat.currChatOrderId',
        'chat.currConversation',
        'chat.quickMessageList',
        'user.userName',
        'user.tenantId',
        // 'user.providerPermission', // 只保存在内存中，不永久存储
        'userAccount.paymentOrder',
        'userAccount.collectOPrder',
        'tenant.tenantInfo',
        // 'tenant.tenantConfig', // 当前平台的配置
        // 'settings.notifySound',
        'userAccount.availableBalance',
        'userAccount.freezeBalance','userAccount.userId'],
      // 使用 localStorage 存储
      storage: window.localStorage
    })
  ]
})

export default store
