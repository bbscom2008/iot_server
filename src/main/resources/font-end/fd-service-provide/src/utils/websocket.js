import {
  getToken,
  getTokenHead,
  removeToken
} from '@/utils/auth'

import { Message, MessageBox } from 'element-ui'

import {
  getLastMsg,
  getLastTime
} from '@/utils/chat.js'

import MsgNotify from '@/assets/audio/new-notification.mp3'


import store from '@/store/index.js'


function playMsgNotifySound() {
  const audio = new Audio(MsgNotify)
  audio.play()

}



class WebSocketService {
  constructor() {
    this.url = '';
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 2;
    this.reconnectDelay = 1000;
    this.messageHandlers = new Set();
    this.heartbeatInterval = 0; // 心跳
    this.heartbeatTimeoutTimer = null; // 心跳超时定时器
    this.heartbeatTimeout = 6000; // 心跳超时阈值（ms）
    this.connectTimeoutTimer = null; // 连接超时定时器
    this.connectTimeout = 10000; // 连接超时阈值（ms）
    this.isConnecting = false;
    this.isOnline = navigator.onLine; // 网络状态
    this.reconnectTimer = null; // 重连定时器
    this.isDestroyed = false; // 是否已销毁
    this.messageQueue = []; // 消息缓存队列
    this.statusChangeHandlers = new Set(); // 状态变化监听器
    this.currentStatus = 'disconnected'; // 当前连接状态
    this.hasShownReconnectConfirm = false; // 是否已弹出断线确认框
  }

