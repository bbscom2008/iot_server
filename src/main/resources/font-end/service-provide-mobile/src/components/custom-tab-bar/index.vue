<template>
  <!-- 没有UI 的 -->
  <view v-if="!isShowUi" class="noUi tab-bar" :style="{ paddingBottom: safeAreaInsets.bottom + 'rpx' }">
    <view v-for="(item, index) in list" :key="index" class="tab-bar-item" @click="switchTab(item, index)">
      <image :src="current === index ? item.selectedIconPath : item.iconPath" class="tab-bar-icon" />
      <text :class="['tab-bar-text', current === index ? 'active' : '']">
        {{ item.text }}
      </text>
    </view>
  </view>

  <!-- 有 UI 效果的 -->
  <view v-else class="isShowUi">
    <view class="tab-bar" :style="{ paddingBottom: safeAreaInsets.bottom + 'rpx' }">
      <view class="tab-bar-item" @click="switchTab(list2[0], 0)">
        <!-- :src="current === 0 ? list2[0].selectedIconPath : list2[0].iconPath" -->
        <view :style="{
            backgroundImage:
              current === 0
                ? `url(${list2[0].selectedIconPath})`
                : `url(${list2[0].iconPath})`
          }" class="tab-bar-icon tab0"></view>
        <text :class="['tab-bar-text', current === 0 ? 'active' : '']">
          {{ list2[0].text }}
        </text>
      </view>

      <view class="tab-bar-item" @click="switchTab(list2[1], 1)" style="margin-right: 200rpx">
        <image :src="current === 1 ? list2[1].selectedIconPath : list2[1].iconPath" class="tab-bar-icon" />
        <text :class="['tab-bar-text', current === 1 ? 'active' : '']">
          {{ list2[1].text }}
        </text>
      </view>

      <view class="tab-bar-center" @click="switchTab(list2[2], 2)">
        <image :src="!$store.state.isReceiveOrder ? list2[2].selectedIconPath : ''"
            :style="{backgroundColor:$store.state.isReceiveOrder?'red':''}"
         class="tab-bar-icon" />
        <view class="txt" :style="{ color:$store.state.isReceiveOrder?'white':'#333' }"  >
          {{ $store.state.isReceiveOrder ? '停止接单' : '开始接单' }}
        </view>
      </view>

      <view class="tab-bar-item" @click="switchTab(list2[3], 3)">
        <image :src="current === 3 ? list2[3].selectedIconPath : list2[3].iconPath" class="tab-bar-icon" />
        <text :class="['tab-bar-text', current === 3 ? 'active' : '']">
          {{ list2[3].text }}
        </text>
      </view>

      <view class="tab-bar-item" @click="switchTab(list2[4], 4)">
        <image :src="current === 4 ? list2[4].selectedIconPath : list2[4].iconPath" class="tab-bar-icon" />
        <text :class="['tab-bar-text', current === 4 ? 'active' : '']">
          {{ list2[4].text }}
        </text>
      </view>

      <view class="tips" v-if="showTips">
        <view class="txt">
          <view>人不在线或无法确认已支付的码，请停止接单。系统检测恶意超时将封号！</view>
          <view>掉单严重或不及时确认已支付，封号整个团队！</view>
        </view>
        <image class="img" src="/static/imgs/close.png" style="width: 32rpx; height: 32rpx" @click="closeShowTips"
          mode=""></image>
      </view>
    </view>
  </view>
</template>

