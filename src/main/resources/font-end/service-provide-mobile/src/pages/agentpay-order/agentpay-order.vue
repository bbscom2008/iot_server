<template>
  <view class="container" :style="{paddingTop:$store.state.navBarHeight+'rpx'}">
    <!-- 自定义标题栏 -->
    <custom-nav-bar title="提现审核1">
      <view class="right" slot="right">
        <view class="nav-right" @click="showFilter = true">
          <uni-icons type="search" color="#fff"></uni-icons>
          <text class="query-text">搜索</text>
        </view>
      </view>
    </custom-nav-bar>

    <!-- 刷新控制区域 -->
    <view class="refresh-control">
      <view class="refresh-select">
        <picker
          @change="onRefreshChange"
          :value="refreshIndex"
          :range="refreshOptions"
          range-key="label"
        >
          <view class="picker">
            自动刷新: {{ refreshOptions[refreshIndex].label }}
          </view>
        </picker>
      </view>
      <view class="refresh-timer"> 下次刷新: {{ countdown }}秒 </view>
    </view>

    <!-- 订单列表 -->
    <scroll-view class="order-list" scroll-y>
      <view v-for="(item, index) in orderList" :key="index" class="order-card">
        <view class="card-header">
          <text class="order-id">系统订单号: {{ item.systemOrderId }}</text>
          <text class="order-status" :class="getStatusClass(item.status)">{{
            item.status
          }}</text>
        </view>

        <view class="card-body">
          <view class="info-row">
            <text class="info-label">商户订单号:</text>
            <text class="info-value">{{ item.merchantOrderId }}</text>
          </view>

          <view class="info-row">
            <text class="info-label">产品信息:</text>
            <text class="info-value">{{ item.productInfo }}</text>
          </view>

          <view class="info-row">
            <text class="info-label">订单金额:</text>
            <text class="info-value price">¥{{ item.amount }}</text>
          </view>

          <view class="info-row">
            <text class="info-label">创建时间:</text>
            <text class="info-value">{{ item.createTime }}</text>
          </view>

          <view class="info-row">
            <text class="info-label">被接单次数:</text>
            <text class="info-value">{{ item.acceptedTimes }}次</text>
          </view>

          <view class="notes-row">
            <text class="notes-label">接单注意事项:</text>
            <text class="notes-value">{{ item.notes }}</text>
          </view>
        </view>

        <view class="card-footer">
          <button class="action-btn" @click="acceptOrder(item)">接单</button>
        </view>
      </view>
    </scroll-view>

    <!-- 搜索弹窗 -->
    <uni-popup
      ref="queryPopupRef"
      type="dialog"
      @maskClick="closeSearchModal()"
    >
      <view class="query-popup">
        <view class="popup-header">
          <text class="popup-title">搜索条件</text>
          <uni-icons
            type="closeempty"
            class="close-icon"
            size="26"
            @click="closeSearchModal()"
          ></uni-icons>
        </view>

        <scroll-view class="modal-content" scroll-y>
          <uni-forms
            ref="queryFormDataRef"
            :model="queryFormData"
            :rules="queryRules"
            label-position="top"
            label-width="200"
          >
            <uni-forms-item label="系统订单号" name="systemOrderNo">
              <uni-easyinput
                v-model="queryFormData.systemOrderNo"
                type="number"
                placeholder="请输入订单号, 纯数字"
                @blur="$refs.queryFormDataRef.validateField('systemOrderNo')"
              />
            </uni-forms-item>
            <uni-forms-item label="商户订单号" name="merchantOrderNo">
              <uni-easyinput
                v-model="queryFormData.merchantOrderNo"
                placeholder="请输入名称"
                @blur="$refs.queryFormDataRef.validateField('merchantOrderNo')"
              />
            </uni-forms-item>
            <view class="range-input">
              <view class="range-title"> 订单金额范围 </view>
              <view class="range-body">
                <uni-forms-item
                  label=""
                  class="no-label"
                  name="minOrderAmount"
                  label-position="left"
                  :rules="minOrderAmountRules"
                >
                  <uni-easyinput
                    v-model="queryFormData.minOrderAmount"
                    type="number"
                    placeholder="最小值"
                    @blur="
                      $refs.queryFormDataRef.validateField('minOrderAmount')
                    "
                  />
                </uni-forms-item>
                <view class="range-separator"> 至 </view>
                <uni-forms-item
                  label-position="left"
                  :rules="maxOrderAmountRules"
                  class="no-label"
                  label=""
                  name="maxOrderAmount"
                >
                  <uni-easyinput
                    v-model="queryFormData.maxOrderAmount"
                    placeholder="最大值"
                    type="number"
                    @blur="
                      $refs.queryFormDataRef.validateField('maxOrderAmount')
                    "
                  />
                </uni-forms-item>
                <text class="range-unit">元</text>
              </view>
            </view>
            <uni-forms-item label="产品名称" name="productId">
              <MySelect
                haveAll
                :options="productList"
                v-model="queryFormData.productId"
              >
              </MySelect>
            </uni-forms-item>
            <uni-forms-item label="订单状态" name="orderStatus">
              <MySelect
                haveAll
                :options="orderStateOptions"
                v-model="queryFormData.orderStatus"
              >
              </MySelect>
            </uni-forms-item>

            <uni-forms-item label="通知状态" name="notifyStatus">
              <MySelect
                haveAll
                :options="notifyStatusOptions"
                v-model="queryFormData.notifyStatus"
              >
              </MySelect>
            </uni-forms-item>

            <uni-forms-item label="创建时间" name="createTime" required>
              <uni-datetime-picker
                type="datetimerange"
                v-model="queryFormData.createTime"
              />
            </uni-forms-item>
          </uni-forms>
        </scroll-view>

        <view class="query-buttons">
          <button class="reset-btn" @click="resetQueryForm()">重置</button>
          <button class="search-btn" @click="queryTableData()">搜索</button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import { formatDateTime } from '@/utils'

