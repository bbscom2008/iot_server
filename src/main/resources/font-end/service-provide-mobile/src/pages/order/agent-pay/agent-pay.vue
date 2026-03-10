<template>
  <reportUi v-if="isShowUi" :isInTab="isInTab" ></reportUi>
  <reportNo v-else :isInTab="isInTab" ></reportNo>
</template>

<script>
  
  import reportUi from './agent-pay-ui.vue'
  import reportNo from './agent-pay-no.vue'
  
	export default {
		name: 'ServiceChangeRecord',
    components: {
      reportUi,
      reportNo
    },
    props: {
      isInTab: {
        type: Boolean | String,
        default: false
      }
    },
    
	}
</script>

<style lang="scss" scoped>

</style>