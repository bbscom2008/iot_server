<template>
  <div class="">
    <div class="logo">
      <img src="@/assets/img_bank/usdt_icon.png" alt="" />
    </div>

    <div class="amount">
      <span class="text"> {{ orderInfo.payAmount }}USTD </span>

      <i
        class="el-icon-document-copy"
        @click="
          (e) => {
            clipboard(orderInfo.payAmount, e)
          }
        "
      ></i>
    </div>

    <div class="cutdowntime" v-if="cutdownTime > 0">
      请在
      <span v-if="cutdownHours > 0">{{ cutdownHours }}:</span>
      <span>{{ cutdownMinutes }}:</span>
      <span>{{ cutdownSeconds }}s</span> 内完成支付
    </div>
    <div v-else class="outtime">已过期</div>

    <div class="trc-addr">
      <div class="trc">
        <span><img src="@/assets/img/ttrc.png" alt="" /></span>
        RTC20充币地址
      </div>
      <div class="addr-line">
        <span class="addr">{{ orderInfo.paymentData }}</span>
        <i
          class="el-icon-document-copy"
          @click="
            (e) => {
              clipboard(orderInfo.paymentData, e)
            }
          "
        ></i>
      </div>
    </div>

    <div class="info">请认准TRC20公链+仔细核对，以免造成损失！</div>

    <div class="qr-box">
      <my-qr-code :value="orderInfo.paymentData"></my-qr-code>
    </div>

    <div class="info-box" >
      <div class="row" >
        <div class="label" >
          订单号：
        </div>
        <div class="value" >
          {{ orderInfo.acceptanceId }}
        </div>
      </div>

      <div class="row" >
        <div class="label" >
          用户名：
        </div>
        <div class="value" >
          {{ orderInfo.userName }}
        </div>
      </div>


      <div class="row" >
        <div class="label" >
          订单金额：
        </div>
        <div class="value" >
          {{ orderInfo.orderAmount }}元
        </div>
      </div>

      <div class="row" >
        <div class="label" >
          U价汇率：
        </div>
        <div class="value" >
          {{ orderInfo.usdRate }}
        </div>
      </div>

      <div class="row" >
        <div class="label" >
          实付金额：
        </div>
        <div class="value"   @click="
              (e) => {
                clipboard(orderInfo.payAmount, e)
              }
            " style="cursor: pointer;"  >
          {{ orderInfo.payAmount }} U

          <i
            class="el-icon-document-copy"
          
          ></i>

        </div>
      </div>

      <div class="row" >
        <div class="label" >
          备注信息：
        </div>
        <div class="value" >
          {{ orderInfo.remark }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import clipboard from '@/utils/clipboard'

import { formatDateTime } from '@/utils'
import FileSaver from 'file-saver'
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
    clipboard,
    autoTime() {
      this.cutdownTime = Math.floor((new Date(this.orderInfo.expiredTime) - new Date()) / 1000)
      if (this.cutdownTime <= 0) {
        this.cutdownTime = 0
        clearInterval(this.autoFlag)
      } else {
        this.autoFlag = setInterval(() => {
          this.cutdownTime = Math.floor((new Date(this.orderInfo.expiredTime) - new Date()) / 1000)
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
  img {
    width: 60px;
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
  span {
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
  padding: 10px;
  color: #666;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  img {
    height: 12px;
    vertical-align: middle;
    margin-top: -3px;
  }
  .trc {
    font-size: 14px;
    span {
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
      font-size: 19px;
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

.info-box{
  .row {
    display: flex;
    justify-content: space-between;
    padding: 8px 20px;


    .label{
      color: #999;
    }
    .value {
      color: black;
      font-weight: 600;
    }

  }

}

</style>
