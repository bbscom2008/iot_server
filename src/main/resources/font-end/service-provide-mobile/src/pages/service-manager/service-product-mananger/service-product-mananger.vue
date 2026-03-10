<template>
  <reportUi v-if="isShowUi"></reportUi>
  <reportNo v-else></reportNo>
</template>

<script>
  
  import reportUi from './service-product-mananger-ui.vue'
  import reportNo from './service-product-mananger-no.vue'
  
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