<script>
  
  import {
    getUpdateCollectAndPayment
  } from '@/api/user'
  
  
  export default {
    props: {
      current: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        safeAreaInsets: uni.getSystemInfoSync().safeAreaInsets,
        list: [{
            pagePath: '/pages/home/home',
            text: '首页',
            iconPath: '/static/tab_icons/home.png',
            selectedIconPath: '/static/tab_icons/home-active.png'
          },
          {
            pagePath: '/pages/cate/cate',
            text: '代收',
            iconPath: '/static/tab_icons/cate.png',
            selectedIconPath: '/static/tab_icons/cate-active.png'
          },
          {
            pagePath: '/pages/cart/cart',
            text: '代付',
            iconPath: '/static/tab_icons/cart.png',
            selectedIconPath: '/static/tab_icons/cart-active.png'
          },
          {
            pagePath: '/pages/order/payment-accept-order/payment-accept-order',
            text: '抢单',
            iconPath: '/static/tab_icons/cart.png',
            selectedIconPath: '/static/tab_icons/cart-active.png'
          },
          {
            pagePath: '/pages/chat-client/chat-client',
            text: '客服',
            iconPath: '/static/tab_icons/my.png',
            selectedIconPath: '/static/tab_icons/my-active.png'
          },
          {
            pagePath: '/pages/my/my',
            text: '我的',
            iconPath: '/static/tab_icons/my.png',
            selectedIconPath: '/static/tab_icons/my-active.png'
          }
        ],
        list2: [{
            pagePath: '/pages/home/home',
            text: '首页',
            iconPath: '/static/tab_icons/tab0.png',
            selectedIconPath: '/static/tab_icons/tab0-act.png'
          },
          {
            pagePath: '/pages/cate/cate',
            text: '订单',
            iconPath: '/static/tab_icons/tab1.png',
            selectedIconPath: '/static/tab_icons/tab1-act.png'
          },
          // {
          // 	"pagePath": "/pages/cart/cart",
          // 	"text": "代付",
          // 	"iconPath": "/static/tab_icons/cart.png",
          // 	"selectedIconPath": "/static/tab_icons/cart-active.png"
          // },
          {
            pagePath: '/pages/order/payment-accept-order/payment-accept-order',
            text: '',
            iconPath: '/static/tab_icons/tab-center.png',
            selectedIconPath: '/static/tab_icons/tab-center.png'
          },
          {
            pagePath: '/pages/chat-client/chat-client',
            text: '抢单',
            iconPath: '/static/tab_icons/tab2.png',
            selectedIconPath: '/static/tab_icons/tab2-act.png'
          },
          {
            pagePath: '/pages/my/my',
            text: '我的',
            iconPath: '/static/tab_icons/tab3.png',
            selectedIconPath: '/static/tab_icons/tab3-act.png'
          }
        ],

        showTips: false,
        // isReceiveOrder: false,
      }
    },
    watch: {
      '$store.state.isReceiveOrder': {
        handler(newV, oldV) {
          if (newV) {
            this.showTips = true
          }
        }
      }
    },
    created() {
      if (this.isShowUi) {
        this.$store.state.tabBarHeight = this.safeAreaInsets.bottom + 164
      } else {
        this.$store.state.tabBarHeight = this.safeAreaInsets.bottom + 100
      }
    },
    methods: {
      closeShowTips() {
        this.showTips = false
      },

      async switchOrder() {

    console.log('--------switchOrder-----------');
        try {
          const oldV = this.$store.state.isReceiveOrder
          await getUpdateCollectAndPayment(
            this.$store.state.userAccount.userId, {
              isCollectEnable: !oldV,
              isPaymentEnable: !oldV
            }
          )
          this.$store.commit('update_receive_order', !this.$store.state.isReceiveOrder)
          this.showTips = this.$store.state.isReceiveOrder
        } catch (e) {
          console.log(e);
        }


      },

      switchTab(item, index) {
        // uni.switchTab({
        // 	url: item.pagePath
        // })

        // 如果是showui 而且 inndex == 2
        if (this.isShowUi && index == 2) {
          this.switchOrder()
          return
        }

        if (this.current === index) return

        this.$emit('update:current', index)
        console.log('---safeAreaInsets--', this.safeAreaInsets)
      }
    }
  }
</script>

<style lang="scss"  >
  // @import url(./tab.scss);
  // @import url(./tab2.scss);
  
  .isShowUi {
   
    .tab-bar {
     position: fixed;
     bottom: 0;
     left: 0;
     right: 0;
     height: 166rpx;
      // background: #232738;
      background-color: #efefef;
      display: flex;
      justify-content: space-around;
      align-items: center;
      background-image: url(/static/tab_icons/tab-bg.png);
      background-size: contain;
      background-repeat: no-repeat;
      z-index: 10;
    }
  
   .tab0{
        background-size: 175%;
        background-position-x: -36rpx;
        background-position-y: -14rpx;
      }
      
    .tab-bar-center{
      position: absolute;
      left: 50%;
      top: -14rpx;
      transform: translateX(-50%);
      
      .tab-bar-icon{
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
        // border: 20rpx solid #efefef;
      }
     
      
      .txt{
        line-height: 30rpx;
        position: absolute;
        top: 0%;
        left: 0;
        width: 60rpx;
        height: 60rpx;
        font-size: 24rpx;
        margin-top: 20rpx;
        margin-left: 26rpx;
      }
      .red{
        font-weight: 600;
        color: #EA443B;
      }
      
    }
    .tab-bar-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
  
      .tab-bar-icon {
        width: 48rpx;
        height: 48rpx;
      }
  
      .tab-bar-text {
        font-size: 24rpx;
        margin-top: 8rpx;
        color: #666;
      }
  
      .tab-bar-text.active {
        color: #E0C4B2;
      }
    }
    
    .tips{
      // display: flex;
      position: absolute;
      top: -130rpx;
      left: 50%;
      font-size: 20rpx;
      background-color: rgba(0, 0, 0, .7);
      width: calc(100vw - 40rpx);
      box-sizing: border-box;
      height: 100rpx;
      transform: translate(-50%, 0);
      color: #FFFFFF;
      padding: 10rpx 14rpx 10rpx 6rpx;
      border-radius: 20rpx;
      .txt{
        text-align: center;
      }
      .img{
        position: absolute;
        top: 15rpx;
        right: 6rpx;
      }
      &::after{
        content: '';
        position: absolute;
        width: 0px;
        height: 0px;
        top: 100%;
        left: 50%;
        transform: translate(-50%, -1rpx);
        border-top: 20rpx solid rgba(0, 0, 0, .7);
        border-left: 20rpx solid transparent;
        border-right: 20rpx solid transparent;
      }
    }
    
  }
  
</style>