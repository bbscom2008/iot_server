<template>
    <view
    class="container isShowUi"
    :style="{
      paddingTop: $store.state.navBarHeight + 'rpx',
    }"
  >
    <!-- 自定义标题栏 -->
    <custom-nav-bar title="代付接单">
      <view class="right" slot="right">
        <view class="nav-right" @click="showFilter = true">
          <uni-icons type="search" color="#fff"></uni-icons>
          <text class="query-text">搜索</text>
        </view>
      </view>
    </custom-nav-bar>

<!--  <view class="sub-nav-bar">
    <view class="item" :class="{curr:queryFormData.isActive===''}" @click="onSubNavClick('')">全部</view>
    <view class="item" :class="{curr:queryFormData.isActive===1}" @click="onSubNavClick(1)">待接单</view>
    <view class="item" :class="{curr:queryFormData.isActive===0}" @click="onSubNavClick(0)" >已接单</view>
    <view class="item" :class="{curr:queryFormData.isActive===0}" @click="onSubNavClick(0)" >已取消</view>
    <view class="item" :class="{curr:queryFormData.isActive===0}" @click="onSubNavClick(0)" >已生成</view>
  </view> -->
  
  
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

      <view class="no-data" v-if="tableData.length == 0">
        <uni-icons type="search" size="50"></uni-icons>
        <text>暂无相关数据</text>
      </view>
      <view class="main-content" v-else>
        <view class="opt-btn no-modify" style="padding: 10rpx 10rpx 0 30rpx; align-items: center; gap: 20rpx;">

          <u-checkbox-group v-if="showCheckboxes"  v-model="isAllSelected" placement="column" @change="selectAll" style="width: 180rpx">
            <u-checkbox name="all" :label="isAllSelected.length > 0 ? '全不选' : '全选'"></u-checkbox>
          </u-checkbox-group>

          <u-button type="primary" @click="switchShowCheck()"   >
            <image src="/static/imgs/copy.png" style="width: 38rpx; height: 38rpx; margin-right: 6rpx" mode=""></image>
            {{ showCheckboxes?'退出' : '批量操作' }}
          </u-button>

          <u-button type="primary" :disabled="selectRows.length == 0"
            v-if="showCheckboxes"
          @click="batchAcceptOrder()" >批量接单</u-button>

        </view>
        
        <u-checkbox-group v-model="selectRows" placement="column" @change="selectChange">
          <view v-for="(item, index) in tableData" :key="index" class="item-card">
            <!-- 复选框 -->
            <view v-if="showCheckboxes" class="checkbox-wrapper" style="padding-left: 20rpx;"  >
              <u-checkbox :name="item.orderId" style="padding: 20rpx;"  ></u-checkbox>
            </view>
            <view
                class="order-card"
              >
              <view class="card-header">
                <text class="order-id">系统订单号: {{ item.systemOrderNo }}</text>
                <u-tag
                  size="mini"
                  :text="
                    orderStateOptions.find((ele) => ele.value == item.orderStatus)
                      .label
                  "
                  :type="
                    orderStateOptions.find((ele) => ele.value == item.orderStatus)
                      .type
                  "
                >
                </u-tag>
              </view>

              <view class="card-body" v-if="showCheckboxes"  >
                <view class="info-row">
                  <text class="info-label">系统订单号:</text>
                  <text class="info-value">{{ item.systemOrderNo }}</text>
                </view>
                <view class="info-row">
                  <text class="info-label">订单金额:</text>
                  <text class="info-value price">¥{{ item.orderAmount }}元</text>
                </view>
              </view>
                <view class="card-body" v-else  >
                <view class="info-row">
                  <text class="info-label">商户订单号:</text>
                  <text class="info-value">{{ item.merchantOrderNo }}</text>
                </view>

                <view class="info-row">
                  <text class="info-label">产品信息:</text>
                  <text class="info-value">{{ item.productName }}</text>
                </view>

                <view class="info-row">
                  <text class="info-label">订单金额:</text>
                  <text class="info-value price">¥{{ item.orderAmount }}元</text>
                </view>

                <view class="info-row">
                  <text class="info-label">创建时间:</text>
                  <text class="info-value">{{ item.createTime }}</text>
                </view>

                <view class="info-row">
                  <text class="info-label">订单状态:</text>
                  <text class="info-value">
                    {{
                      orderStateOptions.find((ele) => ele.value == item.orderStatus)
                        .label
                    }}
                  </text>
                </view>

                <view class="info-row">
                  <text class="info-label">被接单次数:</text>
                  <text class="info-value">{{ item.acceptCount }}</text>
                </view>

                <view class="notes-row">
                  <text class="notes-label">注意事项:</text>
                  <text class="notes-value">{{ item.paymentDesc }}</text>
                </view>
              </view>

              <view class="card-footer" v-if="!showCheckboxes" >
                <u-button
                  type="primary"
                  style="width: 60%"
                  @click="acceptOrder(item)"
                  >接单</u-button
                >
              </view>
            </view>
          </view>
        </u-checkbox-group>
      

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
                placeholder="请输入商户订单号"
                @blur="$refs.queryFormDataRef.validateField('merchantOrderNo')"
              />
            </uni-forms-item>

            <view class="range-input">
              <view class="range-title"> 订单金额 </view>
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
                    placeholder="最小金额"
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
                    placeholder="最大金额"
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
                :options="notifyStatusSimpleOptions"
                v-model="queryFormData.notifyStatus"
              >
              </MySelect>
            </uni-forms-item>

            <!-- <uni-forms-item label="创建时间" name="createTime" required>
              <uni-datetime-picker
                type="datetimerange"
                v-model="queryFormData.createTime"
              />
            </uni-forms-item> -->


            <view class="range-input">
              <uni-forms-item
                  label="创建时间"
                  required
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
  </view>
