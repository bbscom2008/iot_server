<template>
  <view class="home-container isShowUi" :style="{ paddingTop: `${statusBarHeight}rpx` }">

    <view class="error-notify">
      {{ errorMsg }}
    </view>

    <scroll-view class="order-list" scroll-y @scroll="onPageSroll" :scroll-with-animation="true" :scroll-top="scrollTop"
      refresher-enabled :refresher-triggered="refreshTriggered" @refresherrefresh="onScrollRefresh()">
      <view style="height: 100%;">
        <view class="fount-bg">

          <home-head></home-head>

          <view class="btn-switch-box">
            <view class="btn" :class="flag == 0 ? 'select':'' " @click="switchOrder(0)">
              <text>代收</text>
              <image class="img" src="/static/imgs/wan-line.png" mode="" v-if="flag == 0"></image>
            </view>
            <view class="btn2" :class="flag == 1 ? 'select':'' " @click="switchOrder(1)">
              <text>代付</text>
              <image class="img" src="/static/imgs/wan-line.png" mode="" v-if="flag == 1"></image>
            </view>
          </view>

          <view class="tongji-box">

            <view class="item-box">
              <view class="tongji"> 今日统计： </view>
              <view class="dashboard">
                <view class="item">
                  <image class="img" src="/static/imgs/tj-icon-1.png" mode=""></image>
                  <view class="info">
                    <view class="value"> {{ todayList.orderCount }} </view>
                    <view class="title">订单数量（笔）</view>
                  </view>
                </view>
                <view class="item">
                  <image class="img" src="/static/imgs/tj-icon-2.png" mode=""></image>
                  <view class="info">
                    <view class="value">
                      {{ todayList.orderAmount.toFixed(2) }}
                    </view>
                    <view class="title">订单金额（元）</view>
                  </view>
                </view>
                <view class="item">
                  <image class="img" src="/static/imgs/tj-icon-3.png" mode=""></image>
                  <view class="info">
                    <view class="value">
                      {{ todayList.providerCost.toFixed(2) }}
                    </view>
                    <view class="title">个人分润（元）</view>
                  </view>
                </view>
                <view class="item">
                  <image class="img" src="/static/imgs/tj-icon-4.png" mode=""></image>
                  <view class="info">
                    <view class="value">
                      {{ todayList.successfulOrderCount }}
                    </view>
                    <view class="title">成交订单（笔）</view>
                  </view>
                </view>
                <view class="item">
                  <image class="img" src="/static/imgs/tj-icon-5.png" mode=""></image>
                  <view class="info">
                    <view class="value">
                      {{ todayList.successfulOrderAmount.toFixed(2) }}
                    </view>
                    <view class="title">成交订单（元）</view>
                  </view>
                </view>
                <view class="item">
                  <image class="img" src="/static/imgs/tj-icon-6.png" mode=""></image>
                  <view class="info">
                    <view class="value">
                      {{ todayList.teamProfit.toFixed(2) }}
                    </view>
                    <view class="title">团队分润（元）</view>
                  </view>
                </view>
              </view>
            </view>


            <!-- yestodayList -->
            <view class="item-box  mt-20">
              <view class="tongji"> 昨日统计： </view>
              <view class="dashboard">
                <view class="item">
                  <image class="img" src="/static/imgs/tj-icon-1.png" mode=""></image>
                  <view class="info">
                    <view class="value"> {{ yestodayList.orderCount }} </view>
                    <view class="title">订单数量（笔）</view>
                  </view>
                </view>
                <view class="item">
                  <image class="img" src="/static/imgs/tj-icon-2.png" mode=""></image>
                  <view class="info">
                    <view class="value">
                      {{ yestodayList.orderAmount.toFixed(2) }}
                    </view>
                    <view class="title">订单金额（元）</view>
                  </view>
                </view>
                <view class="item">
                  <image class="img" src="/static/imgs/tj-icon-3.png" mode=""></image>
                  <view class="info">
                    <view class="value">
                      {{ yestodayList.providerCost.toFixed(2) }}
                    </view>
                    <view class="title">个人分润（元）</view>
                  </view>
                </view>
                <view class="item">
                  <image class="img" src="/static/imgs/tj-icon-4.png" mode=""></image>
                  <view class="info">
                    <view class="value">
                      {{ yestodayList.successfulOrderCount }}
                    </view>
                    <view class="title">成交订单（笔）</view>
                  </view>
                </view>
                <view class="item">
                  <image class="img" src="/static/imgs/tj-icon-5.png" mode=""></image>
                  <view class="info">
                    <view class="value">
                      {{ yestodayList.successfulOrderAmount.toFixed(2) }}
                    </view>
                    <view class="title">成交订单（元）</view>
                  </view>
                </view>
                <view class="item">
                  <image class="img" src="/static/imgs/tj-icon-6.png" mode=""></image>
                  <view class="info">
                    <view class="value">
                      {{ yestodayList.teamProfit.toFixed(2) }}
                    </view>
                    <view class="title">团队分润（元）</view>
                  </view>
                </view>
              </view>
            </view>

          </view>


        </view>
      </view>
    </scroll-view>
    <!-- <view class="gray-bg"> </view> -->
  </view>
