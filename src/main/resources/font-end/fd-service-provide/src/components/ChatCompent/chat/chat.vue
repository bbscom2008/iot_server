<template>
  <div class="chat-container isShowUi">
    <OrderInfoBox />

    <!-- WebSocket 连接状态提示 -->
    <div v-if="wsConnectionStatus !== 'connected'" class="ws-status-bar">
      <el-alert
        :title="wsStatusMessage"
        :type="wsStatusType"
        :closable="false"
        show-icon
        class="ws-alert"
      >
        <template slot="title">
          <span class="ws-status-text">{{ wsStatusMessage }}</span>
          <el-button 
            v-if="wsConnectionStatus === 'disconnected'" 
            type="text" 
            size="mini" 
            @click="reconnectWebSocket"
            class="reconnect-btn"
          >
            重新连接
          </el-button>
        </template>
      </el-alert>
    </div>

    <!-- 消息列表 -->
    <div
      class="ttsv"
      style="flex: 1;overflow: hidden;"
      
    >
      <div class="message-list" ref="chatContainer" v-scroll="{
        onReachTop: loadHistoreMsg
      }" >
        <div class="chat">
          <!-- 加载状态提示 -->
          <div class="loading-status">
            <!-- 加载中 -->
            <div v-if="isLoading" class="loading-text">加载中...</div>
            <!-- 没有更多数据了 -->
            <div v-if="isNoMore && messageList.length>page.pageSize" class="no-more-text">没有数据了哦~</div>
          </div>

          <div :key="message.messageId" v-for="message in [...welcomeMsg, ...messageList]"  style="width:100%" >
            <!-- 客的消息在左边， -->
            <div class="item-l" v-if="message.from == FromType.client">
              <div class="avatar">
                <img
                  class="img"
                  :src="
                    require(`@/assets/heads/icon${
                      $store.state.chat.currConversation.avatar != null
                        ? $store.state.chat.currConversation.avatar
                        : 0
                    }.png`)
                  "
                  fit="cover"
                  alt=""
                />
              </div>

              <div class="content" style="max-width: 80%" >
                <div class="label" v-for="(item) in message.content" :key="item.messageId">
                  <div v-if="item.type == MessageType.text" @click="(e) => {
                    clipboard(item.text, e)
                  }"  >{{ item.text }}</div>

                  <div v-else-if="item.type == MessageType.system">
                     <OrderStatusItem :item="item.item" />
                  </div>
                  <div v-else-if="item.type == MessageType.qrcard">
                     <QrCodeItem :item="item.text" />
                  </div>

                  <br v-else-if="item.type == MessageType.br" />
                  <div v-else-if="item.type == MessageType.image" style="position: relative">
                    <ImageMessageItem :item="item" :allImagePreview="allImagePreview" />
                  </div>
                  <div v-else-if="item.type == MessageType.video" style="position: relative">
                    <VideoMessageItem :item="item" @playVideo="playVideo" />
                  </div>
                </div>
              </div>
              <!-- <div class="time">{{ getLastTime(message.time) }}</div> -->
              <div class="time">{{ message.time }}</div>
            </div>

            <!-- 码商的消息在右边 -->
            <div class="item-r" v-if="message.from == FromType.provider">
              <!-- <div class="time">{{ getLastTime(message.time) }}</div> -->
              <div class="time">{{ message.time }}</div>
              <div class="content" style="max-width: 80%">
                <div :key="i" class="label" v-for="(item, i) in message.content">
                  <template v-if="item.type == MessageType.text">{{ item.text }}</template>
                  <div v-else-if="item.type == MessageType.system" v-html="item.text"></div>
                  <br v-else-if="item.type == MessageType.br" />
                  <div v-else-if="item.type == MessageType.image">
                    <ImageMessageItem :item="item" :allImagePreview="allImagePreview" />
                  </div>
                  <div v-else-if="item.type == MessageType.qrcard">
                     <QrCodeItem :item="item.text" />
                  </div>
                  <div v-else-if="item.type == MessageType.video">
                    <VideoMessageItem :item="item" @playVideo="playVideo" />
                  </div>
                </div>
              </div>
              <div class="avatar">
                <img class="img" src="@/assets/img/server.jpg" fit="cover" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="chat-input-area">
      <!-- 输入框 -->
      <!-- @click="onClickTextarea" -->
      <el-input
        ref="inputBoxRef"
        id="textinput"
        @keyup.enter.native="sendMessage"
        v-model="inputText"
        class="input-box"
        placeholder="输入消息..."
      ></el-input>


      <!-- 其他工具按钮，如图片、文件 -->
      <div class="toolbar" :style="{ width: inputText ? '100px' : '70px' }">
        <svg
          class="happy"
          @click.stop="clickEmojiBox"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          style="cursor: pointer"
          viewBox="0 0 32 32"
        >
          <path
            d="M16 32c8.837 0 16-7.163 16-16s-7.163-16-16-16-16 7.163-16 16 7.163 16 16 16zM16 3c7.18 0 13 5.82 13 13s-5.82 13-13 13-13-5.82-13-13 5.82-13 13-13zM16 18.711c3.623 0 7.070-0.963 10-2.654-0.455 5.576-4.785 9.942-10 9.942s-9.544-4.371-10-9.947c2.93 1.691 6.377 2.658 10 2.658zM8 11c0-1.657 0.895-3 2-3s2 1.343 2 3c0 1.657-0.895 3-2 3s-2-1.343-2-3zM20 11c0-1.657 0.895-3 2-3s2 1.343 2 3c0 1.657-0.895 3-2 3s-2-1.343-2-3z"
          ></path>
        </svg>

        <i
          class="el-icon-circle-plus-outline"
          v-if="!inputText"
          style="font-size: 30px; cursor: pointer"
          @click="clickMediaPicker"
        ></i>

        <div class="action-bar" v-else>
          <button @click="sendMessage">发送</button>
        </div>
      </div>
    </div>

    <!-- Emoji选择器 -->
    <div style="height: 170px" v-show="showEmoji">
      <emoji-picker @changeValue="insertEmoji" :inputBox="$refs.inputBoxRef"></emoji-picker>
    </div>

    <div class="media-picker-box" style="height: 100px" v-if="showMediaPicker">
      <ImagePicker @select-image="insertLocalMedia"></ImagePicker>
      <videoPicker @select-video="insertLocalMedia"> </videoPicker>
      <quickMessage @select-msg="insertLocalMedia"></quickMessage>
      <quickCardMessage @select-card="insertLocalMedia"></quickCardMessage>
    </div>

    <!-- 全屏视频播放器// -->
    <div class="video-wrap" @click="closeVideo" v-if="showVideo">
      <video class="video-box" :src="currentVideo" controls autoplay></video>
    </div>
    <PasteImage @paste-image="insertLocalMedia" ></PasteImage>
  </div>
