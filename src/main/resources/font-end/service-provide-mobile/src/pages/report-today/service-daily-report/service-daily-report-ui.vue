<template>
  <view class="container isShowUi" :style="{paddingTop:$store.state.navBarHeight+'rpx'}">
    <!-- 自定义标题栏 -->
    <custom-nav-bar title="今日报表">
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
                <text class="value">{{summaryInfo.successfulRate}} %</text>
              </view>
            </view>

            <view class="summary-grid" v-if="summaryInfo">
              <view class="sub-box">
                <view class="summary-item">
                  <text class="label">订单数量</text>
                  <text class="value">{{summaryInfo.orderCount}}</text>
                </view>
                <view class="summary-item">
                  <text class="label">订单金额</text>
                  <view class="value red-txt"> <text
                      v-if="summaryInfo.orderAmount!=null">￥</text>{{summaryInfo.orderAmount }}
                  </view>
                </view>

                <view class="summary-item">
                  <text class="label">成功订单数</text>
                  <text class="value">{{summaryInfo.successfulOrderCount}}</text>
                </view>
                <view class="summary-item">
                  <text class="label">成功订单金额</text>
                  <view class="value red-txt"> <text v-if="summaryInfo.successfulOrderAmount!=null">￥</text>
                    {{summaryInfo.successfulOrderAmount}}
                  </view>
                </view>
              </view>
              <view class="sub-box">
                <view class="summary-item">
                  <text class="label">实付金额</text>
                  <view class="value red-txt"><text v-if="summaryInfo.payAmount!=null">￥</text>{{summaryInfo.payAmount}}
                  </view>
                </view>
                <view class="summary-item">
                  <text class="label">成功实付金额</text>
                  <view class="value red-txt"><text
                      v-if="summaryInfo.successfulPayAmount!=null">￥</text>{{summaryInfo.successfulPayAmount}}
                  </view>
                </view>

                <view class="summary-item">
                  <text class="label">分润</text>
                  <view class="value red-txt"><text
                      v-if="summaryInfo.providerCost!=null">￥</text>{{summaryInfo.providerCost}}
                  </view>
                </view>
                <view class="summary-item">
                </view>
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
              <view class="info">成功率: <u-tag :text="`${ item.successfulRate } %`" type="success"> </u-tag>
              </view>
            </view>

            <view class="card-body-2">

              <view class="sub-box">
                <view class="info-row">
                  <text class="info-label">订单数量</text>
                  <text class="info-value">{{ item.orderCount }}</text>
                </view>

                <view class="info-row">
                  <text class="info-label">订单金额</text>
                  <text class="info-value price">¥{{ item.orderAmount }}</text>
                </view>

                <view class="info-row">
                  <text class="info-label">成功订单数</text>
                  <text class="info-value">{{ item.successfulOrderCount }}</text>
                </view>

                <view class="info-row">
                  <text class="info-label">成功订单金额</text>
                  <text class="info-value price">¥{{ item.successfulOrderAmount }}</text>
                </view>
              </view>



              <view class="sub-box">
                <view class="info-row">
                  <text class="info-label">实付金额</text>
                  <text class="info-value price">¥{{ item.payAmount }}</text>
                </view>

                <view class="info-row">
                  <text class="info-label">个人分润</text>
                  <text class="info-value price">¥{{ item.providerCost }}</text>
                </view>

                <view class="info-row">
                  <text class="info-label">团队分润</text>
                  <text class="info-value price">¥{{ item.teamProfit }}</text>
                </view>

                <view class="info-row">
                  <text class="info-label">日终余额</text>
                  <text class="info-value price">¥{{ item.dailyAvailableBalance }}</text>
                </view>
              </view>
            </view>
          </view>
          <pagination @change="onPaginationChange" :total="total" :value="page.pageNum"></pagination>
        </view>
      </view>
    </scroll-view>

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
    EndOfDayReport,
    EndOfDayReportSummary
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
        queryFormData: {},
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
      resetQueryForm() {
        this.queryFormData = {}
      },


      // 确认搜索
      async queryTableData() {
        let params = {
          tenantId: this.$store.state.tenantId,
          userId: this.$store.state.userAccount.userId
        }


        // this.refreshTriggered = true
        let res = await EndOfDayReport({
          ...params,
          ...this.page
        })
        console.log(res);
        this.tableData = res.data.list
        this.total = res.data.total


        // 汇总信息 
        let ret = await EndOfDayReportSummary(params)
        console.log('---providerDailyReportSummary---', ret);
        this.summaryInfo = ret.data
        this.refreshTriggered = false
        this.scrollToTop()
      },


      scrollToTop() {
        this.scrollTop = this.oldScrollTop
        this.$nextTick(() => {
          this.scrollTop = 0
        });
      },





    }
  }
</script>

<style lang="scss" scoped>
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
</style>