<template>
  <div class="order-box" :style="{ height: showOrderInfo ? '108px' : '52px' }">
    <div class="order-info k-box" v-if="showOrderInfo">
      <div class="line-item">
        <div class="item">
          <div class="label">订单金额</div>
          <div class="value money">
            ￥{{ orderInfo && orderInfo.orderAmount ? orderInfo.orderAmount.toFixed(2) : '' }}
          </div>
        </div>
        <div class="item">
          <div class="label">实付金额</div>
          <div class="value money">
            ￥{{ orderInfo && orderInfo.payAmount ? orderInfo.payAmount.toFixed(2) : '' }}
          </div>
        </div>
        <div class="item">
          <div class="label">收款信息</div>
          <div class="value">{{ orderInfo.collectInfoName }}</div>
        </div>
        <div class="item">
          <div class="label">订单备注</div>
          <div class="value">{{ orderInfo.transferRemark }}</div>
        </div>
      </div>
      <!-- <div class="remark">
        <div class="label">订单备注 :</div>
        <div class="value">{{ orderInfo.transferRemark }}</div>
      </div> -->
    </div>

    <div class="ext-info">
      <div class="num-info" v-if="showOrderInfo">
        <div class="line">
          <div class="label">商户单号</div>
          <div class="value" @click="(e) => copyInfo(e, orderInfo.merchantOrderNo)">
            {{ orderInfo.merchantOrderNo }}
          </div>
        </div>
        <div class="line">
          <div class="label">系统单号</div>
          <div class="value" @click="(e) => copyInfo(e, orderInfo.systemOrderNo)">
            {{ orderInfo.systemOrderNo }}
          </div>
        </div>
        <!-- <div class="line">
          <div class="label">创建时间</div>
          <div class="value">{{ orderInfo.createTime }}</div>
        </div> -->
      </div>
      <div class="msg-info" v-else>
        <span>订单号：{{ orderInfo?orderInfo.systemOrderNo:'' }}</span>
        <span style="margin-left: 10px">订单金额：</span>
        <span style="color: #ea443b; font-weight: 600"
          >￥{{ orderInfo.orderAmount ? orderInfo.orderAmount.toFixed(2) : '' }}</span
        >
      </div>
      <!-- <div
        class="btn-box"
        style="display: flex; flex-direction: row; gap: 20px; align-items: center"
      > -->
        <el-tag
          :type="orderStateType"
          v-if="showOrderInfo"
          >{{ orderStateLabel }}</el-tag
        >

        <el-button
          type="success"
          @click="showDialog(2)"
          v-if="orderInfo.orderStatus !== 3"
          >确认订单</el-button
        >
     

        <!-- <el-button
          v-if="showOrderInfo"
          :disabled="isRoomClose"
          @click="showDialog(1)"
          style="margin-left: 10px"
          >{{ isRoomClose ? '聊天室已关闭' : '关闭聊天室' }}</el-button
        > -->


        <el-button @click="showOrderInfo = !showOrderInfo" style="width: 100px">{{
          showOrderInfo ? '收起' : '展开'
        }}</el-button>
    </div>

    <el-dialog
      :visible.sync="commonDialogVisible"
      title="确认订单"
      width="600px"
      :modal="false"
      class="deal-order"
      @close="onCommonBtnCancel()"
    >
      <el-form
        ref="orderInfo"
        :model="orderInfo"
        label-position="right"
        label-width="120px"
        style="margin-right: 100px"
      >
        <el-form-item label="系统订单号" prop="systemOrderNo">
          <el-input
            v-model="orderInfo.systemOrderNo"
            disabled
            placeholder="请输入系统订单号"
            size="small"
          />
        </el-form-item>

        <el-form-item label="商户订单号 :" prop="">
          <el-input disabled v-model="orderInfo.merchantOrderNo" size="small" />
        </el-form-item>

        <el-form-item label="订单金额" prop="orderAmount">
          <el-input
            v-model="orderInfo.orderAmount"
            disabled
            placeholder="请输入订单金额"
            size="small"
          />
        </el-form-item>

        <el-form-item label="实付金额" prop="payAmount">
          <el-input
            v-model="orderInfo.payAmount"
            disabled
            placeholder="请输入实付金额"
            size="small"
            class="money"
          />
        </el-form-item>

        <el-form-item label="收款码名称" prop="" v-if="orderInfo.collectInfoName">
          <el-input disabled v-model="orderInfo.collectInfoName" size="small" />
        </el-form-item>

        <el-form-item label="付款人姓名" prop="">
          <el-input disabled v-model="orderInfo.payerName" placeholder="" size="small" />
        </el-form-item>

        <el-form-item label="付款人IP" prop="" v-if="orderInfo.payerIp">
          <el-input
            disabled
            v-model="orderInfo.payerIp"
            placeholder="请输入付款人IP"
            size="small"
          />
        </el-form-item>

        <el-form-item label="转账备注" prop="" v-if="orderInfo.transferRemark">
          <el-input disabled v-model="orderInfo.transferRemark" size="small" />
        </el-form-item>

        <el-form-item label="订单创建时间" prop="" v-if="orderInfo.createTime">
          <el-input disabled v-model="orderInfo.createTime" size="small" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="small" @click="onCommonBtnCancel()"> 取消 </el-button>
        <el-button type="primary" size="small" @click="onCommonBtnOK()"> 确定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { generateUniqueId, parseNow, copyInfo, checkPassword } from '@/utils/index'

