<template>
  <div class="box">
    <!-- 使用 el-switch 组件 -->
    <!-- v-on="$listeners" -->
    <ElSwitch
      ref="switch"
      v-bind="$attrs"
      :value="value"
      active-text=""
      inactive-text=""
      @change="handleChange"
      :active-value="1"
      :inactive-value="0"
      :width="45"
      :disabled="disabled"
    ></ElSwitch>
    <!-- 新增的功能：显示开关状态的文本 -->
    <span class="word"  @click.stop="switchClick()" :class="{ open: value, close: !value, disabled:disabled }">{{
      value ? '开' : '关'
    }}</span>
    <!-- {{value}} -->
  </div>
</template>

<script>
import ElSwitch from 'element-ui/lib/switch'

export default {
  name: 'MySwitch',
  inheritAttrs: false,
  components: {
    ElSwitch
  },
  props: {
    value: {
      type: Number | Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  watch: {
    value(newVal) {
    }
  },
  methods: {
    switchClick() {
      if(this.disabled){
            return 
      }
      this.$emit('input', this.value == 1 ? 0 : 1)
      this.$emit('change', this.value == 1 ? 0 : 1)
    },
    handleChange(newVal) {
      this.$emit('input', newVal)
      this.$emit('change', newVal)
    }
  }
}
</script>
<style lang="scss" scoped>
.box {
  position: relative;
  display: inline-block;
  cursor: pointer;

  .word {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 12px;
    line-height: 12px;
    color: #fff;
    z-index: 1;
  }
  .disabled.word:hover{
    cursor: not-allowed;
  }

  .open {
    left: 35%;
  }

  .close {
    left: 65%;
  }
}
</style>
