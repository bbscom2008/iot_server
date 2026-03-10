<template>
  <view class="chat-container isShowUi" :style="containerHeight">
    <!-- height: (pxToRpx($store.state.windowsSize.height) - 88 )+'rpx' }" -->
    <custom-nav-bar title="聊天页面"> </custom-nav-bar>
    <ReSizeHandler></ReSizeHandler>

    <!-- <view> this.selectionStart : {{ selectionStart }} </view>
    <view> this.selectionEnd : {{ selectionEnd }} </view> -->
    <OrderInfoBoxVue :showOrderInfo.sync="showOrderInfo"></OrderInfoBoxVue>
    <!-- 消息列表 -->
    <view class="ttsv" style="flex: 1; overflow: auto">
      <scroll-view
        class="message-list"
        scroll-y
        :show-scrollbar="true"
        ref="chatContainer"
        :scroll-top="scrollTop"
        @scrolltoupper="loadMore"
        @click="closePickerBox()"
      >
        <view class="chat">
          <template v-for="message in [...welcomeMsg, ...messageList]" >
            <!-- 客户的消息在左边， -->
            <view class="item-l" v-if="message.from == FromType.client" :key="message.messageId">
              <view class="avatar">
                <image
                  class="img"
                  :src="`/static/heads/icon${
                    $store.state.currConversation.avatar != null
                      ? $store.state.currConversation.avatar
                      : 0
                  }.png`"
                  mode="widthFix"
                  alt=""
                />
              </view>

              <view class="content" v-for="(item, i) in message.content" :key="i"  :style="{padding: item.type && item.type == MessageType.system ? '0px' : '8rpx'}"  >
                <view  >
                  <view :key="i" @click="copyInfo(item.text)" v-if="item.type == MessageType.text">{{
                    item.text
                  }}</view>

                  <!-- <rich-text
                    v-else-if="item.type == MessageType.system"
                    :nodes="item.text"
                  /> -->

                  <view v-else-if="item.type == MessageType.system">
                     <OrderStatusItem :item="item.item" />
                  </view>

                  <br v-else-if="item.type == MessageType.br"  />

                  <view v-else-if="item.type == MessageType.image" >
                    <ImageMessageItem
                      :item="item"
                      :allImagePreview="allImagePreview"
                      @call-parent="callPrent"
                    ></ImageMessageItem>
                  </view>

                  <view v-else-if="item.type == MessageType.qrcard">
                     <QrCodeItem :item="item.text" />
                  </view>

                  <view
                    v-else-if="item.type == MessageType.video"
                    style="position: relative"
                  >
                    <VideoMessageItem
                      :item="item"
                      @call-parent="(e) => callPrent(e, item)"
                    ></VideoMessageItem>
                  </view>
                </view>
              </view>

              <!-- <view class="time">{{ getLastTime(message.time) }}</view> -->
              <view class="time">{{ message.time }}</view>


            </view>

            <!-- 客户的消息在右边 -->
            <view class="item-r" v-if="message.from == FromType.provider" :key="message.messageId">
              <!-- <view class="time">{{ getLastTime(message.time) }}</view> -->
              <view class="time">{{ message.time }}</view>

              <view class="content">
                <view v-for="(item, i) in message.content" :key="i">
                  <view :key="i" @click="copyInfo(item.text)" 
                  v-if="item.type == MessageType.text">{{
                    item.text
                  }}</view>

                  <rich-text
                    v-else-if="item.type == MessageType.system"
                    :nodes="item.text"
                  ></rich-text>

                  <br v-else-if="item.type == MessageType.br" />

                  <view
                    v-else-if="item.type == MessageType.image"
                    style="position: relative"
                  >
                    <ImageMessageItem
                      :item="item"
                      :allImagePreview="allImagePreview"
                      @call-parent="callPrent"
                    ></ImageMessageItem>
                  </view>

                  <view v-else-if="item.type == MessageType.qrcard">
                     <QrCodeItem :item="item.text" />
                  </view>

                  <view
                    v-else-if="item.type == MessageType.video"
                    style="position: relative"
                  >
                    <VideoMessageItem
                      :item="item"
                      @call-parent="(e) => callPrent(e, item)"
                    ></VideoMessageItem>
                  </view>
                </view>
              </view>
              <view class="avatar">
                <image
                  class="img"
                  src="/static/imgs/server.jpg"
                  mode="widthFix"
                  alt=""
                />
              </view>
            </view>
          </template>
        </view>
      </scroll-view>
    </view>

    <view class="chat-input-area">
      <!-- 输入框 -->
      <!-- @input="updateCursor" -->
      <textarea
        ref="inputBoxRef"
        id="textinput"
        :focus="isFocus"
        auto-height
        @click="onClickTextarea"
        @focus="onInputFocus"
        @keyup.enter.native="sendMessage"
        v-model="inputText"
        class="input-box"
        placeholder="输入消息..."
      ></textarea>

      <!-- 其他工具按钮，如图片、文件 -->
      <view class="toolbar" :style="{ width: inputText ? '120rpx' : '70rpx' }">
        <!-- <svg
          class="happy"
          @click.stop="clickEmojiBox"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 32 32"
        >
          <path
            d="M16 32c8.837 0 16-7.163 16-16s-7.163-16-16-16-16 7.163-16 16 7.163 16 16 16zM16 3c7.18 0 13 5.82 13 13s-5.82 13-13 13-13-5.82-13-13 5.82-13 13-13zM16 18.711c3.623 0 7.070-0.963 10-2.654-0.455 5.576-4.785 9.942-10 9.942s-9.544-4.371-10-9.947c2.93 1.691 6.377 2.658 10 2.658zM8 11c0-1.657 0.895-3 2-3s2 1.343 2 3c0 1.657-0.895 3-2 3s-2-1.343-2-3zM20 11c0-1.657 0.895-3 2-3s2 1.343 2 3c0 1.657-0.895 3-2 3s-2-1.343-2-3z"
          ></path>
        </svg> -->

        <u-icon
          name="plus-circle"
          size="30"
          class="plus-circle"
          v-if="!inputText"
          @click="clickMediaPicker"
        ></u-icon>

        <view class="action-bar" v-else>
          <button @click="sendMessage">发送</button>
        </view>
      </view>
    </view>

    <!-- Emoji选择器 -->
    <view style="height: 338rpx" v-if="showEmoji">
      <emoji-picker
        @select="insertEmoji"
        @close="showEmoji = false"
      ></emoji-picker>
    </view>
    
    <view style="height: 280rpx" v-if="showMediaPicker">
      <media-picker
        @select-image="insertLocalMedia"
        @close="showMediaPicker = false"
      ></media-picker>
    </view>

    <!-- 全屏视频播放器 -->
    <video
      class="video"
      :id="videoId"
      ref="videoRef"
      :src="currentVideo"
      v-if="showVideo"
      autoplay
      controls
      @fullscreenchange="onFullscreenChange"
    ></video>
  </view>
</template>

<script>
import OrderStatusItem from './ChatCompent/order-status-item.vue'
import ReSizeHandler from './resize-handler.vue'
import emojiPicker from './emoji-picker.vue'
import mediaPicker from './media-picker.vue'

import { generateUniqueId, parseNow, copyInfo } from '@/utils/index'

import ImageMessageItem from './image-message-item.vue'
import VideoMessageItem from './video-message-item.vue'

import { MessageType, FromType } from './utils.js'

import { webSocketService } from '@/utils/websocket.js'

import { getLastTime } from "@/utils/chat.js";

import { getHistoryMessage, getProvideWelcomeMessage  } from '@/api/chat.js'
import { pxToRpx, rpxToPx } from '@/utils/index.js'

import OrderInfoBoxVue from './ChatCompent/OrderInfoBox.vue'
import QrCodeItem from './ChatCompent/qr-code-item.vue'
export default {
  components: {
    emojiPicker,
    OrderInfoBoxVue,
    VideoMessageItem,
    ImageMessageItem,
    ReSizeHandler,
    mediaPicker,
    OrderStatusItem,
    QrCodeItem
  },
  data() {
    return {
      isLoading: false,
      isNoMore: false,
      orderInfo: {}, // 订单信息
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
      showOrderInfo: false,
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
      scrollContainer: null,
      welcomeMsg: []
    }
  },
  computed: {
    containerHeight() {
      console.log(
        '----containerHeight-----',
        this.$store.state.windowsSize.height
      )
      return {
        paddingTop: this.$store.state.navBarHeight + 'rpx',
        height: this.$store.state.windowsSize.height - 50 + 'px'
      }
    },

    orderId() {
      return this.$store.state.currChatOrderId
    },
    textareaDom() {
      return this.$refs.inputBoxRef.$el.querySelector('textarea')
    },
    isRoomClose(){
      return this.$store.state.currConversation.status == 'CLOSE'
    }
  },
  mounted() {
    webSocketService.addMessageHandler(this.handleSocketMessage)
    // 添加WebSocket状态变化监听
    webSocketService.addStatusChangeHandler(this.handleWsStatusChange)
    // 进入会话
    webSocketService.enterConversation()
    this.scrollContainer = this.$refs.chatContainer

    this.getWelcomeMessage()
    this.loadHistoreMsg(true)

    // console.log('=====this.$store.state.currConversation===');
    // console.log(this.$store.state.currConversation);
  
    if(this.$store.state.currConversation.status == 'CLOSE'){
				uni.showToast({
					title:'聊天室已结束',
					icon: 'none'
				})
			}

  },
  beforeDestroy() {
    // 进入会话
    webSocketService.exitConversation()
    webSocketService.removeMessageHandler(this.handleSocketMessage)
    webSocketService.removeStatusChangeHandler(this.handleWsStatusChange)
  },
  methods: {
    getLastTime,
    copyInfo,
    pxToRpx,
    rpxToPx,
    
    // WebSocket状态变化处理
    handleWsStatusChange(newStatus, oldStatus) {
      console.log('WebSocket状态变化:', oldStatus, '->', newStatus);
      
      // 连接成功时，重试所有待重发的图片消息
      if (newStatus === 'connected') {
        this.retryPendingImageMessages();
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
                orderId: this.$store.state.currChatOrderId,
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
    async getWelcomeMessage(){
      let ret = await getProvideWelcomeMessage(this.$store.state.currConversation.conversationId)
      
     try{
      let infos = JSON.parse(ret.data).welcomeMessage;
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
     }catch(e){
      console.log(e);
      
     }


    },
    callPrent(e, item) {
      console.log(e)
      if (e == 'scrollToBottom') {
        this.scrollToBottom()
      } else if (e == 'keepScrollTop') {
        this.keepScrollTop()
      }  else if (e == 'playVideo') {
        this.playVideo(item)
      } 
    },
    async loadHistoreMsg(isFirst = false) {
      if (this.isLoading || this.isNoMore) {
        return
      }
      this.isLoading = true

      try {
        // this.$store.commit('setLoadingEnable', false)
        let ret = await getHistoryMessage(
          this.$store.state.currConversation.conversationId,
          this.page
        )

        this.page.pageNum++

        ret.data.list.map((ele) => {
          if (isFirst) {
            ele.payload.data.content.forEach((item) => (item.isFirst = true))
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
      } catch (e) {
        console.log(e)
      } finally {
        this.isLoading = false
      }

      if (isFirst) {
        this.scrollToBottom()
      }
    },

    playVideo(item) {
      console.log('0000----playVideo-------', item)
      this.currentVideo = item.videoUrl
      this.showVideo = true
      this.videoId = 'video-' + Date.now()

      this.$nextTick(() => {
        // 创建视频上下文
        this.videoContext = uni.createVideoContext(
          this.videoId,
          this.$refs.videoRef
        )
        // 进入全屏
        this.videoContext.requestFullScreen()
      })
    },
    onFullscreenChange(e) {
      if (!e.detail.fullScreen) {
        // 退出全屏时停止播放并隐藏视频
        this.videoContext.stop()
        this.showVideo = false
      }
    },

    imageLoad(e, item) {
      console.log('----imageLoad-----')
      // console.log(e);
      // console.log(item);
      item.loading = false
      this.$forceUpdate()
      this.scrollToBottom()
    },

    handleSocketMessage(data, isHistory = false) {
      if (data.type !== 'message') {
        console.error(data)
        return
      }
      const message = data.data

      // 历史消息放前面
      if (isHistory) {
        message.content.forEach((item) => (item.isHistory = true))
        this.messageList.unshift(message)
        // this.parseAndShowMessage(message)
      } else {
        // 推送的消息放后面
        message.content.forEach((item) => (item.isHistory = false))
        this.messageList.push(message)
        // this.parseAndShowMessage(message, true)
        this.scrollToBottom()
      }
    },
    // parseAndShowMessage(message) {
    //   message.content.forEach((item) => {
    //     if (item.type == MessageType.image) {
    //       item.loading = true
    //       this.$store.commit('setLoadingEnable', false)

    //       getFileById(item.fileId).then((res) => {
    //         item.imgSrc = res.data.fileUrl
    //         // 加入预览
    //         item.index = this.allImagePreview.length
    //         item.loading = false
    //         this.allImagePreview.push(item.imgSrc)
    //         this.$forceUpdate()
    //       })
    //     } else if (item.type == MessageType.video) {
    //       item.loading = true
    //       this.$store.commit('setLoadingEnable', false)
    //       getFileById(item.videoFileId).then((res) => {
    //         item.videoUrl = res.data.fileUrl
    //       })

    //       this.$store.commit('setLoadingEnable', false)
    //       getFileById(item.thumbFileId).then((res) => {
    //         item.thumbImgSrc = res.data.fileUrl
    //         item.loading = false
    //         this.$forceUpdate()
    //       })
    //     }
    //   })
    // },
    insertLocalMedia(messageItem) {
      console.log('--messageItem--', messageItem)

      // messageItem.content.forEach((item) => {
      //   if (item.type == MessageType.image) {
      //   } else if (item.type == MessageType.video) {
      //   }
      // })
      this.messageList.push(messageItem)

      this.scrollToBottom()
    },

    updateCursor() {
      if (this.textareaDom != null) {
        this.selectionStart = this.textareaDom.selectionStart
        this.selectionEnd = this.textareaDom.selectionEnd
      } else {
        // 放最后
        this.selectionStart = this.inputText.length
        this.selectionEnd = this.inputText.length
      }
    },
    // 点击文本区域时更新光标位置
    onClickTextarea(e) {
      this.closePickerBox()
      this.updateCursor()
    },
    
    // 输入框获得焦点时（键盘弹出）滚动到底部
    onInputFocus() {
      this.closePickerBox()
      this.updateCursor()
      // 延迟滚动，等待键盘完全弹出
      setTimeout(() => {
        this.scrollToBottom()
      }, 300)
    },

    keepFocus() {
      // 先失去焦点再重新获取，确保光标显示
      this.isFocus = false

      // 插入emoji前先隐藏键盘
      uni.hideKeyboard()

      this.$nextTick(() => {
        this.isFocus = true
        // 插入emoji前先隐藏键盘
        uni.hideKeyboard()

        this.textareaDom.setSelectionRange(
          this.selectionStart,
          this.selectionEnd
        )
        // 插入emoji前先隐藏键盘
        uni.hideKeyboard()

        // 添加一个小延迟确保聚焦成功
        setTimeout(() => {
          this.isFocus = true
          setTimeout(() => {
            this.textareaDom.setSelectionRange(
              this.selectionStart,
              this.selectionEnd
            )
            // 插入emoji前先隐藏键盘
            uni.hideKeyboard()
          }, 100)
        }, 50)
      })
    },

    closePickerBox() {
      this.showEmoji = false
      this.showMediaPicker = false
    },

    clickMediaPicker() {
      if(this.isRoomClose){
        uni.showToast({
          title: '房间已关闭',
          icon: 'none'
        })
        return 
      }
      

      this.showMediaPicker = !this.showMediaPicker
      this.showEmoji = false

      if (this.showMediaPicker) {
        uni.hideKeyboard()
      }
    },
    clickEmojiBox() {
      if(this.isRoomClose){
        uni.showToast({
          title: '房间已关闭',
          icon: 'none'
        })
        return 
      }
      this.showEmoji = !this.showEmoji
      this.showMediaPicker = false
      this.keepFocus()
    },
    // 发送文本消息
    sendMessage() {
      if(this.isRoomClose){
        uni.showToast({
          title: '房间已关闭',
          icon: 'none'
        })
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
      webSocketService.send({
        type: 'message',
        orderId: this.$store.state.currChatOrderId,
        data: messageItem
      })

      // 清空本地
      this.inputText = ''
      this.scrollToBottom()

      this.keepFocus()
    },
    // 插入表情的核心方法
    insertEmoji(emoji) {
      // 插入emoji前先隐藏键盘
      uni.hideKeyboard()

      // 使用Array.from确保正确处理Unicode字符
      let pre = this.inputText.substring(0, this.selectionStart)
      let after = this.inputText.substring(this.selectionEnd)

      this.inputText = pre + emoji + after

      this.selectionStart += emoji.length
      this.selectionEnd = this.selectionStart

      // 保持焦点
      // this.keepFocus()
    },

    insertMedia() {},

    // 滚动到底部
    scrollToBottom() {
      this.scrollTop = 99998
      this.$nextTick(() => {
        this.scrollTop = 99999 // 足够大的值确保滚动到底
      })
    },

    keepScrollTop() {
      // 保存当前滚动位置和高度
      console.log(this.scrollContainer)
      const scrollTop = this.scrollContainer.$el.firstChild.firstChild.scrollTop
      const scrollHeight =
        this.scrollContainer.$el.firstChild.firstChild.scrollHeight

      this.$nextTick(() => {
        // 计算新内容的高度
        const newScrollHeight =
          this.scrollContainer.$el.firstChild.firstChild.scrollHeight
        const heightDiff = newScrollHeight - scrollHeight

        // 设置滚动位置到原来的位置加上新内容的高度
        this.scrollTop = scrollTop + heightDiff
      })
    },

    // 加载更多消息
    loadMore() {
      // 实现分页加载逻辑
      this.loadHistoreMsg()
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .nav-bar.isShowUi {
  border-radius: 0;
}

.chat-container {
  // height: calc(100vh - 88rpx);
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

  // padding: 20rpx;
  height: 100%;
  // background-color: pink;
  padding: 10rpx 0;
  box-sizing: border-box;
  background-color: #f5f5f5;

  .chat {
    padding: 12rpx;
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
      margin: 10rpx 0;
      width: 100%;
      align-items: flex-start;

      .avatar {
        width: 60rpx;
        height: 60rpx;
        border-radius: 10rpx;
        overflow: hidden;

        // border: 1.9999px solid white;
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
        padding: 10rpx 20rpx;
        font-size: 28rpx;
        background-color: #fff;
        min-height: 40rpx;
        max-width: 70%;
        border-radius: 10rpx;
        overflow-wrap: anywhere;

        .time {
          font-size: 24rpx;
          color: #999;
        }

        .img {
          width: 300rpx;
        }
      }
    }

    .item-l {
      justify-content: flex-start;

      .content {
        background-color: #fff;
        margin-left: 20rpx;

        .loading {
          width: 40rpx;
          height: 40rpx;
          position: absolute;
          bottom: 10rpx;
          right: -78rpx;
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
          border-top: 12rpx solid transparent;
          border-left: 12rpx solid transparent;
          border-right: 12rpx solid #fff;
          border-bottom: 12rpx solid transparent;
          top: 12rpx;
          left: -20rpx;
        }
      }
    }

    .item-r {
      justify-content: flex-end;

      .content {
        margin-right: 10.0001px;
        background-color: #95ec69;

        .loading {
          width: 40rpx;
          height: 40rpx;
          position: absolute;
          bottom: 10rpx;
          left: -78rpx;
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
  align-items: flex-start;
  border-top: 2rpx solid #ccc;
  background-color: #eee;
  padding: 10rpx;
  // height: 78rpx;

  .toolbar {
    display: flex;
    align-items: center;
    height: 30px;
    overflow: hidden;
    transition: width 0.2s linear;

    // padding: 1.3333rem;
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
    min-height: 50rpx;
    font-size: 28rpx;
    background-color: #fff;
    line-height: 1.2;
    outline: none;
    height: 100rpx !important;
    max-height: 160rpx;
    overflow-y: auto;
    margin-right: 15rpx;
    padding-left: 10rpx;
    padding-top: 10rpx;
  }
}
</style>
