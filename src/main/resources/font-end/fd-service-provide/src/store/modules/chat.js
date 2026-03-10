
import {getShortMessage, getUnreadCount} from '@/api/chat.js'

import store from '@/store'

import {getLastMsg, getLastTime} from '@/utils/chat.js'

const state = {
  currChatOrderId: '', // 当前聊天的 orderId
  currConversation: '', // 当前聊天的 会话
  newMessageCount: '', // 客服图标 红点中的数字
  allConversationList: [], // 聊天会话列表
  quickMessageList: [], // 聊天室快捷短语
  quickCardList: [], // 聊天室快捷卡片
  flushChatListFlag: 1 // 刷新聊天列表标志
}

const mutations = {
  updateQuickMessageList(state, payload) {
    state.quickMessageList = payload
  },
  updateQuickCardList(state, payload) {
    state.quickCardList = payload
  },
  updateConversationUnReadCount(state, payload) {
    let item = state.allConversationList.find((ele) => ele.conversationId == payload.conversationId)

    if (item) {
      item.msgCount = payload.count
      item.lastMessage = getLastMsg(payload.lastMessage.data.content) // TODO
      item.time = getLastTime(payload.lastMessage.data.time)
    }
  },

  addCoversationItem(state, value) {
    // state.allConversationList.unshift(value)
    // 因为数据格式不一样，现在不能这么做了
    state.flushChatListFlag += 1
  },

  setNewMessageCount: (state, value) => {
    state.newMessageCount = value
  },
  setCurrentChatOrderId: (state, value) => {
    state.currChatOrderId = value
  }
}

const actions = {


  async getShortMessageAction({ rootState, commit, state }) {

    const res = await getShortMessage(rootState.user.personalInfo.providerId)
      if (res.data && res.data.length > 0) {
        let responseData = res.data[0]

        let allList = JSON.parse(res.data[0].content)
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

        return Promise.resolve(responseData)
      }
  },


  /**
   * 获得未读会话数量
   **/ 
  getNewMessageCount({ commit, state }) {
    return new Promise((resolve, reject) => {
      // 获得未读会话数
      store.commit('app/setLoadingEnable', false)
      getUnreadCount(store.state.user.personalInfo.providerId).then((res) => {
        console.log('获得未读会话数', res)
        commit('setNewMessageCount', res.data)
        resolve(res.data)
      }).catch((error) => {
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
