<template>
  <div class="picker-box">
    <input type="file" style="display: none" id="fileInput" class="file-input" accept="video/*" />
    <!-- <el-upload
      class="upload-demo"
      ref="upload"
      :before-upload="beforeAvatarUpload"
      action="#"
      accept="video/*"
      :http-request="() => {}"
      :show-file-list="false"
      :multiple="false"
      :limit="1"
      :auto-upload="true"
    > -->
    <div class="item" @click="handleClick">
      <i class="el-icon-video-camera-solid" style="font-size: 30px"></i>
      <span>视频</span>
    </div>
    <!-- </el-upload> -->
  </div>
</template>

<script>
import { getFileById, uploadFileToServer } from '@/api/upload'

import { base64ToBlob } from '@/utils/index'

import { generateUniqueId, parseTime, parseNow } from '@/utils/index'

import { webSocketService } from '@/utils/websocket'

import { MessageType, FromType } from './utils.js'

export default {
  name: 'VideoPicker',

  data() {
    return {
      wsService: null,
      FromType,
      MessageType,
      inputDom: null
    }
  },

  mounted() {
    this.inputDom = document.getElementById('fileInput')
    this.inputDom.addEventListener('change', this.beforeAvatarUpload)
  },
  methods: {
    handleClick() {
      this.inputDom.click()
    },
    beforeAvatarUpload(e) {
      let file = ''
      if (e.target.files.length > 0) {
        file = e.target.files[0]
      }

      console.log('----beforeAvatarUpload---', file)

      // const isLt2M = file.size / 1024 / 1024 < 4;

      // const isVideo = file.type === "video/mp4" || file.type === "video/avi";

      // if (!isVideo) {
      //   this.$message.error("上传视频只能是 mp4 avi 格式!");
      // }
      // if (!isLt2M) {
      //   this.$message.error("上传图片大小不能超过 4MB!");
      // }

      // // 先显示 缩略图
      // if (isVideo && isLt2M) {
      //   this.sendVideoMessage(file);
      // }

      // return isVideo && isLt2M;
      this.sendVideoMessage(file)

      return true
    },

    /**
     * 选择图片并发送
     * @param videoFile
     */
    async sendVideoMessage(videoFile) {
      const messageItem = {
        time: parseNow(),
        id: generateUniqueId(),
        from: FromType.provider,
        content: []
      }

      const videoItem = {
        type: MessageType.video,
        videoFileId: '', // 视频文件fileID
        videoUrl: URL.createObjectURL(videoFile), // 视频地址 本地  或  远程  二选一
        videoFileObj: videoFile, // 视频文件

        thumbFileId: '', // 缩备图 文件ID
        thumbImgSrc: '', // 缩备图 图片src  base64 格式  或者 是 远程  url
        thumbFile: '', // 缩备图 图片文件对象
        id: generateUniqueId(),
        isLocal: true
      }

      messageItem.content.push(videoItem)
      videoItem.parent = messageItem

      if (
        videoFile.name.includes('.MOV') ||
        videoFile.name.includes('.mov') ||
        videoFile.name.includes('.AVI') ||
        videoFile.name.includes('.avi')
      ) {
        this.$emit('select-video', messageItem)
        return
      }

      try {
        // 生成缩略图
        let thumbnail = await this.generateThumbnailWithCanvas(videoFile)

        videoItem.thumbImgSrc = thumbnail
        // base64 转文件，并上传
        let thumbImageFile = base64ToBlob(thumbnail)
        videoItem.thumbFile = thumbImageFile
        console.log('----thumbImageFile--', thumbImageFile)
      } catch (err) {
        console.dir(err)
        // 不能生成缩略图，直接上传视频
        videoItem.thumbImgSrc = ''
        videoItem.thumbFile = ''
      }
      // 显示在页面
      this.$emit('select-video', messageItem)

      // this.sendVideoToServer(messageItem);
    },

    // 使用Canvas生成缩略图
    generateThumbnailWithCanvas(videoFile) {
      return new Promise((resolve, reject) => {
        // 创建video元素
        const video = document.createElement('video')
        video.src = URL.createObjectURL(videoFile)
        video.crossOrigin = 'anonymous'
        video.muted = true
        video.currentTime = 1 // 跳到第1秒获取帧

        video.addEventListener('loadeddata', () => {
          // 创建canvas元素
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')

          // 设置canvas尺寸
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight

          // 绘制视频帧到canvas
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

          // 获取base64图片数据
          const thumbnail = canvas.toDataURL('image/jpeg')
          resolve(thumbnail)
        })

        video.addEventListener('error', () => {
          // 出错时使用默认缩略图
          console.log('生成缩略图失败')
          reject(new Error('生成缩略图失败'))
          // this.addVideoMessage(videoPath, 'https://via.placeholder.com/200x150?text=预览图', 10);
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
i {
  font-style: normal;
}

// .chat-container {
//   height: 100%;
//   display: flex;
//   flex-direction: column;
//   max-width: 160rem;
//   margin: 0 auto;

//   .title {
//     font-size: 3.7333rem;
//     padding: 2.6667rem;
//     text-align: center;
//     // background-color: #07c160;
//   }
// }

.picker-box {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  // background-color: #eee;
  border-top: 1.0001px solid #ccc;

  .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    margin: 10.0001px;

    i {
      padding: 10.0001px;
      background-color: #fff;
      border-radius: 4.9999px;
      margin-bottom: 7.9999px;
      color: #333;
    }
  }
}
</style>
