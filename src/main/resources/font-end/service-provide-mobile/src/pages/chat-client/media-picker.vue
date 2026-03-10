<template>
  <view class="media-panel">
    <view class="emoji-box">
      <!-- <view class="item" v-for="(emoji, index) in emojiList" :key="index" @click.stop="selectEmoji(emoji)">
          {{ emoji }}
        </view> -->
      <view class="item" @click="takePhoto">
        <view class="wraper">
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="32"
            viewBox="0 0 36 32"
          >
            <path
              d="M34 4h-2v-2c0-1.1-0.9-2-2-2h-28c-1.1 0-2 0.9-2 2v24c0 1.1 0.9 2 2 2h2v2c0 1.1 0.9 2 2 2h28c1.1 0 2-0.9 2-2v-24c0-1.1-0.9-2-2-2zM4 6v20h-1.996c-0.001-0.001-0.003-0.002-0.004-0.004v-23.993c0.001-0.001 0.002-0.003 0.004-0.004h27.993c0.001 0.001 0.003 0.002 0.004 0.004v1.996h-24c-1.1 0-2 0.9-2 2v0zM34 29.996c-0.001 0.001-0.002 0.003-0.004 0.004h-27.993c-0.001-0.001-0.003-0.002-0.004-0.004v-23.993c0.001-0.001 0.002-0.003 0.004-0.004h27.993c0.001 0.001 0.003 0.002 0.004 0.004v23.993z"
            ></path>
            <path
              d="M30 11c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z"
            ></path>
            <path d="M32 28h-24v-4l7-12 8 10h2l7-6z"></path>
          </svg>
        </view>
        <view class="label"> 图片 </view>
      </view>

      <view class="item" @click="takeVideo">
        <view class="wraper">
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="32"
            viewBox="0 0 32 32"
          >
            <path
              d="M0 4v24h32v-24h-32zM6 26h-4v-4h4v4zM6 18h-4v-4h4v4zM6 10h-4v-4h4v4zM24 26h-16v-20h16v20zM30 26h-4v-4h4v4zM30 18h-4v-4h4v4zM30 10h-4v-4h4v4zM12 10v12l8-6z"
            ></path>
          </svg>
        </view>
        <view class="label"> 视频 </view>
      </view>

      <QuickMessage @select-msg="sendTextMessage"></QuickMessage>
      <QuickCardMessage @select-msg="sendTextMessage"></QuickCardMessage>
    </view>
  </view>
</template>

<script>
import { MessageType, FromType } from './utils.js'
import { generateUniqueId, parseNow, base64ToBlob } from '@/utils/index'

import { webSocketService } from '@/utils/websocket.js'

import QuickMessage from './quick-message.vue'
import QuickCardMessage from './quick-card-message.vue'

import {
  getFileById,
  uploadFileToServer,
  handleUploadParseFileToServer,
  handleUploadDataToQrCode
} from '@/api/upload'

