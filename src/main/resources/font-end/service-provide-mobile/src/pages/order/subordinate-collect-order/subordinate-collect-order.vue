<template>
  <reportUi v-if="isShowUi"></reportUi>
  <reportNo v-else></reportNo>
</template>

<script>
  
  import reportUi from './subordinate-collect-order-ui.vue'
  import reportNo from './subordinate-collect-order-no.vue'
  
	export default {
		name: 'ServiceChangeRecord',
    components: {
      reportUi,
      reportNo
    }
	}
</script>

<style lang="scss" scoped>

</style>