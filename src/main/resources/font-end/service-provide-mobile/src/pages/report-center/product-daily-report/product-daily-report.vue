<template>
  <reportUi v-if="isShowUi"></reportUi>
  <reportNo v-else></reportNo>
</template>

<script>
  
  import reportUi from './product-daily-report-ui.vue'
  import reportNo from './product-daily-report-no.vue'
  
	export default {
		name: 'ReceiveOrder',
    components: {
      reportUi,
      reportNo
    }
	}
</script>

<style lang="scss" scoped>

</style>