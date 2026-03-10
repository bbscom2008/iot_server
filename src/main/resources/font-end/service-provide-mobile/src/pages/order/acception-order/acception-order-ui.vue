<template>
  <view
    class="container isShowUi"
    :style="{
      paddingTop: $store.state.navBarHeight + 'rpx'
    }"
  >
    <!-- 自定义标题栏 -->
    <custom-nav-bar title="兑付接单">
      <view class="right" slot="right">
        <view class="nav-right" @click="showFilter = true">
          <uni-icons type="search" color="#fff"></uni-icons>
          <text class="query-text">搜索</text>
        </view>
      </view>
    </custom-nav-bar>
    <!-- 订单列表 -->
    <scroll-view
      class="order-list"
      scroll-y
      @scroll="(e) => (oldScrollTop = e.detail.scrollTop)"
      :scroll-with-animation="true"
      :scroll-top="scrollTop"
      refresher-enabled
      :refresher-triggered="refreshTriggered"
      @refresherrefresh="onScrollRefresh()"
    >
      <view class="opt-btn">
        <u-button
          class="add-btn"
          style="width: 50%"
          type="primary"
          @click="showAddDialog()"
          >新增</u-button
        >
      </view>

      <view class="no-data" v-if="tableData.length == 0">
        <uni-icons type="search" size="50"></uni-icons>
        <text>暂无相关数据</text>
      </view>
      <view class="main-content" v-else>
        <view v-for="(item, index) in tableData" :key="index" class="item-card">
          <view class="order-card">
            <view class="card-header">
              <view class="value" @click="copyInfo(item.acceptanceId)"
                >订单号:
                <text>{{ item.acceptanceId }}</text>
                <SvgIcon
                  name="copy"
                  style="margin-left: 6rpx"
                  :size="12"
                  fill="red"
                />
              </view>
              <u-tag
                size="mini"
                :text="
                  acceptOrderOptions.find(
                    (ele) => ele.value == item.acceptanceApplyStatus
                  ).label
                "
                :type="
                  acceptOrderOptions.find(
                    (ele) => ele.value == item.acceptanceApplyStatus
                  ).type
                "
              >
              </u-tag>
            </view>

            <view class="card-body">
              <view class="info-row w50">
                <text class="info-label">订单金额:</text>
                <text class="info-value price">¥{{ item.orderAmount }}元</text>
              </view>
              <view class="info-row w50">
                <text class="info-label">实付金额:</text>
                <text class="info-value price">{{ item.payAmount }} U</text>
              </view>

              <view class="info-row w50">
                <text class="info-label">U价汇率:</text>
                <text class="info-value price">{{ item.usdRate }}</text>
              </view>

              <view class="info-row w50">
                <text class="info-label">备注:</text>
                <text class="info-value">{{ item.remark }}</text>
              </view>

              <view class="info-row">
                <text class="info-label">收款信息:</text>
                <text class="info-value" @click="copyInfo(item.paymentData)"
                  >{{ item.paymentData
                  }}<SvgIcon name="copy" style="margin-left: 6rpx" :size="10"
                /></text>
              </view>

              <view class="info-row w50">
                <text class="info-label">审核人:</text>
                <text class="info-value">{{ item.auditUserName }}</text>
              </view>
              <view class="info-row w50">
                <text class="info-label">审核说明:</text>
                <text class="info-value">{{ item.auditResultRemark }}</text>
              </view>
            </view>

            <view class="order-footer">
              <view class="row w50">
                <text class="info-label">创建时间:</text>
                <text class="info-value">{{ item.createTime }}</text>
              </view>
              <view class="row w50">
                <text class="info-label">确认时间:</text>
                <text class="info-value">{{ item.confirmOrderTime }}</text>
              </view>
              <view class="row w50">
                <text class="info-label">过期时间:</text>
                <text class="info-value">{{ item.expiredTime }}</text>
              </view>
              <view class="row w50">
                <text class="info-label">审核时间:</text>
                <text class="info-value">{{ item.auditTime }}</text>
              </view>
            </view>

            <view class="card-footer" style="gap: 20rpx">
              <u-button style="flex: 1" @click="cancelmAcceptenceOrder(item)"
                >取消</u-button
              >
              <u-button
                style="flex: 1"
                type="primary"
                @click="confirmAcceptenceOrder(item)"
                >确认支付</u-button
              >
            </view>
          </view>
        </view>

        <pagination
          @change="onPaginationChange"
          :total="total"
          :value="page.pageNum"
        ></pagination>
      </view>
    </scroll-view>

    <!-- 搜索弹窗 -->
    <uni-popup
      ref="queryPopupRef"
      :show="showFilter"
      @maskClick="closeSdataearchModal()"
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
            label-position="top"
            label-width="200"
          >
            <uni-forms-item label="订单号" name="acceptanceId">
              <uni-easyinput
                v-model="queryFormData.acceptanceId"
                type="number"
                placeholder="请输入订单号"
              />
            </uni-forms-item>

            <uni-forms-item label="订单金额" name="orderAmount">
              <uni-easyinput
                v-model="queryFormData.orderAmount"
                placeholder="请输入订单金额"
              />
            </uni-forms-item>

            <uni-forms-item label="订单状态" name="acceptanceApplyStatus">
              <MySelect
                haveAll
                :options="acceptOrderOptions"
                v-model="queryFormData.acceptanceApplyStatus"
              >
              </MySelect>
            </uni-forms-item>

            <uni-forms-item label="备注信息" name="remark">
              <uni-easyinput
                v-model="queryFormData.remark"
                placeholder="请输入备注信息"
              />
            </uni-forms-item>

            <view class="range-input">
              <uni-forms-item
                label="创建时间"
                class="no-label-title"
                label-position="left"
              ></uni-forms-item>

              <view class="range-body">
                <uni-forms-item
                  label=""
                  class="no-label"
                  name="startTime"
                  label-position="left"
                >
                  <uni-datetime-picker
                    type="datetime"
                    :start="startTimeRange.start"
                    :end="startTimeRange.end"
                    @change="onStartTimeChange"
                    v-model="queryFormData.startTime"
                  />
                </uni-forms-item>
                <view class="range-separator"> 至 </view>
                <uni-forms-item
                  label-position="left"
                  class="no-label"
                  label=""
                  name="endTime"
                >
                  <uni-datetime-picker
                    type="datetime"
                    :start="endTimeRange.start"
                    :end="endTimeRange.end"
                    @change="onEndTimeChange"
                    v-model="queryFormData.endTime"
                  />
                </uni-forms-item>
              </view>
            </view>
          </uni-forms>
        </scroll-view>

        <view class="query-buttons">
          <button class="reset-btn" @click="resetQueryForm()">重置</button>
          <button class="search-btn" @click="btnSearchClick()">搜索</button>
        </view>
      </view>
    </uni-popup>

    <!-- 接单  弹窗 -->
    <uni-popup
      ref="procOrderPopupRef"
      :show="showOrderPopup"
      @maskClick="closeOrderModal()"
    >
      <view class="query-popup">
        <view class="popup-header">
          <text class="popup-title"> 接单</text>
          <uni-icons
            type="closeempty"
            class="close-icon"
            size="26"
            @click="closeOrderModal()"
          ></uni-icons>
        </view>

        <scroll-view class="modal-content" scroll-y>
          <view class="profile-card">
            <view class="info-item">
              <text class="info-label">产品信息：</text>
              <text class="info-value">{{ formData.productName }}</text>
            </view>

            <view class="info-item">
              <text class="info-label">订单金额：</text>
              <text class="info-value">{{ formData.orderAmount }}</text>
            </view>

            <view class="info-item">
              <text class="info-label">创建时间：</text>
              <text class="info-value">{{ formData.createTime }}</text>
            </view>

            <view class="info-item">
              <text class="info-label">注意事项：</text>
              <text class="info-value">{{ formData.paymentDesc }}</text>
            </view>

            <view class="info-item">
              <text class="info-label">被接单次数：</text>
              <text class="info-value">{{ formData.acceptCount }}</text>
            </view>
          </view>
        </scroll-view>

        <view class="query-buttons">
          <button class="reset-btn" @click="closeOrderModal()">取消</button>
          <button class="search-btn" @click="orderBtnOk()">确认</button>
        </view>
      </view>
    </uni-popup>

    <!-- 新增  弹窗 -->
    <uni-popup
      ref="addOrderPopupRef"
      :show="dialogVisible"
      @maskClick="onDialogBtnCancel()"
    >
      <view class="query-popup">
        <view class="popup-header">
          <text class="popup-title"> 新增</text>
          <uni-icons
            type="closeempty"
            class="close-icon"
            size="26"
            @click="onDialogBtnCancel()"
          ></uni-icons>
        </view>
        <scroll-view class="modal-content" scroll-y>
          <uni-forms
            ref="formDataRef"
            :model="formData"
            label-position="left"
            label-width="200"
            :rules="addRules"
            style="padding-top: 20rpx"
          >
            <uni-forms-item required label="金额" name="orderAmount">
              <uni-easyinput
                v-model="formData.orderAmount"
                type="number"
                placeholder="请输入金额"
                @blur="$refs.formDataRef.validateField('orderAmount')"
              />
            </uni-forms-item>

            <uni-forms-item label="备注信息" name="remark">
              <uni-easyinput
                v-model="formData.remark"
                placeholder="请输入备注信息"
              />
            </uni-forms-item>
          </uni-forms>
        </scroll-view>

        <view class="query-buttons">
          <button class="reset-btn" @click="onDialogBtnCancel()">取消</button>
          <button class="search-btn" @click="addDlgBtnOk()">确认</button>
        </view>
      </view>
    </uni-popup>


    <!-- 订单信息  弹窗 -->
    <uni-popup
      ref="orderInfoVisibleRef"
      :show="orderInfoVisible"
      @maskClick="onOrderInfoCancel()"
    >
      <view class="query-popup">
        <view class="popup-header">
          <text class="popup-title">订单信息</text>
          <uni-icons
            type="closeempty"
            class="close-icon"
            size="26"
            @click="onOrderInfoCancel()"
          ></uni-icons>
        </view>
        <scroll-view class="modal-content" scroll-y>
          <AcceptOrderInfo :orderInfo="orderInfo"></AcceptOrderInfo>
        </scroll-view>

        <view class="query-buttons">
          <button class="reset-btn" @click="onOrderInfoCancel()">随后支付</button>
          <button class="search-btn" @click="confirmAcceptenceOrder()">确认支付</button>
        </view>
      </view>
    </uni-popup>


  </view>
