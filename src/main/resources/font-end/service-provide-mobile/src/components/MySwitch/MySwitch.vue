<template>
  <view class="box">
    <!-- 使用 el-switch 组件 -->
    <!-- v-on="$listeners" -->
    <!-- v-bind="$attrs" -->
    <!-- size="22" -->
    <u-switch
      v-bind="$attrs"
      :value="value"
      @change="handleChange"
      :activeValue="1"
      :size="22"
      :inactiveValue="0"
    ></u-switch>

    <text
      class="word"
      @click.stop="switchClick()"
      :style="{
        fontSize: size - 12 + 'px',
        lineHeight: size - 12 + 'px',
        top: size < 24 ? '50%' : '35%'
      }"
      :class="{ open: value, close: !value }"
      >{{ value ? '开' : '关' }}</text
    >
  </view>
</template>

<script>
export default {
  name: 'MySwitch',
  inheritAttrs: false,

  props: {
    value: {
      type: Number,
      default: 0
    },
    size: {
      type: Number,
      default: 22
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

  .open {
    left: 30%;
  }

  .close {
    left: 70%;
    color: $u-primary;
  }
}
</style>
