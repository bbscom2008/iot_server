<template>
  <view class="order-box">
    <view class="order-info k-box" v-if="showOrderInfo">
      <view class="line-item">
        <view class="item">
          <view class="label"> 订单金额 </view>
          <view class="value money">
            ￥{{
              orderInfo.orderAmount ? orderInfo.orderAmount.toFixed(2) : ''
            }}
          </view>
        </view>
        <view class="item">
          <view class="label"> 实付金额 </view>
          <view class="value money">
            ￥{{ orderInfo.payAmount ? orderInfo.payAmount.toFixed(2) : '' }}
          </view>
        </view>
        <view class="item">
          <view class="label"> 收款信息 </view>
          <view class="value"> {{ orderInfo.collectInfoName }} </view>
        </view>
        <!-- <view class="item">
          <view class="label"> 付款人姓名 </view>
          <view class="value"> {{ orderInfo.payerName }} </view>
        </view> -->
         <view class="item">
          <view class="label"> 订单备注 </view>
          <view class="value"> {{ orderInfo.transferRemark }} </view>
        </view>

      </view>
      <!-- <view class="remark">
        <view class="label"> 订单备注 </view>
        <view class="value"> {{ orderInfo.transferRemark }} </view>
      </view> -->
    </view>

    <view class="ext-info">
      <view class="num-info" v-if="showOrderInfo">
        <view class="line">
          <view class="label"> 商户单号 </view>
          <view class="value" @click="copyInfo(orderInfo.merchantOrderNo)">
            {{ orderInfo.merchantOrderNo }}
          </view>
        </view>
        <view class="line">
          <view class="label"> 系统单号 </view>
          <view class="value" @click="copyInfo(orderInfo.systemOrderNo)">
            {{ orderInfo.systemOrderNo }}
          </view>
        </view>
        <view class="line">
          <view class="label"> 创建时间 </view>
          <view class="value"> {{ orderInfo.createTime }} </view>
        </view>
      </view>
      <view class="msg-info" v-else> 查看订单信息 </view>
      <view class="btn-box">

        

        <u-button
          class="close1"
          v-if="showOrderInfo"
          :type=" 'primary'"
          @click="showDialog(2)"
          size="mini"
          >{{ '确认' }}</u-button
        >

        <u-tag
          class="close1"
          v-if="showOrderInfo"
          :type="orderStateType"
          size="mini"
          :text="orderStateLabel"
          style="margin-bottom: 10rpx;"
          ></u-tag
        >


        <!-- <u-button
					class="close"
					type="primary"
					@click="showDialog(3)"
					style="margin-bottom: 30rpx"
					size="mini"
					>取消</u-button
				> -->
      </view>
      <view class="btn-box" style="justify-content: flex-start">
        <u-button
          class="close1"
          type="primary"
          @click="switchShow()"
          size="mini"
          >{{ showOrderInfo ? '收起' : '展开' }}</u-button
        >
        <u-button
          class="close"
          type="primary"
          v-if="showOrderInfo"
          @click="showDialog(1)"
          :disabled="isRoomClose"
          size="mini"
        >
          {{ isRoomClose ? '已关闭' : '关闭' }}
        </u-button>
      </view>
    </view>

    <!-- 确认 、 接单 、 补单  弹窗 -->
    <uni-popup
      ref="procOrderPopupRef"
      :show="showOrderPopup"
      @maskClick="closeOrderModal()"
    >
      <view class="query-popup">
        <view class="popup-header">
          <text class="popup-title"> 确认订单</text>
          <uni-icons
            type="closeempty"
            class="close-icon"
            size="26"
            @click="closeOrderModal()"
          ></uni-icons>
        </view>

        <scroll-view class="modal-content" scroll-y>
          <uni-forms
            ref="queryFormDataRef"
            class="deal-info"
            :model="orderInfo"
            label-position="left"
            label-width="200"
          >
            <uni-forms-item label="系统订单号 : " name="">
              <uni-easyinput v-model="orderInfo.systemOrderNo" disabled />
            </uni-forms-item>

            <uni-forms-item label="商户订单号 : " name="">
              <uni-easyinput v-model="orderInfo.merchantOrderNo" disabled />
            </uni-forms-item>

            <uni-forms-item label="付款人姓名 : " name="">
              <uni-easyinput v-model="orderInfo.payerName" disabled />
            </uni-forms-item>

            <uni-forms-item label="收款信息名称 : " name="">
              <uni-easyinput v-model="orderInfo.collectInfoName" disabled />
            </uni-forms-item>

            <uni-forms-item label="订单金额 : " name="">
              <uni-easyinput
                :value="
                  orderInfo.orderAmount
                    ? orderInfo.orderAmount.toFixed(2)
                    : orderInfo.orderAmount
                "
                disabled
              />
            </uni-forms-item>

            <uni-forms-item label="实付金额 : " name="">
              <uni-easyinput
                :value="
                  orderInfo.payAmount
                    ? orderInfo.payAmount.toFixed(2)
                    : orderInfo.payAmount
                "
                class="money"
                disabled
              />
            </uni-forms-item>

            <uni-forms-item label="转账备注 : " name="">
              <uni-easyinput v-model="orderInfo.transferRemark" disabled />
            </uni-forms-item>

            <uni-forms-item label="订单创建时间 : " name="">
              <uni-easyinput v-model="orderInfo.createTime" disabled />
            </uni-forms-item>
          </uni-forms>
        </scroll-view>

        <view class="query-buttons">
          <button class="reset-btn" @click="closeOrderModal()">取消</button>
          <button class="search-btn" @click="orderBtnOk()">确认</button>
        </view>
      </view>
    </uni-popup>

    <CheckTradePwd
      @checkSuccess="doConfirmOrder"
      :showCheckPwdPopup.sync="showCheckPwdPopup"
    />
  </view>
