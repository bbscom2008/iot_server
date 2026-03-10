<template>
  <div class="chat-container isShowUi">
    <!-- 消息列表 -->
    <div
      class="ttsv"
      style="flex: 1;"
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

          <template v-for="message in messageList">
            <!-- 码商的消息在左边， -->
            <!-- 客的消息在左边， -->
            <div class="item-l" v-if="message.from == FromType.client" :key="message.id" >
              <div class="avatar">
                <img
                  class="img"
                  :src="
                    require(`@/assets/heads/icon0.png`)
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
            <div class="item-r" v-if="message.from == FromType.provider" :key="message.id" >
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
          </template>
        </div>
      </div>
    </div>

    <!-- 全屏视频播放器// -->
    <div class="video-wrap" @click="closeVideo" v-if="showVideo">
      <video class="video-box" :src="currentVideo" controls autoplay></video>
    </div>
  </div>
</template>

<script>

import QrCodeItem from './component/qr-code-item.vue'
import OrderStatusItem from './component/order-status-item.vue'
import {
  getLastTime
} from '@/utils/chat.js'

import { MessageType, FromType } from './utils.js'

import { getHistoryMessageByOrderId } from '@/api/chat.js'


import VideoMessageItem from './video-message-item.vue'
import ImageMessageItem from './image-message-item.vue'


export default {
  components: {
    VideoMessageItem,
    ImageMessageItem,
    OrderStatusItem,
    QrCodeItem
  },
  props: {
    orderId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      currentVideo: '',
      showVideo: false,
      allImagePreview: [],
      MessageType,
      FromType,
      messageList: [], // 消息列表
      scrollTop: 0, // 滚动位置
      page: {
        pageSize: 20,
        pageNum: 1
      },
      isLoading: false,
      isNoMore: false,
      scrollContainer: null,

    }
  },

  mounted() {
    this.scrollContainer = this.$refs.chatContainer
    this.loadHistoreMsg(true)
  },
  methods: {
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
        let ret = await getHistoryMessageByOrderId(
          this.orderId,
          this.page
        )
        this.page.pageNum++

        ret.data.list.forEach((ele) => {
          if(isFirst){
            ele.payload.data.content.forEach(item=>item.isFirst=true)
          }
          this.handleSocketMessage(ele.payload, true)
        })
        this.keepScrollTop()
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
      const message = data.data
      // 历史消息放前面
      if (isHistory) {
        message.content.forEach(item=>item.isHistory=true)
        this.messageList.unshift(message)
      } else {
        // 推送的消息放后面
        message.content.forEach(item=>item.isHistory=false)
        this.messageList.push(message)
        this.scrollToBottom()
      }
    },
    // 新增滚动方法
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.chatContainer;
        container.scrollTop = container.scrollHeight;
      });
    },

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
      margin: 5px 0; /* 10rpx → 5px */
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

</style>
