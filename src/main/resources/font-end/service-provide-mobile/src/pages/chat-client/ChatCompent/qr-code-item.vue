<template>
  <view class="order-card">
    <view class="order-header">
      <my-qr-code :value="item.value" :size="180"> </my-qr-code>
    </view>
    <view class="order-footer">
      <view class="title" @click="copyInfo(item.title)">{{ item.title }}</view>
      <view class="info" v-if="item.username">
        <text>账号：</text>
        <text @click="copyInfo(item.username)">{{ item.username }}</text>
      </view>
      <view class="info" v-if="item.remark">
        <text>备注：</text>
        <text @click="copyInfo(item.remark)">{{ item.remark }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import MyQrCode from '@/components/MyQrCode/MyQrCode.vue'
import { copyInfo } from '@/utils/index'

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
    copyInfo
  }
}
</script>

<style lang="scss" scoped>
.order-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  border-radius: 16rpx;
  // width: 260px;
  padding: 12rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);

  .order-header {
    // margin-bottom: 10px;
  }

  .order-footer {
    margin-top: 8rpx;
    width: 100%;
    .title {
      text-align: center;
      font-size: 28rpx;
      font-weight: 600;
      margin-bottom: 12rpx;
      color: rgb(24, 144, 255);
    }
    .info {
      margin-bottom: 8rpx;
      font-size: 24rpx;
    }
  }
}
</style>