export default {
  data() {
    return {}
  },
  components: {
    QuickMessage,
    QuickCardMessage
  },
  methods: {
    sendTextMessage(msg) {
      this.$emit('select-image', msg)
    },
    // 显示选择器，让用户明确选择来源
    // chooseVideo() {
    //   uni.showActionSheet({
    //     itemList: ['拍照', '从相册选择'],
    //     success: (res) => {
    //       const tapIndex = res.tapIndex
    //       if (tapIndex === 0) {
    //         this.takeVideo('camera') // 拍照
    //       } else if (tapIndex === 1) {
    //         this.takeVideo('album') // 从相册选择
    //       }
    //     },
    //     fail: (error) => {
    //       console.error('显示选择器失败:', error)
    //     }
    //   })
    // },

    takeVideo() {
      uni.chooseVideo({
        sourceType: ['camera', 'album'],
        compressed: true,
        success: async (res) => {
          this.$message.success('选择视频成功')
          this.handleSelectVideo(res)
        },
        fail: (error) => {
          console.log(error)
          this.$message.error('选择视频失败')
        }
      })
    },

    async handleSelectVideo(res) {
      console.log(res)

      const messageItem = {
        time: parseNow(),
        id: generateUniqueId(),
        from: FromType.provider,
        content: []
      }

      const videoItem = {
        type: MessageType.video,
        videoFileId: '', // 视频文件fileID
        videoUrl: res.tempFilePath, // 视频地址 本地  或  远程  二选一
        videoFileObj: res.tempFile, // 视频文件

        thumbFileId: '', // 缩备图 文件ID
        thumbImgSrc: '', // 缩备图 图片src  base64 格式  或者 是 远程  url
        thumbFile: '', // 缩备图 图片文件对象
        id: generateUniqueId(),
        isLocal: true, // 本地文件
        parent: messageItem
      }

      messageItem.content.push(videoItem)

      if (
        res.tempFile.name.includes('.MOV') ||
        res.tempFile.name.includes('.mov') ||
        res.tempFile.name.includes('.AVI') ||
        res.tempFile.name.includes('.avi')
      ) {
        this.$emit('select-image', messageItem)
        return
      }

      try {
        // 生成缩略图
        console.log('=====4=====')
        let thumbnail = await this.generateThumbnailWithCanvas(res.tempFilePath)
        videoItem.thumbImgSrc = thumbnail
        // base64 转文件，并上传
        console.log('=====5=====')
        let thumbImageFile = base64ToBlob(thumbnail)
        videoItem.thumbFile = thumbImageFile

        console.log('messageItem --video--111- ', messageItem)
      } catch (err) {
        console.log('生成缩略图失败', err)
        videoItem.thumbImgSrc = ''
        videoItem.thumbFile = ''
      } finally {
      }

      // 显示在页面
      this.$emit('select-image', messageItem)

      // this.sendVideoToServer(messageItem)
    },

    // 使用Canvas生成缩略图
    generateThumbnailWithCanvas(videoPath) {
      return new Promise((resolve, reject) => {
        // 创建video元素
        const video = document.createElement('video')
        video.src = videoPath
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

        video.addEventListener('error', (err) => {
          // 出错时使用默认缩略图
          reject(err)
          // this.addVideoMessage(videoPath, 'https://via.placeholder.com/200x150?text=预览图', 10);
        })
      })
    },

    //======================获取图片=============================================================

    // 显示选择器，让用户明确选择来源
    // chooseImage() {
    //   uni.showActionSheet({
    //     itemList: ['拍照', '从相册选择'],
    //     success: (res) => {
    //       const tapIndex = res.tapIndex
    //       if (tapIndex === 0) {
    //         this.takePhoto('camera') // 拍照
    //       } else if (tapIndex === 1) {
    //         this.takePhoto('album') // 从相册选择
    //       }
    //     },
    //     fail: (error) => {
    //       console.error('显示选择器失败:', error)
    //     }
    //   })
    // },

    // 拍照
    takePhoto() {
      uni.chooseImage({
        sourceType: ['camera', 'album'], // 只使用相机
        sizeType: ['original'], // 可以指定压缩
        count: 1, // 只能拍一张
        success: (res) => {
          console.log('获取照片成功:', res)
          this.handleSelectImage(res)
        },
        fail: (error) => {
          console.error('获取照片失败:', error)
          this.$message.error('拍照失败')
        }
      })
    },

    async handleSelectImage(res) {
      console.log('handleSelectImage', res)

      const file = res.tempFiles[0]
      let compressedImage = file
      let compressFilePath = res.tempFilePaths[0]

      // 如果图片大于100KB，则进行压缩
      const isGt = file.size > 100 * 1024
      if (isGt) {

        try{
          compressedImage = await this.quickCompressForChat(file)
        }catch(err){
          console.error('快速压缩图片失败:', err)
          compressedImage = file // 使用原图
        }

      }

      // 压缩图片
      console.log('压缩图片完成:', compressedImage)
      console.log('压缩后的文件路径:', compressFilePath)

      const currItemId = generateUniqueId()
      const messageItem = {
        time: parseNow(),
        id: currItemId,
        from: FromType.provider,
        content: []
      }

      messageItem.content = [
        {
          type: MessageType.image,
          fileId: '',
          imgSrc: compressFilePath, // 图片 base64 格式
          // file: res.tempFiles[index],
          file: compressedImage,
          id: generateUniqueId(),
          isLocal: true, // 本地文件
          parent: messageItem
        }
      ]

      // 显示在页面
      this.$emit('select-image', messageItem)
    },
   
    async quickCompressForChat(file) {
      return new Promise((resolve) => {
        const img = new Image()
        img.onload = () => {
          // 创建canvas（固定缩小到适合聊天的大小）
          const canvas = document.createElement('canvas')

          // 设置目标尺寸（二维码不需要太大）
          const targetWidth = 600 > img.width ? img.width : 600
          const targetHeight = (img.height / img.width) * targetWidth

          canvas.width = targetWidth
          canvas.height = targetHeight

          const ctx = canvas.getContext('2d')

          // 关键：禁用平滑，减少文件大小
          ctx.imageSmoothingEnabled = false

          // 使用黑色背景增强二维码对比度
          ctx.fillStyle = 'black'
          ctx.fillRect(0, 0, targetWidth, targetHeight)

          // 绘制图片
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight)

          // 转换为JPEG，低质量
          canvas.toBlob(
            (blob) => {
              // 转换为File对象，保持原始文件名
              const compressedFile = new File(
                [blob],
                `compressed_${file.name}`,
                {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                }
              )

              console.log(`压缩完成: ${file.name}`)
              console.log(
                `原始: ${(file.size / 1024).toFixed(1)}KB → 压缩后: ${(
                  blob.size / 1024
                ).toFixed(1)}KB`
              )

              resolve(compressedFile)
            },
            'image/jpeg',
            0.4
          ) // 质量0.4足够扫码
        }

        img.src = URL.createObjectURL(file)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.media-panel {
  position: fixed;
  bottom: 0rpx;
  width: 100%;
  background: #efefef;
  border-top: 1rpx solid #eee;
}

::v-deep .emoji-box {
  height: 280rpx;
  display: flex;
  gap: 40rpx;
  padding: 40rpx;
  box-sizing: border-box;

  .item {
    display: flex;
    flex-direction: column;
    align-items: center;

    .wraper {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 96rpx;
      height: 96rpx;
      background-color: #fff;
      border-radius: 10rpx;
    }
    .label {
      margin-top: 10rpx;
    }
  }
}
</style>