</template>

<script>
import { formatDateTime } from '@/utils'

import { queryRules } from './rules'

import { amountCheck } from '@/utils/validate.js'
import {
  refreshOptions,
  orderStateOptions,
  notifyStatusOptions,
  notifyStatusSimpleOptions,
  businessTypeOptions,
  changeTypeOptions
} from '@/utils/constants.js'

import { getPayOrderGrabList, grabPayOrder } from '@/api/agent-pay.js'


import {
  getProductListByProviderUserId,
} from '@/api/collect-order.js'


import { debounce } from '@/utils/index.js'

import { mapState } from 'vuex'

export default {
  name: 'ReceiveOrder',
  props: {
    isInTab: {
      type: Boolean | String,
      default: false
    }
  },
  data() {
    return {
      refreshOptions: refreshOptions,
      orderStateOptions: orderStateOptions,
      notifyStatusOptions: notifyStatusOptions,
      businessTypeOptions: businessTypeOptions,
      changeTypeOptions: changeTypeOptions,
      notifyStatusSimpleOptions,
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
      minPayAmountRules: [
        amountCheck,
        {
          validateFunction: (rule, value, data, callback) => {
            if (
              !this.queryFormData.minPayAmount ||
              !this.queryFormData.maxPayAmount
            ) {
              return true
            }

            if (
              Number(this.queryFormData.minPayAmount) >
              Number(this.queryFormData.maxPayAmount)
            ) {
              callback('最小值不能大于最大值')
            }
            return true
          }
        }
      ],
      maxPayAmountRules: [
        amountCheck,
        {
          validateFunction: (rule, value, data, callback) => {
            if (
              !this.queryFormData.minPayAmount ||
              !this.queryFormData.maxPayAmount
            ) {
              return true
            }

            if (
              Number(this.queryFormData.minPayAmount) >
              Number(this.queryFormData.maxPayAmount)
            ) {
              callback('最大值不能小于最小值')
            }
            return true
          }
        }
      ],

      queryRules: queryRules,
      refreshIndex: 0,
      countdown: 0,

      timer: null,
      queryFormData: this.getQueryForm(),
      tableData: [],
      showFilter: false, // 显示搜索框
      refreshTriggered: false,
      page: {
        pageSize: 10,
        pageNum: 1
      },
      total: 0,
      scrollTop: 0,
      oldScrollTop: 0,
      summaryInfo: {}, // 汇总信息
      productList: [
        // {
        //   label: 'asdf',
        //   value: 11
        // },
        // {
        //   label: 'asdf22',
        //   value: 22
        // }
      ],
      formData: {},
      procType: 1, // 1 确认 0 取消  2  补单
      showOrderPopup: false,
      startTimeRange: {
        start: '',
        end: ''
      },

      endTimeRange: {
        start: '',
        end: ''
      },
      showCheckboxes: false,
      selectRows: [],
      isAllSelected: []
    }
  },
  mounted() {
    console.log('-----mounted----onLoad-------')
    this.refreshIndex = uni.getStorageSync('paymentAcceptOrderRefreshIndex') || 0
    this.startRefreshTimer()
    this.queryTableData()
    this.getAllProductList()

  },

  computed: {
    ...mapState({
      tabIndex: (state) => state.tabIndex
    })
  },
  watch: {
    tabIndex(newValue, oldValue) {
      console.log('tabIndex 发生变化，旧值:', oldValue, '新值:', newValue)
      if (oldValue === 1) {
        this.clearRefreshTimer()
      }
    },
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
    }
  },
  beforeDestroy() {
    console.log('-------beforeDestroy--------');
    this.clearRefreshTimer()
    this.refreshIndex = 0
    this.countdown = 0
  },
  methods: {
    switchShowCheck() {
      this.showCheckboxes = !this.showCheckboxes
      this.selectRows = []
      this.isAllSelected = []
    },
    selectChange(row) {
        console.log('--select change --', row)
        if (row.length == this.tableData.length) {
          this.isAllSelected = ['all'] // 全选
        } else {
          this.isAllSelected = [] // 全不选
        }
        this.selectRows = row // 更新选中的复选框的值
        console.log('----this.selectRows----', this.selectRows)
      },
    selectAll(){
      if(this.isAllSelected.length > 0){
        this.isAllSelected = []
        this.selectRows = []
      }else{
        this.selectRows = this.tableData.map((item) => item.orderId)
        this.isAllSelected = ['all']
      }
    },
    batchAcceptOrder() {
      uni.showModal({
        title: '确认接单',
        content: `确定要接单选中的订单吗？`,
        success: async (res) => {
          if (res.confirm) {
            // 批量接单，现在还没有批量接单的接口，以循环的形式处理， Promise.all 处理
            Promise.all(this.selectRows.map((item) => {
              return grabPayOrder(item)
            })).then((res) => {
              this.$message.success('接单成功')
              this.switchShowCheck()
              this.queryTableData()
            }).catch((err) => {
              this.$message.error('接单失败')
            })
          }
        }
      })
    },
    async getAllProductList() {
      let ret = await getProductListByProviderUserId(this.$store.getters.userId)
      this.productList = ret.data.map((ele) => {
        return {
          label: ele.productName,
          value: ele.productId
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
        this.startTimeRange.start = formatDateTime(new Date(middle.getTime()+1000))

        this.startTimeRange.end = e
      }

      console.log(JSON.stringify(this.startTimeRange))
    },

    orderBtnOk() {
      grabPayOrder(this.formData.orderId).then((res) => {
        this.$message.success('接单成功')
        this.closeOrderModal()
        this.queryTableData()
      })
    },
    closeOrderModal() {
      this.showOrderPopup = false
    },
    acceptOrder(row, type) {
      this.procType = type
      this.showOrderPopup = true
      this.formData = row
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
    // onLoadMore: debounce(function() {
    //   if (this.$store.state.isLoading) return
    //   this.page.pageNum += 1
    //   console.log('-----this.page.pageNum-----', this.page.pageNum);
    //   this.queryTableData()
    // }),

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
      this.$refs.queryFormDataRef
        .validate()
        .then(async (ret) => {
          console.log('验证通过', ret)
          this.queryTableData()
        })
        .catch((err) => {
          console.log('验证失败', err)
          console.log(this.queryFormData)
          this.$message.error('输入有误：' + err[0].errorMessage)
        })

      // this.$refs.queryFormDataRef.validate([], (err, formData) => {
      // 	if (!err) {
      // 		console.log('success', formData)
      // 		this.queryTableData()
      // 	}else{
      // 		console.log('--error--', err);
      // 	}
      // })
    },
    // 确认搜索
    async queryTableData() {
      console.log('--this.queryFormData---', this.queryFormData)
      let params = {
        // providerName: this.$store.state.userName
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
      let res = await getPayOrderGrabList(params, this.page)
      console.log(res)
      this.tableData = res.data.list
      this.total = res.data.total

      //   // 汇总信息
      //   let ret = await providerDailyReportSummary(params, this.page)
      //   console.log('---providerDailyReportSummary---', ret)
      //   this.summaryInfo = ret.data

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
        productId: '',
        // merchantId: '',
        // providerId: '',
        orderStatus: '',
        notifyStatus: '', 
        startTime:startStr,
        endTime:endStr,
        // createTime: [startStr, endStr]
      }
    },

    onRefreshChange(e) {
      console.log(e)

      this.refreshIndex = e.detail.value
      uni.setStorageSync('paymentAcceptOrderRefreshIndex', this.refreshIndex)
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
      this.page.pageNum = 1
      this.flushPage()
    }

    // acceptOrder(order) {
    //   uni.showModal({
    //     title: '确认接单',
    //     content: `确定要接单 ${order.systemOrderId} 吗？`,
    //     success: (res) => {
    //       if (res.confirm) {
    //         uni.showLoading({
    //           title: '接单中...'
    //         })

    //         // 模拟接单操作
    //         setTimeout(() => {
    //           order.status = '处理中'
    //           order.acceptedTimes += 1
    //           uni.hideLoading()
    //           uni.showToast({
    //             title: '接单成功',
    //             icon: 'success'
    //           })
    //         }, 1000)
    //       }
    //     }
    //   })
    // }
  }
}
</script>


<style lang="scss" scoped>
  // ::v-deep .nav-bar.isShowUi {
  //   border-radius: 0;
  // }
.container{
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
      color: #CFD5E3;
      text-align: center;
      line-height: 80rpx;
    }

    .curr {
      color: #E0C4B2;
      border-bottom: 8rpx solid #E0C4B2;
      box-sizing: border-box;
    }
  }
  
  .main-content{
    background-color: #eff4ff;
    .order-card{
      padding: 0;
      margin: 20rpx;
      .card-header{
        display: flex;
        padding: 0 40rpx;
        align-items: center;
        height: 72rpx;
        background-image: linear-gradient(to right , #AE9281 0%, #FFF6ED 50%, #EDD0BE 100%);
        border-radius: 20rpx 20rpx 0 0 ;
        color: #071A36;
        .value{
          font-weight: 600;
        }
      }
      .notes-row{
        display: flex;
        align-items: center;
        .notes-value{
          margin-top: 0;
        }
      }
      .card-body{
        padding: 20rpx 40rpx;
        
        .info-label{
          text-align: left;
          width: 200rpx
          
        }
        .info-value{
          margin-right: 0;
        }
        
      }
      .card-footer{
        margin-top: 0;
        padding: 20rpx;
      }
      .footer{
        height: 60rpx;
        border-top: 2rpx dashed #EEEEEE;
        margin-bottom: 0;
        align-items: center;
      }
    }
  }
  
  ::v-deep .u-tag--success{
    background-image: linear-gradient(to top , #6BBCFF 0%, #0D92FF 100%) !important;
    
    .u-tag__text{
    color: #fff !important;
    }
    
  }
  
::v-deep .u-tag--{
  background-image: linear-gradient(to top , #52CABC 0%, #41B5A8 100%) !important;
  
  .u-tag__text{
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

::v-deep .no-label-title{
  margin-bottom: 0 !important;
}

::v-deep .uni-date__x-input{
  font-size: 13px;
}
</style>
