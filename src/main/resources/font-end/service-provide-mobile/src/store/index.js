import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import { getUnreadCount } from '@/api/chat.js'
import { getProviderPermission } from '@/api/user.js'
import { webSocketService } from '@/utils/websocket.js'
import { getTenantConfigPage } from '@/api/service-list'
import { getProviderInfoDetailByProvider } from '@/api/personal-info.js'
import { getLastMsg, getLastTime } from '@/utils/chat.js'

import { audioManager } from '@/utils/audioManager'
import { getShortMessage } from '@/api/chat'

import { isAndroidApp } from '@/utils/index.js'

import { checkTradePassword } from '@/api/user.js'

import {notifyAndroidSetSoundState, getApkVersion} from '@/utils/checkApkVersion.js'

Vue.use(Vuex)
import { setToken, getToken, getTokenHead, setTokenHead } from '@/utils/auth.js'

function getUserAccount() {
  return uni.getStorageSync('userxxxxAccount') || {}
}


function getOldTenantId() {
  return uni.getStorageSync('old_tenant_id') || ''
}

function getPersonInfo() {
  return uni.getStorageSync('userxxxxpersonalInfo') || null
}

function getIsReceiveOrder() {
  return uni.getStorageSync('isReceiveOrder') || false
}

function getSavedToken() {
  const token = getToken()
  // 页面刷新时 如果有token 启动 websocket
  webSocketService.connentIfy()

  return token
}

function getNotifySound() {
  
  if(isAndroidApp() && getApkVersion() && Number(getApkVersion()) >= 6){
    // 安卓环境 ，返回之前保存的值
    return uni.getStorageSync('saved_nofitySound_state') || false
  }else{
    // 不是安卓，默认为 false
    return false;
  }
}

function getIsChatRoomMode() {
  return uni.getStorageSync('isChatRoomMode') || 0
}

