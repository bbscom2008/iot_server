<template>
  <myUi v-if="isShowUi"></myUi>
  <myNo v-else></myNo>
</template>

<script>
import myNo from './home-no.vue'
import myUi from './home-ui.vue'

export default {
  components:{
    myNo,
    myUi
  }
}
</script>

<style lang="scss" scoped>
</style>
