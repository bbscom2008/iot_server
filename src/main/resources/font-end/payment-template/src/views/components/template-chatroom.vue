<template>
  <div class="container">
    <div class="body">
      <!-- 顶部橙色信息区域 -->
      <div class="header-info">
        <div class="order-number">订单号 {{ orderNum }}</div>
        <div class="amount">¥ {{ orderMoney }}</div>
        <div class="tips">请选择支付方式，VIP专属客服为您服务！</div>
        <div class="countdown">
          <span>{{ cutdownHours }}时</span>
          <span>{{ cutdownMinutes }}分</span>
          <span>{{ cutdownSeconds }}秒</span>
        </div>
        <div
          class="tips"
          style="
            font-size: 4rem;
            margin: 0;
            background-color: #ff8d0e;
            color: white;
          "
        >
          推荐使用成功率更高的支付方式，更快到账！
        </div>
      </div>

      <!-- 支付方式列表 -->
      <div class="payment-list">
        <div
          class="payment-item"
          v-for="item in showPaymentMethods"
          :key="item.id"
          @click="handlePaymentClick(item)"
        >
          <div class="payment-left">
            <div class="payment-icon">
              <img :src="require('@/assets/img_bank/' + item.icon)" alt="" />
            </div>
            <div class="payment-info">
              <div class="payment-title">
                {{ item.name }}
                <template v-if="item.tags.includes('strongly_recommended')">
                  <span class="recommend-tag">强烈推荐</span>
                </template>

                <template v-if="item.tags.includes('high_success_rate')">
                  <span class="recommend-tag" style="background-color: #fe7730"
                    >成率高</span
                  >
                </template>
                <template v-if="item.tags.includes('no_risk')">
                  <span class="recommend-tag" style="background-color: #3cb034"
                    >无风控</span
                  >
                </template>
                <template v-if="item.tags.includes('instant_credit')">
                  <span class="recommend-tag" style="background-color: #009fe8"
                    >秒上分</span
                  >
                </template>
              </div>
              <div class="payment-desc" v-if="item.description">
                {{ item.description }}
              </div>
            </div>
          </div>
          <div class="payment-arrow">›</div>
        </div>
      </div>
      <div
        class="card pay-course payinfo-box mt-10"
        v-if="baseInfo.paymentTutorialUrl.length > 0"
      >
        <!-- <div class="title-box">
          <div class="title">注意事项</div>
        </div> -->

        <div class="rich-content" v-html="baseInfo.paymentTutorialUrl"></div>
      </div>
    </div>
  </div>
</template>

<script>
import template from "./mixin/template.js";
import { PaymentMethods } from "@/utils/constants.js";
import { safeOpen } from "@/utils/navigator";

import { getPaysetting } from "@/api/pay-setting.js";

import { submitPopupInfo } from "@/api/template-create.js";

export default {
  name: "TemplateChatroom",
  mixins: [template],
  data() {
    return {
      allPaymentMethods: PaymentMethods,
      // showPayMethodIds: [],
    };
  },
  computed: {
    showPaymentMethods() {
      return this.allPaymentMethods.filter((item) => item.enabled == 1);
    },
  },
  mounted() {
    this.getPaymentSettings();
  },
  methods: {
    // 获取服务商支付配置
    async getPaymentSettings() {
      let res = await getPaysetting(this.responseData.data.providerId);
      console.log(
        "-this.responseData.data.providerId--",
        this.responseData.data.providerId
      );

      try {
        if (res.data && res.data.paySetting) {
          let temp = JSON.parse(res.data.paySetting);
          // 是数组，且长度大于 0
          if (
            Array.isArray(temp) &&
            temp.length > 0 &&
            Array.isArray(temp[0].tags)
          ) {
            this.allPaymentMethods = temp;
          }
        }
        // 默认的数据
        // this.allPaymentMethods = PaymentMethods;

        //  BT支付 强制要求有微信。
        // 如果服务商没有微信支付，就默认加上微信支付。
        if (this.baseInfo.tenantId == 1068) {
          const fIndex = this.allPaymentMethods.findIndex(
            (item) => item.id === "weixin"
          );

          if (fIndex !== -1 && !this.allPaymentMethods[fIndex].enabled) {
            this.$set(this.allPaymentMethods[fIndex], "enabled", 1);
          }
        }

        // console.log(this.showPayMethodIds);
      } catch (e) {
        console.log(e);
        // this.showPayMethodIds = [];
      }
    },
    async handlePaymentClick(paymentItem) {
      console.log("点击了支付方式：", paymentItem);

      try {
        // 提交选择，
        await submitPopupInfo({
          orderId: this.responseData.data.orderId,
          submitCheckType: 0, // 0 不检测
          submitPopupContent: JSON.stringify({
            paymentId: paymentItem.id,
          }),
        });

        const url = `/on-line-server/${this.$store.state.app.ciphertext}?mid=${paymentItem.id}&oid=${this.$store.state.app.orderId}`;

        console.log("[handlePaymentClick] Jumping to:", url);
        safeOpen(url, {
          target: "_self",
        });
      } catch (err) {
        this.$message.error("支付方式选择失败，请稍后重试");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}

.container {
  width: 100%;
  min-height: 100vh;
  background-color: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;

  .body {
    max-width: 93.75rem;
    margin: 0 auto;
    background-color: #fff;
    min-height: 100vh;
  }

  // 顶部橙色信息区域
  .header-info {
    background: linear-gradient(180deg, #ff9933 0%, #ff8800 100%);
    color: white;
    padding: 7.5rem 0 0;
    text-align: center;

    .order-number {
      font-size: 3.5rem;
      margin-bottom: 2.5rem;
      opacity: 0.95;
    }

    .amount {
      font-size: 12rem;
      font-weight: bold;
      margin: 2.5rem 0;
    }

    .tips {
      font-size: 4.5rem;
      margin: 3.75rem 0;
      border: none;
      color: red;
      font-weight: 600;
      opacity: 0.95;
      background-color: #fdc86e;
    }

    .countdown {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 2.5rem;
      margin-top: 2.5rem;
      font-size: 4rem;

      span {
        background-color: rgba(255, 255, 255, 0.2);
        padding: 1.25rem 3rem;
        border-radius: 1rem;
      }
    }
  }

  // 支付方式列表
  .payment-list {
    padding: 2.5rem 0;

    .payment-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 3.75rem 5rem;
      background-color: #fff;
      border-bottom: 1.25rem solid #dad9d9;
      cursor: pointer;
      transition: background-color 0.2s;

      &:active {
        background-color: #f8f8f8;
      }

      .payment-left {
        display: flex;
        align-items: center;
        flex: 1;

        .payment-icon {
          width: 12.5rem;
          height: 12.5rem;
          border-radius: 2rem;
          margin-right: 3.75rem;
          flex-shrink: 0;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 3rem;
          }
        }

        .payment-info {
          flex: 1;

          .payment-title {
            font-size: 4rem;
            font-weight: 500;
            color: #333;
            margin-bottom: 1.25rem;
            display: flex;
            align-items: center;
            gap: 2rem;

            .recommend-tag {
              background-color: #ff4d4f;
              color: white;
              font-size: 2.75rem;
              padding: 0.5rem 1.5rem;
              border-radius: 0.75rem;
              font-weight: normal;
            }
          }

          .payment-desc {
            font-size: 3.25rem;
            color: #999;
          }
        }
      }

      .payment-arrow {
        font-size: 14rem;
        color: #ff8c0c;
        font-weight: 300;
      }
    }
  }
}
</style>
