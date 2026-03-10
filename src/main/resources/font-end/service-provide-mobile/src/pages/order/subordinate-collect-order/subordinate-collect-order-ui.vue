<template>
  <view class="container isShowUi" :style="{paddingTop:$store.state.navBarHeight+'rpx'}">
    <!-- 自定义标题栏 -->
    <custom-nav-bar title="下级代收订单">
      <view class="right" slot="right">
        <view class="nav-right" @click="showFilter = true">
          <uni-icons type="search" color="#fff"></uni-icons>
          <text class="query-text">搜索</text>
        </view>
      </view>
    </custom-nav-bar>

    <view class="sub-nav-bar">
      <view class="item" :class="{curr:queryFormData.orderStatus===''}" @click="onSubNavClick('')">全部</view>
      <view class="item" :class="{curr:queryFormData.orderStatus===1}" @click="onSubNavClick(1)">待接单</view>
      <view class="item" :class="{curr:queryFormData.orderStatus===2}" @click="onSubNavClick(2)">已接单</view>
      <view class="item" :class="{curr:queryFormData.orderStatus===4}" @click="onSubNavClick(4)">已取消</view>
      <view class="item" :class="{curr:queryFormData.orderStatus===0}" @click="onSubNavClick(0)">已生成</view>
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
        <view v-for="(item, index) in tableData" :key="index" class="order-card">
          <view class="card-header">
            <text class="order-id">系统订单号: {{ item.systemOrderNo }}</text>
            <u-tag size="mini" :text="
                orderStateOptions.find((ele) => ele.value == item.orderStatus)
                  .label
              " :type="
                orderStateOptions.find((ele) => ele.value == item.orderStatus)
                  .type
              ">
            </u-tag>
          </view>

          <view class="card-body">
            <view class="info-row">
              <text class="info-label">商户订单号:</text>
              <text class="info-value">{{ item.merchantOrderNo }}</text>
            </view>

            <view class="info-row">
              <text class="info-label">产品信息:</text>
              <text class="info-value">{{ item.productName }}</text>
            </view>

            <view class="line2">
              <view class="info-row">
                <text class="info-label">订单金额:</text>
                <text class="info-value price">¥{{ item.orderAmount }}元</text>
              </view>
              <view class="info-row">
                <text class="info-label">实付金额:</text>
                <text class="info-value price">¥{{ item.payAmount }}元</text>
              </view>
            </view>

            <view class="line2">
              <view class="info-row">
                <text class="info-label">收款信息:</text>
                <view class="info-value" @click="look_shoukuan_info(item)"> <text class="look-txt">查看</text>
                  {{ item.collectInfoName }}
                </view>
              </view>
              <view class="info-row">
                <text class="info-label">提交信息:</text>
                <text class="info-value look-txt" @click="look_submit_info(item)">查看</text>
              </view>
            </view>

            <view class="info-row" v-if="!item.isShowAll">
              <text class="info-label">确认用户名:</text>
              <text class="info-value">{{ item.confirmOrderUserName }}</text>
            </view>

            <view class="line2" v-if="item.isShowAll">
              <view class="info-row">
                <text class="info-label">订单状态:</text>
                <view class="info-value">
                  <u-tag size="mini" :text="
                      orderStateOptions.find(
                        (ele) => ele.value == item.orderStatus
                      ).label
                    " :type="
                      orderStateOptions.find(
                        (ele) => ele.value == item.orderStatus
                      ).type
                    ">
                  </u-tag>
                </view>
              </view>

              <view class="info-row">
                <text class="info-label">通知状态:</text>
                <text class="info-value"><u-tag size="mini" :text="
                      notifyStatusOptions.find(
                        (row) => row.value === item.notifyStatus
                      ).label
                    " :type="
                      notifyStatusOptions.find(
                        (row) => row.value === item.notifyStatus
                      ).type
                    ">
                  </u-tag></text>
              </view>
            </view>

            <view class="info-row" v-if="item.isShowAll">
              <text class="info-label">码商信息:</text>
              <text class="info-value">{{ item.providerUserName }}
              </text>
            </view>
            
            <view class="info-row" v-if="item.isShowAll">
              <text class="info-label">确认用户名:</text>
              <text class="info-value">{{ item.confirmOrderUserName }}</text>
            </view>
            

            <view class="notes-row" v-if="item.isShowAll">
              <text class="notes-label">转账备注:</text>
              <text class="notes-value">{{ item.transferRemark }}</text>
            </view>


            <view class="line2" v-if="item.isShowAll">
              <view class="time-row">
                <text class="time-label">创建</text>
                <text class="info-value">{{ item.createTime }}</text>
              </view>
              <view class="time-row">
                <text class="time-label">接单</text>
                <text class="info-value">{{ item.receiveTime }}</text>
              </view>
              <view class="time-row">
                <text class="time-label">确认</text>
                <text class="info-value">{{ item.confirmOrderTime }}</text>
              </view>
              <view class="time-row">
                <text class="time-label">通知</text>
                <text class="info-value">{{ item.notifyTime }}</text>
              </view>
              <view class="time-row">
                <text class="time-label">过期</text>
                <text class="info-value">{{ item.expiredTime }}</text>
              </view>
            </view>


          </view>

          <view class="switch-box" @click="item.isShowAll = !item.isShowAll">
            <view v-if="item.isShowAll" class="txt">收起</view>
            <u-icon v-if="item.isShowAll" name="arrow-up" color="#999999" size="20"></u-icon>
            <view v-if="!item.isShowAll" class="txt">全部订单信息</view>
            <u-icon v-if="!item.isShowAll" name="arrow-down" color="#999999" size="20"></u-icon>
          </view>

          <view class="card-footer">
            <u-button @click="procOrder(item, 0)">取消</u-button>
            <u-button @click="procOrder(item, 2)">补单</u-button>
            <u-button type="primary" @click="procOrder(item, 1)">确认</u-button>
          </view>
        </view>

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
                <uni-forms-item label="" class="no-label" name="minOrderAmount" label-position="left"
                  :rules="minOrderAmountRules">
                  <uni-easyinput v-model="queryFormData.minOrderAmount" type="number" placeholder="最小值" @blur="
                      $refs.queryFormDataRef.validateField('minOrderAmount')
                    " />
                </uni-forms-item>
                <view class="range-separator"> 至 </view>
                <uni-forms-item label-position="left" :rules="maxOrderAmountRules" class="no-label" label=""
                  name="maxOrderAmount">
                  <uni-easyinput v-model="queryFormData.maxOrderAmount" placeholder="最大值" type="number" @blur="
                      $refs.queryFormDataRef.validateField('maxOrderAmount')
                    " />
                </uni-forms-item>
                <text class="range-unit">元</text>
              </view>
            </view>

            <view class="range-input">
              <view class="range-title"> 实付金额 </view>
              <view class="range-body">
                <uni-forms-item label="" class="no-label" name="minPayAmount" label-position="left"
                  :rules="minPayAmountRules">
                  <uni-easyinput v-model="queryFormData.minPayAmount" type="number" placeholder="最小值"
                    @blur="$refs.queryFormDataRef.validateField('minPayAmount')" />
                </uni-forms-item>
                <view class="range-separator"> 至 </view>
                <uni-forms-item label-position="left" :rules="maxPayAmountRules" class="no-label" label=""
                  name="maxPayAmount">
                  <uni-easyinput v-model="queryFormData.maxPayAmount" placeholder="最大值" type="number"
                    @blur="$refs.queryFormDataRef.validateField('maxPayAmount')" />
                </uni-forms-item>
                <text class="range-unit">元</text>
              </view>
            </view>

            <uni-forms-item label="产品名称" name="productId">
              <MySelect haveAll :options="productList" v-model="queryFormData.productId">
              </MySelect>
            </uni-forms-item>

            <uni-forms-item label="码商" name="providerId">
              <MySelect haveAll :options="providerList" v-model="queryFormData.providerId">
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

    <!-- 确认 、 接单 、 补单  弹窗 -->
    <uni-popup ref="procOrderPopupRef" :show="showOrderPopup" @maskClick="closeOrderModal()">
      <view class="query-popup">
        <view class="popup-header">
          <text class="popup-title">
            {{
              procType == 0 ? '取消订单' : procType == 1 ? '确认订单' : '补单'
            }}</text>
          <uni-icons type="closeempty" class="close-icon" size="26" @click="closeOrderModal()"></uni-icons>
        </view>

        <scroll-view class="modal-content" scroll-y>
          <uni-forms ref="queryFormDataRef" :model="formData" label-position="top" label-width="200">
            <uni-forms-item label="系统订单号" name="">
              <uni-easyinput v-model="formData.systemOrderNo" disabled />
            </uni-forms-item>

            <uni-forms-item label="订单金额" name="">
              <uni-easyinput v-model="formData.orderAmount" disabled />
            </uni-forms-item>

            <uni-forms-item label="实付金额" name="">
              <uni-easyinput v-model="formData.payAmount" disabled />
            </uni-forms-item>
          </uni-forms>
        </scroll-view>

        <view class="query-buttons">
          <button class="reset-btn" @click="closeOrderModal()">取消</button>
          <button class="search-btn" @click="orderBtnOk()">确认</button>
        </view>
      </view>
    </uni-popup>

    <!-- 查看收款信息弹窗    -->
    <uni-popup ref="showAccountInfoRef" :show="showAccountInfoVisible" @maskClick="showAccountInfoVisible = false">
      <view class="query-popup">
        <view class="popup-header">
          <text class="popup-title">查看收款信息</text>
          <uni-icons type="closeempty" class="close-icon" size="26" @click="showAccountInfoVisible = false"></uni-icons>
        </view>

        <scroll-view class="modal-content" scroll-y>
          <uni-forms v-if="showAccountInfoVisible" label-position="left" label-width="220rpx">


            <uni-forms-item label="收款信息名称">
              <view class="item-value" style="display: flex; align-items: center;height: 100%;">
                {{ formData.collectInfoName }}
              </view>
            </uni-forms-item>

            <uni-forms-item label="产品名称">
              <view class="item-value" style="display: flex; align-items: center;height: 100%;">
                {{ formData.productName }}
              </view>
            </uni-forms-item>

            <view v-if="formData.payeeAccountConfig && showAccountInfoVisible"
              style="padding: 20rpx 20rpx 20rpx 0; margin: 10rpx 0">
              <!-- 文本信息 -->
              <uni-forms-item v-for="(item) in formData.payeeAccountConfig.texts" :key="item.textConfigId"
                :label="item.textTitle">
                <view class="item-value" style="display: flex; align-items: center;height: 100%;">
                  {{ item.textValue }}
                </view>
              </uni-forms-item>
              <!-- 按钮信息 -->

              <view v-for="button in formData.payeeAccountConfig.buttons" :key="button.buttonConfigId">
                <uni-forms-item v-for="item in button.buttonParamList" :key="item.buttonParamId"
                  :label="item.paramTitle">
                  <view class="item-value">
                    {{ formData[`buttonParamList_${item.buttonParamId}`] }}
                  </view>
                </uni-forms-item>
              </view>

              <!-- 二维码设置 -->

              <view v-if="formData.payeeAccountConfig.qrConfig.isActive == 1">
                <uni-forms-item label="生成方式" prop="">
                  <view class="item-value">
                    {{
                    parseTypeOptions.find(
                      (ele) =>
                        ele.value ==
                        formData.payeeAccountConfig.qrConfig.parseType
                    ).label
                  }}
                  </view>
                </uni-forms-item>

                <uni-forms-item v-if="formData.payeeAccountConfig.qrConfig.parseType != 2" label="选择图片">
                  <image style="width: 292rpx; height: 292rpx"
                    :src="formData.payeeAccountConfig.qrConfig.fileList[0].url" />
                </uni-forms-item>

                <view class="btn-box" v-if="formData.payeeAccountConfig.qrConfig.parseType == 2">
                  <uni-forms-item v-if="formData.payeeAccountConfig.qrConfig.GenerQrUrl" label="二维码">
                    <image style="width: 292rpx; height: 292rpx"
                      :src="formData.payeeAccountConfig.qrConfig.GenerQrUrl" />
                  </uni-forms-item>

                  <uni-forms-item label="输入数据">
                    <view class="item-value">
                      {{ formData.payeeAccountConfig.qrConfig.parseValue }}
                    </view>
                  </uni-forms-item>
                </view>
              </view>

              <!-- 文件配置 -->
              <view v-if="
                formData.payeeAccountConfig.files &&
                formData.payeeAccountConfig.files.length > 0
              " class="file-config">
                <uni-forms-item v-for="(item, index) in formData.payeeAccountConfig.files" :key="index"
                  :label="item.fileTitle">
                  <view style="display: flex; justify-content: space-between">
                    {{ item.fileList[0].name }}
                    <u-button size="mini" style="width: 100rpx; margin: 0 10rpx" type="primary"
                      @click="download(item.fileList[0])">下载</u-button>
                  </view>
                  <view class="red_tip">说明： {{ item.remark }}</view>
                </uni-forms-item>
              </view>
            </view>
          </uni-forms>
        </scroll-view>

        <!-- <view class="query-buttons">
        <u-button @click="onDialogBtnCancel()">取消</u-button>
        <u-button type="primary" @click="onDialogBtnOk()">确定</u-button>
      </view> -->

        <!-- 查看提交信息 弹窗 -->
        <uni-popup ref="submit_info_dialog_visibleRef" :show="submit_info_dialog_visible"
          @maskClick="closeInfoDialog()">
          <view class="query-popup">
            <view class="popup-header">
              <text class="popup-title">查看提交信息</text>
              <uni-icons type="closeempty" class="close-icon" size="26" @click="closeInfoDialog()"></uni-icons>
            </view>
            <view style="padding: 40rpx 20rpx; width: 500rpx; 
          display: flex; justify-content: space-between; 
          margin-bottom: -1px;
          background-color: white;">
              提交信息 ：{{ submit_info_formData.submitInfo  }}
              <view v-if="submit_info_formData.submitInfo" @click="onCopyBtnClick()">复制</view>
            </view>
            <view class="query-buttons">
              <!-- <button class="reset-btn" @click="closeInfoDialog()">取消</button> -->
              <button class="search-btn" @click="closeInfoDialog()">关闭</button>
            </view>
          </view>
        </uni-popup>


      </view>
    </uni-popup>



  </view>
