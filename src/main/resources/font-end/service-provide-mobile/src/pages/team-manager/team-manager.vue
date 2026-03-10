<template>
  <reportUi v-if="isShowUi"></reportUi>
  <reportNo v-else></reportNo>
</template>

<script>
  
  import reportUi from './team-manager-ui.vue'
  import reportNo from './team-manager-no.vue'
  
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