import { getToken, getTokenHead, removeToken } from '@/utils/auth'

import { MessageBox, Message } from 'element-ui'

import DingDong from '@/assets/audio/dingdong.mp3'

import store from '@/store'

class NotifySocket {
  constructor() {
    this.url = ''
    this.socket = null
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectDelay = 1000

    this.heartbeatInterval = 0 // 心跳
    this.isConnecting = false
    this.isOnline = navigator.onLine // 网络状态
    this.reconnectTimer = null // 重连定时器
    this.isDestroyed = false // 是否已销毁

    this.isCloseByUser = false
  }

  // 初始化网络状态监听
  initNetworkListener() {
    window.addEventListener('online', () => {
      console.log('网络已连接，尝试重连NotifySocket');
      this.isOnline = true;
      if (this.socket && this.socket.readyState !== WebSocket.OPEN && !this.isCloseByUser) {
        this.connentIfy();
      }
    });

    window.addEventListener('offline', () => {
      console.log('网络已断开');
      this.isOnline = false;
      this.clearReconnectTimer();
    });
  }

  connentIfy() {
    if (this.isDestroyed) {
      console.log('NotifySocket服务已销毁，不再连接');
      return;
    }

    if (!store.state.settings.notifySound) {
      console.log('通知声音关闭，不连接')
      return
    }

    if (!getToken()) {
      console.log('===没有token 无法联接=====')
      return
    }

    if (!this.isOnline) {
      console.log('---网络离线，无法连接---');
      return;
    }

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.log('--notify socket is opened not need reopen --')
      return
    }

    if (this.isConnecting) {
      console.log('-nn--正在联接，不用重联---')
      return
    }

    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    this.url = `${wsProtocol}//` + location.host + '/websapi/ws/providerOrderMessage'

    this.connect()
  }
  connect() {
    try {
      this.isConnecting = true
      this.socket = new WebSocket(this.url)

      this.socket.onopen = () => {
        this.isConnecting = false
        console.log('=====NotifySocket连接成功--订单通知开启--==isAutoFlush : ', store.state.settings.isAutoFlush)
        this.reconnectAttempts = 0
        this.onOpen && this.onOpen()

        // 激活铃声, 响一下
        // if (store.state.settings.isStartByUser) {
          if(store.state.settings.isAutoFlush){
            // 自动刷新，不播放声音
          }else{
            this.playNotify(0)
          }
      }

      this.socket.onmessage = (event) => {
        try {
          const ret = JSON.parse(event.data)
          if (ret.type === 'NOTIFICATION') {
            if (ret.tradeType == 0) {
              this.playNotify(0)
            } else if (ret.tradeType == 1) {
              this.playNotify(1)
            }
          }
        } catch (error) {
          console.error('消息解析错误', error)
        }
      }

      this.socket.onclose = (event) => {
        console.log('=====NotifySocket连接关闭=====', event.code, event.reason)
        this.isConnecting = false
        // 停止心跳
        clearInterval(this.heartbeatInterval)

        if (!this.isCloseByUser && event.code !== 1000 && event.code !== 1001) {
          this.tryReconnect()
        }
      }

      this.socket.onerror = (error) => {
        console.error('WebSocket错误', error)
        this.isConnecting = false
        if (!this.isCloseByUser) {
          this.tryReconnect()
        }
      }
    } catch (error) {
      this.isConnecting = false
      console.error('创建WebSocket失败', error)
      this.tryReconnect()
    }
  }

  playNotify(type) {
    console.log('----------playNotify-----')

    // if (!store.state.settings.isStartByUser) {
    //   Message({
    //     message: '您有新的订单',
    //     type: 'success',
    //     duration: 2000
    //   })
    // }

    if (type == 0) {
      const audio = new Audio(DingDong)
      audio.play()
    } else if (type == 1) {
      const audio = new Audio(DingDong)
      audio.play()
    }
  }

  // 打开联接后
  onOpen() {
    this.auth() // 认证
    this.startHeartbeat()
    Message({
      message: '订单通知已开启',
      type: 'success',
      duration: 1000
    })
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
    }, 20000) // 每30秒发送一次心跳
  }

  send(data) {
    // console.log("发送消息 send ", data);
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data))
      return true
    }
    return false
  }

  close() {
    if (this.socket) {
      this.socket.close()
    }
  }

  // 清除重连定时器
  clearReconnectTimer() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  tryReconnect() {
    if (this.isDestroyed || this.isCloseByUser) {
      console.log('NotifySocket服务已销毁或用户关闭，停止重连');
      return;
    }

    if (!this.isOnline) {
      console.log('网络离线，停止重连');
      return;
    }

    this.clearReconnectTimer();

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      const delay = Math.min(this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1), 30000); // 指数退避，最大30秒
      
      console.log(`--notifySocket--尝试第${this.reconnectAttempts}次重连，延迟${delay}ms...`)
      Message({
        message: `订单通知连接已断开，正在尝试第${this.reconnectAttempts}次重连...`,
        type: 'warning',
        duration: 2000
      })
      
      this.reconnectTimer = setTimeout(() => {
        if (!this.isDestroyed && !this.isCloseByUser && this.isOnline) {
          this.connentIfy()
        }
      }, delay)
    } else {
      console.log('NotifySocket达到最大重连次数，停止重连');
      // 重置重连次数，等待网络恢复
      this.reconnectAttempts = 0;
    }
  }

  // 销毁NotifySocket服务
  destroy() {
    console.log('销毁NotifySocket服务');
    this.isDestroyed = true;
    this.isCloseByUser = true;
    this.clearReconnectTimer();
    clearInterval(this.heartbeatInterval);
    
    if (this.socket) {
      this.socket.close(1000, 'Service destroyed');
      this.socket = null;
    }
  }
}

let notifySocket = new NotifySocket()

let clickedInSoundBox = true

// 初始化网络状态监听
notifySocket.initNetworkListener()

export function setInSoundBox(clickedInSoundBoxFlag = true){
  clickedInSoundBox = clickedInSoundBoxFlag
}


export function startWebSocket() {
  if (!notifySocket) {
    notifySocket = new NotifySocket()
    notifySocket.initNetworkListener()
  }
  notifySocket.connentIfy()
}

export function closeWebSocket() {
  if (notifySocket) {
    notifySocket.isCloseByUser = true
    notifySocket.close()
    notifySocket = null
  }

  Message({
    message: '订单通知已关闭',
    type: 'error',
    duration: 1000
  })
}
