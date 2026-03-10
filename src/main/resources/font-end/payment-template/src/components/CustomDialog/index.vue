<template>
  <transition name="dialog-fade">
    <div
      v-if="visible"
      class="custom-dialog-wrapper"
      @click.self="handleWrapperClick"
    >
      <div
        class="custom-dialog"
        :style="{ width: width }"
      >
        <div class="custom-dialog-header" v-if="title || showClose">
          <span class="custom-dialog-title">{{ title }}</span>
          <button
            v-if="showClose"
            class="custom-dialog-headerbtn"
            @click="handleClose"
          >
            <i class="custom-dialog-close">×</i>
          </button>
        </div>
        <div class="custom-dialog-body">
          <slot></slot>
        </div>
        <div class="custom-dialog-footer" v-if="$slots.footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'CustomDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: String,
    width: {
      type: String,
      default: '50%'
    },
    showClose: {
      type: Boolean,
      default: true
    },
    closeOnClickModal: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    visible(val) {
      if (val) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
      this.$emit('close')
    },
    handleWrapperClick() {
      if (this.closeOnClickModal) {
        this.handleClose()
      }
    }
  },
  beforeDestroy() {
    document.body.style.overflow = ''
  }
}
</script>

<style scoped>
.custom-dialog-wrapper {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  margin: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
}

.custom-dialog {
  position: relative;
  margin: 15vh auto 50px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  box-sizing: border-box;
}

.custom-dialog-header {
  padding: 20px 20px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.custom-dialog-title {
  font-size: 18px;
  font-weight: 500;
  color: #303133;
}

.custom-dialog-headerbtn {
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #909399;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-dialog-headerbtn:hover {
  color: #409eff;
}

.custom-dialog-close {
  font-style: normal;
  font-size: 24px;
  line-height: 1;
}

.custom-dialog-body {
  padding: 20px;
  color: #606266;
  font-size: 14px;
  word-break: break-all;
}

.custom-dialog-footer {
  padding: 10px 20px 20px;
  text-align: right;
  box-sizing: border-box;
}

.dialog-fade-enter-active {
  animation: dialog-fade-in 0.3s;
}

.dialog-fade-leave-active {
  animation: dialog-fade-out 0.3s;
}

@keyframes dialog-fade-in {
  0% {
    transform: translate3d(0, -20px, 0);
    opacity: 0;
  }
  100% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}

@keyframes dialog-fade-out {
  0% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
  100% {
    transform: translate3d(0, -20px, 0);
    opacity: 0;
  }
}
</style>

