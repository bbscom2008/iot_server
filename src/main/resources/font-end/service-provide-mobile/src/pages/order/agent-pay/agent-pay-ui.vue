<template>
  <view class="container isShowUi" :style="{
      paddingTop: $store.state.navBarHeight + 'rpx',
    }">
    <!-- 自定义标题栏 -->
    <custom-nav-bar title="">
      <view slot="title" class="nav-title">
        <view class="left" @click="jumpTo('/pages/order/collect-order/collect-order')">代收订单</view>
        <view class="right">代付订单</view>
      </view>

      <view class="right" slot="right">
        <view class="nav-right" @click="showFilter = true">
          <uni-icons type="search" color="#fff"></uni-icons>
          <text class="query-text">搜索</text>
        </view>
      </view>
    </custom-nav-bar>

    <view class="sub-nav-bar">
      <view class="item" :class="{curr:queryFormData.orderStatus===''}" @click="onSubNavClick('')">全部</view>
      <!-- <view class="item" :class="{curr:queryFormData.orderStatus===1}" @click="onSubNavClick(1)">待接单</view> -->
      <view class="item" :class="{curr:queryFormData.orderStatus===2}" @click="onSubNavClick(2)">已接单</view>
      <view class="item" :class="{curr:queryFormData.orderStatus===4}" @click="onSubNavClick(4)">已取消</view>
      <view class="item" :class="{curr:queryFormData.orderStatus===3}" @click="onSubNavClick(3)">已成功</view>
    </view>

    <!-- 订单列表 -->
    <scroll-view class="order-list" scroll-y @scroll="(e) => (oldScrollTop = e.detail.scrollTop)"
      :scroll-with-animation="true" :scroll-top="scrollTop" refresher-enabled :refresher-triggered="refreshTriggered"
      @refresherrefresh="onScrollRefresh()">
      <!-- 刷新控制区域 -->
      <view class="refresh-control">
        <view class="refresh-select">
          <picker @change="onRefreshChange" :value="refreshIndex" :range="refreshOptions" range-key="label">
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

          <u-checkbox-group v-if="showCheckboxes"  v-model="isAllSelected" placement="column" @change="selectAll" >
            <u-checkbox name="all" :label="isAllSelected.length > 0 ? '全不选' : '全选'"></u-checkbox>
          </u-checkbox-group>

          <u-button type="primary" @click="switchShowCheck()"   >
            {{ showCheckboxes?'退出' : '批量操作' }}
          </u-button>

          <u-button type="primary" :disabled="selectRows.length == 0"
            v-if="showCheckboxes"
          @click="batchConfirmOrder()" >批量确认</u-button>

          <u-button type="primary" :disabled="selectRows.length == 0"
            v-if="showCheckboxes"
          @click="batchCancelOrder()" >批量取消</u-button>

          <u-button type="primary" :disabled="selectRows.length == 0"
            v-if="showCheckboxes"
          @click="batchRejectOrder()" >批量驳回</u-button>

        </view>

        <u-checkbox-group v-model="selectRows" placement="column" @change="selectChange">
          <view v-for="(item, index) in tableData" :key="index" class="item-card">
            <!-- 复选框 -->
            <view v-if="showCheckboxes" class="checkbox-wrapper" style="padding-left: 20rpx;"  >
              <u-checkbox :name="item.orderId" style="padding: 20rpx;"   ></u-checkbox>
            </view>

            <view  class="order-card">
              <view class="card-header">
                <text class="order-id">系统订单号:  <text @click="copyInfo(item.systemOrderNo)">{{ item.systemOrderNo }}</text> </text>
                <u-tag size="mini" :text="
                    orderStateOptions.find((ele) => ele.value == item.orderStatus)
                      .label
                  " :type="
                    orderStateOptions.find((ele) => ele.value == item.orderStatus)
                      .type
                  ">
                </u-tag>
              
              </view>



              <view class="card-body" v-if="showCheckboxes"  >
                <view class="info-row w100">
                  <text class="info-label">商户订单号:</text>
                  <text class="info-value" @click="copyInfo(item.merchantOrderNo)">{{ item.merchantOrderNo }}</text>
                </view>
                <view class="info-row w100">
                  <text class="info-label">订单金额:</text>
                  <text class="info-value price">¥{{ item.orderAmount }}元</text>
                </view>
              </view>

              <view v-else >
                <view class="card-body">

                  <view class="info-row w100">
                    <text class="info-label">商户订单号:</text>
                    <text class="info-value" @click="copyInfo(item.merchantOrderNo)">{{ item.merchantOrderNo }}</text>
                  </view>

                  <view class="info-row w100">
                    <text class="info-label">产品信息:</text>
                    <text class="info-value">{{ item.productName }}</text>
                  </view>

                  <view class="info-row w50">
                    <text class="info-label">订单金额:</text>
                    <text class="info-value price">¥{{ item.orderAmount }}元</text>
                  </view>


                  <view class="info-row w50">
                    <text class="info-label">收款信息:</text>
                    <text class="info-value look-txt"  @click="look_collect_info(item)"  >{{ item.payeeData }} 查看 </text>
                  </view>


                  <template  v-if="item.isShowAll">
                    <view class="info-row w50">
                      <text class="info-label">订单状态:</text>
                      <u-tag :type="orderStateOptions.find(ele=>ele.value == item.orderStatus ).type" size="mini"
                        :text="orderStateOptions.find(ele=>ele.value == item.orderStatus ).label"></u-tag>
                    </view>

                    <view class="info-row w50">
                      <text class="info-label">通知状态:</text>

                      <u-tag :type="notifyStatusOptions.find(ele=>ele.value == item.notifyStatus ).type" size="mini"
                        :text="notifyStatusOptions.find(ele=>ele.value == item.notifyStatus ).label"></u-tag>
                    </view>
                    <view class="info-row w50">
                      <text class="info-label">审核状态:</text>
                      <view class="info-value">
                        <!-- 审核状态（0-驳回，1-通过） -->
                        <u-tag :type="item.auditStatus == 1 ? 'success' : 'warning'" size="mini"
                          :text="item.auditStatus == 1 ? '通过' : '驳回'"></u-tag>
                      </view>
                    </view>
                    <view class="info-row w50">
                      <text class="info-label">回款状态:</text>
                      <view class="info-value">
                        <!-- 回款状态（0-待回款、1-已回款） -->
                        <!-- <text class="info-value">{{ item.repaymentStatus }}</text> -->
                        <u-tag :type="item.repaymentStatus == 1 ? 'success' : 'info'" size="mini"
                          :text="item.repaymentStatus == 1 ? '已回款' : '待回款'"></u-tag>
                      </view>
                    </view>

                    <view class="info-row w50">
                      <text class="info-label">转账凭证:</text>
                      <text class="info-value look-txt"  @click="look_submit_info(item)"
                        v-if="item.transferVoucher && item.transferVoucher.length > 0"
                        >查看</text>
                    </view>

                    <view class="info-row w50">
                      <text class="info-label">审核用户名:</text>
                      <text class="info-value">{{ item.confirmOrderUserName }}</text>
                    </view>

                    <view class="info-row w100 " >
                      <text class="info-label">转账备注:</text>
                      <text class="info-value">{{ item.transferRemark }}</text>
                    </view>

                    <!-- </template>

                    <template v-if="item.isShowAll"> -->

                    <view class="line2" >
                      <view class="time-row w50">
                        <text class="time-label">创建</text>
                        <text class="info-value">{{ item.createTime }}</text>
                      </view>
                      <view class="time-row w50">
                        <text class="time-label">接单</text>
                        <text class="info-value">{{ item.receiveTime }}</text>
                      </view>
                      <view class="time-row w50">
                        <text class="time-label">确认</text>
                        <text class="info-value">{{ item.confirmOrderTime }}</text>
                      </view>
                      <view class="time-row w50">
                        <text class="time-label">通知</text>
                        <text class="info-value">{{ item.notifyTime }}</text>
                      </view>
                      <view class="time-row w50">
                        <text class="time-label">回款</text>
                        <text class="info-value">{{ item.repaymentTime }}</text>
                      </view>
                    </view>

                  </template>

                  </view>

                  <view class="switch-box" @click="item.isShowAll = !item.isShowAll">
                  <view v-if="item.isShowAll" class="txt">收起</view>
                  <u-icon v-if="item.isShowAll" name="arrow-up" color="#999999" size="20"></u-icon>
                  <view v-if="!item.isShowAll" class="txt">全部订单信息</view>
                  <u-icon v-if="!item.isShowAll" name="arrow-down" color="#999999" size="20"></u-icon>
                  </view>

                  <view class="card-footer">
                    <u-button @click="procOrder(item, 0)">取消</u-button>
                    <u-button @click="procOrder(item, 2)">驳回</u-button>
                    <u-button @click="showDetail(item)">详情</u-button>
                    <u-button type="primary" @click="procOrder(item, 1)">确认</u-button>
                  </view>
              </view>

            </view>
          </view>

        </u-checkbox-group>
        <pagination @change="onPaginationChange" :total="total" :value="page.pageNum"></pagination>
      </view>
    </scroll-view>

    <!-- 搜索弹窗 -->
    <uni-popup ref="queryPopupRef" :show="showFilter" @maskClick="closeSearchModal()">
      <view class="query-popup">
        <view class="popup-header">
          <text class="popup-title">搜索条件</text>
          <uni-icons type="closeempty" class="close-icon" size="26" @click="closeSearchModal()"></uni-icons>
        </view>

        <scroll-view class="modal-content" scroll-y>
          <uni-forms ref="queryFormDataRef" :model="queryFormData" :rules="queryRules" label-position="top"
            label-width="200">
            <uni-forms-item label="系统订单号" name="systemOrderNo">
              <uni-easyinput v-model="queryFormData.systemOrderNo" type="number" placeholder="请输入订单号, 纯数字"
                @blur="$refs.queryFormDataRef.validateField('systemOrderNo')" />
            </uni-forms-item>

            <uni-forms-item label="商户订单号" name="merchantOrderNo">
              <uni-easyinput v-model="queryFormData.merchantOrderNo" placeholder="请输入商户订单号"
                @blur="$refs.queryFormDataRef.validateField('merchantOrderNo')" />
            </uni-forms-item>

            <view class="range-input">
              <view class="range-title"> 订单金额 </view>
              <view class="range-body">
                <uni-forms-item label="" class="no-label" name="orderAmount" label-position="left"
                  :rules="minOrderAmountRules">
                  <uni-easyinput v-model="queryFormData.orderAmount" type="number" placeholder="订单金额" @blur="
                      $refs.queryFormDataRef.validateField('orderAmount')
                    " />
                </uni-forms-item>
                <!-- <view class="range-separator"> 至 </view>
                <uni-forms-item label-position="left" :rules="maxOrderAmountRules" class="no-label" label=""
                  name="maxOrderAmount">
                  <uni-easyinput v-model="queryFormData.maxOrderAmount" placeholder="最大值" type="number" @blur="
                      $refs.queryFormDataRef.validateField('maxOrderAmount')
                    " />
                </uni-forms-item> -->
                <text class="range-unit">元</text>
              </view>
            </view>

            <uni-forms-item label="产品名称" name="productId">
              <MySelect haveAll :options="productList" v-model="queryFormData.productId">
              </MySelect>
            </uni-forms-item>

            <uni-forms-item label="订单状态" name="orderStatus">
              <MySelect haveAll :options="orderStateOptions" v-model="queryFormData.orderStatus">
              </MySelect>
            </uni-forms-item>

            <uni-forms-item label="通知状态" name="notifyStatus">
              <MySelect haveAll :options="notifyStatusSimpleOptions" v-model="queryFormData.notifyStatus">
              </MySelect>
            </uni-forms-item>

            <uni-forms-item label="确认用户名" name="confirmOrderUserName">
              <uni-easyinput v-model="queryFormData.confirmOrderUserName" placeholder="请输入确认用户名" @blur="
                  $refs.queryFormDataRef.validateField('confirmOrderUserName')
                " />
            </uni-forms-item>

            <!-- <uni-forms-item label="创建时间" name="createTime" required>
              <uni-datetime-picker
                type="datetimerange"
                v-model="queryFormData.createTime"
              />
            </uni-forms-item> -->
            <view class="range-input">
              <uni-forms-item label="创建时间" required class="no-label-title" label-position="left"></uni-forms-item>


              <view class="range-body">
                <uni-forms-item label="" class="no-label" name="startTime" label-position="left">
                  <uni-datetime-picker type="datetime" :start="startTimeRange.start" :end="startTimeRange.end"
                    @change="onStartTimeChange" v-model="queryFormData.startTime" />
                </uni-forms-item>
                <view class="range-separator"> 至 </view>
                <uni-forms-item label-position="left" class="no-label" label="" name="endTime">
                  <uni-datetime-picker type="datetime" :start="endTimeRange.start" :end="endTimeRange.end"
                    @change="onEndTimeChange" v-model="queryFormData.endTime" />
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

    <!-- 订单详情 弹窗  -->
    <uni-popup ref="orderDetailPopupRef" :show="showOrderDetail" @maskClick="closeOrderDetailModal()">
      <view class="query-popup">
        <view class="popup-header">
          <text class="popup-title"> 订单详情 </text>
          <uni-icons type="closeempty" class="close-icon" size="26" @click="closeOrderDetailModal()"></uni-icons>
        </view>

        <scroll-view class="modal-content" scroll-y>
          <view class="profile-card">
            <view class="info-item">
              <text class="info-label" style="width: 160rpx;" >付款说明：</text>
              <text class="info-value">{{
                profileData.paymentDesc 
              }}</text>
            </view>

            <view class="info-item">
              <text class="info-label" style="width: 160rpx;">转账说明：</text>
              <text class="info-value">{{
                profileData.transferDesc 
              }}</text>
            </view>

            <view class="info-item">
              <text class="info-label" style="width: 160rpx;">审核说明：</text>
              <text class="info-value">{{
                profileData.auditResultRemark 
              }}</text>
            </view>
          </view>
        </scroll-view>

        <view class="query-buttons">
          <button class="search-btn" @click="closeOrderDetailModal()">
            关闭
          </button>
        </view>
      </view>
    </uni-popup>

    <!-- <view v-if="orderPopupVisible"> -->
    <ProcOrder @flushPage="flushPage" :orderVisible.sync="orderPopupVisible" :procType="procType" :currItem="currItem">
    </ProcOrder>
    <!-- </view> -->
    
    <!-- 收款信息 弹窗  -->
    <uni-popup ref="look_collect_info_visible_ref" 
    :show="look_collect_info_visible" @maskClick="look_collect_info_visible=false">
      <view class="query-popup">
        <view class="popup-header">
          <text class="popup-title"> 收款信息 </text>
          <uni-icons type="closeempty" class="close-icon" size="26" @click="look_collect_info_visible=false"></uni-icons>
        </view>
    
        <scroll-view class="modal-content" scroll-y>
          <view class="profile-card">
            <view class="info-item">
              <text class="info-label">收款人：</text>
              <text class="info-value" @click="copyInfo(look_info_item.payee)" >{{
                look_info_item.payee 
              }}</text>
            </view>
    
            <view class="info-item">
              <text class="info-label">账号：</text>
              <text class="info-value" @click="copyInfo(look_info_item.payeeNo)">{{
                look_info_item.payeeNo 
              }}</text>
            </view>
    
            <view class="info-item">
              <text class="info-label">地址：</text>
              <text class="info-value" @click="copyInfo(look_info_item.payeeAddress)">{{
                look_info_item.payeeAddress 
              }}</text>
            </view>
          </view>
        </scroll-view>
    
        <view class="query-buttons">
          <button class="search-btn" @click="look_collect_info_visible = false">
            关闭
          </button>
        </view>
      </view>
    </uni-popup>
    
    <!-- 转账凭证 弹窗  -->
    <uni-popup ref="submit_info_dialog_visible_ref" 
    :show="submit_info_dialog_visible" @maskClick="submit_info_dialog_visible=false">
      <view class="query-popup">
        <view class="popup-header">
          <text class="popup-title"> 转账凭证 </text>
          <uni-icons type="closeempty" class="close-icon" size="26" @click="submit_info_dialog_visible=false"></uni-icons>
        </view>
        <scroll-view class="modal-content" style="height: 70vh;" >
          <view class="">共有 {{pingImgShowList.length}} 张图片</view>
         <image :src="item.url"  style="width: 100%;" mode="aspectFit" 
         :key="item.url"
           v-for="item in pingImgShowList"  > 
          </image>
        </scroll-view>
    
        <view class="query-buttons">
          <button class="search-btn" @click="submit_info_dialog_visible = false">
            关闭
          </button>
        </view>
      </view>
    </uni-popup>
    
    
  </view>
