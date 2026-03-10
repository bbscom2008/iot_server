<template>
  <reportUi v-if="isShowUi"></reportUi>
  <reportNo v-else></reportNo>
</template>

<script>
  
  import reportUi from './sub-change-record-ui.vue'
  import reportNo from './sub-change-record-no.vue'
  
	export default {
		name: 'SubChangeRecord',
    components: {
      reportUi,
      reportNo
    }
	}
</script>

<style lang="scss" scoped>

</style>