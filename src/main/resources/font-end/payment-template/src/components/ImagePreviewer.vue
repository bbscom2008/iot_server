<template>
  <transition name="image-previewer-fade">
    <div v-if="visible" class="image-previewer" @click.self="close">
      <div class="image-previewer__toolbar">
        <span class="image-previewer__name">{{ filename }}</span>
        <i class="el-icon-close image-previewer__close" @click="close" />
      </div>
      <div class="image-previewer__content" @click="close">
        <img :src="src" alt="预览图片" class="image-previewer__img" />
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ImagePreviewer',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    src: {
      type: String,
      default: ''
    }
  },
  computed: {
    filename() {
      try {
        const url = new URL(this.src, window.location.href)
        const pathname = url.pathname
        return decodeURIComponent(pathname.substring(pathname.lastIndexOf('/') + 1)) || '图片预览'
      } catch (e) {
        if (typeof this.src === 'string') {
          const parts = this.src.split('?')[0].split('/')
          return decodeURIComponent(parts[parts.length - 1] || '图片预览')
        }
        return '图片预览'
      }
    }
  },
  watch: {
    visible: {
      immediate: true,
      handler(val) {
        this.toggleScroll(!val)
        if (val) {
          window.addEventListener('keydown', this.onKeydown)
        } else {
          window.removeEventListener('keydown', this.onKeydown)
        }
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.onKeydown)
    this.toggleScroll(true)
  },
  methods: {
    close() {
      this.$emit('update:visible', false)
    },
    onKeydown(e) {
      if (e.key === 'Escape') {
        this.close()
      }
    },
    toggleScroll(enable) {
      if (typeof document === 'undefined') return
      document.body.style.overflow = enable ? '' : 'hidden'
    }
  }
}
</script>

<style scoped>
.image-previewer {
  position: fixed;
  z-index: 3000;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  padding: 24px 32px;
  box-sizing: border-box;
}

.image-previewer__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  font-size: 16px;
  margin-bottom: 16px;
}

.image-previewer__close {
  font-size: 22px;
  cursor: pointer;
}

.image-previewer__content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
}

.image-previewer__img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.image-previewer-fade-enter-active,
.image-previewer-fade-leave-active {
  transition: opacity 0.2s ease;
}

.image-previewer-fade-enter,
.image-previewer-fade-leave-to {
  opacity: 0;
}

.image-previewer__name {
  max-width: calc(100% - 40px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

