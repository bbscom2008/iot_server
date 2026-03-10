<template>
  <!-- :before-close="handleBeforeClose" -->
  <ElDialog v-bind="$attrs" v-on="$listeners" 
    v-el-drag-dialog
  :close-on-click-modal="false" >
    <div v-loading="$store.state.app.loading">
      <slot />
    </div>

    <!-- 手动处理具名插槽 -->
    <template #title>
      <slot name="title" />
    </template>
    <template #footer>
      <slot name="footer" />
    </template>
  </ElDialog>
</template>

<script>
import ElDialog from 'element-ui/lib/dialog'

export default {
  name: 'MyDialog',
  components: {
    ElDialog
  },
  inheritAttrs: false, // 防止默认属性绑定到根元素
  methods: {
    // handleBeforeClose(done) {
    //   // 查找所有 Form 并清除校验
    //   console.log('--------------------------------handleBeforeClose')

    //   setTimeout(() => {
    //     const forms = this.$el.querySelectorAll('.el-form')
    //     forms.forEach((formEl) => {
    //       const formRef = formEl.__vue__.$refs.form
    //       if (formRef) {
    //         formRef.clearValidate() // 清除校验
    //         formRef.resetFields() // 重置表单（可选）
    //       }
    //     })
    //   }, 200)
    //   done() // 必须调用 done() 关闭 Dialog
    // }
  },
  mounted() {
    // console.log('MyDialog mounted, you can add custom logic here')
    // 可以在这里添加全局 Dialog 逻辑，比如统一关闭动画、拦截事件等
  }
}
</script>
