<template>
  <view class="container isShowUi" :style="{paddingTop:$store.state.navBarHeight+'rpx'}">
    <!-- 自定义标题栏 -->
    <custom-nav-bar title="收款信息今日报表">
    </custom-nav-bar>

    <!-- 订单列表 -->
    <scroll-view class="order-list" scroll-y @scroll="e=>oldScrollTop=e.detail.scrollTop" :scroll-with-animation="true"
      :scroll-top="scrollTop" refresher-enabled :refresher-triggered="refreshTriggered"
      @refresherrefresh="onScrollRefresh()">


      <view class="main-content">


        <!-- 汇总信息 -->
        <view class="out-box">
          <view class="summary-card">

            <view class="summary-title">
              <text class="txt">汇总信息</text>
              <view class="info">
                <text class="label">成功率</text>
                <text class="value" v-if="summaryInfo.successfulRate!=null"  >{{summaryInfo.successfulRate}} %</text>
              </view>
            </view>
            <view class="summary-grid" v-if="summaryInfo">
              <view class="summary-item">
                <text class="label">订单数量</text>
                <text class="value">{{summaryInfo.orderCount}}</text>
              </view>
              <view class="summary-item">
                <text class="label">订单金额</text>
                <text class="value red-txt"  v-if="summaryInfo.orderAmount!=null" >￥{{summaryInfo.orderAmount}} </text>
              </view>
              <view class="summary-item">
                <text class="label">成功订单数</text>
                <text class="value">{{summaryInfo.successfulOrderCount}}</text>
              </view>
              <view class="summary-item">
                <text class="label">成功订单金额</text>
                <text class="value red-txt" v-if="summaryInfo.successfulOrderAmount!=null"  >￥{{summaryInfo.successfulOrderAmount}} </text>
              </view>
              <view class="summary-item">
                <text class="label">实付金额</text>
                <text class="value red-txt" v-if="summaryInfo.payAmount!=null">￥{{summaryInfo.payAmount}} </text>
              </view>
              <view class="summary-item">
                <text class="label">成功实付金额</text>
                <text class="value red-txt"
                  v-if="summaryInfo.successfulPayAmount != null">￥{{summaryInfo.successfulPayAmount}} </text>
              </view>
            </view>

          </view>
        </view>


        <view class="no-data" v-if="tableData.length == 0">
          <uni-icons type="search" size="50"></uni-icons>
          <text>暂无相关数据</text>
        </view>
        <view class="" v-else>


          <view v-for="(item, index) in tableData" :key="index" class="order-card">

            <view class="card-header">
              <view class="order-id">统计日期: <text class="txt">{{ item.statisticsDate}}</text> </view>
              <view class="info">成功率: <u-tag :text="`${ item.successfulRate } %`" type="success"> </u-tag></view>
            </view>

            <view class="card-body-2">

              <view class="left-box" style="100%">
                <image src="/static/imgs/collect.png" style="width: 84rpx; height: 84rpx;" mode=""></image>
                <text class="txt">收款信息名称</text>
                <text class="name">{{ item.payeeAccountName }}</text>
              </view>

              <view class="right-box">

                <view class="info-row">
                  <text class="info-label">订单数量:</text>
                  <text class="info-value">{{ item.orderCount }}</text>
                </view>

                <view class="info-row">
                  <text class="info-label">成功订单数:</text>
                  <text class="info-value">{{ item.successfulOrderCount }}</text>
                </view>

                <view class="info-row">
                  <text class="info-label">实付金额:</text>
                  <text class="info-value">￥{{ item.payAmount }}</text>
                </view>

                <view class="info-row">
                  <text class="info-label">订单金额:</text>
                  <text class="info-value price">¥{{ item.orderAmount }} </text>
                </view>



                <view class="info-row">
                  <text class="info-label">成功订单金额:</text>
                  <text class="info-value price">¥{{ item.successfulOrderAmount }} </text>
                </view>

                <view class="info-row">
                  <text class="info-label">成功实付金额:</text>
                  <text class="info-value price">¥{{ item.successfulPayAmount }} </text>
                </view>




              </view>
            </view>

            <!-- 	<view class="card-footer">
						<button class="action-btn" @click="acceptOrder(item)">接单</button>
					</view> -->
          </view>

          <pagination @change="onPaginationChange" :total="total" :value="page.pageNum"></pagination>
        </view>

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


            <uni-forms-item label="产品名称" name="productName">
              <uni-easyinput v-model="queryFormData.productName" placeholder="请输入产品名称"
                @blur="$refs.queryFormDataRef.validateField('productName')" />
            </uni-forms-item>


            <uni-forms-item label="统计日期" name="createTime" required>
              <uni-datetime-picker type="daterange" v-model="queryFormData.createTime" />
            </uni-forms-item>
          </uni-forms>
        </scroll-view>

        <view class="query-buttons">
          <u-button icon="reload" class="reset-btn" @click="resetQueryForm()">重置</u-button>
          <u-button icon="search" class="search-btn" @click="btnSearchClick()">搜索</u-button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
  import {
    formatDateTime
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
    businessTypeOptions,
    changeTypeOptions
  } from '@/utils/constants.js'

  import {
    payeeAccountDailyReport,
    payeeAccountDailyReportSummary
  } from '@/api/today-report.js'

  import {
    debounce
  } from '@/utils/index.js'

  export default {
    name: 'ReceiveOrder',
    data() {
      return {
        refreshOptions: refreshOptions,
        orderStateOptions: orderStateOptions,
        notifyStatusOptions: notifyStatusOptions,
        businessTypeOptions: businessTypeOptions,
        changeTypeOptions: changeTypeOptions,
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
      }
    },
    created() {
      console.log('---------onLoad-------');
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
      }
    },
    onUnload() {
      this.clearRefreshTimer()
    },
    methods: {
      onScrollRefresh() {
        console.log('---onScrollRefresh----');
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

        this.$refs.queryFormDataRef.validate()
          .then(async (ret) => {
            console.log('验证通过', ret)
            this.queryTableData()
          }).catch((err) => {
            console.log('验证失败', err)
            console.log(this.queryFormData);
            this.$message.error('输入不正确，请检查')
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
          tenantId: this.$store.state.tenantId,
          userId: this.$store.state.userAccount.userId
        }

        // this.refreshTriggered = true
        let res = await payeeAccountDailyReport({
          ...params,
          ...this.page
        })
        console.log(res);
        this.tableData = res.data.list
        this.total = res.data.total


        // 汇总信息 
        let ret = await payeeAccountDailyReportSummary(params)
        console.log('---providerDailyReportSummary---', ret);
        this.summaryInfo = ret.data

        this.refreshTriggered = false

        this.scrollToTop()
        this.closeSearchModal()
      },


      scrollToTop() {
        this.scrollTop = this.oldScrollTop
        this.$nextTick(() => {
          this.scrollTop = 0
        });
      },

      getQueryForm() {
        // let now = new Date()
        // const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
        // let endStr = formatDateTime(
        //   new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
        // )
        // let startStr = formatDateTime(today)
        return {
          // productId: '',
          // merchantId: '',
          // providerId: '',
          // orderStatus: '',
          // notifyStatus: '',
          createTime: []
        }
      },


    }
  }
</script>

<style scoped lang="scss" >
  ::v-deep .nav-bar.isShowUi {
    border-radius: 0;
  }

  .isShowUi {
    .out-box {
      background-color: #232738;
      padding: 20rpx;
      border-radius: 0 0 20rpx 20rpx;

    }

    .order-card {
      margin: 20rpx 20rpx 0;
      border-radius: 32rpx;
      background-image: linear-gradient(to bottom, #FFEFD5 0%, #fff 30%, #fff 100%);
    }
  }

  .isShowUi .summary-card .summary-grid {
    justify-content: flex-start;

    &::after {
      background-color: transparent;
    }

    .summary-item {
      width: 30%;
    }
  }

  .isShowUi .order-card .card-body-2::after {
    content: none;
  }

  .isShowUi .order-card .card-body-2 {
    .left-box {
      width: 200rpx;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .txt {
        font-size: 20rpx;
      }

      .name {
        font-size: 28rpx;
        font-weight: 600;
      }
    }

    .right-box {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      flex: 1;
      border: 2rpx solid #EFF4FF;
      border-radius: 40rpx;
    }
  }
</style>