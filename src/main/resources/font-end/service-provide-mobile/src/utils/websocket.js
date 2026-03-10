import {
  getToken,
  getTokenHead,
  removeToken
} from '@/utils/auth'

import {
  getLastMsg,
  getLastTime
} from '@/utils/chat.js'


import JSONbig from 'json-bigint'

const JSONbigString = JSONbig({
  storeAsString: true
})

import store from '@/store/index.js'
import audioCenter  from '@/utils/audioCenter.js'

function playMsgNotifySound(){
  audioCenter.playSound('MESSAGE_NOTIFY')
}



class WebSocketService {
  constructor() {
    this.url = '';
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 20;
    this.reconnectDelay = 1000;
    this.messageHandlers = new Set();
    this.heartbeatInterval = 0; // 心跳
    this.isConnecting = false;
    this.messageQueue = []; // 消息缓存队列
    this.statusChangeHandlers = new Set(); // 状态变化监听器
    this.currentStatus = 'disconnected'; // 当前连接状态
  }

  connentIfy() {
    const token = getToken()
    if (!token) {
      console.log('---token-is null--');
      return
    }

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.log('---chat socket is opened not need reopen --');
      return
    }
    
    if(this.isConnecting){
      console.log('---正在联接，2秒后重联---');
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

      this.socket.onopen = () => {
        this.isConnecting = false
        console.log("chat Socket连接成功");
        this.reconnectAttempts = 0;
        this.updateStatus('connected');
        this.onOpen && this.onOpen();
        this.flushMessageQueue(); // 发送缓存的消息
      };

      this.socket.onmessage = (event) => {
        try {
          // console.log("收到消息", event.data);
          const data = JSONbigString.parse(event.data);

          // 处理心跳
          if (data.type === "heartbeat") {
            if (data.data === 'PING') {
              this.send({
                type: "heartbeat",
                data: 'PONG',
              })
            }
          } else if (data.type === "conversationNotify") {
            // 会话提醒
          } else if (data.type === "CONVERSATION_COUNT_NOTIFY") {
            // 未读会话数量  提醒 客服头像上的红点
            playMsgNotifySound()
            store.commit('setNewMessageCount', data.payload.unreadConversationCount)
          } else if (data.type === "UNREAD_MESSAGE_COUNT") {
            // 未读会话消息数量更新
            store.commit('updateConversationUnReadCount', data.payload)

          } else if (data.type === "NEW_CONVERSATION_JOIN") {
            playMsgNotifySound()
            // 有新的会话加入
           const item = data.payload.conversation
            item.lastMessageData = data.payload.firstMessage
            item.lastMessageTime = data.payload.conversation.createTime
            item.lastMessage = getLastMsg(item.lastMessageData.data.content)
            item.title = `${item.payeeAccountName} : ${ item.productName}`
            item.time = getLastTime(item.lastMessageTime)
            item.msgCount = 1

            console.log(item);

            // 会话提醒
            store.commit('addCoversationItem', item)

          } else if (data.type === "NEW_CONVERSATION_NOTIFY") {
            // 新增会话
            console.log('新增会话 -- 添加提醒');
            playMsgNotifySound()
            store.commit('setNewMessageCount', 1)

          } else if (data.type === "message") {
            // 聊天的业务
						if(store.state.currConversation.conversationId == data.conversationId){
							this.messageHandlers.forEach((handler) => handler(data));
						}
												
          }

        } catch (error) {
          console.error("消息解析错误", error);
          
        }
      };

      this.socket.onclose = () => {
        console.log("=== chat socket===WebSocket连接关闭");
        this.isConnecting = false;
        this.updateStatus('disconnected');
        // 停止心跳
        clearInterval(this.heartbeatInterval)

        this.tryReconnect();
      };

      this.socket.onerror = (error) => {
        console.error("WebSocket错误", error);
        this.updateStatus('error');
      };

    } catch (error) {
      this.isConnecting = false
      this.updateStatus('error');
      console.error("创建WebSocket失败", error);
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
      // console.log("发送心跳", parseNow());
    }, 20000); // 每30秒发送一次心跳
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
      
      // 同步更新store中的状态
      if(store && store.commit){
        store.commit('setWebSocketStatus', status);
      }
      
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
    if (this.socket) {
      this.socket.close();
    }
    // 注意：关闭连接时不清空消息队列，以便重连后可以继续发送
    // 如果需要清空，可以调用 clearMessageQueue()
  }

  // 进入会话
  enterConversation() {
    this.send({
      type: "readConversation",
      conversationId: store.state.currConversation.conversationId
    })
  }

  // 退出会话
  exitConversation() {
    this.send({
      type: "exitConversation",
      conversationId: store.state.currConversation.conversationId
    })
		// 清空 当前会话
		store.state.currConversation={}
  }


  tryReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      this.updateStatus('reconnecting');
      setTimeout(() => {
        console.log(`----chat socket 尝试第${this.reconnectAttempts}次重连...`);
        this.connentIfy();
      }, this.reconnectAttempts * this.reconnectDelay);
    } else {
      this.updateStatus('failed');
      console.error('WebSocket重连失败，已达到最大重连次数');
    }
  }

}

export const webSocketService = new WebSocketService();