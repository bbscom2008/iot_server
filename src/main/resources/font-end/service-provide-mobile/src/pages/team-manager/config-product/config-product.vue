<template>
  <reportUi v-if="isShowUi"  ref="compUi" :options="options" ></reportUi>
  <reportNo v-else ref="compNo" :options="options" ></reportNo>
</template>

<script>
  
  import reportUi from './config-product-ui.vue'
  import reportNo from './config-product-no.vue'
  
	export default {
		name: 'ServiceChangeRecord',
    components: {
      reportUi,
      reportNo
    },
    data(){
      return {
        options:{}
      }
    },
    onLoad(options) {
     this.options = options
    },
    
	}
</script>

<style lang="scss" scoped>

</style>