<template>
  <view class="home-container isShowUi">
    <scroll-view
      class="order-list"
      scroll-y
      :scroll-with-animation="true"
      refresher-enabled
      :refresher-triggered="refreshTriggered"
      @refresherrefresh="onScrollRefresh()"
    >
      <view class="fount-bg">
        <homeHeadVue></homeHeadVue>

        <view class="nav-box">
          <view class="team-box">
            <view
              class="item"
              @click="jumpTo('/pages/team-manager/team-manager')"
            >
              <view class="txt">团队管理</view>
              <image
                src="/static/my/user.png"
                style="width: 52rpx; height: 52rpx"
                mode=""
              ></image>
            </view>

            <view
              class="item"
              @click="
                jumpTo(
                  '/pages/service-manager/service-product-mananger/service-product-mananger'
                )
              "
            >
              <view class="txt">产品列表</view>
              <image
                src="/static/my/plist.png"
                style="width: 52rpx; height: 52rpx"
                mode=""
              ></image>
            </view>
          </view>

          <view class="card-box">
            <view class="title-box"> 代收代付 </view>
            <view class="item-box">
              <view
                class="item"
                @click="jumpTo('/pages/order/collect-order/collect-order')"
              >
                <image
                  src="/static/my/order-1.png"
                  style="width: 56rpx; height: 56rpx"
                  mode=""
                ></image>
                <text>代收订单</text>
              </view>

              <view
                class="item"
                @click="jumpTo('/pages/order/agent-pay/agent-pay')"
              >
                <image
                  src="/static/my/order-2.png"
                  style="width: 56rpx; height: 56rpx"
                  mode=""
                ></image>
                <text>代付订单</text>
              </view>
              <view
                class="item"
                @click="
                  jumpTo(
                    '/pages/order/payment-accept-order/payment-accept-order'
                  )
                "
              >
                <image
                  src="/static/my/order-3.png"
                  style="width: 56rpx; height: 56rpx"
                  mode=""
                ></image>
                <text>代付接单</text>
              </view>

              <view
                class="item"
                @click="
                  jumpTo(
                    '/pages/order/subordinate-collect-order/subordinate-collect-order'
                  )
                "
              >
                <image
                  src="/static/my/order-4.png"
                  style="width: 56rpx; height: 56rpx"
                  mode=""
                ></image>
                <text>下级代收</text>
              </view>

              <view
                class="item"
                @click="
                  jumpTo(
                    '/pages/order/subordinate-agent-pay-order/subordinate-agent-pay-order'
                  )
                "
              >
                <image
                  src="/static/my/order-5.png"
                  style="width: 56rpx; height: 56rpx"
                  mode=""
                ></image>
                <text>下级代付</text>
              </view>
            </view>
            <view class="item-box" style="margin-top: 20rpx;" >
              <view
                class="item"
                @click="jumpTo('/pages/order/acception-order/acception-order-ui')"
              >
                <image
                  src="/static/my/order-9.png"
                  style="width: 56rpx; height: 56rpx"
                  mode=""
                ></image>
                <text>兑付订单</text>
              </view>
              
              <view class="item"></view>
              <view class="item"></view>
              <view class="item"></view>
              <view class="item"></view>
            </view>

          </view>

          <view class="card-box">
            <view class="title-box"> 报表中心 </view>
            <view class="item-box">
              <view
                class="item"
                @click="
                  jumpTo(
                    '/pages/report-center/service-daily-report/service-daily-report'
                  )
                "
              >
                <image
                  src="/static/my/order-6.png"
                  style="width: 56rpx; height: 56rpx"
                  mode=""
                ></image>
                <text>日终报表</text>
              </view>
              <view
                class="item"
                @click="
                  jumpTo(
                    '/pages/report-center/service-team-report/service-team-report'
                  )
                "
              >
                <image
                  src="/static/my/order-7.png"
                  style="width: 56rpx; height: 56rpx"
                  mode=""
                ></image>
                <text>团队报表</text>
              </view>
              <view
                class="item"
                @click="
                  jumpTo(
                    '/pages/report-center/product-daily-report/product-daily-report'
                  )
                "
              >
                <image
                  src="/static/my/order-8.png"
                  style="width: 56rpx; height: 56rpx"
                  mode=""
                ></image>
                <text>产品日报表</text>
              </view>
              <view
                class="item"
                @click="
                  jumpTo(
                    '/pages/report-center/income-info-daily/income-info-daily'
                  )
                "
              >
                <image
                  src="/static/my/order-9.png"
                  style="width: 56rpx; height: 56rpx"
                  mode=""
                ></image>
                <text>收款报表</text>
              </view>
            </view>
          </view>

          <view class="card-box">
            <view class="title-box">今日报表</view>
            <view class="item-box">
              <view
                class="item"
                @click="
                  jumpTo(
                    '/pages/report-today/service-daily-report/service-daily-report'
                  )
                "
              >
                <image
                  src="/static/my/order-6.png"
                  style="width: 56rpx; height: 56rpx"
                  mode=""
                ></image>
                <text>日终报表</text>
              </view>
              <view
                class="item"
                @click="
                  jumpTo(
                    '/pages/report-today/service-team-report/service-team-report'
                  )
                "
              >
                <image
                  src="/static/my/order-7.png"
                  style="width: 56rpx; height: 56rpx"
                  mode=""
                ></image>
                <text>团队报表</text>
              </view>
              <view
                class="item"
                @click="
                  jumpTo(
                    '/pages/report-today/product-daily-report/product-daily-report'
                  )
                "
              >
                <image
                  src="/static/my/order-8.png"
                  style="width: 56rpx; height: 56rpx"
                  mode=""
                ></image>
                <text>产品日报表</text>
              </view>
              <view
                class="item"
                @click="
                  jumpTo(
                    '/pages/report-today/income-info-daily/income-info-daily'
                  )
                "
              >
                <image
                  src="/static/my/order-9.png"
                  style="width: 56rpx; height: 56rpx"
                  mode=""
                ></image>
                <text>收款报表</text>
              </view>
            </view>
          </view>

          <!-- <view class="card-box">
          <view class="title-box"> 产品管理 </view>
          <view class="item-box">
            <view class="item" @click="
                jumpTo(
                  '/pages/service-manager/service-product-mananger/service-product-mananger'
                )
              ">
              <uni-icons type="list" size="40" color="#4792f3"></uni-icons>
              <text>产品列表</text>
            </view>

            <view class="item" @click="
                jumpTo(
                  '/pages/service-manager/service-income-info/service-income-info'
                )
              ">
              <uni-icons type="email" size="40" color="#4792f3"></uni-icons>
              <text>收款信息</text>
            </view>
            <view class="item"> </view>
            <view class="item"> </view>
            <view class="item"> </view>
          </view>
        </view> -->

          <view class="card-box">
            <view class="title-box"> 账变中心 </view>
            <view class="item-box">
              <view
                class="item"
                @click="
                  jumpTo(
                    '/pages/cash-manage/service-change-record/service-change-record'
                  )
                "
              >
                <image
                  src="/static/my/order-10.png"
                  style="width: 56rpx; height: 56rpx"
                  mode=""
                ></image>
                <text>账变记录</text>
              </view>
              <view
                class="item"
                @click="
                  jumpTo(
                    '/pages/cash-manage/sub-change-record/sub-change-record'
                  )
                "
              >
                <image
                  src="/static/my/order-11.png"
                  style="width: 56rpx; height: 56rpx"
                  mode=""
                ></image>
                <text>下级账变</text>
              </view>
              <view class="item"> </view>
              <view class="item"> </view>
            </view>
          </view>

          <!-- <view class="card-box">
          <view class="title-box"> 账号设置 </view>
          <view class="item-box">
            <view class="item" @click="jumpTo('/pages/personal-info/personal-info')">
              <uni-icons type="person" size="40" color="#4792f3"></uni-icons>
              <text>个人信息</text>
            </view>
            
            <view class="item" @click="showConfirmLogout()">
              <uni-icons type="paperplane" size="40" color="#4792f3"></uni-icons>
              <text>退出登录</text>
            </view>
            <view class="item"> </view>
          </view>
        </view> -->
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import homeHeadVue from '../../components/home-head/home-head.vue'