</template>

<script>

import {
  startWebSocket,
} from '@/utils/notifySocket'



  import HomeHead from '@/components/home-head/home-head.vue'
  import {
    getCollectOrderToday,
    getCollectOrderYesterday,
    getPaymentToday,
    getPaymentYesterdayYesterday,
    getUpdateCollectAndPayment,
    getCollectAndPayment
  } from '@/api/user'


  export default {
    components: {
      HomeHead
    },
    data() {
      return {
        isCollectEnable: 0,
        isPaymentEnable: 0,
        oldScrollTop: 0,
        scrollTop: 0,
        refreshTriggered: false,
        errorMsg: '您的余额已经低于最低接单金额【0】，已经自动关闭接单功能，请及时充值！',
        flag: 0, //0:代收 1:代付
        //顶部数据
        todayList: {
          orderCount: 0,
          orderAmount: 0,
          providerCost: 0,
          successfulOrderCount: 0,
          successfulOrderAmount: 0,
          teamProfit: 0
        },
        yestodayList: {
          orderCount: 0,
          orderAmount: 0,
          providerCost: 0,
          successfulOrderCount: 0,
          successfulOrderAmount: 0,
          teamProfit: 0
        },
        statusBarHeight: 0
      }
    },
    mounted() {
      const systemInfo = uni.getSystemInfoSync()
      if (this.isShowUi) {
        this.statusBarHeight = systemInfo.statusBarHeight

      } else {
        this.statusBarHeight = this.$store.state.navBarHeight + 20
      }

      console.log(
        'this.$store.state.userAccount.userId: ',
        this.$store.state.userAccount.userId
      )

      if (!this.$store.state.userAccount.userId) {
        uni.redirectTo({
          url: '/pages/login/login'
        })
        return
      }

      this.getBusinessStatus()
      
      this.getCollectOrderToday()
      this.getCollectOrderYesterday()

      this.startWebSocket()

      


    },


    methods: {
			
      startWebSocket,
      async getBusinessStatus() {
        let ret = await getCollectAndPayment(
          this.$store.state.userAccount.userId
        )
        this.isCollectEnable = ret.data.isCollectEnable ? 1 : 0 // 是否开启代收
        this.isPaymentEnable = ret.data.isPaymentEnable ? 1 : 0 // 是否开启代付

        this.$store.commit('update_receive_order', this.isCollectEnable && this.isPaymentEnable)
      },

      onPageSroll(e) {
        this.oldScrollTop = e.detail.scrollTop
      },
      async onScrollRefresh() {
        console.log('---onScrollRefresh----')
        this.refreshTriggered = true
        uni.$emit('refreshAccountInfo')
        if (this.flag == 0) {
          // 代收
          Promise.all([
              this.getBusinessStatus(),
              this.getCollectOrderToday(),
              this.getCollectOrderYesterday()
            ])
            .then((res) => {
              console.log(res)
            })
            .catch((err) => {
              console.log(err)
            })
            .finally(() => {
              this.refreshTriggered = false
              this.scrollToTop()
            })
        } else {
          // 代付
          Promise.all([
              this.getBusinessStatus(),
              this.getPaymentToday(),
              this.getPaymentYesterdayYesterday()
            ])
            .then((res) => {
              console.log(res)
            })
            .catch((err) => {
              console.log(err)
            })
            .finally(() => {
              this.refreshTriggered = false
              this.scrollToTop()
            })
        }
      },
      scrollToTop() {
        this.scrollTop = this.oldScrollTop
        this.$nextTick(() => {
          this.scrollTop = 0
        })
      },
      jumpTo(page) {
        uni.navigateTo({
          url: page
        })
      },
      switchOrder(type) {
        this.flag = type
        if (type === 0) {
          this.getCollectOrderToday()
          this.getCollectOrderYesterday()
        } else {
          this.getPaymentToday()
          this.getPaymentYesterdayYesterday()
        }
      },
      async getCollectOrderToday() {
        let res = await getCollectOrderToday()
        if (res.data) {
          this.todayList = res.data
        }
      },
      async getCollectOrderYesterday() {
        let res = await getCollectOrderYesterday()
        if (res.data) {
          this.yestodayList = res.data
        }
      },
      async getPaymentToday() {
        let res = await getPaymentToday()
        if (res.data) {
          this.todayList = res.data
        }
      },
      async getPaymentYesterdayYesterday() {
        let res = await getPaymentYesterdayYesterday()
        if (res.data) {
          this.yestodayList = res.data
        }
      },


    }
  }