</template>

<script>

import clipboard from '@/utils/clipboard'

import emojiPicker from './emoji-picker.vue'
import PasteImage from './paste-image.vue'
import OrderInfoBox from './component/order-info-box.vue'
import ImagePicker from './image-picker.vue'
import VideoMessageItem from './video-message-item.vue'
import ImageMessageItem from './image-message-item.vue'
import videoPicker from './video-picker.vue'
import quickMessage from './quick-message.vue'
import quickCardMessage from './quick-card-message.vue'

import QrCodeItem from './component/qr-code-item.vue'
import OrderStatusItem from './component/order-status-item.vue'

import { generateUniqueId, parseNow, copyInfo } from '@/utils/index'

import {
  getLastTime
} from '@/utils/chat.js'

import { MessageType, FromType } from './utils.js'

import { webSocketService } from '@/utils/websocket.js'


import { getHistoryMessage, getProvideWelcomeMessage } from '@/api/chat.js'



export default {
  components: {
    emojiPicker,
    PasteImage,
    OrderInfoBox,
    OrderStatusItem,
    quickMessage,
    ImagePicker,
    VideoMessageItem,
    ImageMessageItem,
    videoPicker,
    quickCardMessage,
    QrCodeItem,
  },
  data() {
    return {
      currentVideo: '',
      showVideo: false,
      videoContext: '',
      videoId: '',
      allImagePreview: [],
      showMediaPicker: false,
      MessageType,
      FromType,
      lastRange: null, // 保存光标位置
      isFocus: true,
      messageList: [], // 消息列表
      inputText: '', // 输入文本
      showEmoji: false, // 显示Emoji选择器
      scrollTop: 0, // 滚动位置
      selectionStart: 0,
      selectionEnd: 0,
      page: {
        pageSize: 20,
        pageNum: 1
      },
      isLoading: false,
      isNoMore: false,
      scrollContainer: null,
      welcomeMsg: [],
      // WebSocket 连接状态
      wsConnectionStatus: 'connecting', // connecting, connected, disconnected, reconnecting
      wsStatusMessage: '正在连接...',
      wsStatusType: 'info',
      currentConversationId: null
    }
  },
  watch: {
    showMediaPicker() {
      this.$nextTick(() => {
        this.scrollToBottom()
      })
    },
    showEmoji() {
      this.$nextTick(() => {
        this.scrollToBottom()
      })
    },
    orderId(newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        this.switchConversation()
      }
    }
  },
  computed: {
    orderId() {
      return this.$store.state.chat.currChatOrderId
    },
    textareaDom() {
      return this.$refs.inputBoxRef
    },
    isRoomClose(){
      const conversation = this.$store.state.chat.currConversation
      return conversation && conversation.status === 'CLOSE'
    }
  },
  mounted() {
    webSocketService.addMessageHandler(this.handleSocketMessage)
    // 添加WebSocket状态变化监听
    webSocketService.addStatusChangeHandler(this.handleWsStatusChange)
    this.scrollContainer = this.$refs.chatContainer
    this.switchConversation(true)

    // 监听 WebSocket 连接状态
    this.initWebSocketStatusListener()

    if(this.isRoomClose){
      this.$message.error('当前会话已关闭')
    }
  },
  beforeDestroy() {
    if (this.currentConversationId) {
      webSocketService.exitConversation(this.currentConversationId)
    }
    webSocketService.removeMessageHandler(this.handleSocketMessage)
    webSocketService.removeStatusChangeHandler(this.handleWsStatusChange)
    
    // 清理 WebSocket 状态监听
    this.cleanupWebSocketStatusListener()
    
    this.$store.state.chat.currConversation = {}
    this.$store.state.chat.currChatOrderId = ''
  },
  methods: {
    clipboard,
    
    // WebSocket状态变化处理
    handleWsStatusChange(newStatus, oldStatus) {
      console.log('WebSocket状态变化:', oldStatus, '->', newStatus);
      
      // 更新UI状态
      this.updateConnectionStatusUI(newStatus);
      
      // 连接成功时，重试所有待重发的图片消息
      if (newStatus === 'connected') {
        this.retryPendingImageMessages();
      }
    },
    
    // 更新连接状态UI
    updateConnectionStatusUI(status) {
      switch (status) {
        case 'connecting':
          this.updateConnectionStatus('connecting', '正在连接...', 'info');
          break;
        case 'connected':
          this.updateConnectionStatus('connected', '连接正常', 'success');
          break;
        case 'disconnected':
          this.updateConnectionStatus('disconnected', '连接已断开', 'error');
          break;
        case 'reconnecting':
          this.updateConnectionStatus('reconnecting', '正在重连...', 'info');
          break;
        case 'error':
          this.updateConnectionStatus('disconnected', '连接错误', 'error');
          break;
        case 'failed':
          this.updateConnectionStatus('disconnected', '连接失败', 'error');
          break;
      }
    },
    
    // 重试待重发的图片消息
    retryPendingImageMessages() {
      this.messageList.forEach(message => {
        if (message.from === FromType.provider) {
          message.content.forEach(item => {
            if (item.type === MessageType.image && item.pendingResend) {
              console.log('重试发送图片消息:', item.id);
              // 重新发送WebSocket消息
              const newContent = message.content.map((contentItem) => {
                if (contentItem.type === MessageType.image && contentItem.id === item.id) {
                  return {
                    id: contentItem.id,
                    fileId: contentItem.fileId,
                    type: contentItem.type
                  };
                }
                return contentItem;
              });

              const newMessageItem = {
                time: message.time,
                id: message.id,
                from: message.from,
                content: newContent
              };

              const sendResult = webSocketService.send({
                type: 'message',
                orderId: this.$store.state.chat.currChatOrderId,
                data: newMessageItem
              });
              
              if (sendResult) {
                item.pendingResend = false;
                console.log('图片消息重发成功');
              }
            }
          });
        }
      });
    },
    
    // 初始化 WebSocket 状态监听
    initWebSocketStatusListener() {
      // 检查初始连接状态
      this.checkWebSocketStatus()
      
      // 监听网络状态变化
      window.addEventListener('online', this.handleNetworkOnline)
      window.addEventListener('offline', this.handleNetworkOffline)
      
      // 定期检查连接状态
      this.statusCheckInterval = setInterval(() => {
        this.checkWebSocketStatus()
      }, 5000) // 每5秒检查一次
    },

    // 检查 WebSocket 连接状态
    checkWebSocketStatus() {
      if (!webSocketService.socket) {
        this.updateConnectionStatus('disconnected', '连接已断开', 'error')
        return
      }

      switch (webSocketService.socket.readyState) {
        case WebSocket.CONNECTING:
          this.updateConnectionStatus('connecting', '正在连接...', 'info')
          break
        case WebSocket.OPEN:
          this.updateConnectionStatus('connected', '连接正常', 'success')
          break
        case WebSocket.CLOSING:
          this.updateConnectionStatus('disconnected', '连接正在关闭...', 'warning')
          break
        case WebSocket.CLOSED:
          this.updateConnectionStatus('disconnected', '连接已断开', 'error')
          break
        default:
          this.updateConnectionStatus('disconnected', '连接状态未知', 'error')
      }
    },

    // 更新连接状态
    updateConnectionStatus(status, message, type) {
      this.wsConnectionStatus = status
      this.wsStatusMessage = message
      this.wsStatusType = type
    },

    // 处理网络上线
    handleNetworkOnline() {
      console.log('网络已连接')
      this.updateConnectionStatus('connecting', '网络已恢复，正在重连...', 'info')
      // 触发重连
      setTimeout(() => {
        this.checkWebSocketStatus()
      }, 1000)
    },

    // 处理网络离线
    handleNetworkOffline() {
      console.log('网络已断开')
      this.updateConnectionStatus('disconnected', '网络连接已断开', 'error')
    },

    // 手动重连 WebSocket
    reconnectWebSocket() {
      this.updateConnectionStatus('reconnecting', '正在重新连接...', 'info')
      
      // 尝试重新连接
      webSocketService.connentIfy()
      
      // 延迟检查连接状态
      setTimeout(() => {
        this.checkWebSocketStatus()
      }, 2000)
    },

    // 清理 WebSocket 状态监听
    cleanupWebSocketStatusListener() {
      // 移除网络状态监听
      window.removeEventListener('online', this.handleNetworkOnline)
      window.removeEventListener('offline', this.handleNetworkOffline)
      
      // 清理定时器
      if (this.statusCheckInterval) {
        clearInterval(this.statusCheckInterval)
        this.statusCheckInterval = null
      }
    },

    async getWelcomeMessage(){
      const conversation = this.$store.state.chat.currConversation
      if (!conversation || !conversation.conversationId) {
        return
      }
      let ret = await getProvideWelcomeMessage(conversation.conversationId)
      let infos = [{"type":"html","html":"<p>欢迎进入聊天室</p>"}]
      
      try{
        infos = JSON.parse(ret.data).welcomeMessage;
      }catch(e){
        console.log(e);
      }

      infos && infos.forEach((item) => {

        const messageItem = {
          time: parseNow(),
          id: generateUniqueId(),
          from: FromType.provider, // 1 码商  2  客户
          content: [
          ],
        };

        if (item.type == "html") {
          messageItem.content.push({
            type: MessageType.system,
            text: item.html,
          });
        } else if (item.type == "image") {
          messageItem.content.push({
            type: MessageType.image,
            fileId: item.imageFileId,
          });
        } else if (item.type == "video") {
          messageItem.content.push({
            type: MessageType.video,
            videoFileId: item.videoFileId,
          });
        }
        this.welcomeMsg.push(messageItem);
      });
    },
    insertEmoji(v){
      this.inputText = v
    },
    getLastTime,

    keepScrollTop(){
      // 保存当前滚动位置和高度
      const scrollTop = this.scrollContainer.scrollTop;
      const scrollHeight = this.scrollContainer.scrollHeight;

      this.$nextTick(() => {
          // 计算新内容的高度
          const newScrollHeight = this.scrollContainer.scrollHeight;
          const heightDiff = newScrollHeight - scrollHeight;
          
          // 设置滚动位置到原来的位置加上新内容的高度
          this.scrollContainer.scrollTop = scrollTop + heightDiff;
        });
    },

    // 加载历史记录，如果是第一次自动滚动到最下方
    async loadHistoreMsg(isFirst=false) {
      if (this.isLoading || this.isNoMore) {
        return
      }
      this.isLoading = true

      try {
        this.$store.commit('app/setLoadingEnable', false)
        const conversationId = this.currentConversationId
        if (!conversationId) {
          this.isLoading = false
          return
        }

        let ret = await getHistoryMessage(
          conversationId,
          this.page
        )
        this.page.pageNum++

        ret.data.list.map((ele) => {

          if(isFirst){
            ele.payload.data.content.forEach(item=>item.isFirst=true)
          }

          this.handleSocketMessage(ele.payload, true)
        })
        
        if (!isFirst) {
          this.keepScrollTop()
        }
        
        // 判断是否还有更多数据
        if (this.messageList.length >= ret.data.total) {
          this.isNoMore = true
        }

      } catch (err) {
        console.log('err', err)
      } finally {
        this.isLoading = false
      }

      if(isFirst){
        this.scrollToBottom()
      }
    },

    closeVideo() {
      this.showVideo = false
      this.currentVideo = ''
    },

    playVideo(item) {
      this.showVideo = true
      // 如果是本地视频
      if (item.videoFileObj) {
        this.currentVideo = URL.createObjectURL(item.videoFileObj)
      } else {
        this.currentVideo = item.videoUrl
      }
    },

    handleSocketMessage(data, isHistory = false) {
      if (data.type !== 'message') {
        console.error(data);
        return
      }
      const message = data.data

      // 历史消息放前面
      if (isHistory) {
        message.content.forEach(item=>item.isHistory=true)
        this.messageList.unshift(message)
        // this.parseAndShowMessage(message)
      } else {
        // 推送的消息放后面
        message.content.forEach(item=>item.isHistory=false)
        this.messageList.push(message)
        // this.parseAndShowMessage(message, true)
        this.scrollToBottom()
      }

    },

    

    insertLocalMedia(messageItem) {
      console.log('--messageItem--', messageItem)

      // messageItem.content.forEach((item) => {
      //   if (item.type == MessageType.image) {
      //     // 上传成功以后，再加入预览列表
      //     item.index = this.allImagePreview.length
      //     this.allImagePreview.push(item.imgSrc)
      //   } else if (item.type == MessageType.video) {
      //   }
      // })

      this.messageList.push(messageItem)

      this.scrollToBottom()
    },

    clickMediaPicker() {
       if(this.isRoomClose){
        this.$message.error('当前会话已关闭')
        return
      }

      this.showMediaPicker = !this.showMediaPicker
      this.showEmoji = false
    },
    clickEmojiBox() {
      if(this.isRoomClose){
        this.$message.error('当前会话已关闭')
        return
      }
      this.showEmoji = !this.showEmoji
      this.showMediaPicker = false
    },

    // 发送文本消息
    sendMessage() {
      if(this.isRoomClose){
        this.$message.error('当前会话已关闭')
        return
      }
      if (!this.inputText.trim()) return

      let msgList = this.inputText.trim().split(/[\n|\r\n]/g)
      console.log(msgList)

      const contents = []

      msgList.forEach((item, index) => {
        contents.push({
          type: MessageType.text,
          text: item
        })
        if (index < msgList.length - 1) {
          contents.push({
            type: MessageType.br
          })
        }
      })

      const messageItem = {
        time: parseNow(),
        id: generateUniqueId(),
        from: FromType.provider,
        content: contents
      }
      // 先添加到本地列表
      this.messageList.push(messageItem)

      // 发送到服务器 TODO
      const conversation = this.$store.state.chat.currConversation
      if (!conversation || !conversation.conversationId) {
        return
      }
      webSocketService.send({
        type: 'message',
        orderId: this.$store.state.chat.currChatOrderId,
        data: messageItem
      })

      // 清空本地
      this.inputText = ''
      this.scrollToBottom()
    },
    

    // 新增滚动方法
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.chatContainer;
        container.scrollTop = container.scrollHeight;
      });
    },

    resetConversationState() {
      this.messageList = []
      this.welcomeMsg = []
      this.page = {
        pageSize: 20,
        pageNum: 1
      }
      this.isNoMore = false
      this.isLoading = false
    },

    switchConversation(isInitial = false) {
      const conversation = this.$store.state.chat.currConversation
      const newConversationId = conversation && conversation.conversationId

      if (!newConversationId) {
        if (this.currentConversationId) {
          webSocketService.exitConversation(this.currentConversationId)
        }
        this.currentConversationId = null
        this.resetConversationState()
        return
      }

      if (!isInitial && newConversationId === this.currentConversationId) {
        return
      }

      if (!isInitial && this.currentConversationId) {
        webSocketService.exitConversation(this.currentConversationId)
      }

      this.resetConversationState()
      this.currentConversationId = newConversationId
      webSocketService.enterConversation(newConversationId)
      this.getWelcomeMessage()
      this.loadHistoreMsg(true)
    }

  }
}
</script>
<style lang="scss" scoped>
::v-deep .nav-bar.isShowUi {
  border-radius: 0;
}