</template>

<script>
import { getOrderInfoByOrderId } from '@/api/collect-order.js'
import CheckTradePwd from '@/components/check-trade-password/index.vue'
import { confirmCollectOrder } from '@/api/collect-order.js'

import { closeConversation } from '@/api/chat.js'

import {orderStateOptions} from '@/utils/constants'

import {
    copyInfo
  } from '@/utils'


import { navBack } from '@/utils/router.js'

export default {
  components: {
    CheckTradePwd
  },
  props: {
    showOrderInfo: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    showOrderPopup(v) {
      console.log('------showOrderPopup-------', v)
      if (this.$refs.procOrderPopupRef) {
        if (v) {
          this.$refs.procOrderPopupRef.open('bottom')
        } else {
          this.$refs.procOrderPopupRef.close()
        }
      }
    }
  },
  computed: {
    isRoomClose() {
      return this.$store.state.currConversation.status == 'CLOSE'
    },
     orderStateLabel(){
      return orderStateOptions.find(item => item.value === this.orderInfo.orderStatus).label
    },
    orderStateType(){
      return orderStateOptions.find(item => item.value === this.orderInfo.orderStatus).type
    },
  },
  data() {
    return {
      showCheckPwdPopup: false,
      orderInfo: {},
      showOrderPopup: false,
      showType: 0 // 1 关闭 2 确认
    }
  },
  mounted() {
    this.loadOrderInfo()
  },
  methods: {
    copyInfo,
    closeOrderModal() {
      this.showOrderPopup = false
    },

    async doConfirmOrder() {
      confirmCollectOrder(this.orderInfo.orderId).then((res) => {
        this.$message.success('确认成功')
        this.loadOrderInfo()
        this.closeOrderModal()
      })
    },

    async orderBtnOk() {
      // 确认订单
      if (this.$store.getters.isSecondConfirmOrder) {
        this.showCheckPwdPopup = true
      } else {
        await this.doConfirmOrder()
      }
    },

    showDialog(n) {
      this.showType = n

      let content = ''
      let title = ''
      switch (n) {
        case 1: // 关闭
          title = '关闭聊天室'
          content = '确认要关闭聊天室吗？关闭后不能再发消息'
          break
        case 2: // 确认订单
          title = '确认订单'
          content = '确定要确认订单吗？'
          break
        case 3: // 取消订单
          title = '取消订单'
          content = '确定要取消订单吗？'
          break
      }

      uni.showModal({
        title,
        content,
        showCancel: true,

        success: ({ confirm, cancel, content }) => {
          if (cancel) {
            return
          }
          if (confirm) {
            if (this.showType == 1) {
              this.closeChat()
            } else if (this.showType == 2) {
              this.showOrderPopup = true
            }
          }
        }
      })
    },
    async closeChat() {
      await closeConversation(this.$store.state.currConversation.conversationId)

      navBack()
    },
    switchShow() {
      this.$emit('update:showOrderInfo', !this.showOrderInfo)
    },
    async loadOrderInfo() {
      this.$store.commit('setLoadingEnable', false)
      let res = await getOrderInfoByOrderId(this.$store.state.currChatOrderId)

      this.orderInfo = res.data
    }
  }
}
</script>

<style lang="scss" scoped>
.order-box {
  background-color: #232738;
  // height: 300rpx;
  line-height: 1.3;
  border-radius: 0 0 30rpx 30rpx;
  padding: 0 20rpx;

  .order-info {
    // height: 100rpx;
    padding: 10rpx 30rpx;

    .line-item {
      display: flex;
      justify-content: space-between;
      // border-bottom: 2rpx dotted white;
      // padding-bottom: 10rpx;

      .item {
        text-align: center;

        .label {
          font-size: 20rpx;
          color: #999;
        }

        .money {
          color: #ea443b;
        }

        .value {
          // font-weight: 600;
        }
      }
    }

    .remark {
      font-size: 22rpx;
      display: flex;
      justify-content: space-between;
      margin-top: 8rpx;
    }
  }

  .ext-info {
    padding: 10rpx 20rpx;
    display: flex;
    justify-content: space-between;

    .num-info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .line {
        display: flex;

        .label {
          font-size: 22rpx;
          color: #8c8e92;
        }

        .value {
          font-size: 22rpx;
          color: #bcc1cd;
          margin-left: 20rpx;
        }
      }
    }

    .msg-info {
      color: white;
      font-size: 22rpx;
    }

    .btn-box {
      display: flex;
      flex-direction: column-reverse;

      .close {
        background-image: linear-gradient(
          to right,
          #edd0be 0%,
          #fff6ed 50%,
          #ae9281 100%
        );
        color: #1d2129;
        border-radius: 12px;
        margin-bottom: 10rpx;
      }
    }
  }
}
::v-deep .deal-info {
  .uni-forms-item {
    margin-bottom: 8rpx;
  }
  .is-disabled {
    background-color: transparent !important;
    border-color: transparent !important;
  }
  .money {
    input {
      color: #c00;
    }
  }
}
</style>
