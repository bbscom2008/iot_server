<template>
  <button
    :class="['custom-button', `custom-button-${type}`, {
      'is-plain': plain,
      'is-round': round,
      'is-disabled': disabled
    }]"
    :disabled="disabled"
    :type="nativeType"
    @click="handleClick"
  >
    <span v-if="iconText" class="custom-button-icon">{{ iconText }}</span>
    <slot></slot>
  </button>
</template>

<script>
import { getIcon, isIconClass } from '@/utils/icons'

export default {
  name: 'CustomButton',
  props: {
    type: {
      type: String,
      default: 'default'
    },
    plain: Boolean,
    round: Boolean,
    disabled: Boolean,
    icon: String,
    nativeType: {
      type: String,
      default: 'button'
    },
    size: String
  },
  computed: {
    iconText() {
      if (!this.icon) return ''
      if (isIconClass(this.icon)) {
        return getIcon(this.icon)
      }
      return this.icon
    }
  },
  methods: {
    handleClick(e) {
      if (!this.disabled) {
        this.$emit('click', e)
      }
    }
  }
}
</script>

<style scoped>
.custom-button {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  margin: 0;
  font-weight: 500;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
  transition: all 0.3s;
}

.custom-button:hover:not(.is-disabled) {
  color: #409eff;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
}

.custom-button:active:not(.is-disabled) {
  color: #3a8ee6;
  border-color: #3a8ee6;
}

.custom-button-primary {
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
}

.custom-button-primary:hover:not(.is-disabled) {
  background: #66b1ff;
  border-color: #66b1ff;
  color: #fff;
}

.custom-button-success {
  color: #fff;
  background-color: #67c23a;
  border-color: #67c23a;
}

.custom-button-success:hover:not(.is-disabled) {
  background: #85ce61;
  border-color: #85ce61;
  color: #fff;
}

.custom-button-danger {
  color: #fff;
  background-color: #f56c6c;
  border-color: #f56c6c;
}

.custom-button-danger:hover:not(.is-disabled) {
  background: #f78989;
  border-color: #f78989;
  color: #fff;
}

.custom-button-text {
  border-color: transparent;
  color: #409eff;
  background: transparent;
  padding-left: 0;
  padding-right: 0;
}

.custom-button-text:hover:not(.is-disabled) {
  color: #66b1ff;
  background-color: transparent;
  border-color: transparent;
}

.custom-button.is-plain {
  background: #fff;
}

.custom-button-primary.is-plain {
  color: #409eff;
  background: #ecf5ff;
  border-color: #b3d8ff;
}

.custom-button-primary.is-plain:hover:not(.is-disabled) {
  background: #409eff;
  border-color: #409eff;
  color: #fff;
}

.custom-button-danger.is-plain {
  color: #f56c6c;
  background: #fef0f0;
  border-color: #fbc4c4;
}

.custom-button-danger.is-plain:hover:not(.is-disabled) {
  background: #f56c6c;
  border-color: #f56c6c;
  color: #fff;
}

.custom-button.is-round {
  border-radius: 20px;
}

.custom-button.is-disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.custom-button-icon {
  margin-right: 5px;
  display: inline-block;
}
</style>

