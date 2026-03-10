<template>
  <div class="custom-upload">
    <div
      v-if="listType === 'picture-card'"
      class="custom-upload-picture-card"
    >
      <div
        v-for="(file, index) in fileList"
        :key="index"
        class="custom-upload-picture-card-item"
      >
        <img v-if="file.url" :src="file.url" alt="" />
        <div class="custom-upload-picture-card-actions">
          <i class="custom-upload-delete" @click="handleRemove(file, index)">×</i>
        </div>
      </div>
      <div
        v-if="fileList.length < limit"
        class="custom-upload-picture-card-trigger"
        @click="handleClick"
      >
        <i class="custom-upload-icon">+</i>
        <input
          ref="input"
          type="file"
          :accept="accept"
          style="display: none"
          @change="handleChange"
        />
      </div>
    </div>
    <div v-if="showTip" class="custom-upload-tip">
      <slot name="help-tip"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomUpload',
  props: {
    action: String,
    accept: {
      type: String,
      default: 'image/*'
    },
    limit: {
      type: Number,
      default: 1
    },
    listType: {
      type: String,
      default: 'text'
    },
    httpRequest: Function,
    beforeUpload: Function,
    onSuccess: Function,
    onRemove: Function,
    autoUpload: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      fileList: []
    }
  },
  computed: {
    showTip() {
      return this.$slots['help-tip']
    }
  },
  methods: {
    handleClick() {
      this.$refs.input.click()
    },
    handleChange(e) {
      const files = e.target.files
      if (!files || files.length === 0) return
      
      const file = files[0]
      
      if (this.beforeUpload) {
        const result = this.beforeUpload(file)
        if (result === false) {
          return
        }
        if (result instanceof Promise) {
          result.then(() => {
            this.uploadFile(file)
          }).catch(() => {})
          return
        }
      }
      
      this.uploadFile(file)
    },
    uploadFile(file) {
      if (this.httpRequest) {
        this.httpRequest({
          file,
          onProgress: () => {},
          onSuccess: (response) => {
            const url = URL.createObjectURL(file)
            this.fileList.push({
              name: file.name,
              url: url,
              raw: file,
              response: response
            })
            if (this.onSuccess) {
              this.onSuccess(response, file, this.fileList)
            }
          },
          onError: () => {}
        })
      } else {
        const url = URL.createObjectURL(file)
        this.fileList.push({
          name: file.name,
          url: url,
          raw: file
        })
        if (this.onSuccess) {
          this.onSuccess({}, file, this.fileList)
        }
      }
      
      this.$refs.input.value = ''
    },
    handleRemove(file, index) {
      if (file.url && file.url.startsWith('blob:')) {
        URL.revokeObjectURL(file.url)
      }
      this.fileList.splice(index, 1)
      if (this.onRemove) {
        this.onRemove(file, this.fileList)
      }
    }
  }
}
</script>

<style scoped>
.custom-upload-picture-card {
  display: inline-block;
  vertical-align: top;
}

.custom-upload-picture-card-item {
  width: 148px;
  height: 148px;
  position: relative;
  display: inline-block;
  margin-right: 8px;
  margin-bottom: 8px;
  border: 1px solid #c0ccda;
  border-radius: 6px;
  overflow: hidden;
  background: #fff;
}

.custom-upload-picture-card-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.custom-upload-picture-card-actions {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  cursor: default;
  text-align: center;
  color: #fff;
  opacity: 0;
  font-size: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-upload-picture-card-item:hover .custom-upload-picture-card-actions {
  opacity: 1;
}

.custom-upload-delete {
  cursor: pointer;
  font-style: normal;
  font-size: 28px;
  line-height: 1;
}

.custom-upload-picture-card-trigger {
  width: 148px;
  height: 148px;
  border: 1px dashed #c0ccda;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: inline-block;
  vertical-align: top;
  background-color: #fafafa;
  transition: border-color 0.3s;
}

.custom-upload-picture-card-trigger:hover {
  border-color: #409eff;
}

.custom-upload-icon {
  font-size: 28px;
  color: #8c939d;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-style: normal;
}

.custom-upload-tip {
  font-size: 12px;
  color: #606266;
  margin-top: 7px;
}
</style>

