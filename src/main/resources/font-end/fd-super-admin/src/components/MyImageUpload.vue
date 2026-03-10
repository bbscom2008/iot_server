<template>
  <div v-loading="isLoading">
    <el-upload
      class="my-image-upload"
      ref="uploadRef"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemoveLogo"
      :on-success="handleSuccessLogo"
      :on-exceed="handleExceed"
      :before-upload="beforeUpload"
      :auto-upload="true"
      :http-request="uploadImage"
      :accept="accept"
      :limit="1"
      action="#"
      list-type="picture-card"
      :file-list="userLogoFile"
    >
      <!-- <el-button slot="trigger" size="small" type="primary">选取文件</el-button> -->

      <div
        slot="trigger"
        class="my-picker"
        :style="{ display: userLogoFile.length == 0 ? 'block' : 'none' }"
      >
        <i v-if="userLogoFile.length == 0" class="el-icon-plus"></i>
      </div>
      <!-- <div v-if="userLogoFile.length == 0" slot="tip" class="el-upload__tip">上传logo图片</div> -->
    </el-upload>
  </div>
</template>

<script>
import { uploadFileToServer, getFileById } from '@/api/upload'

import Empty from '@/assets/img/video-mark.png'

export default {
  name: 'MyImageUpload',
  props: {
    accept: {
      type: String,
      default: 'image/*'
    },
    value: {
      // 就是 fileId
      type: String,
      default: ''
    },
    limit: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      userLogoFile: [],
      isLoading: false
    }
  },
  // watch: {
  //   userLogoFile(newVal) {
  //     if (newVal.length > 0) {
  //       console.log('---newVal[0].fileId-----', newVal[0].fileId)
  //       this.$emit('input', newVal[0].fileId)
  //     }
  //   }
  // },
  mounted() {
    if (this.value) {
      if (this.accept.indexOf('video') !== -1) {
        this.userLogoFile = [
          {
            url: Empty,
            name: 'file'
          }
        ]
      } else {
        this.isLoading = true
        getFileById(this.value)
          .then((res) => {
            if (res && res.data) {
              this.userLogoFile = [
                {
                  url: res.data.fileUrl,
                  name: 'file'
                }
              ]
            }
          })
          .finally(() => {
            this.isLoading = false
          })
      }
    }
  },
  methods: {
    handleExceed(file, fileList) {
      this.$message({
        message: '最多只能选择1张',
        type: 'error'
      })
    },
    handlePictureCardPreview(file) {},
    handleRemoveLogo(file, fileList) {
      console.log(file, fileList)
      this.userLogoFile = fileList
      this.$forceUpdate()
      //   this.$refs.baseInfoRef.validateField('userLogoFile')
    },
    async handleSuccessLogo(response, file, fileList) {
      this.userLogoFile = fileList

      console.log('----handleSuccessLogo--response--', response)
      console.log('----handleSuccessLogo--file--', file)
      console.log('----handleSuccessLogo--response--', fileList)

      // 如果上传的是视频，显示一张表示视频的图片
      if (file.raw.type.indexOf('video') !== -1) {
        this.userLogoFile[0].url = Empty
      }

      if (response && response.data) {
        // let res = await getFileById(response.data)
        this.userLogoFile[0].fileId = response.data.fileUrl
      } else {
        this.userLogoFile.splice(0, 1)
      }
    },

    beforeUpload(file) {
      // const isImage = file.type.indexOf('image') !== -1
      // if (!isImage) {
      //   this.$message.error('只能上传图片类型的文件！')
      //   return false
      // }
      // const isGt4M = file.size > 1024 * 1024 * 4
      // if (isGt4M) {
      //   this.$message.error('上传图片大小不能超过 4MB！')
      //   return false
      // }
      return true
    },
    async uploadImage(action) {
      try {
        let res = await uploadFileToServer(action.file)
        this.$emit('change', res.data)
        this.$emit('input', res.data)
        return res
      } catch (e) {
        console.log(e)
        this.$message.error('上传图片失败！')
        this.userLogoFile = []
      }
    }
  }
}
</script>

<style scoped>
.my-picker {
  background-color: #fbfdff;
  border: 1px dashed #c0ccda;
  border-radius: 6px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 148px;
  height: 148px;
  cursor: pointer;
  line-height: 146px;
  vertical-align: top;
}

::v-deep .el-upload--picture-card {
  background-color: transparent;
  border-color: transparent;
}
</style>
