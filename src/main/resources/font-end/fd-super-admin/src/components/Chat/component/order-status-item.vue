<template>
  <div class="order-card">
    <div class="order-header">
      <div class="order-icon">
        <img  style="background: #fff;"  :src="require('@/assets/img_bank/'+item.icon)" alt="" />
      </div>
      <div class="order-info">
        <div class="order-number">{{ orderInfo.merchantOrderNo }}</div>
        <div class="order-time">{{ orderInfo.createTime }}</div>
      </div>
    </div>
    <div class="order-footer">
      <div class="order-amount">¥ {{ orderInfo.payAmount }}</div>
      <el-tag :type="orderState.type" class="order-status">{{ orderState.label }}</el-tag>
    </div>
  </div>
</template>

<script>

import { getOrderInfoByOrderId } from "@/api/chat";
import { orderStateOptions } from "@/utils/constants";

export default {
  name: "PaymentMethodItem",
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    orderState() {
      return this.orderStateOptions.find(item => item.value === this.orderInfo.orderStatus);
    }
  },
  data() {
    return {
      orderInfo: '',
      orderStateOptions,
    }
  },
  mounted() {
    this.getOrderInfo();
  },
  methods: {
    getOrderInfo() {
      // 聊天消息传来的 oid 
      getOrderInfoByOrderId(this.item.oid).then(res => {
        this.orderInfo = res.data;
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.order-card {
  background: #fff;
  border-radius: 8px;
  width: 300px;
  padding: 14px;
  margin-bottom: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  .order-header {
    display: flex;
    align-items: flex-start;
    margin-bottom: 10px;

    .order-icon {
      width: 54px;
      height: 54px;
      border-radius: 8px;
      overflow: hidden;
      flex-shrink: 0;
      margin-right: 12px;
      background: linear-gradient(135deg, #1677ff 0%, #0050b3 100%);
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .order-info {
      flex: 1;

      .order-number {
        font-size: 14px;
        font-weight: 500;
        color: #333;
        margin-bottom: 4px;
      }

      .order-time {
        font-size: 12px;
        color: #999;
      }
    }
  }

  .order-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 10px;
    border-top: 1px solid #f5f5f5;

    .order-amount {
      font-size: 16px;
      font-weight: bold;
      color: #ff3b30;
    }

    .order-status {
      font-size: 12px;
      color: #999;
    }
  }
}
</style>