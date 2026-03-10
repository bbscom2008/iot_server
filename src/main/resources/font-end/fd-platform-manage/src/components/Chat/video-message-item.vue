<template>
  <div class="video-message-wraper">
    <el-image
      slot="error"
      class="img error-img"
      :src="ImageError"
      @click="reload"
      v-if="isError"
      fit="cover"
    ></el-image>

    <el-image
      v-if="item.thumbImgSrc && !isError"
      class="img"
      @click="playVideo(item)"
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
    <div v-if="item.thumbImgSrc && !isError" class="play-icon">
      <i class="el-icon-caret-right"></i>
    </div>
    <span
      v-if="isLoading"
      v-loading="isLoading"
      class="loading"
      element-loading-background="rgba(0, 0, 0, 0)"
    ></span>
  </div>
</template>

<script>
import { parseNow } from '@/utils'
import { getFileById } from '@/api/upload'

import ImageError from '@/assets/img/image-error.png'

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
      ImageError,
      isLoading: false,
      isError: false
    }
  },

  mounted() {
    this.reload()
  },
  methods: {
    reload() {
      this.isError = false
      this.parseVideoMessage()
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

        // 获取视频缩略图
        this.$store.commit('app/setLoadingEnable', false)
        res = await getFileById(this.item.thumbFileId)
        this.item.thumbImgSrc = res.data.fileUrl
      } catch (err) {
        this.isError = true
      } finally {
        this.isLoading = false
      }

      this.$forceUpdate()
    },

    playVideo(item) {
      this.$emit('playVideo', item)
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

.loading {
  position: absolute;
  width: 42px;
  height: 42px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
