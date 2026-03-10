<template>
  <reportUi v-if="isShowUi"></reportUi>
  <reportNo v-else></reportNo>
</template>

<script>
  import reportUi from './service-team-report-ui.vue'
  import reportNo from './service-team-report-no.vue'
  export default {
    name: 'ReceiveOrder',
    components: {
      reportUi,
      reportNo
    }
  }
</script>

<style scoped>

</style>