import { queryRules } from './rules'

import { amountCheck } from '@/utils/validate.js'
import {
  refreshOptions,
  orderStateOptions,
  notifyStatusOptions
} from '@/utils/constants.js'

export default {
  name: 'ReceiveOrder',
  data() {
    return {
      queryRules: queryRules,
      minOrderAmountRules: [
        amountCheck,
        {
          validateFunction: (rule, value, data, callback) => {
            if (
              !this.queryFormData.minOrderAmount ||
              !this.queryFormData.maxOrderAmount
            ) {
              return true
            }

            if (
              Number(this.queryFormData.minOrderAmount) >
              Number(this.queryFormData.maxOrderAmount)
            ) {
              callback('最小值不能大于最大值')
            }
            return true
          }
        }
      ],
      maxOrderAmountRules: [
        amountCheck,
        {
          validateFunction: (rule, value, data, callback) => {
            if (
              !this.queryFormData.minOrderAmount ||
              !this.queryFormData.maxOrderAmount
            ) {
              return true
            }

            if (
              Number(this.queryFormData.minOrderAmount) >
              Number(this.queryFormData.maxOrderAmount)
            ) {
              callback('最大值不能小于最小值')
            }
            return true
          }
        }
      ],

      productList: [
        { label: 'iPhone 14 Pro Max', value: '1' },
        { label: 'MacBook Pro 14寸', value: '2' },
        { label: 'AirPods Pro 2代', value: '3' }
      ],
      notifyStatusOptions: notifyStatusOptions,
      orderStateOptions: orderStateOptions,
      refreshIndex: 0,
      refreshOptions: refreshOptions,
      countdown: 0,

      timer: null,
      queryFormData: this.getQueryForm(),
      orderList: [
        {
          systemOrderId: 'SYS20230615001',
          merchantOrderId: 'MER20230615001',
          productInfo: 'iPhone 14 Pro Max 256G 深空黑',
          amount: '8999.00',
          createTime: '2023-06-15 10:30:25',
          status: '待接单',
          notes: '需在30分钟内完成接单操作',
          acceptedTimes: 0
        },
        {
          systemOrderId: 'SYS20230615002',
          merchantOrderId: 'MER20230615002',
          productInfo: 'MacBook Pro 14寸 M2 Pro 16G/512G',
          amount: '14999.00',
          createTime: '2023-06-15 11:15:42',
          status: '待接单',
          notes: '需确认库存后再接单',
          acceptedTimes: 1
        },
        {
          systemOrderId: 'SYS20230615003',
          merchantOrderId: 'MER20230615003',
          productInfo: 'AirPods Pro 2代',
          amount: '1899.00',
          createTime: '2023-06-15 13:45:18',
          status: '待接单',
          notes: '优先处理',
          acceptedTimes: 2
        },
        {
          systemOrderId: 'SYS20230615004',
          merchantOrderId: 'MER20230615004',
          productInfo: 'iPad Air 10.9寸 64G WLAN版',
          amount: '4799.00',
          createTime: '2023-06-15 14:20:33',
          status: '待接单',
          notes: '需确认颜色',
          acceptedTimes: 0
        },
        {
          systemOrderId: 'SYS20230615005',
          merchantOrderId: 'MER20230615005',
          productInfo: 'Apple Watch Series 8 GPS 41mm',
          amount: '3199.00',
          createTime: '2023-06-15 15:05:57',
          status: '待接单',
          notes: '需确认表带颜色',
          acceptedTimes: 1
        }
      ],
      showFilter: false // 显示搜索框
    }
  },
  onLoad() {
    this.startRefreshTimer()
  },
  watch: {
    showFilter(v) {
      if (this.$refs.queryPopupRef) {
        if (v) {
          this.$refs.queryPopupRef.open('bottom')
        } else {
          this.$refs.queryPopupRef.close()
        }
      }
    }
  },
  onUnload() {
    this.clearRefreshTimer()
  },
  methods: {
    onStateChange(e) {
      console.log('change---', e)
    },
    closeSearchModal() {
      this.showFilter = false
    },

    resetQueryForm() {
      this.queryFormData = this.getQueryForm()
    },

    // 确认搜索
    queryTableData() {
      this.$refs.queryFormDataRef
        .validate()
        .then((res) => {
          console.log('验证通过', res)

		  console.log('--this.queryFormData---', this.queryFormData);
		  


          this.closeSearchModal()
          this.currentPage = 1
          // 这里应该是调用API进行搜索
          // 模拟搜索
          // this.loadData()
        })
        .catch((err) => {
          console.log('验证失败', err)
          return false
        })
    },

    getQueryForm() {
      let now = new Date()
      const today = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,
        0,
        0
      )
      let endStr = formatDateTime(
        new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
      )
      let startStr = formatDateTime(today)
      return {
        productId: '',
        merchantId: '',
        providerId: '',
        orderStatus: '',
        notifyStatus: '',
        createTime: [startStr, endStr]
      }
    },

    onRefreshChange(e) {
      this.refreshIndex = e.detail.value
      this.clearRefreshTimer()
      this.startRefreshTimer()
    },
    startRefreshTimer() {
      const interval = this.refreshOptions[this.refreshIndex].value
      if (interval <= 0) {
        this.countdown = 0
        return
      }

      this.countdown = interval
      this.timer = setInterval(() => {
        this.countdown--
        if (this.countdown <= 0) {
          this.refreshOrders()
          this.countdown = interval
        }
      }, 1000)
    },
    clearRefreshTimer() {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
    },
    refreshOrders() {
      uni.showLoading({
        title: '刷新中...'
      })

      // 模拟网络请求
      setTimeout(() => {
        // 这里可以替换为实际的数据更新逻辑
        console.log('订单数据已刷新')
        uni.hideLoading()
      }, 500)
    },
    getStatusClass(status) {
      return {
        'status-pending': status === '待接单',
        'status-processing': status === '处理中',
        'status-completed': status === '已完成',
        'status-cancelled': status === '已取消'
      }
    },
    acceptOrder(order) {
      uni.showModal({
        title: '确认接单',
        content: `确定要接单 ${order.systemOrderId} 吗？`,
        success: (res) => {
          if (res.confirm) {
            uni.showLoading({
              title: '接单中...'
            })

            // 模拟接单操作
            setTimeout(() => {
              order.status = '处理中'
              order.acceptedTimes += 1
              uni.hideLoading()
              uni.showToast({
                title: '接单成功',
                icon: 'success'
              })
            }, 1000)
          }
        }
      })
    }
  }
}
</script>