.video-wrap {
  height: 100vh;
  width: 700px;
  position: absolute;
  top: 0;
  left: 0;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: #000;
  z-index: 100;
}
.video-box {
  height: 400px;
  width: 700px;
  position: absolute;
  top: 0;
  left: 0;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.chat-container {
  height: 100%; /* 88rpx → 44px */
  display: flex;
  flex-direction: column;

  .video {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
  }
}

.message-list {
  flex: 1;
  overflow-y: auto;
  height: 100%;
  padding: 5px 0; /* 10rpx 0 → 5px 0 */
  box-sizing: border-box;
  background-color: #f5f5f5;


  ::v-deep p{
    margin: 0;
    padding: 0;
  }
  .chat {
    padding: 6px; /* 12rpx → 6px */
    display: flex;
    justify-content: flex-end;
    flex-direction: column;
    align-items: flex-end;
    line-height: 1.4;
    min-height: 100%;

    .item-r,
    .item-l {
      display: flex;
      justify-content: flex-start;
      margin: 3px 0; /* 10rpx → 5px */
      width: 100%;
      align-items: flex-start;

      .avatar {
        width: 30px; /* 60rpx → 30px */
        height: 30px; /* 60rpx → 30px */
        border-radius: 5px; /* 10rpx → 5px */
        overflow: hidden;

        // border: 1px solid white;  /* 1.9999px → 1px */
        .img {
          width: 100%;
        }
      }

      .time {
        align-self: flex-end;
        font-size: 10px;
        margin: 5px;
        color: #aaa;
      }

      .content {
        position: relative;
        padding: 5px 10px; /* 10rpx 20rpx → 5px 10px */
        font-size: 14px; /* 28rpx → 14px */
        background-color: #fff;
        min-height: 20px; /* 40rpx → 20px */
        // max-width: 70%;
        border-radius: 5px; /* 10rpx → 5px */
        overflow-wrap: anywhere;

        .time {
          font-size: 12px; /* 24rpx → 12px */
          color: #999;
        }

        .play-icon {
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 45px;
          font-size: 35px;
          color: #333;
          height: 45px;
          background-color: rgba($color: #fff, $alpha: 0.7);
          border-radius: 50%;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }

        .img {
          width: 150px; /* 300rpx → 150px */
        }
      }
    }

    .item-l {
      justify-content: flex-start;

      .content {
        background-color: #fff;
        margin-left: 10px; /* 20rpx → 10px */

        .loading {
          width: 20px; /* 40rpx → 20px */
          height: 20px; /* 40rpx → 20px */
          position: absolute;
          bottom: 5px; /* 10rpx → 5px */
          right: -39px; /* 78rpx → 39px */
        }

        .time {
          text-align: left;
        }

        &::after {
          position: absolute;
          // background-color: red;
          content: '';
          width: 0;
          height: 0;
          border-top: 6px solid transparent; /* 12rpx → 6px */
          border-left: 6px solid transparent; /* 12rpx → 6px */
          border-right: 6px solid #fff; /* 12rpx → 6px */
          border-bottom: 6px solid transparent; /* 12rpx → 6px */
          top: 6px; /* 12rpx → 6px */
          left: -10px; /* 20rpx → 10px */
        }
      }
    }

    .item-r {
      justify-content: flex-end;

      .content {
        margin-right: 10.0001px;
        background-color: #95ec69;

        .loading {
          width: 20px; /* 40rpx → 20px */
          height: 20px; /* 40rpx → 20px */
          position: absolute;
          bottom: 5px; /* 10rpx → 5px */
          left: -39px; /* 78rpx → 39px */
        }

        .time {
          text-align: right;
        }

        &::after {
          position: absolute;
          // background-color: red;
          content: '';
          width: 0;
          height: 0;
          border-top: 6px solid transparent;
          border-left: 6px solid #95ec69;
          border-right: 6px solid transparent;
          border-bottom: 6px solid transparent;
          top: 6px;
          right: -10.0001px;
        }
      }
    }
  }
}

.chat-input-area {
  display: flex;
  align-items: center;
  border-top: 1px solid #ccc; /* 2rpx → 1px */
  background-color: #eee;
  padding: 5px; /* 10rpx → 5px */
  // height: 39px;  /* 78rpx → 39px */

  .toolbar {
    display: flex;
    align-items: center;
    height: 30px;
    overflow: hidden;
    transition: width 0.2s linear;

    // padding: 0.66665px;  /* 1.3333rem → 0.66665px */
    .happy {
      font-size: 24px;
      margin-right: 10.0001px;
      fill: #606266;
    }

    .plus-circle {
      font-weight: 600;
    }

    .action-bar {
      overflow: hidden;

      button {
        padding: 6px 15px;
        font-size: 14px;
        color: white;
        border-radius: 5px;
        background-color: #07c160;
        border: none;
      }
    }
  }

  .input-box {
    flex: 1;
    min-height: 25px; /* 50rpx → 25px */
    font-size: 14px; /* 28rpx → 14px */
    background-color: #fff;
    
    line-height: 1.2;
    outline: none;
    height: auto;
    max-height: 80px; /* 160rpx → 80px */
    overflow-y: auto;
    margin-right: 7.5px; /* 15rpx → 7.5px */
    padding-left: 5px; /* 10rpx → 5px */
    padding-top: 5px; /* 10rpx → 5px */
    ::v-deep input{
      border: none !important;
      padding: 0 !important;
    }
  }
}

.media-picker-box {
  height: 140px;
  background: #f5f5f5;
  display: flex;
  padding: 0 20px;
  gap: 10px;
}

.loading-status {
  padding: 15px;  /* 30rpx → 15px */
  width: 100%;
  text-align: center;
  color: #999;
}
.loading-text,
.no-more-text {
  font-size: 14px;  /* 28rpx → 14px */
}

/* WebSocket 连接状态提示样式 */
.ws-status-bar {
  position: sticky;
  top: 0;
  z-index: 1000;
  margin-bottom: 10px;
  
  .ws-alert {
    border-radius: 4px;
    margin: 0;
    
    .ws-status-text {
      font-size: 14px;
      font-weight: 500;
    }
    
    .reconnect-btn {
      margin-left: 10px;
      color: #409EFF;
      font-size: 12px;
      
      &:hover {
        color: #66b1ff;
      }
    }
  }
}

/* 连接状态动画 */
.ws-status-bar .ws-alert {
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

</style>
