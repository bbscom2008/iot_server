<template>
  <div class="myqr-box" v-loading="loading" >
    <qrcode-vue :value="value" :size="size" level="M"
     render-as="svg"  style="width: 100%; height: 100%;"/>
  </div>
</template>

<script>
import QrcodeVue from 'qrcode.vue'
import { addOrderOperationLog } from '@/api/template-create'
export default {
  name: 'MyQrCode',
  props: {
    value: {
      type: String,
      default: ''
    },
    size: {
      type: Number,
      default: 200
    }
  },
  components: {
    QrcodeVue
  },
  data(){
    return {
      loading: false
    }
  },
  watch: {
    value(newVal, oldVal){
      if(newVal != ''){
        this.loading = false;
      }
    }
  },
  mounted() {
    addOrderOperationLog(this.$store.getters.orderId, 'MyQrCode mounted: '+this.value);
    if(this.value === ''){
      this.loading = true;
      this.$eventBus.$emit('myqr-code-empty');
    }
  },
 
}
</script>

<style lang="scss" scoped>
.myqr-box {
  display: inline-block;
  width:100%;
  height: 100%;
  ::v-deep svg {
    vertical-align: middle;
    width: 100% !important;
    height: 100% !important;
  }
}
</style>
