<template>
  <div ref="draggable" class="draggable-box" :style="boxStyle"  @mousedown="startDrag">
    <slot>拖拽我</slot>
    <div class="resize-handle" @mousedown.stop="startResize"></div>
  </div>
</template>

<script>
export default {
  props: {
    handle: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      position: { x: 100, y: 100 }, // 初始位置
      isDragging: false,
      startPos: { x: 0, y: 0 }, // 记录开始拖拽时的鼠标位置
      boxPos: { x: 0, y: 0 }, // 记录开始拖拽时盒子位置
      boxWidth: 500,
      boxHeight: 500,
      isResizing: false,
      resizeStartPos: { x: 0, y: 0 },
      resizeStartSize: { width: 0, height: 0 }
    }
  },
  computed: {
    boxStyle() {
      return {
        left: `${this.position.x}px`,
        top: `${this.position.y}px`,
        cursor: this.isDragging ? 'move' : 'default',
        // opacity: this.isDragging ? 0.9 : 1,
        width: `${this.boxWidth}px`,
        height: `${this.boxHeight}px`,
      }
    }
  },
  created(){
    const htmlWidth = document.documentElement.clientWidth;
    const htmlHeight = document.documentElement.clientHeight;

    this.boxHeight = htmlHeight *0.9;
    this.boxWidth = htmlWidth *0.8 > 1200 ? 1200 : htmlWidth *0.8;

    this.position = {
      x: (htmlWidth - this.boxWidth)/2,
      y: (htmlHeight - this.boxHeight)/2,
    }

  },
  mounted() {
    window.addEventListener('mousemove', this.handleDrag)
    window.addEventListener('mouseup', this.stopDrag)

  },
  beforeDestroy() {
    window.removeEventListener('mousemove', this.handleDrag)
    window.removeEventListener('mouseup', this.stopDrag)
  },
  methods: {
    startDrag(e) {
      if (e.button !== 0) return // 仅左键拖动

      if (this.handle) {
        const handleElement = e.target.closest(this.handle)
        if (!handleElement || !this.$refs.draggable.contains(handleElement)) {
          return
        }
      }

      this.isDragging = true
      // 记录初始位置（关键修复点）
      this.startPos = {
        x: e.clientX,
        y: e.clientY
      }
      this.boxPos = {
        x: this.position.x,
        y: this.position.y
      }

      e.preventDefault()
    },
    startResize(e) {
      if (e.button !== 0) return // 仅左键拖动

      this.isResizing = true
      this.resizeStartPos = {
        x: e.clientX,
        y: e.clientY
      }
      this.resizeStartSize = {
        width: this.boxWidth,
        height: this.boxHeight
      }

      e.preventDefault()
      e.stopPropagation()
    },
    handleDrag(e) {
      if (this.isResizing) {
        const deltaX = e.clientX - this.resizeStartPos.x
        const deltaY = e.clientY - this.resizeStartPos.y

        this.boxWidth = Math.max(200, this.resizeStartSize.width + deltaX)
        this.boxHeight = Math.max(200, this.resizeStartSize.height + deltaY)
      } else if (this.isDragging) {
        // 计算相对位移（修复跳变的核心逻辑）
        this.position = {
          x: this.boxPos.x + (e.clientX - this.startPos.x),
          y: this.boxPos.y + (e.clientY - this.startPos.y)
        }
      }
    },
    stopDrag() {
      this.isDragging = false
      this.isResizing = false
    }
  }
}
</script>

<style scoped>
.draggable-box {
  position: absolute;
  /* transform: translate(-50%, -50%); */
  
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  user-select: none;
  transition: opacity 0.2s;
}

.resize-handle {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 20px;
  height: 20px;
  cursor: nw-resize;
  background: transparent;
}
</style>
