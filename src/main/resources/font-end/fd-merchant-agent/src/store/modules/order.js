import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

import {formatDateTime } from '@/utils'

const state = {
  startTime: 0, // 开始时间
  startTimeStr: '', // 开始时间


  startTimeOneDay: 0, // 报表中的 开始时间 -- 一天
  startTimeOneDayStr: '', // 报表中的 开始时间 str

  /**
   * 有需要时直接读
   * 凡是对 通道修改了,就将此 置空,下次有需要时,再联网下载.
   */
  allChannelList:[], // 所有渠道列表 -- 下拉框中用



  productList:[], // 所有产品列表 -- 下拉框中用


}

const mutations = {
 
  setStartTime(state, data) {
    state.startTime = data
    if(data){
      state.startTimeStr = formatDateTime(data)
    }else{
      state.startTimeStr = ''
    }
  },

  setStartTimeOneDay(state, data) {
    state.startTimeOneDay = data
    if(data){
      state.startTimeOneDayStr = formatDateTime(data)
    }else{
      state.startTimeOneDayStr = ''
    }
  }


}

const actions = {
 
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
