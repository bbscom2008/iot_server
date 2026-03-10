<template>
  <view class="nav-bar" :class="isShowUi?'isShowUi':'noui'" :style="{
      height: navBarHeight + 'rpx',
      paddingTop: statusBarHeight + 'rpx',
    }">
    <view class="nav-bar-content" :style="{ height: navBarContentHeight + 'rpx' }">
      <view class="left" style="margin-top: 30rpx">
        <slot name="left">
          <view v-if="showBackButton" class="back-btn" @click="handleBack">
            <uni-icons type="left" size="20" color="#fff" class="back-icon"></uni-icons>
          </view>
        </slot>
      </view>
      <view class="center">
        <slot name="center">
            <text v-if="title" class="title">
              {{ title }}
            </text>
          <slot v-else  name="title">
          </slot>
        </slot>
      </view>
      <view class="right">
        <slot name="right"></slot>
      </view>
    </view>
  </view>
</template>

<script>
	
	
  import {
    routerHistory,	navBack
  } from '@/utils/router'



  export default {
    props: {
      title: {
        type: String,
        default: ''
      }
    },
    computed: {},
    data() {
      return {
        statusBarHeight: 0,
        showBackButton: false,
        navBarHeight: 0,
        navBarContentHeight: 88 // 导航栏内容高度，一般为44rpx
      }
    },
    mounted() {
      this.checkBackButton()
    },
    created() {
      const systemInfo = uni.getSystemInfoSync()
      this.statusBarHeight = systemInfo.statusBarHeight
      // 高度 = 状态栏高度 + 导航栏内容高度
      this.navBarHeight = this.statusBarHeight + this.navBarContentHeight

      this.$store.state.navBarHeight = this.navBarHeight

      console.log('-----this.navBarHeight---', this.navBarHeight)
    },
    methods: {
			handleBack(){
				navBack()
			},
      checkBackButton() {
        const pages = getCurrentPages()
        const history = routerHistory.getHistory()

        // 显示条件：有页面栈或有历史记录
        this.showBackButton = pages.length > 1 || history.length > 0
      },
     
    }
  }
</script>

<style scoped>
  .nav-bar {
    width: 100%;

    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
  }

  .noui {
    background: #4792f3;
    box-shadow: 0 1px 0 0 #4792f3;
  }

  .isShowUi {
    background: #232738;
    box-shadow: 0 1px 0 0 #232738;
    border-radius: 0 0 40rpx 40rpx;
  }

  .nav-bar-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 30rpx;
  }

  .left,
  .right {
    width: 160rpx;
  }

  .center {
    flex: 1;
    text-align: center;
  }

  .title {
    font-size: 32rpx;
    font-weight: bold;
    /* color: #333; */
    color: white;
  }

  .back-btn {
    width: 100rpx;
    display: flex;
    align-items: center;
  }

  .back-icon {
    width: 72rpx;
    height: 72rpx;
  }
</style>