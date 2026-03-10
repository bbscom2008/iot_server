<template>
  <reportUi v-if="isShowUi" :isInTab="isInTab" ></reportUi>
  <reportNo v-else :isInTab="isInTab" ></reportNo>
</template>

<script>
  
  import reportUi from './collect-order-ui.vue'
  import reportNo from './collect-order-no.vue'
  
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