<template>
  <view class="video-message-wraper">
    <image
      class="img"
      :src="ImageError"
      mode="widthFix"
      v-if="isError"
      @click="reload"
    >
    </image>

    <image
      class="img"
      v-if="item.thumbImgSrc && !isError"
      :src="item.thumbImgSrc"
      mode="widthFix"
      @click="$emit('call-parent', 'playVideo')"
      @load="imageLoad"
      @error="onVideoError"
    ></image>

    <u-icon
      class="play-icon"
      name="play-right-fill"
      size="30"
      @click="$emit('call-parent', 'playVideo')"
    ></u-icon>

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
  </view>
</template>

<script>
import { getFileById } from '@/api/upload'
import { uploadFileToServer } from '@/api/upload'
import { webSocketService } from '@/utils/websocket'

import ImageError from '@/static/imgs/image-error.png'

import EmptyImage from '@/static/imgs/empty.png'

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
    onVideoError() {
      console.log('==========onVideoError=======')
      this.isLoading = false
      this.isError = true
    },
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
        this.$emit('call-parent', 'keepScrollTop')
      } else {
        // 向下滚动
        this.$emit('call-parent', 'scrollToBottom')
      }
    },
    async parseVideoMessage() {
      this.isLoading = true
      try {
        // 获取视频地址url
        this.$store.commit('setLoadingEnable', false)
        let res = await getFileById(this.item.videoFileId)
        this.item.videoUrl = res.data.fileUrl

        // 如果有 fileID 获取视频缩略图
        if (this.item.thumbFileId) {
          this.$store.commit('setLoadingEnable', false)
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

    // playVideo(item) {
    //   this.$emit('playVideo', item)
    // },

    async sendVideoToServer(messageItem) {
      const videoItem = messageItem.content[0] // 只有一个
      // 开始上传至服务器，上传完成，发送 webSocket 消息
      // 将视频和 缩略图上传到服务器
      this.isLoading = true

      try {
        let res = await uploadFileToServer(videoItem.videoUrl, (percent) => {
          this.progress = percent
          console.log('====上传中========', percent)
        })
        // 视频传完了
        videoItem.videoFileId = res.data

        if (videoItem.thumbFile) {
          // 有可能没有缩略图
          let res2 = await uploadFileToServer(videoItem.thumbImgSrc)
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
        orderId: this.$store.state.currChatOrderId, // 收银台 不传 orderId  码商端要 传
        data: message
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.video-message-wraper {
  cursor: pointer;
  max-width: 320rpx;
  position: relative;
}

.img {
  width: 260rpx;
}

.play-icon {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100rpx;
  font-size: 80rpx;
  color: #333;
  height: 100rpx;
  background-color: rgba($color: #fff, $alpha: 0.7);
  border-radius: 50%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
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