</template>

<script>
  import {
    formatDateTime,
    downloadFile
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
    getPayeeAccountInfoById
  } from '@/api/service-income-info.js'

  import {
    getFileById
  } from '@/api/upload'
  import {
    getProviderReportPage,
    providerDailyReportSummary
  } from '@/api/report-center.js'

  import {
    getCollectOrderList,
    cancelCollectOrder,
    confirmCollectOrder,
    supplementCollectOrder,
    getSubmitInfoInfo,
  } from '@/api/collect-order.js'

  import {
    debounce
  } from '@/utils/index.js'

  import {
    mapState
  } from 'vuex'

  export default {
    name: 'ReceiveOrder',
    data() {
      return {
        showAccountInfoVisible: false,

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
        productList: [{
            label: '产品1',
            value: 11
          },
          {
            label: '产品2',
            value: 22
          }
        ],
        providerList: [{
            label: '码商1',
            value: 11
          },
          {
            label: '码商2',
            value: 22
          }
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

        submit_info_formData: {},
        submit_info_dialog_visible: false,

      }
    },
    mounted() {
      console.log('-----mounted----onLoad-------')
      this.refreshIndex = uni.getStorageSync('subordinateCollectOrderRefreshIndex') || 0
      this.startRefreshTimer()
      this.queryTableData()
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
      },
      showAccountInfoVisible(v) {
        if (this.$refs.showAccountInfoRef) {
          if (v) {
            this.$refs.showAccountInfoRef.open('bottom')
          } else {
            this.$refs.showAccountInfoRef.close()
          }
        }
      },

      submit_info_dialog_visible(v) {
        if (this.$refs.submit_info_dialog_visibleRef) {
          if (v) {
            this.$refs.submit_info_dialog_visibleRef.open('center')
          } else {
            this.$refs.submit_info_dialog_visibleRef.close()
          }
        }
      },

    },
    beforeDestroy() {
      this.clearRefreshTimer()
      this.countdown = 0
      this.refreshIndex = 0
    },
    methods: {

      closeInfoDialog() {
        this.submit_info_dialog_visible = false
        this.submit_info_formData = {
          tradePassword: '',
          isShow: false,
          submitInfo: '',
          orderId: ''
        }
      },

      look_submit_info(row) {
        this.submit_info_formData = {
          tradePassword: '',
          isShow: false,
          submitInfo: '',
          orderId: row.orderId
        }
        this.submit_info_dialog_visible = true

        this.doLookInfo()
      },
      async doLookInfo() {
        let ret = await getSubmitInfoInfo(this.submit_info_formData.orderId, {
          tenantId: this.$store.state.tenantId
        })
        if (!ret.data) {
          uni.showToast({
            title: '暂无任何信息',
            icon: 'none',
            duration: 2000
          })
          return
        }

        this.submit_info_formData.submitInfo = ret.data
        this.submit_info_formData.isShow = true
      },

      download(item) {
        downloadFile(item.url, item.name)
      },

      async look_shoukuan_info(row) {
        if (!row.collectInfoId) {
          uni.showToast({
            title: '收款信息不存在',
            icon: 'none',
            duration: 2000
          })
          return
        }
        this.showAccountInfoVisible = true
        this.formData = Object.assign({}, row)

        const res = await getPayeeAccountInfoById(row.collectInfoId)

        const qrConfig = res.data.qrConfig
        qrConfig.fileId = qrConfig.qrUrl // 其实是 fileId

        if (qrConfig.parseType == null) {
          qrConfig.parseType = 0
          qrConfig.fileList = []
          console.error('-----不应该出现的情况，-----', qrConfig.parseType)
        } else if (qrConfig.parseType != 2) {
          // 0 原图 1 上传并解析
          let resp = await getFileById(qrConfig.qrUrl) // 其实是 fileId
          qrConfig.fileList = [{
            name: resp.data.originalName,
            url: resp.data.fileUrl
          }]
          this.qrImageUrl = resp.data.fileUrl
        } else {
          let resp = await getFileById(qrConfig.qrUrl) // 其实是 fileId
          qrConfig.GenerQrUrl = resp.data.fileUrl ? resp.data.fileUrl : ''
          qrConfig.parseValue = qrConfig.parseValue ? qrConfig.parseValue : ''
        }

        if (res.data.files) {
          for (let index = 0; index < res.data.files.length; index++) {
            const ele = res.data.files[index]
            ele.fileId = ele.fileUrl

            let resp = await getFileById(ele.fileId) // 其实是 fileId

            ele.fileList = [{
              name: resp.data.originalName,
              url: resp.data.fileUrl
            }]
          }
        }

        this.formData = {
          ...this.formData,
          payeeAccountConfig: {
            texts: res.data.texts,
            buttons: res.data.buttons,
            qrConfig: qrConfig,
            files: res.data.files
          }
        }
      },
      onSubNavClick(v) {
        this.queryFormData.orderStatus = v
        this.queryTableData()
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

      orderBtnOk() {
        if (this.procType == 0) {
          // 取消
          cancelCollectOrder(this.formData.orderId).then((res) => {
            this.$message.success('取消成功')
            this.closeOrderModal()
            this.queryTableData()
          })
        } else if (this.procType == 1) {
          // 确认
          confirmCollectOrder(this.formData.orderId).then((res) => {
            this.$message.success('确认成功')
            this.closeOrderModal()
            this.queryTableData()
          })
        } else if (this.procType == 2) {
          // 补单
          supplementCollectOrder(this.formData.orderId).then((res) => {
            this.$message.success('补单成功')
            this.closeOrderModal()
            this.queryTableData()
          })
        }
      },
      closeOrderModal() {
        this.showOrderPopup = false
      },
      procOrder(row, type) {
        this.procType = type
        this.showOrderPopup = true
        this.formData = row
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
            // this.queryFormData[key] !== '' &&
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
        params.operationType = 1
        let res = await getCollectOrderList(params, this.page)
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
          now.getDate() - 3,
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
        this.refreshIndex = e.detail.value
        uni.setStorageSync('subordinateCollectOrderRefreshIndex', this.refreshIndex)
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
        this.flushPage()
      }

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

    .left {
      background-image: linear-gradient(to right, #AE9281 0%, #FFF6ED 50%, #EDD0BE 100%);
    }

    .right {
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
        padding: 20rpx 40rpx;


        .line2 {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;

          .info-row {
            width: 48%;
          }

          .time-row {
            width: 50%;
            font-size: 24rpx;
            color: #999999;

            .time-label {
              margin-right: 10rpx;
            }
          }


          .info-label {
            text-align: left;
            width: 140rpx;
            margin-right: 0;
          }
        }

        .notes-row {
          display: flex;
          align-items: center;
          padding: 20rpx 0;

          .notes-label {
            font-size: 24rpx;
            width: 240rpx;

          }

          .notes-value {
            font-size: 24rpx;
            line-height: 28rpx;
            margin: 0;
          }
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