<template>
  <loginUi v-if="isShowUi"></loginUi>
  <loginNo v-else></loginNo>
</template>

<script>
import loginNo from './login-no.vue'
import loginUi from './login-ui.vue'

export default {
  components:{
    loginNo,
    loginUi
  }
}
</script>

<style lang="scss" scoped>
</style>