</script>

<style lang="scss" scoped>
  .isShowUi.home-container {
    position: relative;
    // 50 是底部 44 是顶部
    // min-height: calc(100vh - 100rpx);
    height: calc(100% + 2rpx);
    background-color: #232738;
    // padding-bottom: 100rpx;

    .order-list {
      height: 100%;
    }


    .fount-bg {
      position: relative;
      display: flex;
      flex-direction: column;
      z-index: 10;
      height: 100%;
      padding-bottom: 120rpx;
    }



    .error-notify {
      display: none;
      position: fixed;
      top: 88rpx;
      left: 0%;
      width: 100vw;
      font-size: 24rpx;
      background-color: #fa503b;
      color: white;
      padding: 15rpx;
    }

    

    .nav-box {
      flex: 1;
      // height: 200rpx;
      // background-color: #4792f3;
      padding: 10rpx 20rpx;

      .nav {
        display: flex;
        justify-content: space-around;
        align-items: center;
        height: 180rpx;
        background-color: #fff;
        border-radius: 20rpx;

        .item {
          display: flex;
          flex-direction: column;
          align-items: center;

          .img {
            width: 80rpx;
            height: 80rpx;
            border-radius: 50%;
            overflow: hidden;
          }
        }
      }

      .receive-box {
        margin-top: 30rpx;
        // height: 290rpx;
        background-color: #fff;
        border-radius: 20rpx;
        padding: 30rpx;

        .info-row {
          height: 60rpx;

          .info-label {
            color: #333;
          }
        }

        .img-box {
          display: flex;
          justify-content: center;
          padding: 20rpx;

          .stop-img-btn {
            width: 160rpx;
            height: 160rpx;
            border-radius: 50%;
            background-color: #fa503b;
            box-shadow: 2rpx 2rpx 2rpx 2rpx rgba(0, 0, 0, 0.4);
            font-size: 32rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: 700;
            color: white;
          }
        }

        .notify {
          color: #fa503b;
          font-size: 24rpx;
        }
      }
    }

    .mt-10 {
      margin-top: 10rpx;
    }

    .mt-20 {
      margin-top: 20rpx;
    }

    .btn-switch-box {
      display: flex;
      justify-content: center;
      margin-top: 30rpx;
      color: white;
      font-size: 16px;
      gap: 50rpx;

      .select {
        color: #f6e5d7;
        display: flex;
        flex-direction: column;
      }

      .img {
        margin-top: 6rpx;
        width: 62rpx;
        height: 12rpx;
      }
    }

    .tongji-box {
      background-color: #efefef;
      border-radius: 40rpx 40rpx 0 0;
      margin-top: 30rpx;
      padding: 20rpx;
      flex: 1;
      padding-bottom: 200rpx;

      .item-box {
        background-image: linear-gradient(to bottom,
            #ffefd5 0%,
            #fff 35%,
            #fff 100%);
        border-radius: 32rpx;
      }

      .tongji {
        display: flex;
        align-items: center;
        height: 70rpx;
        font-weight: 600;
        font-size: 32rpx;
        padding-left: 40rpx;
      }

      .dashboard {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        .item {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 33%;
          // height: ;
          margin: 30rpx 0;

          .img {
            width: 52rpx;
            height: 52rpx;
            margin-right: 10rpx;
          }

          .info {
            .value {
              font-weight: 700;
              line-height: 44rpx;
              font-size: 32rpx;
            }

            .title {
              line-height: 44rpx;
              font-size: 20rpx;
            }
          }
        }
      }
    }
  }
</style>