import { getCollectOrderList, getOrderInfoByOrderId } from '@/api/order-manage/collect-order.js'

import { orderStateOptions } from '@/utils/constants'

import { closeConversation } from '@/api/chat.js'

import { providerCollectOrderConfirm } from '@/api/order-manage/collect-order.js'

export default {
  data() {
    return {
      orderInfo: {}, // 订单信息
      commonDialogVisible: false,
      showOrderInfo: false,
      orderStateOptions
    }
  },
  computed: {
    orderId() {
      return this.$store.state.chat.currChatOrderId
    },
    isRoomClose() {
      const conversation = this.$store.state.chat.currConversation
      return conversation && conversation.status == 'CLOSE'
    },
    orderStateLabel() {
      return orderStateOptions.find((item) => item.value === this.orderInfo.orderStatus).label
    },
    orderStateType() {
      return orderStateOptions.find((item) => item.value === this.orderInfo.orderStatus).type
    }
  },
  watch: {
    orderId(newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        this.loadOrderInfo()
      }
    }
  },
  mounted() {
    this.loadOrderInfo()
  },

  methods: {
    copyInfo,
    async loadOrderInfo() {
      this.$store.commit('app/setLoadingEnable', false)
      if (!this.orderId) {
        this.orderInfo = {}
        return
      }
      let res = await getOrderInfoByOrderId(this.orderId)
      this.orderInfo = res.data
    },
    async onCommonBtnOK() {
      // 判断是否需要二次确认，如果需要输入密码
      if (this.$store.getters['isSecondConfirmOrder']) {
        // 二次确认需要密码
        try {
          let ret = await checkPassword(this)
          if (!ret.data) {
            this.$message.error('密码错误')
            return
          }
        } catch (err) {
          console.log('err-6666--' + err)
          return
        }
      }

      // 确认
      await providerCollectOrderConfirm(this.orderInfo.orderId, {
        payerName: this.orderInfo.payerName,
        payerIp: this.orderInfo.payerIp
      })
      this.$message({
        message: '确认成功',
        type: 'success'
      })

      this.$eventBus.$emit('exitChatRoom')
      this.$eventBus.$emit('flushChatList')

      this.onCommonBtnCancel()
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
          this.commonDialogVisible = true
          return
        case 3: // 取消订单
          title = '取消订单'
          content = '确定要取消订单吗？'
          break
      }

      this.$confirm(content, {
        title,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        if (n == 1) {
          // this.closeChat()
        } else if (n == 2) {
          this.commonDialogVisible = true
        } else if (n == 3) {
        }
      })
    },
    async closeChat() {
      // const conversation = this.$store.state.chat.currConversation
      // if (!conversation || !conversation.conversationId) {
      //   return
      // }
      // await closeConversation(conversation.conversationId)
      // this.$message({
      //   message: '聊天室已关闭',
      //   type: 'success'
      // })
      // this.$eventBus.$emit('flushChatList')
    },

    onCommonBtnCancel() {
      this.commonDialogVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.order-box {
  // background-color: #232738;
  color: #333;
  // height: 150px;  /* 300rpx → 150px */
  border-radius: 0 0 15px 15px; /* 30rpx → 15px */
  padding: 0 10px; /* 20rpx → 10px */

  .order-info {
    padding: 10px 15px 0; /* 20rpx 30rpx → 10px 15px */

    .line-item {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px dotted white; /* 2rpx → 1px */

      .item {
        text-align: center;

        .label {
          font-size: 12px; /* 24rpx → 12px */
        }

        .money {
          color: #ea443b;
        }

        .value {
          font-weight: 600;
          margin-top: 5px;
        }
      }
    }

    .remark {
      font-size: 14px; /* 24rpx → 12px */
      display: flex;
      gap: 10px;
    }
  }

  .ext-info {
    padding: 10px; /* 20rpx → 10px */
    display: flex;
    justify-content: space-between;
    align-items: center;

    .num-info {
      .line {
        display: flex;
        margin: 3px 0;

        .label {
          font-size: 12px; /* 24rpx → 12px */
          color: #8c8e92;
        }

        .value {
          cursor: pointer;
          font-size: 14px; /* 24rpx → 12px */
          // color: #bcc1cd;
          margin-left: 10px; /* 20rpx → 10px */
        }
      }
    }

    .msg-info {
      display: flex;
      align-items: center;
      font-size: 16px; /* 24rpx → 12px */
    }

    .btn-box {
      display: flex;
      flex-direction: column-reverse;

      .close {
        // background-image: linear-gradient(to right, #edd0be 0%, #fff6ed 50%, #ae9281 100%);
        color: #1d2129;
        border-radius: 12px;
      }
    }
  }
}

::v-deep .deal-order {
  .el-form {
    .el-form-item__label {
      color: #999;
    }

    .el-form-item--small.el-form-item {
      margin-bottom: 0;
    }

    .el-input.is-disabled {
      .el-input__inner {
        color: black;
        border-color: transparent;
        background-color: transparent;
        padding-left: 0;
      }
    }

    .el-input.is-disabled.money {
      .el-input__inner {
        color: red;
        font-weight: 600;
      }
    }
  }
}
</style>
