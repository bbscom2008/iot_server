<template>
  <div class="order-card">
    <div class="order-header">
      <div class="order-icon">
        <img
          style="background: #fff"
          :src="require('@/assets/img_bank/' + item.icon)"
          alt=""
        />
      </div>
      <div class="order-info">
        <div
          class="order-number"
          @click="
            (e) => {
              clipboard(orderInfo.merchantOrderNo, e);
            }
          "
        >
          {{ orderInfo.merchantOrderNo
          }}<svg-icon icon-class="copy" class="icon" />
        </div>
        <div class="order-time">{{ orderInfo.createTime }}</div>
      </div>
    </div>
    <div class="order-footer">
      <div
        class="order-remark"
        @click="
          (e) => {
            clipboard(orderInfo.transferRemark, e);
          }
        "
      >
        {{ orderInfo.transferRemark
        }}<svg-icon icon-class="copy" class="icon" />
      </div>
      <div class="order-amount">¥ {{ orderInfo.payAmount }}</div>
      <el-tag
        v-if="orderState"
        :type="orderState.type"
        class="order-status"
        size="mini"
        >{{ orderState.label }}</el-tag
      >
    </div>
  </div>
</template>

<script>
import { getOrderInfoByOrderId } from "@/api/chat";
import { orderStateOptions } from "@/utils/constants";
import clipboard from "@/utils/clipboard";

export default {
  name: "OrderStatusItem",
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    orderState() {
      return this.orderStateOptions.find(
        (item) => item.value === this.orderInfo.orderStatus
      );
    },
  },
  data() {
    return {
      orderInfo: "",
      orderStateOptions,
    };
  },
  mounted() {
    console.log("====OrderStatusItem=====mounted======");

    this.getOrderInfo();
  },
  methods: {
    clipboard,
    getOrderInfo() {
      getOrderInfoByOrderId(this.$route.query.oid).then((res) => {
        this.orderInfo = res.data;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.order-card {
  background: #fff;
  border-radius: 2rem;
  width: 100%;
  padding: 2rem;
  // margin-bottom: 2.5rem;
  box-shadow: 0 0.5rem 2rem rgba(0, 0, 0, 0.06);

  .order-header {
    display: flex;
    align-items: flex-start;
    margin-bottom: 1.5rem;

    .order-icon {
      width: 8rem;
      height: 8rem;
      border-radius: 2rem;
      overflow: hidden;
      flex-shrink: 0;
      margin-right: 2rem;
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
        font-size: 3rem;
        font-weight: 500;
        color: #333;
        margin-bottom: 1rem;
      }

      .order-time {
        font-size: 2.5rem;
        color: #999;
      }
    }
  }

  .order-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 1rem;
    border-top: 0.25rem solid #f5f5f5;

    .order-amount {
      font-size: 3rem;
      font-weight: bold;
      color: #ff3b30;
    }
    .order-remark {
      font-size: 3rem;
      font-weight: bold;
      color: #999;
    }

    .order-status {
      font-size: 3rem;
      color: #999;
    }
  }
}
</style>
