import { parseNow, randomHeadIcon  } from "@/utils/index";

import store from '@/store/index'
// const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
// const WebSocketUrl =
// `${wsProtocol}//` + location.host + "/chatapi/ws/providerOrderMessage";

// const HEAD_ICON = Math.floor(Math.random() * 11)
// const WebSocketUrl = "ws://192.168.1.195:8001/ws/chat/payer?orderId=4530800909876860223&headIcon=" + HEAD_ICON;

import {parseCiphertext} from '@/utils/index'

function getCiphtText() {

  const ciphertext = store.state.app.ciphertext

  if(!ciphertext){
    // 从路径中解析出加密字符串
    const ciphertext = parseCiphertext()
    if(ciphertext){
      store.commit('app/setCiphertext', ciphertext);
    }
  }

  return ciphertext
  
}


class WebSocketService {
  constructor() {
    this.url = "";
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.messageHandlers = new Set();
    this.heartbeatInterval = 0; // 心跳
    this.messageQueue = []; // 消息缓存队列
    this.isConnecting = false; // 是否正在连接中
    this.statusChangeHandlers = new Set(); // 状态变化监听器
    this.currentStatus = 'disconnected'; // 当前连接状态: connecting, connected, disconnected, reconnecting, error
  }

  connentIfy() {

    if(store.state.chat.isChatRoomClose){
      console.log('----聊天室已经关闭----');
      return
    }


    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.warn("---socket is opened not need reopen --");
      return;
    }

    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const baseUrl =`${wsProtocol}//` + location.host + "/chatapi/ws/chat/payer";

    // const baseUrl =`ws://18.143.77.174:8086/chatapi/ws/chat/payer`;
    
    const ciphertext = getCiphtText()
    if(!ciphertext){
      console.log('-----后台自动联接，条件不足-----');
      return
    }
    
    const params = new URLSearchParams({
      orderId: ciphertext,
      headIcon: randomHeadIcon(),
    });
    const url = `${baseUrl}?${params.toString()}`;
    console.log(url);
    
    this.connect(url);
  }

  connect(url) {
    try {
      this.url = url;
      this.isConnecting = true; // 标记正在连接
      this.updateStatus('connecting'); // 更新状态为连接中
      this.socket = new WebSocket(this.url);

      this.socket.onopen = () => {
        console.log("WebSocket连接成功");
        this.isConnecting = false; // 连接完成
        this.reconnectAttempts = 0; // 重置重连次数
        this.updateStatus('connected'); // 更新状态为已连接
        
        this.onOpen && this.onOpen();
      };

      this.socket.onmessage = (event) => {
        try {
          // console.log("收到消息", event.data);

          const data = JSON.parse(event.data);

          // 处理心跳
          if (data.type === "heartbeat") {
            if (data.data === "PING") {
              this.send({
                type: "heartbeat",
                data: "PONG",
              });
            }
            return; // 心跳消息不触发业务逻辑
          }

          this.messageHandlers.forEach((handler) => handler(data));
        } catch (error) {
          console.error("消息解析错误", error);
        }
      };

      this.socket.onclose = () => {
        console.log("WebSocket连接关闭");
        this.isConnecting = false; // 标记连接已关闭
        this.updateStatus('disconnected'); // 更新状态为已断开
        // 停止心跳
        clearInterval(this.heartbeatInterval);

        this.tryReconnect();
      };

      this.socket.onerror = (error) => {
        console.error("WebSocket错误", error);
        this.updateStatus('error'); // 更新状态为错误
        // 防止错误传播
        if (error && error.preventDefault) {
          error.preventDefault();
        }
      };
    } catch (error) {
      console.error("创建WebSocket失败", error);
      this.updateStatus('error');
      this.isConnecting = false;
    }
  }

  // 打开联接后
  onOpen() {
    // this.auth()
    this.startHeartbeat();
    this.flushMessageQueue(); // 发送缓存的消息
  }

  auth() {
    this.send({
      orderId: "test_orderid",
    });
  }

  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      this.send({
        type: "heartbeat",
        data: "PING",
      });
      // console.log("发送心跳", parseNow());
    }, 10000); // 每30秒发送一次心跳
  }

  send(data) {
    // console.log("webSocket发送消息 send ", data);

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

  close() {
    this.isConnecting = false;
    clearInterval(this.heartbeatInterval); // 停止心跳
    if (this.socket) {
      this.socket.close();
    }
    // 注意：关闭连接时不清空消息队列，以便重连后可以继续发送
    // 如果需要清空，可以调用 clearMessageQueue()
  }

  // 停止重连并关闭连接（用于聊天室关闭等情况）
  stopReconnect() {
    console.log('----停止WebSocket重连----');
    this.reconnectAttempts = this.maxReconnectAttempts; // 设置为最大重连次数，阻止重连
    this.updateStatus('chatroom-closed'); // 更新状态为聊天室已关闭
    this.close(); // 关闭连接
  }

  tryReconnect() {
    // 检查聊天室是否已关闭，如果已关闭则停止重连
    if (store.state.chat.isChatRoomClose) {
      console.log('----聊天室已关闭，停止重连----');
      this.updateStatus('chatroom-closed'); // 更新状态为聊天室已关闭
      return;
    }

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      this.updateStatus('reconnecting'); // 更新状态为重连中
      setTimeout(() => {
        console.log(`尝试第${this.reconnectAttempts}次重连...`);
        this.connentIfy();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      this.updateStatus('failed'); // 更新状态为连接失败
      console.error('WebSocket重连失败，已达到最大重连次数');
    }
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
}

export const webSocketService = new WebSocketService();
