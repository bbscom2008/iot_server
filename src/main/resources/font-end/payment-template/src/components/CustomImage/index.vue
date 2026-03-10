<template>
  <div class="custom-image">
    <img
      v-if="src"
      ref="imgRef"
      :src="imgSrc"
      :style="imageStyle"
      :class="imageClass"
      @error="handleError"
      @load="handleLoad"
      @click="imagePreviewVisible = true"
    />
    <div v-else class="custom-image-placeholder">
      <span>暂无图片</span>
    </div>

    <!-- 加载状态遮罩 -->
    <div v-if="loading" class="custom-image-loading">
      <div class="custom-image-loading-spinner">
        <svg class="circular" viewBox="0 0 50 50">
          <circle class="path" cx="25" cy="25" r="20" fill="none"></circle>
        </svg>
      </div>
    </div>

    <ImagePreviewer
      :visible="imagePreviewVisible"
      :src="src"
      @update:visible="imagePreviewVisible = $event"
    />
  </div>
</template>

<script>
import { addOrderOperationLog } from "@/api/template-create";

import ImagePreviewer from "@/components/ImagePreviewer.vue";

export default {
  name: "CustomImage",
  components: {
    ImagePreviewer,
  },
  props: {
    src: String,
    fit: {
      type: String,
      default: "fill",
    },
    imgStyle: {
      type: [Object, Array, String],
      default: () => ({}),
    },
    load: {
      type: Function,
      default: () => {},
    },
    error: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      loading: true,
      errorState: false,
      imagePreviewVisible: false,
      retryNum: 3, // 重试次数
    };
  },
  computed: {
    imgSrc() {
      return this.src;
    },
    imageStyle() {
      const extra = {
        objectFit:
          this.fit === "contain"
            ? "contain"
            : this.fit === "cover"
            ? "cover"
            : "fill",
      };

      if (Array.isArray(this.imgStyle)) {
        return [...this.imgStyle, extra];
      }

      if (typeof this.imgStyle === "string") {
        return [this.imgStyle, extra];
      }

      return {
        ...(this.imgStyle || {}),
        ...extra,
      };
    },
    imageClass() {
      return {
        "is-loading": this.loading,
        "is-error": this.errorState,
      };
    },
  },
  methods: {
    handleError() {
      // 重新加载
      if (this.retryNum > 0) {
        setTimeout(() => {
          this.retryNum--;
          // 1秒后重试
          this.$refs.imgRef.src = this.imgSrc;
        }, 200);
      } else {
        // 确实加载失败
        this.loading = false;
        this.errorState = true;
        console.log('==typeof this.error==', typeof this.error);
        
        this.$emit('error')
        if (this.error && typeof this.error == "function") {
          this.error();
        }
        addOrderOperationLog(
          this.$store.getters.orderId,
          "图片加载失败: " + this.retryNum + "次, " + this.src
        );
      }
    },
    handleLoad() {
      this.loading = false;
      this.errorState = false;
      this.$emit('load')
      if (this.load && typeof this.load == "function") {
        this.load();
      }
      addOrderOperationLog(
        this.$store.getters.orderId,
        "图片加载成功: " + this.src
      );
    },
  },
};
</script>

<style scoped>
.custom-image {
  display: inline-block;
  overflow: hidden;
  position: relative;
  min-width: 100px;
  min-height: 100px;
}

.custom-image img {
  display: block;
  width: 100%;
  height: 100%;
}

.custom-image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
  font-size: 14px;
}

/* 加载状态遮罩 */
.custom-image-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 1;
}

.custom-image-loading-spinner {
  text-align: center;
}

.custom-image-loading-spinner .circular {
  height: 42px;
  width: 42px;
  animation: loading-rotate 2s linear infinite;
}

.custom-image-loading-spinner .path {
  animation: loading-dash 1.5s ease-in-out infinite;
  stroke-dasharray: 90, 150;
  stroke-dashoffset: 0;
  stroke-width: 2;
  stroke: #409eff;
  stroke-linecap: round;
}

@keyframes loading-rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes loading-dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 200;
    stroke-dashoffset: -35px;
  }
  100% {
    stroke-dasharray: 90, 200;
    stroke-dashoffset: -124px;
  }
}
</style>
