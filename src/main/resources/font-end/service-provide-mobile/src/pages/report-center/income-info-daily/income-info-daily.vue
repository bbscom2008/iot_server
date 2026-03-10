<template>
  <reportUi v-if="isShowUi"></reportUi>
  <reportNo v-else></reportNo>
</template>

<script>
  
  import reportUi from './income-info-daily-ui.vue'
  import reportNo from './income-info-daily-no.vue'
  
	export default {
		name: 'IncomeInfoDaily',
    components: {
      reportUi,
      reportNo
    }
	}
</script>

<style lang="scss" scoped>

</style>