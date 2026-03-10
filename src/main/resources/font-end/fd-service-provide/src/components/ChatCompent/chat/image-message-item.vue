<template>
  <div class="image-message-wraper">
    <el-image
      slot="error"
      class="img error-img"
      :src="ImageError"
      @click="reload"
      v-if="isError"
      fit="cover"
    ></el-image>

    <el-image
      class="img"
      :src="item.imgSrc"
      v-if="!isError && item.imgSrc"
      fit="cover"
      :preview-src-list="allImagePreview"
      @load="imageLoad()"
      @error="onImageError"
    >
    </el-image>
    <span v-show="isLoading">
      <i v-loading="true" class="loading" element-loading-background="rgba(255, 0, 0, 0)"></i>
    </span>
    <a :href="item.imgSrc" v-if="item.imgSrc" class="download" target="_blank">图片不显示，点此获取</a>
  </div>
</template>

<script>
import { getFileById } from '@/api/upload'

import { uploadFileToServer } from '@/api/upload'
import { webSocketService } from '@/utils/websocket'
import ImageError from '@/assets/img/image-error.png'
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
      isError: false
    }
  },
  mounted() {
    this.reload()
  },
  methods: {
    onImageError() {
      this.isLoading = false
      this.isError = true
    },
    imageLoad() {
      // this.isLoading = false
      if (this.item.isHistory && !this.item.isFirst) {
        // 历史消息，不滚动
        this.$parent.keepScrollTop()
      } else {
        // 向下滚动
        this.$parent.scrollToBottom()
      }
    },
    reload() {
      this.isError = false
      if (this.item.isLocal) {
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
        this.$store.commit('app/setLoadingEnable', false)
        let res = await getFileById(this.item.fileId)
        this.item.imgSrc = res.data.fileUrl
        this.allImagePreview.push(this.item.imgSrc)
        this.$forceUpdate()
      } catch (err) {
        console.log(err)
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

      try {
        // 检查WebSocket连接状态
        const wsStatus = webSocketService.getStatus()
        if (wsStatus !== 'connected') {
          console.warn('WebSocket未连接，等待连接后再上传图片')
          // 延迟重试
          setTimeout(() => {
            this.uploadImage(messageItem)
          }, 2000)
          return
        }

        let res = await uploadFileToServer(imageItem.file)
        
        if (!res || !res.data) {
          throw new Error('上传响应无效')
        }
        
        imageItem.fileId = res.data

        // 加入图片列表
        this.allImagePreview.push(URL.createObjectURL(imageItem.file));

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
        
        // 显示错误提示
        this.$message.error('图片上传失败，3秒后自动重试')
        
        // 3秒后自动重试
        setTimeout(() => {
          if (this.isError) {
            console.log('自动重试上传图片')
            this.uploadImage(messageItem)
          }
        }, 3000)
        
      } finally {
        this.isLoading = false
      }
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
        orderId: this.$store.state.chat.currChatOrderId,
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
.image-message-wraper {
  cursor: pointer;
  max-width: 160px;
  position: relative;
}

.download{
  font-size: 12px;
  color: #409eff;
  text-decoration: underline;
}

.error-img {
  width: 140px;
}

.loading {
  position: absolute;
  width: 42px;
  height: 42px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
