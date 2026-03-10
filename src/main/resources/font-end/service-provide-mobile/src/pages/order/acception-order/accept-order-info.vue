<template>
  <view class="" style="padding-bottom: 30rpx;" >
    <view class="logo">
      <image class="img" src="@/static/img_bank/usdt_icon.png" alt="" />
    </view>

    <view class="amount">
      <text class="text" @click="copyInfo(orderInfo.payAmount+'')">
        {{ orderInfo.payAmount }} USTD
        <SvgIcon name="copy" style="margin-left: 6rpx" size="20"  />
      </text>
    </view>

    <view class="cutdowntime" v-if="cutdownTime > 0">
      请在
      <text v-if="cutdownHours > 0">{{ cutdownHours }}:</text>
      <text>{{ cutdownMinutes }}:</text>
      <text>{{ cutdownSeconds }}s</text> 内完成支付
    </view>
    <view v-else class="outtime">已过期</view>

    <view class="trc-addr">
      <view class="trc">
        <image class="img" src="@/static/imgs/ttrc.png" alt="" />
        RTC20充币地址
      </view>
      <view class="addr-line">
        <text class="addr" @click="copyInfo(orderInfo.paymentData)">
          {{ orderInfo.paymentData }}
          <SvgIcon name="copy" style="margin-left: 6rpx" />
        </text>
      </view>
    </view>

    <view class="info">请认准TRC20公链+仔细核对，以免造成损失！</view>

    <view class="qr-box">
      <my-qr-code :value="orderInfo.paymentData"></my-qr-code>
    </view>

    <view class="info-box">
      <view class="row">
        <view class="label"> 订单号： </view>
        <view class="value">
          {{ orderInfo.acceptanceId }}
        </view>
      </view>

      <view class="row">
        <view class="label"> 用户名： </view>
        <view class="value">
          {{ orderInfo.userName }}
        </view>
      </view>

      <view class="row">
        <view class="label"> 订单金额： </view>
        <view class="value"> {{ orderInfo.orderAmount }}元 </view>
      </view>

      <view class="row">
        <view class="label"> U价汇率： </view>
        <view class="value">
          {{ orderInfo.usdRate }}
        </view>
      </view>

      <view class="row">
        <view class="label"> 实付金额： </view>
        <view
          class="value"
          @click="
            (e) => {
              clipboard(orderInfo.payAmount, e)
            }
          "
          style="cursor: pointer"
        >
          {{ orderInfo.payAmount }} U

          <i class="el-icon-document-copy"></i>
        </view>
      </view>

      <view class="row">
        <view class="label"> 备注信息： </view>
        <view class="value">
          {{ orderInfo.remark }}
        </view>
      </view>
    </view>
    <view class="tips">支付完成以后，点击确认支付</view>
  </view>
</template>

<script>
import { copyInfo } from '@/utils/index'

import MyQrCode from '@/components/MyQrCode/MyQrCode.vue'

export default {
  components: { MyQrCode },
  name: 'AcceptenceOrderInfo',
  props: {
    orderInfo: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    cutdownHours() {
      return String(Math.floor(this.cutdownTime / 3600)).padStart(2, '0')
    },
    cutdownMinutes() {
      return String(Math.floor((this.cutdownTime % 3600) / 60)).padStart(2, '0')
    },
    cutdownSeconds() {
      return String(Math.floor((this.cutdownTime % 3600) % 60)).padStart(2, '0')
    }
  },

  data() {
    return {
      acceptOrderOptions: [
        { label: '待支付', value: 0, type: 'info' },
        { label: '已支付', value: 1, type: 'success' },
        { label: '审核通过', value: 2, type: 'primary' },
        { label: '审核驳回', value: 3, type: 'danger' },
        { label: '已取消', value: 4, type: 'warning' }
      ],
      cutdownTime: 0,
      autoFlag: null
    }
  },

  methods: {
    copyInfo,
    autoTime() {
      this.cutdownTime = Math.floor(
        (new Date(this.orderInfo.expiredTime) - new Date()) / 1000
      )
      if (this.cutdownTime <= 0) {
        this.cutdownTime = 0
        clearInterval(this.autoFlag)
      } else {
        this.autoFlag = setInterval(() => {
          this.cutdownTime = Math.floor(
            (new Date(this.orderInfo.expiredTime) - new Date()) / 1000
          )
          this.$forceUpdate()
        }, 1000)
      }
    }
  },
  mounted() {
    this.autoTime()
  }
}
</script>

<style lang="scss" scoped>
.logo {
  padding: 10px;
  text-align: center;
  .img {
    width: 60px;
    height: 60px;
  }
}
.amount {
  text-align: center;
  .text {
    color: black;
    font-size: 30px;
    font-weight: 600;
  }
  i {
    cursor: pointer;
    font-size: 16px;
    color: blue;
  }
}
.cutdowntime {
  padding: 10px;
  text-align: center;
  font-size: 14px;
  color: #333;
  text {
    color: #ffaa09;
  }
}
.outtime {
  text-align: center;
  color: red;
  font-size: 22px;
  font-weight: 600;
  padding: 10px;
}
.trc-addr {
  padding: 6px;
  color: #666;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  .img {
    height: 12px;
    width: 43px;
    vertical-align: middle;
    margin-top: -3px;
  }
  .trc {
    font-size: 14px;
    text {
      font-size: 11px;
      font-weight: 600;
      font-style: italic;
      color: #c23631;
      margin-right: 5px;
    }
  }
  .addr-line {
    margin-top: 10px;
    .addr {
      font-size: 14px;
      color: #283372;
      margin-right: 5px;
    }

    i {
      cursor: pointer;
      color: blue;
    }
  }
}
.info {
  padding: 15px;
  color: #ffaa09;
  font-size: 12px;
}
.qr-box {
  text-align: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.info-box {
  .row {
    display: flex;
    justify-content: space-between;
    padding: 8px 20px;

    .label {
      color: #999;
    }
    .value {
      color: black;
      font-weight: 600;
    }
  }
}

.tips{
  padding: 20rpx;
  background-color: bisque;
  color: #c00;
}

</style>
