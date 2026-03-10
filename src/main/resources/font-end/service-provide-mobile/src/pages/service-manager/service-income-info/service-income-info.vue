<template>
  <myUi v-if="isShowUi"></myUi>
  <myNo v-else></myNo>
</template>

<script>
import myNo from './service-income-info-no.vue'
import myUi from './service-income-info-ui.vue'

export default {
  components:{
    myNo,
    myUi
  }
}
</script>

<style lang="scss" scoped>
</style>
