<template>
  <myUi v-if="isShowUi"></myUi>
  <myNo v-else></myNo>
</template>

<script>
import myNo from './myNo.vue'
import myUi from './myUi.vue'

export default {
  components:{
    myNo,
    myUi
  }
}
</script>

<style lang="scss" scoped>
</style>
