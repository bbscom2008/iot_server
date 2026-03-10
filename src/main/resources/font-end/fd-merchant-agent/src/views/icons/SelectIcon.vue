<template>
  <div class="icons-container">
    <el-tabs type="border-card">
      <el-tab-pane label="Svg-Icons">
        <div class="grid">
          <div v-for="item of svgIcons" :key="item" @click="itemClick(item)">
            <el-tooltip placement="top">
              <div slot="content">
                <!-- {{ generateIconCode(item) }} -->
                  {{ item }}
              </div>
              <div class="icon-item">
                <svg-icon :icon-class="item" class-name="disabled" />
                <!-- <span>{{ item }}</span> -->
              </div>
            </el-tooltip>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Element-UI Icons">
        <div class="grid">
          <div v-for="item of elementIcons" :key="item" @click="item2Click(item)">
            <el-tooltip placement="top">
              <div slot="content">
                <!-- {{ generateElementIconCode(item) }} -->
                el-icon-{{ item }}
              </div>
              <div class="icon-item">
                <i :class="'el-icon-' + item" />
                <!-- <span>{{ item }}</span> -->
              </div>
            </el-tooltip>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import clipboard from '@/utils/clipboard'
import svgIcons from './svg-icons'
import elementIcons from './element-icons'

export default {
  name: 'Icons',
  data() {
    return {
      svgIcons,
      elementIcons
    }
  },
  props: {
    select: {
      type: Boolean,
      default: false
    }, 
  },
  methods: {
    generateIconCode(symbol) {
      return `<svg-icon icon-class="${symbol}" />`
    },
    generateElementIconCode(symbol) {
      return `<i class="el-icon-${symbol}" />`
    },
    handleClipboard(text, event) {
      clipboard(text, event)
    },
    itemClick(item) {

      if (this.select) {
        this.$emit('selectIcon', item)
      }else{
        handleClipboard(generateIconCode(item),$event)
      }
    },
    item2Click(item) {

      if (this.select) {
        this.$emit('selectIcon', 'el-icon-' + item) 
      } else {
        handleClipboard(generateElementIconCode(item),$event) 
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.icons-container {
  margin: 10px 10px 0;
  overflow: auto;

  .grid {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    max-height: 200px;
    overflow: auto;
  }

  .icon-item {
    margin: 5px;
    height: 20px;
    text-align: center;
    width: 20px;
    font-size: 18px;
    color: #24292e;
    cursor: pointer;
  }

  span {
    display: block;
    font-size: 16px;
    margin-top: 10px;
  }

  .disabled {
    pointer-events: none;
  }
}
</style>
