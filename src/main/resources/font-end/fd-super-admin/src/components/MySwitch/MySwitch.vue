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
      @input="handleChange"
      :active-value="1"
      :inactive-value="0"
      :width="width"
      :disabled="disabled"
    ></ElSwitch>
    <!-- 新增的功能：显示开关状态的文本 -->
    <div
      class="word-wrap"
      :class="{ toleft: value, toright: !value, disabled: disabled }"
      @click.stop="switchClick()"
    >
      <span
        class="word"
        @click.stop="switchClick()"
        :class="{ open: value, close: !value, disabled: disabled }"
      >
        {{ value ? activeLabel : inactiveLabel }}</span
      >
    </div>
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
    activeValue: {
      type: Number | String | Boolean,
      default: 1
    },
    inactiveValue: {
      type: Number | String | Boolean,
      default: 0
    },
    width: {
      type: Number,
      default: 45
    },
    value: {
      type: Number | Boolean,
      default: false
    },
    disabled: {
      type: Boolean | Number,
      default: false
    },
    activeLabel: {
      type: String,
      default: '开'
    },
    inactiveLabel: {
      type: String,
      default: '关'
    }
  },
  data() {
    return {}
  },
  watch: {
    value(newVal) {}
  },
  methods: {
    switchClick() {
      console.log('---switchClick------', this.value)
      if (this.disabled) {
        return
      }
      this.$emit('input', this.value == this.activeValue ? this.inactiveValue : this.activeValue)
      this.$emit('change', this.value == this.activeValue ? this.inactiveValue : this.activeValue)
    },
    handleChange(newVal) {
      console.log('----handleChange-------', newVal)

      this.$emit('input', newVal)
      this.$emit('change', newVal)
    }
  }
}
</script>
<style lang="scss" scoped>

::v-deep  .el-switch__core{
  border-color: #c00;
  background-color: #c00;
  color: white;
}


::v-deep .el-switch.is-checked .el-switch__core{
  border-color: green;
  background-color: green;
}


.box {
  position: relative;
  display: inline-block;
  // display: flex;
  cursor: pointer;

  .word-wrap {
    position: absolute;
    display: flex;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }
  .word {
    // position: absolute;
    // top: 55%;
    // left: 50%;
    // transform: translate(-50%, -50%);
    margin-top: 1px;
    font-size: 12px;
    // line-height: 12px;
    color: #fff;
    z-index: 1;
  }
  .disabled.word:hover {
    cursor: not-allowed;
  }

  .toleft {
    justify-content: flex-start;
  }
  .toright {
    justify-content: flex-end;
  }
  .open {
    margin-left: 10px;
  }

  .close {
    margin-right: 10px;
    color: #fff;
  }
}
</style>
