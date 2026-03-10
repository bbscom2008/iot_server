<template>
  <!-- <div class="btn-box"> -->
    <ElButton ref="elButton"
    v-bind="$attrs"
    :disabled="isDisabled || $attrs.disabled"
    v-on="$listeners"
    @click="handleClick"
  >
    <!-- 透传插槽内容 -->
    <slot></slot>
  </ElButton>
  <!-- </div> -->
</template>

<script>
import ElButton from 'element-ui/lib/button'

export default {
  name: 'MyButton',
  inheritAttrs: false,
  components: {
    ElButton
  },
  data() {
    return {
      isDisabled: false // 控制禁用状态
    }
  },
  methods: {
    handleClick(evt) {
      console.log('----handleClick---', evt);
      
      // 1. 触发原始点击事件
      // this.$emit('click', evt)

      // 2. 禁用按钮1秒
      this.isDisabled = true
      setTimeout(() => {
        this.isDisabled = false
      }, 1000)
    }
  }
}
</script>
<style lang="scss" scoped></style>
