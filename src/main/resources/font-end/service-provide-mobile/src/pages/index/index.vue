<template>
  <view>
    <!-- 页面内容 -->
    <view
      class="content"
      style="height: calc(100vh - 190rpx)"
      :style="{
        paddingTop: saveTopArea + 'rpx',
        height: `calc(100vh - ${$store.state.tabBarHeight}rpx)`
      }"
    >
      <!-- :style="{paddingTop: currentTab == 1? '0rpx' : navBarHeight + 'rpx', paddingBottom: tabBarHeight + 'rpx'}" > -->
      <!-- 页面内容 -->
      <!-- <template v-if="isShowUi"> -->
      <view v-if="currentTab == 0" style="height: 100%">
        <Home></Home>
      </view>

      <view v-if="currentTab == 1" style="height: 100%">


        <template v-if="$store.state.isChatRoomMode == 1">
          <ChatRoomOrder></ChatRoomOrder>
        </template>
        <template v-else>
          <CollectOrder
            isInTab
            v-if="$store.state.tabOrderType == 0"
          ></CollectOrder>
          <AgentPay isInTab v-if="$store.state.tabOrderType == 1"></AgentPay>
        </template>

      </view>

      <view v-if="currentTab == 3" style="height: 100%">
        <AcceptOrder></AcceptOrder>
      </view>

      <view v-if="currentTab == 4" style="height: 100%">
        <My></My>
      </view>
      <!-- </template> -->

      <!-- <template v-else>
                <view v-if="currentTab == 0" style="height: 100%;">
                    <Home></Home>
                </view>
                <view v-if="currentTab == 1" style="height: 100%;">
                    <CollectOrder isInTab></CollectOrder>
                </view>
                <view v-if="currentTab == 2" style="height: 100%;">
                    <AgentPay isInTab></AgentPay>
                </view>
                <view v-if="currentTab == 3" style="height: 100%;">
                    <AcceptOrder isInTab></AcceptOrder>
                </view>
                <view v-if="currentTab == 4" style="height: 100%;">
                    <ChatClient></ChatClient>
                </view>
                <view v-if="currentTab == 5" style="height: 100%;">
                    <My></My>
                </view>
            </template> -->
    </view>
    <ChatCompent></ChatCompent>
    <!-- 自定义 Tab 栏 -->
    <custom-tab-bar :current.sync="currentTab"></custom-tab-bar>
  </view>
</template>

<script>
import CustomNavBar from '@/components/custom-nav-bar/index.vue'
import CustomTabBar from '@/components/custom-tab-bar/index.vue'
import ChatCompent from '@/pages/chat-client/ChatCompent/index.vue'

import Home from '@/pages/home/home.vue'
import Check from '@/pages/check/check.vue'

import CollectOrder from '@/pages/order/collect-order/collect-order.vue'

import AgentPay from '@/pages/order/agent-pay/agent-pay.vue'
import ChatClient from '@/pages/chat-client/chat-list.vue'

import AcceptOrder from '@/pages/order/payment-accept-order/payment-accept-order'

import receiveOrder from '@/pages/receive-order/receive-order.vue'
import My from '@/pages/my/my.vue'

import { mapState } from 'vuex'

import ChatRoomOrder from '@/pages/order/chat-room-order/chat-room-order.vue'

export default {
  components: {
    CustomNavBar,
    ChatCompent,
    CustomTabBar,
    ChatClient,
    AcceptOrder,
    CollectOrder,
    Home,
    AgentPay,
    Check,
    receiveOrder,
    My,
    ChatRoomOrder
  },
  data() {
    return {
      navBarHeight: 0,
      saveTopArea: 0
    }
  },
  computed: {
    currentTab: {
      get() {
        return this.$store.state.tabIndex
      },
      set(val) {
        this.$store.commit('setTabIndex', val)
      }
    },
    ...mapState(['tabBarHeight'])
    
  },
  onLoad(options) {
    // 获取导航栏高度
    const systemInfo = uni.getSystemInfoSync()
    console.log('systemInfo', systemInfo)

    this.navBarHeight = systemInfo.statusBarHeight + 88
    this.saveTopArea = systemInfo.statusBarHeight

    this.$store.state.saveHeight = systemInfo.safeArea
    this.$store.state.statusBarHeight = systemInfo.statusBarHeight
    this.$store.state.navBarHeight = this.navBarHeight
    console.log('------this.navBarHeight------', this.navBarHeight)

    // console.log('---onLoad----', options)
    // if (options.tab) {
    //   this.currentTab = Number(options.tab)
    // }
  }
}
</script>

<style>
.content {
  /* min-height: 100vh; */
  box-sizing: border-box;
  overflow: hidden;
}
</style>
