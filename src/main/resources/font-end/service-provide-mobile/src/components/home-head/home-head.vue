<template>
  <view>
    <view class="id-box">
      <view class="king-box">
        <image
          src="/static/king_logo.png"
          style="width: 80rpx; height: 80rpx"
          mode="aspectFill"
        >
        </image>
        <text style="margin-left: 10rpx" class="id">{{
          $store.state.personalInfo ? $store.state.personalInfo.userName : ''
        }}</text>
      </view>
      <view class="img-box">
        <svg
          style="width: 40rpx"
          fill="#c00"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          width="34"
          height="32"
          viewBox="0 0 34 32"
          v-if="$store.state.notifySound"
          @click="switchSount(false)"
        >
          <path
            d="M27.814 28.814c-0.384 0-0.768-0.146-1.061-0.439-0.586-0.586-0.586-1.535 0-2.121 2.739-2.739 4.247-6.38 4.247-10.253s-1.508-7.514-4.247-10.253c-0.586-0.586-0.586-1.536 0-2.121s1.536-0.586 2.121 0c3.305 3.305 5.126 7.7 5.126 12.374s-1.82 9.069-5.126 12.374c-0.293 0.293-0.677 0.439-1.061 0.439zM22.485 25.985c-0.384 0-0.768-0.146-1.061-0.439-0.586-0.586-0.586-1.535 0-2.121 4.094-4.094 4.094-10.755 0-14.849-0.586-0.586-0.586-1.536 0-2.121s1.536-0.586 2.121 0c2.55 2.55 3.954 5.94 3.954 9.546s-1.404 6.996-3.954 9.546c-0.293 0.293-0.677 0.439-1.061 0.439v0zM17.157 23.157c-0.384 0-0.768-0.146-1.061-0.439-0.586-0.586-0.586-1.535 0-2.121 2.534-2.534 2.534-6.658 0-9.192-0.586-0.586-0.586-1.536 0-2.121s1.535-0.586 2.121 0c3.704 3.704 3.704 9.731 0 13.435-0.293 0.293-0.677 0.439-1.061 0.439z"
          ></path>
          <path
            d="M13 30c-0.26 0-0.516-0.102-0.707-0.293l-7.707-7.707h-3.586c-0.552 0-1-0.448-1-1v-10c0-0.552 0.448-1 1-1h3.586l7.707-7.707c0.286-0.286 0.716-0.372 1.090-0.217s0.617 0.519 0.617 0.924v26c0 0.404-0.244 0.769-0.617 0.924-0.124 0.051-0.254 0.076-0.383 0.076z"
          ></path>
        </svg>

        <svg
          v-else
          style="width: 40rpx"
          fill="#b3a9a5"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 32 32"
          @click="switchSount(true)"
        >
          <path
            d="M30 19.348v2.652h-2.652l-3.348-3.348-3.348 3.348h-2.652v-2.652l3.348-3.348-3.348-3.348v-2.652h2.652l3.348 3.348 3.348-3.348h2.652v2.652l-3.348 3.348 3.348 3.348z"
          ></path>
          <path
            d="M13 30c-0.26 0-0.516-0.102-0.707-0.293l-7.707-7.707h-3.586c-0.552 0-1-0.448-1-1v-10c0-0.552 0.448-1 1-1h3.586l7.707-7.707c0.286-0.286 0.716-0.372 1.090-0.217s0.617 0.519 0.617 0.924v26c0 0.404-0.244 0.769-0.617 0.924-0.124 0.051-0.254 0.076-0.383 0.076z"
          ></path>
        </svg>
      </view>

      <u-icon
        name="reload"
        color="#b3a9a5"
        size="26"
        @click="onReloadHandler"
      ></u-icon>

      <view
        class="img-box"
        @click="jumpTo('/pages/personal-info/personal-info')"
      >
        <image
          src="/static/small-setting.png"
          style="width: 40rpx; height: 40rpx"
          mode="aspectFill"
        ></image>
      </view>
    </view>

    <!-- <view class="notify-box">
      hello
    </view> -->

    <notify-box></notify-box>

    <view class="info-box k-box" style="margin-top:20rpx;"  >
      <view class="balance">
        <view class="avaible_balance balance-item">
          <view class="txt">账户余额</view>
          <view class="value">{{ topList.availableBalance.toFixed(2) }}</view>
        </view>
        <view class="freeze_balance balance-item">
          <view>冻结金额</view>
          <view class="value">{{ topList.freezeBalance.toFixed(2) }}</view>
        </view>
      </view>

      <view class="nav">
        <view
          class="item"
          @click="
            jumpTo(
              '/pages/service-manager/service-income-info/service-income-info'
            )
          "
        >
          <image class="img" src="/static/imgs/nav-qr1.png" mode="aspectFill">
          </image>
          <text class="txt">收款码管理</text>
        </view>
        <view
          class="item"
          @click="jumpTo('/pages/service-apply-for/service-apply-for')"
        >
          <image
            class="img"
            src="/static/imgs/nav-qr2.png"
            mode="aspectFill"
          ></image>
          <text class="txt">提现申请</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { providerAccountSummary } from '@/api/user'

import { getDeviceType, isAndroidApp } from '@/utils'
import notifyBox from '../notify-box/notify-box.vue'

export default {
  components: { notifyBox },
  name: 'home-head',
  data() {
    return {
      //   topList: {
      //     accountStatus: 0,
      //     availableBalance: 0,
      //     freezeBalance: 0
      //   }
    }
  },
  mounted() {
    this.providerAccountSummary()
    uni.$on('refreshAccountInfo', this.providerAccountSummary)
  },
  beforeDestroy() {
    uni.$off('refreshAccountInfo', this.providerAccountSummary)
  },
  computed: {
    topList() {
      return this.$store.state.topList
    }
  },
  methods: {
    jumpTo(page) {
      uni.navigateTo({
        url: page
      })
    },
    onReloadHandler() {
      if (isAndroidApp()) {
        console.log('====AndroidBridge======', AndroidBridge)
        if (typeof AndroidBridge !== 'undefined') {
          AndroidBridge.refreshPage()
          console.log('刷新页面======AndroidBridge.refreshPage()=========');
        }
      } else {
        location.reload(true)
      }
    },
    switchSount(flag) {
      this.$store.commit('CHANGE_NofitySound', flag)
    },
    async providerAccountSummary() {
      let res = await providerAccountSummary(
        this.$store.state.userAccount.userId
      )
      if (res.data) {
        this.$store.state.topList = res.data
        this.$store.state.availableBalance = res.data.availableBalance
        this.$store.state.frozenBalance = res.data.freezeBalance
      }
    }
  }
}
</script>

<style lang="scss">
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
  .img-box {
    display: flex;
    align-items: center;
  }
}
.info-box {
  // display: flex;
  // justify-content: space-between;
  height: 243rpx;
  margin: 0 20rpx;

  .balance {
    display: flex;
    justify-content: space-between;
    height: 100rpx;
    margin: 0 40rpx 20rpx;
    padding-top: 20rpx;
    padding-bottom: 20rpx;
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
    margin: 10rpx 60rpx;
    padding-bottom: 10px;

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
</style>