</template>

<script>
import { formatDateTime } from '@/utils'

import { copyInfo } from '@/utils/index'
import AcceptOrderInfo from './accept-order-info.vue'
import {
  getAcceptenceOrderPage,
  createAcceptenceOrder,
  confirmAcceptenceOrder,
  auditAcceptenceOrder,
  cancelAcceptenceOrder,
  exportAcceptenceOrderList
} from '@/api/acceptence-order.js'

import { mapState } from 'vuex'

export default {
  name: 'ReceiveOrder',
  props: {
    isInTab: {
      type: Boolean | String,
      default: false
    }
  },
  components:{
    AcceptOrderInfo
  },
  data() {
    return {
      addRules: {
        orderAmount: {
          rules: [
            {
              required: true,
              errorMessage: '请输入金额'
            }
          ]
        }
      },
      queryFormData: this.getQueryForm(),
      tableData: [],
      showFilter: false, // 显示搜索框
      page: {
        pageSize: 10,
        pageNum: 1
      },
      total: 0,
      scrollTop: 0,
      oldScrollTop: 0,
      refreshTriggered: false,
      formData: {},
      showOrderPopup: false,
      startTimeRange: {
        start: '',
        end: ''
      },

      endTimeRange: {
        start: '',
        end: ''
      },
      dialogVisible: false,
      acceptOrderOptions: [
        { label: '待支付', value: 0, type: 'info' },
        { label: '已支付', value: 1, type: 'success' },
        { label: '审核通过', value: 2, type: 'primary' },
        { label: '审核驳回', value: 3, type: 'error' },
        { label: '已取消', value: 4, type: 'warning' }
      ],
      orderInfo: {},
      orderInfoVisible: false,

    }
  },
  mounted() {
    this.queryTableData()
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
    },
    showOrderPopup(v) {
      if (this.$refs.procOrderPopupRef) {
        if (v) {
          this.$refs.procOrderPopupRef.open('bottom')
        } else {
          this.$refs.procOrderPopupRef.close()
        }
      }
    },
    dialogVisible(v) {
      if (this.$refs.addOrderPopupRef) {
        if (v) {
          this.$refs.addOrderPopupRef.open('bottom')
        } else {
          this.$refs.addOrderPopupRef.close()
        }
      }
    },
    orderInfoVisible(v) {
      if (this.$refs.orderInfoVisibleRef) {
        if (v) {
          this.$refs.orderInfoVisibleRef.open('bottom')
        } else {
          this.$refs.orderInfoVisibleRef.close()
        }
      }
    }
  },
  beforeDestroy() {
    console.log('-------beforeDestroy--------')
    this.refreshIndex = 0
    this.countdown = 0
  },
  methods: {
    copyInfo,
    
    onOrderInfoCancel(){
      this.orderInfoVisible = false
    },
    onDialogBtnCancel() {
      this.dialogVisible = false
      this.$refs.formDataRef.clearValidate()
    },
    addDlgBtnOk() {
      this.$refs.formDataRef.validate().then(async (valid) => {
        if (valid) {
           let ret = await createAcceptenceOrder({
            userId: this.$store.state.userAccount.userId,
            orderAmount: +this.formData.orderAmount,
            remark: this.formData.remark
          })

          this.orderInfo = ret.data

          this.onDialogBtnCancel()
          this.flushPage()
          this.orderInfoVisible = true
          
        }
      }).catch(e=>{
        console.log(e);
        
      })
    },
    showAddDialog() {
      this.dialogVisible = true
      this.formData = {
        userId: this.$store.state.userAccount.userId
      }
      // this.orderInfo = {
      //   acceptanceId: '4530937079652422421',
      //   tenantId: 1006,
      //   userId: '193266881427779584',
      //   userName: 'provideYase01',
      //   orderAmount: 111,
      //   payAmount: 15.88,
      //   usdRate: 6.99,
      //   paymentData: 'TXp88A9h2yM93bfei6jmWbNYTvgW7sNgCH',
      //   expiredTime: '2025-12-10 04:33:49',
      //   remark: null
      // }
      // this.orderInfoVisible = true

    },
    cancelmAcceptenceOrder(row) {
      uni.showModal({
        title: '提示',
        content: '确认取消吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              let ret = await cancelAcceptenceOrder({
                acceptanceId: row.acceptanceId
              })
              this.$message.success('已取消')
            } catch (e) {
              console.log(e)
              this.$message.error(e.message)
            }
            this.flushPage()
          } else if (res.cancel) {
            console.log('用户点击了取消')
          }
        }
      })
    },
    confirmAcceptenceOrder(row) {
      if (!row) {
        row = this.orderInfo
      }
      uni.showModal({
        title: '提示',
        content: '确认支付吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              let ret = await confirmAcceptenceOrder({
                acceptanceId: row.acceptanceId
              })
              this.$message.success('已确认')
            } catch (e) {
              console.log(e)
              this.$message.error(e.message)
            }
            this.flushPage()
          } else if (res.cancel) {
            console.log('用户点击了取消')
          }
        }
      })
    },

    onStartTimeChange(e) {
      console.log(e)

      if (!e) {
        this.endTimeRange.start = 1
        this.endTimeRange.end = Date.now()
        return
      }

      const now = new Date()
      const today_start = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,
        0,
        0
      ) // 今天凌晨
      const middle = new Date(
        today_start.getTime() - 3600 * 1000 * 24 * 2 - 500
      ) // 3天前的半夜

      let selectDateTime = new Date(e)
      if (middle.getTime() > selectDateTime.getTime()) {
        // 选了3 天前的
        this.endTimeRange.start = e
        this.endTimeRange.end = formatDateTime(middle)
      } else {
        // 选了3天内的
        this.endTimeRange.start = e

        this.endTimeRange.end = formatDateTime(
          new Date(today_start.getTime() + 24 * 60 * 60 * 1000 - 1000)
        )
      }
      console.log(JSON.stringify(this.endTimeRange))
    },
    onEndTimeChange(e) {
      console.log(e)
      if (!e) {
        this.startTimeRange.start = 1
        this.startTimeRange.end = Date.now()
        return
      }
      const now = new Date()
      const today_start = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,
        0,
        0
      ) // 今天凌晨
      const middle = new Date(
        today_start.getTime() - 3600 * 1000 * 24 * 2 - 500
      ) // 3天前的半夜

      let selectDateTime = new Date(e)
      if (middle.getTime() > selectDateTime.getTime()) {
        // 选了3 天前的
        this.startTimeRange.start = 1
        this.startTimeRange.end = e
      } else {
        // 选了3天内的
        this.startTimeRange.start = formatDateTime(
          new Date(middle.getTime() + 1000)
        )

        this.startTimeRange.end = e
      }

      console.log(JSON.stringify(this.startTimeRange))
    },

    batchAcceptOrder() {
      uni.showModal({
        title: '确认接单',
        content: `确定要接单选中的订单吗？`,
        success: async (res) => {
          if (res.confirm) {
            // 批量接单，现在还没有批量接单的接口，以循环的形式处理， Promise.all 处理
            Promise.all(
              this.selectRows.map((item) => {
                return grabPayOrder(item)
              })
            )
              .then((res) => {
                this.$message.success('接单成功')
                this.switchShowCheck()
                this.queryTableData()
              })
              .catch((err) => {
                this.$message.error('接单失败')
              })
          }
        }
      })
    },

    onScrollRefresh() {
      console.log('---onScrollRefresh----')
      this.refreshTriggered = true
      this.page.pageNum = 1
      this.queryTableData()
    },
    /**
	   分页器改变的监听 
	  */
    onPaginationChange(page) {
      this.page = page
      this.queryTableData()
    },

    closeSearchModal() {
      this.showFilter = false
      this.resetQueryForm()
      if (this.$refs.queryFormDataRef) {
        this.$refs.queryFormDataRef.clearValidate()
      }
    },

    resetQueryForm() {
      this.queryFormData = this.getQueryForm()
    },

    btnSearchClick() {
      this.queryTableData()
    },
    // 确认搜索
    async queryTableData() {
      console.log('--this.queryFormData---', this.queryFormData)
      let params = {
        tenantId: this.$store.state.tenantId,
        userName: this.$store.state.userName
      }

      Object.keys(this.queryFormData).forEach((key) => {
        if (
          this.queryFormData[key] !== '' &&
          this.queryFormData[key] !== undefined
        ) {
          if (key == 'createTime') {
            params['startTime'] = this.queryFormData['createTime'][0]
            params['endTime'] = this.queryFormData['createTime'][1]
          } else {
            params[key] = this.queryFormData[key]
          }
        }
      })
      // this.refreshTriggered = true
      let res = await getAcceptenceOrderPage(this.page, params)
      console.log(res)
      this.tableData = res.data.list
      this.total = res.data.total

      this.refreshTriggered = false

      this.scrollToTop()
      this.closeSearchModal()
    },

    flushPage() {
      this.queryTableData()
    },

    scrollToTop() {
      this.scrollTop = this.oldScrollTop
      this.$nextTick(() => {
        this.scrollTop = 0
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

      this.$nextTick(() => {
        const tomorrow = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          0,
          0,
          0
        ) // 今天凌晨

        this.startTimeRange.end = formatDateTime(tomorrow)
        this.endTimeRange.end = formatDateTime(tomorrow)
      })

      return {
        acceptanceApplyStatus: '',
        startTime: startStr,
        endTime: endStr
      }
    },

    refreshOrders() {
      this.page.pageNum = 1
      this.flushPage()
    }
  }
}
</script>

