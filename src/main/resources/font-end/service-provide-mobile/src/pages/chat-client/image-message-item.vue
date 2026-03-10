<template>
  <view class="image-message-wraper">
    <image
      class="img"
      :src="ImageError"
      mode="widthFix"
      v-if="isError"
      @click="reload"
    >
    </image>

    <image
      class="image"
      :src="item.imgSrc"
      v-if="!isError && item.imgSrc"
      mode="widthFix"
      @click="previewImage(item.index)"
      @load="imageLoad"
      @error="onImageError"
    >
    </image>
    <u-loading-icon
      v-if="isLoading"
      mode="semicircle"
      class="loading"
      size="56"
      color="#c00"
      textColor="#c00"
      :text="progress > 0 ? progress : ''"
      textSize="18"
      inactive-color="white"
    ></u-loading-icon>
    <a :href="item.imgSrc" v-if="item.imgSrc" class="download" target="_blank">图片不显示，点此获取</a>
  </view>
</template>

<script>
import { getFileById } from '@/api/upload'

import { uploadFileToServer2 } from '@/api/upload'
import { webSocketService } from '@/utils/websocket'
import ImageError from '@/static/imgs/image-error.png'
export default {
  name: 'ImageMessageItem',
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    allImagePreview: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      ImageError,
      isLoading: false,
      isError: false,
      progress: 0,
      retryCount: 0, // 重试计数器
    }
  },
  mounted() {
    console.log('====mounted= image item==')

    this.reload()
  },
  methods: {
    onImageError() {
      console.log('==========onImageError=======')
      this.isLoading = false
      this.isError = true
    },
    imageLoad() {
      // this.isLoading = false
      if (this.item.isHistory && !this.item.isFirst) {
        // 历史消息，不滚动
        // this.$parent.keepScrollTop()
        this.$emit('call-parent', 'keepScrollTop')
      } else {
        // 向下滚动
        // this.$parent.scrollToBottom()
        this.$emit('call-parent', 'scrollToBottom')
      }
    },
    reload() {
      this.isError = false
      if (this.item.isLocal) {
        this.addToPreview()
        this.uploadImage(this.item.parent)
      } else {
        // 分析下載
        this.parseImageMessage()
      }
    },
    async parseImageMessage() {
      this.isLoading = true
      try {
        // 获取图片地址
        this.$store.commit('setLoadingEnable', false)
        let res = await getFileById(this.item.fileId)
        this.item.imgSrc = res.data.fileUrl
        this.addToPreview()

        this.$forceUpdate()
      } catch (err) {
        console.log('=====parseImageMessage=====', err)
        this.isError = true
      } finally {
        this.isLoading = false
      }
    },
    /**
     * 将图片上传至服务器，并更新页面
     * @param file
     */
    async uploadImage(messageItem) {
      const imageItem = messageItem.content[0]
      this.isLoading = true
      this.isError = false

      console.log('this.retryCount ', this.retryCount);
      

      try {
        // 检查WebSocket连接状态
        const wsStatus = this.$store.state.webSocketStatus || 'disconnected'
        if (wsStatus !== 'connected') {
          console.warn('WebSocket未连接，等待连接后再上传图片')
          // 延迟重试，最多重试5次
          // if (!this.retryCount) {
          //   this.retryCount = 0
          // }
          if (this.retryCount < 2) {
            this.retryCount++
            setTimeout(() => {
              this.uploadImage(messageItem)
            }, 10000)
          } else {
            console.error('WebSocket连接失败，图片上传终止')
            this.isError = true
            uni.showToast({
              title: '网络连接失败，请检查网络后重试',
              icon: 'none',
              duration: 3000
            })
          }
          return
        }
        
        

        let res = await uploadFileToServer2(imageItem.file, (percent) => {
          this.progress = percent
          console.log('====上传中========', percent)
        })

        // 重置重试计数
        this.retryCount = 0
        
        if (!res || !res.data) {
          throw new Error('上传响应无效')
        }
        
        imageItem.fileId = res.data
        
        // 发送 webSocket 消息
        const sendResult = this.sendWsMessage(messageItem)
        if (!sendResult) {
          console.warn('WebSocket消息发送失败，将在重连后重试')
          // 标记为待重发状态
          imageItem.pendingResend = true
        }
        
      } catch (e) {
        console.error('图片上传失败:', e)
        this.isError = true
        this.progress = 0
        
        // 显示错误提示
        uni.showToast({
          title: '图片上传失败',
          icon: 'none',
          duration: 2000
        })
        
        if(this.retryCount < 2){
          this.retryCount++
          // 3秒后自动重试
          setTimeout(() => {
            if (this.isError) {
              console.log('自动重试上传图片')
              this.uploadImage(messageItem)
            }
          }, 3000)
        }
        
      } finally {
        this.isLoading = false
      }
    },

    addToPreview() {
      this.item.index = this.allImagePreview.length
      this.allImagePreview.push(this.item.imgSrc)
    },

    // 图片预览
    previewImage(index) {
      uni.previewImage({
        current: index,
        urls: this.allImagePreview
      })
    },

    sendWsMessage(messageItem) {
      const newContent = messageItem.content.map((item) => {
        // 图片去掉 imgSrc 和 file
        const newItem = {}
        newItem.id = item.id
        newItem.fileId = item.fileId
        newItem.type = item.type
        return newItem
      })

      const newMessageItem = {}
      newMessageItem.time = messageItem.time
      newMessageItem.id = messageItem.id
      newMessageItem.from = messageItem.from
      newMessageItem.content = newContent

      // 发送 webSocket
      const sendResult = webSocketService.send({
        type: 'message',
        orderId: this.$store.state.currChatOrderId,
        data: newMessageItem
      })
      
      if (!sendResult) {
        console.warn('WebSocket消息发送失败，消息已加入队列')
        return false
      }
      
      return true
    }
  }
}
</script>

<style lang="scss" scoped>

.download{
  font-size: 12px;
  color: #409eff;
  text-decoration: underline;
}

.image-message-wraper {
  cursor: pointer;
  width: 320rpx;
  // height: 420rpx;
  position: relative;
}

.img {
  width: 260rpx;
}

.image{
  width: 100%;
  height: 100%;
}
.loading {
  position: absolute;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  width: 42px;
  height: 42px;
  font-size: 20px;
  font-weight: 600;
  color: #c00;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

::v-deep .loading .u-loading-icon__text {
  position: absolute;
  left: 50%;
  width: 100%;
  margin-left: 0;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 18px;
  color: rgb(204, 0, 0);
}
</style>
