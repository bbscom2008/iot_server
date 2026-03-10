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
  </div>
</template>

<script>
import { getFileById } from '@/api/upload'


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
      this.parseImageMessage()
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