const store = new Vuex.Store({
  state: {
    audio: null,

    tabIndex: 0,

    navBarHeight: 0, // 顶部导航栏高度  后退按钮，标题，等
    statusBarHeight: 0, // 状态栏高度  手机电量，信号，等 在  nav-bar 中处理
    tabBarHeight: 100, //  底部tab 栏的高度,
    saveHeight: 0, // 手机底部   如 虚拟按钮  的高度, 在 tab-bar 中处理

    isReceiveOrder: getIsReceiveOrder(), // 接单的总开关

    windowsSize: {
      height: '',
      width: ''
    }, // 时刻监听窗体高度变化

    tabOrderType: 0, //  0 代收  1  代付

    topList: {
      accountStatus: 0,
      availableBalance: 0,
      freezeBalance: 0
    },

    token: getSavedToken(),
    tokenHeader: getTokenHead(),
    loginResult: {}, // 登录结果

    userName: '', // 登录成功的用户名
    // 可用余额
    availableBalance: 0,
    // 冻结余额
    frozenBalance: 0,
    tenantId: getOldTenantId(), // 平台ID  租户ID

    // this.$store.state.userAccount.userId
    userAccount: getUserAccount(), // 用户账号信息

    personalInfo: getPersonInfo(), // 个人信息
    isLoading: false, // 标记当前是否在联网
    loadingEnable: false,

    tenantInfo: {},

    notifySound: getNotifySound(),

    currChatOrderId: '', // 当前聊天的 orderId
    currConversation: '', // 当前聊天的 会话
    newMessageCount: '', // 客服图标 红点中的数字
    allConversationList: [], // 聊天会话列表

    tenantConfig: [], // 当前平台的配置

    allQuickMessageList: [], // 所有快捷短语列表
    quickMessageList: [], // 聊天室快捷短语
    quickCardList: [], // 聊天室快捷卡片
    webSocketStatus: 'disconnected', // WebSocket连接状态

    isChatRoomMode: getIsChatRoomMode(), // 是否是聊天室模式 (0: 关闭, 1: 开启)

    providerPermission: {} // 当前码商的权限
  },
  mutations: {
    SET_providerPermission(state, data) {
      state.providerPermission = data
    },
    setIsChatRoomMode(state, flag) {
      state.isChatRoomMode = flag
      uni.setStorageSync('isChatRoomMode', flag)
    },
    updateQuickMessageList(state, payload) {
      state.quickMessageList = payload
    },
    updateQuickCardList(state, payload) {
      state.quickCardList = payload
    },
    setWebSocketStatus(state, status) {
      state.webSocketStatus = status
    },
    SET_TENANT_CONFIG: (state, data) => {
      state.tenantConfig = data
    },
    setWindowsSize(state, payload) {
      state.windowsSize.height = payload.height
      state.windowsSize.width = payload.width
    },
    updateConversationUnReadCount(state, payload) {
      let item = state.allConversationList.find(
        (ele) => ele.conversationId == payload.conversationId
      )
      if (item) {
        item.msgCount = payload.count
        item.lastMessage = getLastMsg(payload.lastMessage.data.content) // TODO
        item.time = getLastTime(payload.lastMessage.data.time)
      }
    },

    addCoversationItem(state, value) {
      state.allConversationList.unshift(value)
    },

    setNewMessageCount: (state, value) => {
      state.newMessageCount = value
    },
    setCurrentChatOrderId: (state, value) => {
      state.currChatOrderId = value
    },

    CHANGE_NofitySound: (state, value) => {
      state.notifySound = value
      if (value) {
        audioManager.initializeOnUserInteraction()
        uni.showToast({
          title: '订单通知已开启',
          icon: 'none'
        })
      } else {
        uni.showToast({
          title: '订单通知已关闭',
          icon: 'none'
        })
      }
      uni.setStorageSync('saved_nofitySound_state', value)
      notifyAndroidSetSoundState(value)
    },
    set_tenant_info(state, flag) {
      state.tenantInfo = flag
    },

    update_receive_order(state, flag) {
      state.isReceiveOrder = flag
      uni.setStorageSync('isReceiveOrder', flag)
    },
    setLoadingEnable(state, flag) {
      state.loadingEnable = flag
    },
    setLoading(state, flag) {
      state.isLoading = flag
      state.loadingEnable = true
    },

    setTenantId(state, tenantId) {
      uni.setStorageSync('old_tenant_id', tenantId)
      state.tenantId = tenantId
    },

    setUserAccount(state, userAccount) {
      state.userAccount = userAccount
      uni.setStorageSync('userxxxxAccount', userAccount)
    },

    setTabIndex(state, index) {
      state.tabIndex = index
    },
    setToken(state, token) {
      state.token = token
      setToken(token)
      // 判断webSocket 有没有打开，如果没有，就打开
      webSocketService.connentIfy()
    },
    setTokenHead(state, tokenHeader) {
      state.tokenHeader = tokenHeader
      setTokenHead(tokenHeader)
    },
    SET_PERSONAL_INFO(state, info) {
      uni.setStorageSync('userxxxxpersonalInfo', info)
      state.personalInfo = info

      // 获得未读会话数量
      store.dispatch('getNewMessageCount')
    }
  },
  getters: {
    userId: (state) => {
      if (state.userAccount.userId) {
        return state.userAccount.userId
      } else {
        uni.reLaunch({
          url: '/pages/login/login'
        })
      }
    },
    isSecondConfirmOrder: (state) => {
      const config = state.tenantConfig.find(
        (ele) => ele.configKey === 'isSecondConfirmOrder'
      )
      if (!config) {
        return false
      }

      if (config.configValue == 'true') {
        return true
      }

      return false
    },
  },
  actions: {

    async platformNotify({ commit, state, dispatch }) {

      if (state.tenantConfig.length == 0) {
        state.tenantConfig = await dispatch('getTenantConfig')
      }
      if(!state.tenantConfig){
        return ''
      }

      const notifyConfig = state.tenantConfig.find(
        (item) => item.configKey === 'PlatformNotify'
      )
      return notifyConfig ? notifyConfig.configValue : ''
    },

    async getShortMessageAction({ commit, state }) {

      const res = await getShortMessage(state.personalInfo.providerId)
      if (res.data && res.data.length > 0) {
        this.responseData = res.data[0]

        let allList = JSON.parse(res.data[0].content)
        state.allQuickMessageList = res.data

        let messageList = []
        let cardList = []

        allList.forEach((ele) => {
          if (ele.type && ele.type == 'card') {
            cardList.push(ele)
          } else {
            messageList.push(ele)
          }
        })

        commit('updateQuickMessageList', messageList)
        commit('updateQuickCardList', cardList)

        return Promise.resolve(res.data[0])
      }
    },


    async loadUserProviderPermission({ commit, state }) {
      // 如果已经有了，就不再联网
      if (state.providerPermission.userId) {
        return
      }
      const res = await getProviderPermission(state.userAccount.userId)
      commit('SET_providerPermission', res.data)
    },

    async getTenantConfig({ commit, state }) {
      try {
        if (!state.tenantInfo.tenantId) {
          return Promise.resolve()
        }
        console.log(
          '==state.tenantInfo.tenantId==',
          state.tenantInfo.tenantId
        )

        console.log('state.tenantConfig',state.tenantConfig);
        

        // 如果已有了配置，就不再连网获取
        if (state.tenantConfig.length > 0) {
          return Promise.resolve(state.tenantConfig)
        }

        const res = await getTenantConfigPage({
          tenantId: state.tenantInfo.tenantId,
          pageSize: 1000,
          pageNum: 1
        })
        console.log('SET_TENANT_CONFIG', res.data.list);
        
        commit('SET_TENANT_CONFIG', res.data.list)
        return Promise.resolve(res.data.list)
      } catch (err) {
        console.log(err)
      }
    },
    logout_clean(context) {
      context.commit('setUserAccount', {})
      context.commit('setTenantId', '')
      context.commit('SET_PERSONAL_INFO', null)
      context.commit('setToken', '')
      context.commit('setTokenHead', '')
      context.commit('SET_TENANT_CONFIG', [])
      context.commit('set_tenant_info', {})
      context.commit('setNewMessageCount', '')
    },
    getNewMessageCount({ commit, state }) {
      return new Promise((resolve, reject) => {
        // 获得未读会话数
        store.commit('setLoadingEnable', false)
        if (!state.personalInfo) {
          // 刚登录时 客服图标加载，但还没获得个人信息，本次忽略
          // 获得个人信息后，会再次获取
          return
        }
        getUnreadCount(state.personalInfo.providerId)
          .then((res) => {
            console.log('获得未读会话数', res)
            commit('setNewMessageCount', res.data)
            resolve(res.data)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    getPersonalInfo({ commit, state, dispatch }) {
      return new Promise((resolve, inject) => {
        console.log(
          '---getPersonalInfo---state.personalInfo--',
          state.personalInfo
        )

        if (state.personalInfo != null) {
          resolve(state.personalInfo)

          return
        }

        getProviderInfoDetailByProvider()
          .then((res) => {
            console.log('---resres----', res)

            commit('SET_PERSONAL_INFO', res.data)
            resolve(res.data)
          })
          .catch((res) => {
            inject(res)
          })
      })
    }
  },
  plugins: [
    createPersistedState({
      // 存储方式，这里使用 UniApp 的 storage
      storage: {
        getItem: (key) => uni.getStorageSync(key),
        setItem: (key, value) => uni.setStorageSync(key, value),
        removeItem: (key) => uni.removeStorageSync(key)
      },
      // 可以指定要持久化的 state 字段，若不指定则持久化所有 state
      paths: [
        'userName',
        // 'tabIndex',
        'currChatOrderId',
        'currConversation',
        'windowsSize',
        'newMessageCount',
        // 'tenantConfig',
        'tenantInfo'
      ]
    })
  ]
})

export default store
