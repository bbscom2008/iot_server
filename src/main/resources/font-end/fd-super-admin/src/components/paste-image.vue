<template></template>

<script>

export default {
  data() {
    return {
      messages: [],
      textMessage: ''
    }
  },
  mounted() {
    // 确保容器可获取焦点
    this.$nextTick(() => {
      this.$el.focus()
    })

    // 添加全局粘贴事件监听（可选）
    window.addEventListener('paste', this.handleGlobalPaste)
  },
  beforeDestroy() {
    window.removeEventListener('paste', this.handleGlobalPaste)
  },
  methods: {
    async handlePaste(event) {
      console.log('粘贴事件触发', event)

      try {
        const items = event.clipboardData ? event.clipboardData.items : null
        if (!items) return

        // 查找图片数据
        for (let i = 0; i < items.length; i++) {
          const item = items[i]
          if (item.type.indexOf('image') !== -1) {
            event.preventDefault() // 阻止默认粘贴行为

            const file = item.getAsFile()
            this.$emit('paste-image', file)
            break
          }
        }
      } catch (error) {
        console.error('处理粘贴图片失败:', error)
      }
    },

    handleGlobalPaste(event) {
      this.handlePaste(event)
    },
  }
}
</script>

<style scoped>
.chat-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  outline: none; /* 移除焦点边框 */
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.message {
  margin-bottom: 10px;
  padding: 8px;
  border-radius: 8px;
  background: #f5f5f5;
}

.sent-image {
  max-width: 300px;
  max-height: 300px;
  border-radius: 8px;
}

.input-area {
  display: flex;
  padding: 10px;
  border-top: 1px solid #ddd;
  background: white;
}

.input-area input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 10px;
}

.input-area button {
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.input-area button:hover {
  background: #0056b3;
}

/* 确保容器可获取焦点 */
.chat-container:focus {
  outline: none;
}
</style>