<style scoped>


.refresh-control {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  background-color: #fff;
  border-radius: 10rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.refresh-select .picker {
  color: #333;
  font-size: 28rpx;
}

.refresh-timer {
  color: #666;
  font-size: 26rpx;
}

.order-list {
  height: calc(100vh - 120rpx);
}

.order-card {
  background-color: #fff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  padding: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 15rpx;
  border-bottom: 1rpx solid #eee;
  margin-bottom: 15rpx;
}

.order-id {
  font-size: 28rpx;
  color: #333;
}

.order-status {
  font-size: 26rpx;
  padding: 5rpx 15rpx;
  border-radius: 20rpx;
}

.status-pending {
  background-color: #fff8e6;
  color: #faad14;
}

.status-processing {
  background-color: #e6f7ff;
  color: #1890ff;
}

.status-completed {
  background-color: #f6ffed;
  color: #52c41a;
}

.status-cancelled {
  background-color: #fff2f0;
  color: #ff4d4f;
}

.info-row {
  display: flex;
  margin-bottom: 12rpx;
}

.info-label {
  width: 160rpx;
  color: #999;
  font-size: 26rpx;
}

.info-value {
  flex: 1;
  color: #333;
  font-size: 26rpx;
}

.price {
  color: #f56c6c;
  font-weight: bold;
}

.notes-row {
  margin-top: 20rpx;
  padding-top: 15rpx;
  border-top: 1rpx dashed #eee;
}

.notes-label {
  color: #999;
  font-size: 26rpx;
}

.notes-value {
  display: block;
  margin-top: 10rpx;
  color: #f56c6c;
  font-size: 26rpx;
  line-height: 1.5;
}

.card-footer {
  margin-top: 20rpx;
  text-align: right;
}

.action-btn {
  display: inline-block;
  background-color: #409eff;
  color: #fff;
  font-size: 26rpx;
  padding: 8rpx 40rpx;
  border-radius: 20rpx;
  border: none;
}

.action-btn:after {
  border: none;
}
</style>
