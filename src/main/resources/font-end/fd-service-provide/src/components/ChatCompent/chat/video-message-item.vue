<template>
  <div class="video-message-wraper">
    <el-image
      slot="error"
      class="error-img"
      :src="ImageError"
      @click="reload"
      v-if="isError"
      fit="cover"
    ></el-image>

    <el-image
      class="img"
      @click="playVideo(item)"
      v-if="item.thumbImgSrc && !isError"
      :src="item.thumbImgSrc"
      fit="cover"
      @load="imageLoad()"
      @error="onLoadError"
    >
      <span
        slot="placeholder"
        v-if="isLoading"
        v-loading="isLoading"
        style="width: 20px; height: 20px"
        element-loading-background="rgba(0, 0, 0, 0)"
      ></span>
    </el-image>
    
    <div v-if="item.videoUrl && !isError && !isLoading" class="play-icon" @click="playVideo(item)">
      <i class="el-icon-caret-right"></i>
    </div>
    <span
      v-if="isLoading"
      v-loading="isLoading"
      class="loading"
      element-loading-background="rgba(0, 0, 0, 0)"
    >
      {{ progress > 0 ? progress : '' }}
    </span>
  </div>
</template>

<script>
import { parseNow } from '@/utils'
import { getFileById } from '@/api/upload'
import { uploadFileToServer } from '@/api/upload'
import { webSocketService } from '@/utils/websocket'

import ImageError from '@/assets/img/image-error.png'

import EmptyImage from '@/assets/img/empty.png'

export default {
  name: 'VideoMessageItem',
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      EmptyImage,
      ImageError,
      isLoading: false,
      isError: false,
      progress: 0 // 上传进度
    }
  },

  created() {
    // 如果是本地视频,而没有缩略图,则使用默认缩略图
    if (this.item.isLocal && !this.item.thumbImgSrc) {
      this.item.thumbImgSrc = EmptyImage
    } else if (!this.item.isLocal && !this.item.thumbFileId) {
      // 远程视频,没有缩略图 fileId
      this.item.thumbImgSrc = EmptyImage
    }
  },
  mounted() {
    this.reload()
  },
  methods: {
    reload() {
      this.isError = false
      if (this.item.isLocal) {
        // 本地视频，直接显示
        this.sendVideoToServer(this.item.parent)
      } else {
        this.parseVideoMessage()
      }
    },
    onLoadError() {
      this.isLoading = false
      this.isError = true
    },
    imageLoad() {
      if (this.item.isHistory && !this.item.isFirst) {
        // 历史消息，不滚动
        this.$parent.keepScrollTop()
      } else {
        // 向下滚动
        this.$parent.scrollToBottom()
      }
    },
    async parseVideoMessage() {
      this.isLoading = true
      try {
        // 获取视频地址url
        this.$store.commit('app/setLoadingEnable', false)
        let res = await getFileById(this.item.videoFileId)
        this.item.videoUrl = res.data.fileUrl

        // 如果有 fileID 获取视频缩略图
        if (this.item.thumbFileId) {
          this.$store.commit('app/setLoadingEnable', false)
          res = await getFileById(this.item.thumbFileId)
          this.item.thumbImgSrc = res.data.fileUrl
        }
      } catch (err) {
        this.isError = true
      } finally {
        this.isLoading = false
      }

      this.$forceUpdate()
    },

    playVideo(item) {
      this.$emit('playVideo', item)
    },

    async sendVideoToServer(messageItem) {
      const videoItem = messageItem.content[0] // 只有一个
      // 开始上传至服务器，上传完成，发送 webSocket 消息
      // 将视频和 缩略图上传到服务器
      this.isLoading = true

      try {
        let res = await uploadFileToServer(videoItem.videoFileObj, (percent) => {
          this.progress = percent
        })
        // 视频传完了
        videoItem.videoFileId = res.data

        if (videoItem.thumbFile) {
          // 有可能没有缩略图
          let res2 = await uploadFileToServer(videoItem.thumbFile)
          // 缩略图传完了
          videoItem.thumbFileId = res2.data
        }
        // 发送 webSocket 消息
        this.sendVideoMessage(messageItem)
      } catch (err) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    },
    sendVideoMessage(messageItem) {
      // webSocket 发送到服务器
      // 不能直接删除 messageItem 中的 imgSrc ，会导致消息列表中图片消失
      const newContent = messageItem.content.map((item) => {
        // 图片去掉 imgSrc 和 file
        const newItem = {}
        newItem.id = item.id
        newItem.type = item.type
        newItem.videoFileId = item.videoFileId
        newItem.thumbFileId = item.thumbFileId

        return newItem
      })

      const message = {
        id: messageItem.id,
        time: messageItem.time,
        from: messageItem.from,
        content: newContent
      }

      webSocketService.send({
        type: 'message',
        orderId: this.$store.state.chat.currChatOrderId, // 收银台 不传 orderId  码商端要 传
        data: message
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.video-message-wraper {
  cursor: pointer;
  width: 160px;
  position: relative;
}

.play-icon {
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

.error-img {
  width: 140px;
}
.img {
  width: 100%;
}

.loading {
  position: absolute;
  text-align: center;
  width: 42px;
  height: 42px;
  font-size: 20px;
  font-weight: 600;
  color: #c00;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