  // 初始化网络状态监听
  initNetworkListener() {
    window.addEventListener('online', () => {
      console.log('网络已连接，尝试重连ChatWebSocket');
      this.isOnline = true;
      if (this.socket && this.socket.readyState !== WebSocket.OPEN) {
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
      console.log('WebSocket服务已销毁，不再连接');
      return;
    }

    const token = getToken()
    if (!token) {
      console.log('---token-is null--');
      return
    }

    if (!this.isOnline) {
      console.log('---网络离线，无法连接---');
      return;
    }

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.log('--chat socket is opened not need reopen --');
      return
    }

    if (this.isConnecting) {
      console.log('---正在联接，不用重联---');
      return
    }

    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    this.url = `${wsProtocol}//` + location.host + "/chatapi/ws/chat/provider?token=" + getToken();

    this.connect()

  }
  connect() {
    try {
      this.isConnecting = true
      this.updateStatus('connecting');
      this.socket = new WebSocket(this.url);
      this.startConnectTimeout();

      this.socket.onopen = () => {
        this.isConnecting = false
        this.clearConnectTimeout();
        console.log("WebSocket连接成功---聊天通知开启---");
        this.reconnectAttempts = 0;
        this.updateStatus('connected');
        this.onOpen && this.onOpen();
        this.flushMessageQueue(); // 发送缓存的消息
      };

      this.socket.onmessage = (event) => {
        try {
          // console.log("收到消息", event.data);

          const data = JSON.parse(event.data);

          // 处理心跳
          if (data.type === "heartbeat") {
            if (String(data.data).toLowerCase() === 'pong') {
              this.clearHeartbeatTimeout();
            }
          } else if (data.type === "conversationNotify") {
            // 会话提醒
          } else if (data.type === "CONVERSATION_COUNT_NOTIFY") {
            // 未读会话数量  提醒 客服头像上的红点
            store.commit('chat/setNewMessageCount', data.payload.unreadConversationCount)
          } else if (data.type === "UNREAD_MESSAGE_COUNT") {
            // 未读会话消息数量更新
            playMsgNotifySound()
            store.commit('chat/updateConversationUnReadCount', data.payload)

          } else if (data.type === "NEW_CONVERSATION_JOIN") {
            // 有新的会话加入
            playMsgNotifySound()
            const item = data.payload.conversation
            item.lastMessageData = data.payload.firstMessage
            item.lastMessageTime = data.payload.conversation.createTime
            item.lastMessage = getLastMsg(item.lastMessageData.data.content)
            item.title = `${item.payeeAccountName} : ${item.productName}`
            item.time = getLastTime(item.lastMessageTime)
            item.msgCount = 1

            console.log(item);

            // 会话提醒
            store.commit('chat/addCoversationItem', item)

          } else if (data.type === "NEW_CONVERSATION_NOTIFY") {
            // 新增会话
            // console.log('新增会话 -- 添加提醒');
            playMsgNotifySound()
            store.commit('chat/setNewMessageCount', 1)

          } else if (data.type === "message") {
            // 聊天的业务
            // 当前消息是正在聊天的页面的消息时，才会进入会话

            if (store.state.chat.currConversation.conversationId == data.conversationId) {
              this.messageHandlers.forEach((handler) => handler(data));
            }
          }

        } catch (error) {
          console.error("消息解析错误", error);
        }
      };

      this.socket.onclose = (event) => {
        console.log("WebSocket连接关闭", event.code, event.reason);
        this.isConnecting = false
        this.clearConnectTimeout();
        this.updateStatus('disconnected');
        // 停止心跳
        clearInterval(this.heartbeatInterval)
        this.clearHeartbeatTimeout();

        // 只有在非正常关闭时才重连
        // if (event.code !== 1000 && event.code !== 1001) {
        //   this.tryReconnect();
        // }
      };

      this.socket.onerror = (error) => {
        console.error("WebSocket错误", error);
        this.isConnecting = false
        this.clearConnectTimeout();
        this.updateStatus('error');
        this.clearHeartbeatTimeout();
        // 错误时也尝试重连
        this.tryReconnect();
      };

    } catch (error) {
      this.isConnecting = false
      this.updateStatus('error');
      console.error("创建WebSocket失败", error);
      // 创建失败也尝试重连
      this.tryReconnect();
    }
  }

  // 打开联接后
  onOpen() {
    // this.auth()
    this.startHeartbeat()
  }

  auth() {
    this.send({
      orderId: 'test_orderid',
    });
  }

  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      this.send({
        type: "heartbeat",
        data: 'PING',
      });
      this.startHeartbeatTimeout();
      // console.log("发送心跳", parseNow());
    }, 20000); // 每30秒发送一次心跳
  }

  startHeartbeatTimeout() {
    this.clearHeartbeatTimeout();
    this.heartbeatTimeoutTimer = setTimeout(() => {
      console.warn('心跳超时，视为连接断开，触发重连');
      this.updateStatus('disconnected');
      if (this.socket) {
        this.socket.close(4000, 'Heartbeat timeout');
      }
      this.tryReconnect();
    }, this.heartbeatTimeout);
  }

  clearHeartbeatTimeout() {
    if (this.heartbeatTimeoutTimer) {
      clearTimeout(this.heartbeatTimeoutTimer);
      this.heartbeatTimeoutTimer = null;
    }
  }

  startConnectTimeout() {
    this.clearConnectTimeout();
    this.connectTimeoutTimer = setTimeout(() => {
      if (this.socket && this.socket.readyState !== WebSocket.OPEN) {
        console.warn('连接超时，视为连接失败，触发重连');
        this.isConnecting = false;
        this.updateStatus('error');
        try {
          this.socket.close(4001, 'Connect timeout');
        } catch (e) {
          console.error('连接超时关闭失败', e);
        }
        this.tryReconnect();
      }
    }, this.connectTimeout);
  }

  clearConnectTimeout() {
    if (this.connectTimeoutTimer) {
      clearTimeout(this.connectTimeoutTimer);
      this.connectTimeoutTimer = null;
    }
  }


  send(data) {
    // console.log("发送消息 send ", data);

    // 如果连接已经建立，直接发送
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
      return true;
    }

    // 如果正在连接中或连接未建立，将消息加入缓存队列
    if (this.isConnecting || (this.socket && this.socket.readyState === WebSocket.CONNECTING)) {
      console.log("WebSocket正在连接中，消息已加入缓存队列", data);
      this.messageQueue.push(data);
      return true;
    }

    // 如果连接已关闭，尝试重连并缓存消息
    console.warn("WebSocket未连接，消息已加入缓存队列，尝试重连", data);
    this.messageQueue.push(data);
    this.connentIfy(); // 尝试重新连接
    return false;
  }

  // 发送缓存队列中的所有消息
  flushMessageQueue() {
    if (this.messageQueue.length === 0) {
      return;
    }

    console.log(`开始发送缓存的 ${this.messageQueue.length} 条消息`);

    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify(message));
        console.log("发送缓存消息", message);
      } else {
        // 如果发送过程中连接断开，将消息放回队列
        this.messageQueue.unshift(message);
        console.warn("发送缓存消息失败，连接已断开");
        break;
      }
    }
  }

  // 清空消息队列
  clearMessageQueue() {
    this.messageQueue = [];
    console.log("消息队列已清空");
  }

  addMessageHandler(handler) {
    this.messageHandlers.add(handler);
  }

  removeMessageHandler(handler) {
    this.messageHandlers.delete(handler);
  }

  // 更新连接状态并通知监听器
  updateStatus(status) {
    if (this.currentStatus !== status) {
      const oldStatus = this.currentStatus;
      this.currentStatus = status;
      console.log(`WebSocket状态变化: ${oldStatus} -> ${status}`);

      // 通知所有状态变化监听器
      this.statusChangeHandlers.forEach((handler) => {
        try {
          handler(status, oldStatus);
        } catch (error) {
          console.error('状态变化处理器执行错误', error);
        }
      });
    }
  }

  // 添加状态变化监听器
  addStatusChangeHandler(handler) {
    this.statusChangeHandlers.add(handler);
    // 立即通知当前状态
    handler(this.currentStatus, null);
  }

  // 移除状态变化监听器
  removeStatusChangeHandler(handler) {
    this.statusChangeHandlers.delete(handler);
  }

  // 获取当前连接状态
  getStatus() {
    return this.currentStatus;
  }

  close() {
    this.isConnecting = false;
    clearInterval(this.heartbeatInterval); // 停止心跳
    this.clearHeartbeatTimeout();
    this.clearConnectTimeout();
    if (this.socket) {
      this.socket.close();
    }
    // 注意：关闭连接时不清空消息队列，以便重连后可以继续发送
    // 如果需要清空，可以调用 clearMessageQueue()
  }

  // 进入会话
  enterConversation(conversationId) {
    const id = conversationId || (store.state.chat.currConversation && store.state.chat.currConversation.conversationId)
    if (!id) {
      return
    }
    this.send({
      type: "readConversation",
      conversationId: id
    })
  }

  // 退出会话
  exitConversation(conversationId) {
    const id = conversationId || (store.state.chat.currConversation && store.state.chat.currConversation.conversationId)
    if (!id) {
      return
    }
    this.send({
      type: "exitConversation",
      conversationId: id
    })
  }


  // 清除重连定时器
  clearReconnectTimer() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  tryReconnect() {
    console.log('---tryReconnect---', this.reconnectAttempts);
    
    if (this.isDestroyed) {
      console.log('WebSocket服务已销毁，停止重连');
      return;
    }

    if (!this.isOnline) {
      console.log('网络离线，停止重连');
      return;
    }

    this.clearReconnectTimer();

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      this.updateStatus('reconnecting');
      const delay = Math.min(this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1), 10000); // 指数退避，最大30秒

      console.log(`尝试第${this.reconnectAttempts}次重连，延迟${delay}ms...`);
      Message({
        message: `连接已断开，正在尝试第${this.reconnectAttempts}次重连...`,
        type: 'warning',
        duration: 2000
      })

      this.reconnectTimer = setTimeout(() => {
        if (!this.isDestroyed && this.isOnline) {
          this.connentIfy();
        }
      }, delay);
    } else {
      this.updateStatus('failed');
      console.log('达到最大重连次数，停止重连');
      
      // 在页面弹出一个确认框，提示用户连接已断开，点击确认重新加载页面
      if (!this.hasShownReconnectConfirm) {
        // 重置重连次数，等待网络恢复
        this.reconnectAttempts = 0;
        this.hasShownReconnectConfirm = true;
        MessageBox.confirm('连接已断开，请重新加载页面。', '警告', {
          confirmButtonText: '重新加载',
          showCancelButton: false,
          type: 'error',
          closeOnClickModal: false,
          closeOnPressEscape: false
        }).then(() => {
          window.location.reload();
        });
      }


    }
  }

  // 销毁WebSocket服务
  destroy() {
    console.log('销毁WebSocket服务');
    this.isDestroyed = true;
    this.clearReconnectTimer();
    clearInterval(this.heartbeatInterval);
    this.clearHeartbeatTimeout();
    this.clearConnectTimeout();

    if (this.socket) {
      this.socket.close(1000, 'Service destroyed');
      this.socket = null;
    }

    // 移除网络状态监听
    window.removeEventListener('online', this.onOnlineHandler);
    window.removeEventListener('offline', this.onOfflineHandler);
  }

}

export const webSocketService = new WebSocketService();

// 初始化网络状态监听
webSocketService.initNetworkListener();
