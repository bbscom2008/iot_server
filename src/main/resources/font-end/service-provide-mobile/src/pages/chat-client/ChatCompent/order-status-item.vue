<template>
  <view class="order-card">
    <view class="order-header">
      <view class="order-icon">
        <image
          style="background: #fff"
          :src="require('@/static/img_bank/' + item.icon)"
          mode="aspectFill"
        ></image>
      </view>
      <view class="order-info">
        <view class="order-number" style="color: #1890ff;" @click="copyInfo(orderInfo.merchantOrderNo)"
        >{{ orderInfo.merchantOrderNo }}
        <SvgIcon name="copy" style="margin-left: 6rpx;" />
        </view>
        <view class="order-time">{{ orderInfo.createTime }}</view>
      </view>
    </view>
    <view class="order-footer">
      <view :class="['order-status', 'status-' + orderState.type]">{{
        orderState.label
      }}</view>
      <view class="order-amount">¥ {{ orderInfo.payAmount }}</view>
      <view
        class="order-remark" style="color: #1890ff;"
        @click="copyInfo(orderInfo.transferRemark)"
        >{{ orderInfo.transferRemark }}
           <SvgIcon name="copy" style="margin-left: 6rpx;" :size="10" />
        </view
      >
    </view>
  </view>
</template>

<script>
import { getOrderInfoByOrderId } from '@/api/chat'
import { orderStateOptions } from '@/utils/constants'
import {copyInfo} from '@/utils/index'
export default {
  name: 'PaymentMethodItem',
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    orderState() {
      return (
        this.orderStateOptions.find(
          (item) => item.value === this.orderInfo.orderStatus
        ) || {}
      )
    }
  },
  data() {
    return {
      orderInfo: '',
      orderStateOptions
    }
  },
  mounted() {
    this.getOrderInfo()
  },
  methods: {
    copyInfo,
    getOrderInfo() {
      // 聊天消息传来的 oid
      getOrderInfoByOrderId(this.item.oid).then((res) => {
        this.orderInfo = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.order-card {
  background: #fff;
  border-radius: 16rpx;
  max-width: 100%;
  padding: 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);

  .order-header {
    display: flex;
    align-items: flex-start;
    margin-bottom: 10rpx;

    .order-icon {
      width: 70rpx;
      height: 70rpx;
      border-radius: 10rpx;
      overflow: hidden;
      flex-shrink: 0;
      margin-right: 14rpx;
      background: linear-gradient(135deg, #1677ff 0%, #0050b3 100%);
      display: flex;
      align-items: center;
      justify-content: center;

      image {
        width: 100%;
        height: 100%;
      }
    }

    .order-info {
      flex: 1;

      .order-number {
        font-size: 22rpx;
        font-weight: 600;
        color: #333;
        margin-bottom: 6rpx;
      }

      .order-time {
        font-size: 22rpx;
        color: #999;
      }
    }
  }

  .order-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 10rpx;
    border-top: 2rpx solid #f5f5f5;

    .order-amount {
      font-size: 22rpx;
      font-weight: bold;
      color: #ff3b30;
    }

    .order-remark {
      font-size: 22rpx;
      color: #999;
    }

    .order-status {
      font-size: 22rpx;
      padding: 4rpx 16rpx;
      border-radius: 8rpx;

      // Element UI tag 类型样式适配
      &.status-success {
        background: #f0f9ff;
        color: #67c23a;
      }

      &.status-warning {
        background: #fdf6ec;
        color: #e6a23c;
      }

      &.status-danger {
        background: #fef0f0;
        color: #f56c6c;
      }

      &.status-info {
        background: #f4f4f5;
        color: #909399;
      }

      &.status- {
        color: #999;
      }
    }
  }
}
</style>