<style lang="scss" scoped>
// ::v-deep .nav-bar.isShowUi {
//   border-radius: 0;
// }
.container {
  height: 100%;
}
.sub-nav-bar {
  display: flex;
  padding: 0 30rpx;
  background-color: #232738;
  border-radius: 0 0 40rpx 40rpx;
  justify-content: space-evenly;
  height: 80rpx;
  // align-items: center;

  .item {
    width: 25%;
    color: #cfd5e3;
    text-align: center;
    line-height: 80rpx;
  }

  .curr {
    color: #e0c4b2;
    border-bottom: 8rpx solid #e0c4b2;
    box-sizing: border-box;
  }
}

.main-content {
  background-color: #eff4ff;
  .order-card {
    padding: 0;
    margin: 20rpx;
    .card-header {
      display: flex;
      padding: 0 40rpx;
      align-items: center;
      height: 72rpx;
      background-image: linear-gradient(
        to right,
        #ae9281 0%,
        #fff6ed 50%,
        #edd0be 100%
      );
      border-radius: 20rpx 20rpx 0 0;
      color: #071a36;
      .value {
        font-weight: 600;
      }
    }

    .card-body {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      padding: 10rpx 10rpx 0;

      .info-label {
        text-align: left;
        width: 140rpx;
      }
      .info-value {
        margin-right: 0;
      }
    }
    .w50 {
      width: 48%;
      display: flex;
      align-items: center;
    }
    .order-footer {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      padding: 0 10rpx;

      .row {
        display: flex;
        align-items: center;
        font-size: 20rpx;
        .info-label {
          color: #666;
          margin-right: 10rpx;
        }
        .info-value {
          color: #333;
        }
      }
    }
  }
}

::v-deep .u-tag--success {
  background-image: linear-gradient(
    to top,
    #6bbcff 0%,
    #0d92ff 100%
  ) !important;

  .u-tag__text {
    color: #fff !important;
  }
}

::v-deep .u-tag-- {
  background-image: linear-gradient(
    to top,
    #52cabc 0%,
    #41b5a8 100%
  ) !important;

  .u-tag__text {
    color: #fff !important;
  }
}

.refresh-control {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10rpx 20rpx;
  margin: 20rpx;
  background-color: #d8dae0;
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

.profile-card .info-label {
  width: 180rpx;
}
// .profile-card .info-value {
/* border: 1px solid #ccc; */
// }

::v-deep .uni-forms-item {
  flex: 1;
}

::v-deep .no-label-title {
  margin-bottom: 0 !important;
}

::v-deep .uni-date__x-input {
  font-size: 13px;
}
</style>