export default {
  components: {
    homeHeadVue
  },
  data() {
    return {
      refreshTriggered: false,
      errorMsg:
        '您的余额已经低于最低接单金额【0】，已经自动关闭接单功能，请及时充值！'
    }
  },
  onLoad() {
    console.log('----my------onLoad---')
  },
  methods: {
    jumpTo(page) {
      uni.navigateTo({
        url: page
      })
    },
    onScrollRefresh() {
      this.refreshTriggered = true
      uni.$emit('refreshAccountInfo')
      setTimeout(() => {
        this.refreshTriggered = false
      }, 500)
    }
  }
}
</script>

<style lang="scss" scoped>
.order-list {
  height: 100%;
}
.home-container {
  position: relative;
  background-color: #232738;
  padding-bottom: 100rpx;
  height: 101%;
  overflow: auto;
}

.id-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40rpx 40rpx 10rpx;
  color: white;

  .king-box {
    display: flex;
    align-items: center;
  }
}

.info-box {
  // display: flex;
  // justify-content: space-between;
  height: 220rpx;
  margin: 0 20rpx;
  padding-top: 20rpx;

  .balance {
    display: flex;
    justify-content: space-between;
    height: 100rpx;
    padding: 20rpx 40rpx;
    padding-top: 10rpx;
    border-bottom: 2rpx solid white;

    .balance-item {
      color: #282828;
      font-weight: 400;

      .txt {
        font-size: 28rpx;
      }

      .value {
        font-size: 40rpx;
        font-weight: 600;
        margin-top: 10rpx;
      }
    }
  }

  .freeze_balance {
    text-align: right;
  }

  .avaible_balance {
    text-align: left;
  }

  .nav {
    display: flex;
    justify-content: space-between;
    margin: 20rpx 60rpx;

    .item {
      display: flex;
      align-items: center;

      .img {
        width: 42rpx;
        height: 42rpx;
        margin-right: 20rpx;
      }
    }
  }
}

.nav-box {
  margin-top: 20rpx;
  background-color: #efefef;
  border-radius: 40rpx 40rpx 0 0;
  padding: 20rpx;
  padding-bottom: 140rpx;

  .team-box {
    display: flex;
    gap: 20rpx;

    .item {
      height: 100rpx;
      display: flex;
      justify-content: space-between;
      padding: 0 60rpx 0 40rpx;
      align-items: center;
      color: #e0c4b2;
      flex: 1;
      border-radius: 24rpx;
      background-image: linear-gradient(to right, #131522 0%, #3c4159 100%);
      border: 4rpx solid #edd0be;
    }
  }

  .card-box {
    margin-top: 30rpx;
    background-color: #fff;
    border-radius: 20rpx;
    padding: 0 20rpx 40rpx;

    .title-box {
      display: flex;
      font-weight: 600;
      padding: 20rpx;
      font-size: 34rpx;
    }

    .item-box {
      display: flex;

      .item {
        flex: 1;
        // height: 100rpx;
        line-height: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        color: #3d4047;
        gap: 20rpx;
      }
    }
  }
}
</style>
