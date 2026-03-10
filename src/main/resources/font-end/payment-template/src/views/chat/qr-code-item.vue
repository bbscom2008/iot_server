<template>
  <div class="order-card">
    <div class="order-header">
      <my-qr-code :value="item.value" :size="180"> </my-qr-code>
    </div>
    <div class="order-footer">
      <div
        class="title"
        @click="
          (e) => {
            clipboard(item.title, e)
          }
        "
      >
        {{ item.title }}
      </div>
      <div class="info" v-if="item.username"  >
        <span>账号：</span>
        <span
          @click="
            (e) => {
              clipboard(item.username, e)
            }
          "
          >{{ item.username }}</span
        >
      </div>
      <div class="info" v-if="item.remark">
        <span>备注：</span>
        <span
          @click="
            (e) => {
              clipboard(item.remark, e)
            }
          "
          >{{ item.remark }}</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import MyQrCode from '@/components/MyQrCode/MyQrCode.vue'
import clipboard from '@/utils/clipboard'

export default {
  components: { MyQrCode },
  name: 'QrCodeItem',
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {}
  },
  mounted() {},
  methods: {
    clipboard
  }
}
</script>

<style lang="scss" scoped>
.order-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  border-radius: 8px;
  // width: 260px;
  padding: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  .order-header {
    // margin-bottom: 10px;
  }

  .order-footer {
    margin-top: 5px;
    width: 100%;
    .title {
      text-align: center;
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 6px;
      color: rgb(24, 144, 255);
    }
    .info {
      font-size: 16px;
    }
  }
}
</style>
