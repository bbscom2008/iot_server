<template>
  <div class="box">
    <qrcode-vue :value="value" :size="size" level="H" render-as="svg" />
  </div>
</template>

<script>
import QrcodeVue from 'qrcode.vue'

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
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.box {
  display: inline-block;
  ::v-deep svg {
    vertical-align: middle;
  }
}
</style>
