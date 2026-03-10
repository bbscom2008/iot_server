<template>
  <div class="picker-box">
    <input
      type="file"
      style="display: none"
      ref="fileInput"
      accept="image/*"
      @change="pickImageFile"
    />
    <div class="item" @click="() => $refs.fileInput.click()">
      <i class="el-icon-picture" style="font-size: 30px"></i>
      <span>图片</span>
    </div>
  </div>
</template>

<script>
import { generateUniqueId, parseTime, parseNow } from '@/utils/index'

import { MessageType, FromType } from './utils.js'

/**
 * 将所有的消息都做为 混合类型的消息发送。！！！
 */

export default {
  name: 'ImagePicker',

  data() {
    return {
      wsService: null,
      FromType,
      MessageType
    }
  },

  methods: {
    /**
     * 单函数压缩，适合聊天场景
     * @param {File} file - 图片文件
     * @returns {Promise<File>} - 压缩后的文件
     */
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
              const compressedFile = new File([blob], `compressed_${file.name}`, {
                type: 'image/jpeg',
                lastModified: Date.now()
              })

              console.log(`压缩完成: ${file.name}`)
              console.log(
                `原始: ${(file.size / 1024).toFixed(1)}KB → 压缩后: ${(blob.size / 1024).toFixed(
                  1
                )}KB`
              )

              resolve(compressedFile)
            },
            'image/jpeg',
            0.4
          ) // 质量0.4足够扫码
        }

        img.src = URL.createObjectURL(file)
      })
    },
    pickImageFile(e) {
      const file = e.target.files[0]
      console.log('pickImageFile : ', file)

      const isJPG =
        file.type === 'image/jpeg' ||
        file.type === 'image/jpg' ||
        file.type === 'image/bmp' ||
        file.type === 'image/png'

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG/PNG 格式!')
      }

      // 如果大于 100K ，压缩图片
      const isLt2M = file.size > 100 * 1024;
      if (isLt2M) {
        this.quickCompressForChat(file).then((compressedFile) => {
          this.sendImageMessage(compressedFile)
        })
        return
      } 

      this.sendImageMessage(file)
    },

    /**
     * 选择图片并发送
     * @param file
     */
    async sendImageMessage(file) {
      const messageItem = {
        // 所有的消息都是 mixed 类型的
        time: parseNow(), // 发送的时间
        id: generateUniqueId(), // 唯一值
        from: FromType.provider,
        content: []
      }

      const imageItem = {
        type: MessageType.image,
        fileId: '', // fileId 需联网获取再显示
        file: file, // 本地发送文件，直接显示
        imgSrc: URL.createObjectURL(file), // 图片的 base64形式，可直接做为 url
        id: generateUniqueId(),
        isLocal: true // 本地文件
      }

      // 添加对 messageItem 的引用，方便在 imageItem 中上传使用
      imageItem.parent = messageItem

      messageItem.content.push(imageItem)
      this.$emit('select-image', messageItem)

      // 图片上传至服务器 , 由 image-message-item 实现
      // this.uploadImage(messageItem);
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
//   max-width: 600px;
//   margin: 0 auto;

//   .title {
//     font-size: 13.9999px;
//     padding: 10.0001px;
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
