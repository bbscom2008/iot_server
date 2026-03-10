import { getToken } from '@/utils/auth'

import JSONbig from 'json-bigint'

const JSONbigString = JSONbig({
  storeAsString: true
})

const LOG_TAG = 'NotifySocketService'

import store from '@/store/index.js'

import { audioManager } from '@/utils/audioManager'
import { isAndroidApp } from '@/utils/index.js'
import { startAppNotifySocket, getApkVersion } from '@/utils/checkApkVersion.js'

function playNotify(type) {
  console.log(LOG_TAG,'----------playNotify-----', type)

  uni.showToast({
    title: '您有新的订单',
    icon: 'success'
  })

  if (store.state.notifySound) {
      audioManager.playNotificationSound()
  }

  // if (type == 0) {
  // const audio = new Audio(DingDong)
  // audio.play()

  // } else if (type == 1) {
  // const audio = new Audio(DingDong)
  // audio.play()
  // }
}


class NotifySocketService {
  constructor() {
    this.url = ''
    this.socket = null
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 20
    this.reconnectDelay = 1000
    this.messageHandlers = new Set()
    this.heartbeatInterval = 0 // 心跳
    this.isConnecting = false
  }

  connentIfy() {
    const token = getToken()
    if (!token) {
      console.log(LOG_TAG, '---token-is null--')
      return
    }

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.log(LOG_TAG, '---notify socket is opened not need reopen --')
      return
    }

    if (this.isConnecting) {
      console.log(LOG_TAG, '--notify socket-正在联接，2秒后重联---')
      setTimeout(() => {
        this.connentIfy()
      }, 5000);
      return
    }

    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    this.url =
      `${wsProtocol}//` + location.host + '/websapi/ws/providerOrderMessage'

    this.connect()
  }

  connect() {
    try {
      this.isConnecting = true
      this.socket = new WebSocket(this.url)

      this.socket.onopen = () => {
        this.isConnecting = false
        console.log(LOG_TAG, 'notify Socket连接成功')
        this.reconnectAttempts = 0
        this.onOpen && this.onOpen()
      }

      this.socket.onmessage = (event) => {
        try {
          console.log(LOG_TAG, '收到消息', event.data)
          const data = JSONbigString.parse(event.data)
          // 订单通知
          if (data.type === 'NOTIFICATION') {
            // if(ret.tradeType == 0){ // 代收订单
            playNotify(0)
            // }else if(ret.tradeType == 1){ // 代付订单
            // playNotify(1)
            // }
          }
        } catch (error) {
          console.error(LOG_TAG, '消息解析错误', error)
        }
      }

      this.socket.onclose = () => {
        console.log(LOG_TAG, '=== notify socket===WebSocket连接关闭')
        // 停止心跳
        clearInterval(this.heartbeatInterval)

        this.tryReconnect()
      }

      this.socket.onerror = (error) => {
        console.error(LOG_TAG, 'WebSocket错误', error)
        this.tryReconnect()
      }
    } catch (error) {
      this.isConnecting = false
      console.error(LOG_TAG, '创建WebSocket失败', error)
      this.tryReconnect()
    }
  }

  // 打开联接后
  onOpen() {
    this.auth()
    this.startHeartbeat()
  }

  auth() {
    this.send({
      type: 'auth',
      token: getToken()
    })
  }

  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      this.send({
        type: 'heartbeat',
        token: getToken()
      })
    }, 20000) // 每20秒发送一次心跳
  }

  send(data) {
    // console.log("发送消息 send ", data);
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data))
      return true
    }
    return false
  }

  addMessageHandler(handler) {
    this.messageHandlers.add(handler)
  }

  removeMessageHandler(handler) {
    this.messageHandlers.delete(handler)
  }

  close() {
    if (this.socket) {
      this.socket.close()
    }
  }

  tryReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      setTimeout(() => {
        console.log(
          LOG_TAG,
          `notify socket 尝试第${this.reconnectAttempts}次重连...`
        )
        this.connentIfy()
      }, this.reconnectAttempts * this.reconnectDelay)
    }
  }
}

var notifySocket = new NotifySocketService()

export function startWebSocket() {

  if(isAndroidApp() && getApkVersion() && Number(getApkVersion()) >= 6){
    startAppNotifySocket()
    console.log(LOG_TAG, '安卓APK环境，不启动订单通知WebSocket')
    return
  }
  
  console.log(LOG_TAG, '非安卓APK环境，正常启动订单通知WebSocket')

  if (!notifySocket) {
    notifySocket = new NotifySocketService()
  }
  notifySocket.connentIfy()
}

export function closeWebSocket() {
  notifySocket.close()

  uni.showToast({
    title: '订单通知已关闭',
    icon: 'none'
  })
}