</template>

<script>
  import {
    formatDateTime,
    copyInfo
  } from '@/utils'

  import {
    queryRules
  } from './rules'

  import {
    amountCheck
  } from '@/utils/validate.js'
  import {
    refreshOptions,
    orderStateOptions,
    notifyStatusOptions,
    notifyStatusSimpleOptions,
    businessTypeOptions,
    changeTypeOptions
  } from '@/utils/constants.js'

  import {
    getPayOrderList,
    getPaymentOrderDetail,
    confirmPayOrder,
    cancelPayOrder,
    rejectPayOrder
  } from '@/api/agent-pay.js'

  import {
    getProductListByProviderUserId,
  } from '@/api/collect-order.js'


  import ProcOrder from './proc-order.vue'
  import {
    mapState
  } from 'vuex'

import { getFileById } from '@/api/upload'

  export default {
    name: 'ReceiveOrder',
    components: {
      ProcOrder
    },
    props: {
      isInTab: {
        type: Boolean | String,
        default: false
      }
    },
    data() {
      return {
        pingImgShowList:[],
        submit_info_dialog_visible:false,
        
        refreshOptions: refreshOptions,
        orderStateOptions: orderStateOptions,
        notifyStatusOptions: notifyStatusOptions,
        businessTypeOptions: businessTypeOptions,
        changeTypeOptions: changeTypeOptions,
        notifyStatusSimpleOptions,
        minOrderAmountRules: [
          amountCheck,
        
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
        showOrderDetail: false,
        profileData: {},

        currItem: {},
        orderPopupVisible: false,

        startTimeRange: {
          start: '',
          end: ''
        },

        endTimeRange: {
          start: '',
          end: ''
        },
        look_collect_info_visible:false,
        look_info_item:{},
        showCheckboxes: false,
        selectRows: [],
        isAllSelected: []

      }
    },
    mounted() {
      console.log('----mounted-----onLoad-------')
      this.queryTableData()
      this.getAllProductList()

      this.refreshIndex = uni.getStorageSync('agentPayRefreshIndex') || 0

      this.startRefreshTimer()
    },
    computed: {
      ...mapState({
        tabIndex: (state) => state.tabIndex
      })
    },
    watch: {
      tabIndex(newValue, oldValue) {
        console.log('tabIndex 发生变化，旧值:', oldValue, '新值:', newValue)
        if (oldValue === 2) {
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
      showOrderDetail(v) {
        if (this.$refs.orderDetailPopupRef) {
          if (v) {
            this.$refs.orderDetailPopupRef.open('bottom')
          } else {
            this.$refs.orderDetailPopupRef.close()
          }
        }
      },
      look_collect_info_visible(v) {
        if (this.$refs.look_collect_info_visible_ref) {
          if (v) {
            this.$refs.look_collect_info_visible_ref.open('bottom')
          } else {
            this.$refs.look_collect_info_visible_ref.close()
          }
        }
      },
      submit_info_dialog_visible(v) {
        if (this.$refs.submit_info_dialog_visible_ref) {
          if (v) {
            this.$refs.submit_info_dialog_visible_ref.open('bottom')
          } else {
            this.$refs.submit_info_dialog_visible_ref.close()
          }
        }
      }
    },
    beforeDestroy() {
      console.log('-------beforeDestroy--------');
      this.clearRefreshTimer()
    },
    methods: {
      copyInfo,
      selectAll(){
        if(this.isAllSelected.length > 0){
          this.isAllSelected = []
          this.selectRows = []
        }else{
          this.selectRows = this.tableData.map((item) => item.orderId)
          this.isAllSelected = ['all']
        }
      },
      batchCancelOrder() {
        uni.showModal({
          title: '确认取消',
          content: `确定要取消选中的订单吗？`,
          success: async (res) => {
            if (res.confirm) {
              console.log('----batchCancelOrder----', this.selectRows)
              Promise.all(this.selectRows.map((item) => {
                return cancelPayOrder(item)
              })).then((res) => {
                this.$message.success('取消成功')
              }).catch((err) => {
                this.$message.error('取消失败')
              }).finally(() => {
                this.switchShowCheck()
                this.queryTableData()
              })
            }
          }
        })
      },
      batchRejectOrder() {
        uni.showModal({
          title: '确认驳回',
          content: `确定要驳回选中的订单吗？`,
          success: async (res) => {
            if (res.confirm) {
              console.log('----batchRejectOrder----', this.selectRows)
              Promise.all(this.selectRows.map((item) => {
                return rejectPayOrder({
                  orderId: item,
                  auditResultRemark: '批量驳回',
                })
              })).then((res) => {
                this.$message.success('驳回成功')
              }).catch((err) => {
                this.$message.error('驳回失败')
              }).finally(() => {
                this.switchShowCheck()
                this.queryTableData()
              })
            }
          }
        })
      },
      batchConfirmOrder() {
        uni.showModal({
          title: '确认确认',
          content: `确定要确认选中的订单吗？`,
          success: async (res) => {
            if (res.confirm) {
              console.log('----batchConfirmOrder----', this.selectRows)
              Promise.all(this.selectRows.map((item) => {
                return confirmPayOrder({
                  orderId: item,
                  transferDesc: '批量确认',
                })
              })).then((res) => {
                this.$message.success('确认成功')
              }).catch((err) => {
                this.$message.error('确认失败')
              }).finally(() => {
                this.switchShowCheck()
                this.queryTableData()
              })
            }
          }
        })
      },
      switchShowCheck() {
        this.showCheckboxes = !this.showCheckboxes
        this.selectRows = []
        this.isAllSelected = []
      },
      selectChange(row) {
        if (row.length == this.tableData.length) {
          this.isAllSelected = ['all'] // 全选
        } else {
          this.isAllSelected = [] // 全不选
        }
        this.selectRows = row // 更新选中的复选框的值
      },
     async look_submit_info(row) {
        this.pingImgShowList = row.transferVoucher.split(',').map((ele) => {
          let item = {
            fileId: ele,
            url: '',
            name: ''
          }
          return item
        })
  
        const allPromises = this.pingImgShowList.map(ele => {
          return getFileById(ele.fileId)
            .then(res => {
              // 直接修改原对象
              ele.url = res.data.fileUrl;
              ele.name = res.data.originalName;
              return ele; // 可选：返回修改后的元素，便于后续处理
            })
            .catch(error => {
              console.error(`获取文件 ${ele.fileId} 失败:`, error);
              // 可以选择设置默认值或标记错误状态
              ele.error = true;
              return ele; // 确保Promise.all始终能完成
            });
        });
        
        // 等待所有请求完成
        await Promise.all(allPromises);
        
        uni.previewImage({
          urls:this.pingImgShowList.map(ele=>ele.url),
          current:0,
          indicator:'default'
        })
        
        
      },
      look_collect_info(item){
        this.look_collect_info_visible = true
        this.look_info_item = JSON.parse(item.paymentData || '{}')
      },
      
      jumpTo(page) {

        if (this.isInTab) {
          this.$store.state.tabOrderType = 0
        } else {
          uni.redirectTo({
            url: page
          })
        }

      },
      onSubNavClick(v) {
        this.queryFormData.orderStatus = v
        this.queryTableData()
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
          this.startTimeRange.start = formatDateTime(new Date(middle.getTime() + 1000))

          this.startTimeRange.end = e
        }

        console.log(JSON.stringify(this.startTimeRange))
      },

      closeOrderDetailModal() {
        this.showOrderDetail = false
      },
      procOrder(row, type) {
        this.procType = type
        this.currItem = row
        this.orderPopupVisible = true
      },
      async showDetail(row) {
        this.showOrderDetail = true
        // this.formData = row
         let createTime = row.createTime
        let timestr = createTime.split(' ')
        let time = timestr.join('T')
        let res = await getPaymentOrderDetail(row.orderId, { createTime: time })
        this.profileData = res.data
              
      },

      onScrollRefresh() {
        console.log('---onScrollRefresh----')
        this.refreshTriggered = true
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
        // 操作类型(0-当前码商、1-下级码商)
        let res = await getPayOrderList({
            ...params,
            operationType: 0
          },
          this.page
        )
        console.log(res)
        this.tableData = res.data.list.map(item => {
          item.isShowAll = false // 展开订单信息
          return item
        })
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

        const lastOrderStatus = this.queryFormData != undefined && this.queryFormData.orderStatus != undefined ? this
          .queryFormData.orderStatus : ''


        return {
          productId: '',
          // merchantId: '',
          // providerId: '',
          orderStatus: lastOrderStatus,
          notifyStatus: '',
          startTime: startStr,
          endTime: endStr,
          // createTime: [startStr, endStr]
        }
      },

      onRefreshChange(e) {
        this.clearRefreshTimer()
        this.refreshIndex = e.detail.value
        uni.setStorageSync('agentPayRefreshIndex', this.refreshIndex)
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
        this.countdown = 0
        this.refreshIndex = 0
      },
      refreshOrders() {
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
  ::v-deep .nav-bar.isShowUi {
    border-radius: 0;
  }

  .container {
    .order-list {
      height: calc(100% - 40px);
    }
  }


  .nav-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 440rpx;
    height: 72rpx;
    border: 2rpx solid #FFFFFF26;
    border-radius: 36rpx;

    .left,
    .right {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 200rpx;
      height: 64rpx;
      border-radius: 32rpx;
    }

    .right {
      background-image: linear-gradient(to right, #AE9281 0%, #FFF6ED 50%, #EDD0BE 100%);
    }

    .left {
      color: #CFD5E3;
    }
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
        background-image: linear-gradient(to right, #AE9281 0%, #FFF6ED 50%, #EDD0BE 100%);
        border-radius: 20rpx 20rpx 0 0;
        color: #071A36;

        .value {
          font-weight: 600;
        }
      }

      .card-body {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        padding: 20rpx ;

        .w100{
          width: 100%;
        }
        .w50 {
          width: 49%;
        }

        .info-label {
          font-size: 24rpx;
          text-align: left;
          width: 200rpx
        }

        .info-value {
          font-size: 24rpx;
          margin-right: 0;
        }

        .line2 {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;

        }

          .time-row {
            width: 50%;
            font-size: 24rpx;
            color: #999999;

            .time-label {
              margin-right: 10rpx;
            }
          }


        //   .info-label {
        //     text-align: left;
        //     width: 140rpx;
        //     margin-right: 0;
        //   }
        // }

        // .notes-row {
        //   display: flex;
        //   align-items: center;
        //   padding: 20rpx 0;

        //   .notes-label {
        //     font-size: 24rpx;
        //     width: 180rpx;

        //   }

        //   .notes-value {
        //     font-size: 24rpx;
        //     line-height: 28rpx;
        //     margin: 0;
        //   }
        // }

        

      }

      .switch-box {
        display: flex;
        justify-content: center;
        align-items: center;

        .txt {
          color: #999999;
          margin-right: 10rpx;
        }
      }

      .footer {
        height: 60rpx;
        border-top: 2rpx dashed #EEEEEE;
        margin-bottom: 0;
        align-items: center;
      }
    }
  }

  ::v-deep .u-tag--success {
    background-image: linear-gradient(to top, #6BBCFF 0%, #0D92FF 100%) !important;

    .u-tag__text {
      color: #fff !important;
    }

  }

  ::v-deep .u-tag-- {
    background-image: linear-gradient(to top, #52CABC 0%, #41B5A8 100%) !important;

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

  .refresh-select {
    flex: 1;
  }

.query-popup .modal-content{
  max-height: 70vh;
}
  .refresh-select .picker {
    color: #333;
    font-size: 28rpx;
  }

  .refresh-timer {
    color: #666;
    font-size: 26rpx;
  }

  ::v-deep .uni-forms-item {
    flex: 1;
  }

  ::v-deep .no-label-title {
    margin-bottom: 0 !important;
  }

  ::v-deep .uni-date__x-input {
    font-size: 13px;
  }

  ::v-deep .card-footer .u-button {
    height: 60rpx;
  }
</style>