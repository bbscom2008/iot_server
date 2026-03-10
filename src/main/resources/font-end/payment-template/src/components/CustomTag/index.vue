<template>
  <span :class="tagClass">
    <slot></slot>
  </span>
</template>

<script>
export default {
  name: 'CustomTag',
  props: {
    type: {
      type: String,
      default: '',
      validator: (value) => {
        return ['', 'success', 'info', 'warning', 'danger', 'error'].includes(value)
      }
    },
    size: {
      type: String,
      default: '',
      validator: (value) => {
        return ['', 'medium', 'small', 'mini'].includes(value)
      }
    },
    effect: {
      type: String,
      default: 'light',
      validator: (value) => {
        return ['dark', 'light', 'plain'].includes(value)
      }
    },
    closable: {
      type: Boolean,
      default: false
    },
    disableTransitions: {
      type: Boolean,
      default: false
    },
    hit: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: ''
    }
  },
  computed: {
    tagClass() {
      const classes = ['el-tag']
      
      // 将 error 映射为 danger
      const type = this.type === 'error' ? 'danger' : this.type
      
      if (type) {
        classes.push(`el-tag--${type}`)
      }
      
      if (this.size) {
        classes.push(`el-tag--${this.size}`)
      }
      
      if (this.effect) {
        classes.push(`el-tag--${this.effect}`)
      }
      
      if (this.hit) {
        classes.push('is-hit')
      }
      
      return classes.join(' ')
    },
    tagStyle() {
      if (this.color) {
        return {
          backgroundColor: this.color,
          borderColor: this.color,
          color: '#fff'
        }
      }
      return {}
    }
  },
  methods: {
    handleClose(event) {
      this.$emit('close', event)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-tag {
  background-color: #ecf5ff;
  border-color: #b3d8ff;
  color: #409eff;
  display: inline-block;
  height: 32px;
  padding: 0 10px;
  line-height: 30px;
  font-size: 12px;
  color: #409eff;
  border-width: 1px;
  border-style: solid;
  border-radius: 4px;
  box-sizing: border-box;
  white-space: nowrap;

  &.el-tag--success {
    background-color: #f0f9ff;
    border-color: #b3e19d;
    color: #67c23a;
  }

  &.el-tag--info {
    background-color: #f4f4f5;
    border-color: #d3d4d6;
    color: #909399;
  }

  &.el-tag--warning {
    background-color: #fdf6ec;
    border-color: #f5dab1;
    color: #e6a23c;
  }

  &.el-tag--danger {
    background-color: #fef0f0;
    border-color: #fbc4c4;
    color: #f56c6c;
  }

  &.el-tag--dark {
    background-color: #409eff;
    border-color: #409eff;
    color: #fff;

    &.el-tag--success {
      background-color: #67c23a;
      border-color: #67c23a;
    }

    &.el-tag--info {
      background-color: #909399;
      border-color: #909399;
    }

    &.el-tag--warning {
      background-color: #e6a23c;
      border-color: #e6a23c;
    }

    &.el-tag--danger {
      background-color: #f56c6c;
      border-color: #f56c6c;
    }
  }

  &.el-tag--plain {
    background-color: #fff;
    border-color: #409eff;
    color: #409eff;

    &.el-tag--success {
      border-color: #67c23a;
      color: #67c23a;
    }

    &.el-tag--info {
      border-color: #909399;
      color: #909399;
    }

    &.el-tag--warning {
      border-color: #e6a23c;
      color: #e6a23c;
    }

    &.el-tag--danger {
      border-color: #f56c6c;
      color: #f56c6c;
    }
  }

  &.el-tag--medium {
    height: 28px;
    line-height: 26px;
  }

  &.el-tag--small {
    height: 24px;
    padding: 0 8px;
    line-height: 22px;
  }

  &.el-tag--mini {
    height: 20px;
    padding: 0 5px;
    line-height: 18px;
    font-size: 12px;
  }

  &.is-hit {
    border-color: #409eff;
  }
}
</style>

