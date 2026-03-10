<template>
  <!-- paddingBottom: $store.state.tabBarHeight + 'rpx' -->
  <view
    class="container"
    :style="{
      paddingTop: $store.state.navBarHeight + 'rpx'
    }"
  >
    <custom-nav-bar title="聊天列表">
      <view
        slot="right"
        class="img-box"
        @click="handleChatSetting"
      >
        <u-icon name="setting-fill" size="22" color="#e3d3c7"  ></u-icon>
      </view>  
    </custom-nav-bar>

    <scroll-view
      class="chat-list"
      ref="scrollViewRef"
			:show-scrollbar="true"
      scroll-y
      :scroll-with-animation="true"
      @scrolltolower="onScrollToLower"
      lower-threshold="50"
    >
      <!-- :scroll-top="scrollTop" -->
      <!-- refresher-enabled :refresher-triggered="refreshTriggered" -->
      <!-- @refresherrefresh="onScrollRefresh()" -->

      <view class="chat-list-container">
        <!-- 聊天列表项循环展示 -->
        <view
          class="chat-item"
          v-for="(chat, index) in $store.state.allConversationList"
          :key="index"
          @click="goToChatDetail(chat)"
        >
          <view class="chat-item-header">
            <image
              :src="`/static/heads/icon${
                chat.avatar != null ? chat.avatar : 0
              }.png`"
              class="chat-avatar"
            ></image>
            <view class="chat-info">
              <view class="chat-title">{{ chat.title }}</view>
              <view class="chat-last-message">{{ chat.lastMessage }}</view>
            </view>
          </view>
          <view class="chat-item-footer">
            <view class="chat-time">{{ chat.time }}</view>
            <text class="msg-count" v-if="chat.msgCount" > {{chat.msgCount}} </text>
          </view>
        </view>
      </view>
      <!-- 底部加载状态提示 -->
      <view class="loading-status">
        <!-- 加载中 -->
        <view v-if="isLoading" class="loading-text">加载中...</view>
        <!-- 没有更多数据了 -->
        <view v-if="isNoMore" class="no-more-text">已经到底了哦~</view>
      </view>
    </scroll-view>
    <ChatSetting
      ref="chatSettingRef"
      @close="showChatSetting = false"
      v-if="showChatSetting"
    ></ChatSetting>
  </view>
</template>

<script>
import { getHistoryConversation } from '@/api/chat.js'

import {getLastMsg, getLastTime} from '@/utils/chat.js'
import { webSocketService } from '@/utils/websocket.js'

import ChatSetting from './ChatSetting.vue'

export default {
  name: 'ChatList',
  components: {
    ChatSetting
  },
  data() {
    return {
      // 模拟聊天列表数据
      chatList: [
      ],

      scrollTop: 0,
      refreshTriggered: false,
      showChatSetting:false,
      page: {
        pageSize: 20,
        pageNum: 1
      },
      total: 0, // 总共多少个
      isLoading: false, // 是否正在加载
      isNoMore: false, // 是否没有更多数据
      isRefreshing: false // 是否正在刷新（虽然不需要下拉刷新，但防抖可能需要）
    }
  },

  mounted() {
   console.log('----mounted---')
  
  },
  beforeDestroy() {
    console.log('----beforeDestroy---')
    // 更新红点数目
    this.$store.dispatch('getNewMessageCount')
  },
  onShow(){
    console.log('---onShow------');
    webSocketService.connentIfy()
    this.getList()
  },
  methods: {
    handleChatSetting() {
      this.showChatSetting = true
      // this.$refs.chatSettingRef.showChatSetting()
      // this.closeChat()
    },
    goToChatDetail(chat) {
			console.log('======chat====', chat);
      
      this.$store.state.currChatOrderId = chat.orderId
      this.$store.state.currConversation = chat

      uni.navigateTo({
        url: `/pages/chat-client/chat-client?chatTitle=${chat.title}`
      })
    },
    // scroll-view 触底事件
    onScrollToLower() {
      console.log('-----onScrollToLower----')
      // 防抖：防止重复请求:cite[7]
      if (this.isLoading || this.isNoMore) {
        return
      }
      this.page.pageNum++
      this.getList()
    },
    // 获取列表数据
    async getList() {
      // 防止重复请求
      if (this.isLoading) return
      this.isLoading = true
      try {
        this.$store.commit('setLoadingEnable', false)
        const providerId = this.$store.state.personalInfo.providerId
        const response = await getHistoryConversation(providerId, this.page)

        // 假设返回的数据格式为 { data: { list: [], total: 100 } }
        const newList = response.data.list || []
        // 补充 newList
        newList.forEach((ele) => {
          // 最近一条消息
          ele.lastMessage = getLastMsg(ele.lastMessageData.data.content)
					ele.title = `${ele.payeeAccountName} : ${ele.productName} : ${ele.orderId}`
					ele.time = getLastTime(ele.lastMessageTime)
					ele.msgCount = ele.conversationUnreadMessageCount
        })

        this.total = response.data.total || 0

        if (this.page.pageNum === 1) {
          this.chatList = newList
        } else {
          this.chatList = [...this.chatList, ...newList]
        }

        // 保存至仓库
        this.$store.state.allConversationList = this.chatList

        // 判断是否还有更多数据
        if (this.chatList.length >= this.total) {
          this.isNoMore = true
        }
      } catch (error) {
        console.error('获取数据失败:', error)
        // 失败时页码减一
        if (this.page.pageNum > 1) {
          this.page.pageNum--
        }
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      } finally {
        this.isLoading = false
        this.isRefreshing = false
      }
    },

    // onScrollRefresh() {
    //     this.refreshTriggered = true
    //     setTimeout(() => {
    //         this.refreshTriggered = false
    //         this.$nextTick(() => {
    //             this.scrollTop = this.scrollTop == 0 ? 1 : 0
    //         })

    //     }, 1000)
    // },
  }
}
</script>

<style lang="scss" scoped>

.img-box{
  display: flex;
  justify-content: center;
}


.chat-list {
  height: 100%;
  background-color: #eff4ff;
}

.chat-list-container {
  // background-color: #eff4ff;
  padding: 10px;
}

.chat-item {
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  border-bottom: 4rpx solid #f5f5f5;
  padding: 10px;
  border-radius: 20rpx;
  margin-bottom: 10rpx;
}

.chat-item-header {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.chat-avatar {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  margin-right: 10px;
}

.chat-info {
  flex: 1;
}

.chat-title {
  font-size: 28rpx;
  font-weight: 500;
}

.chat-last-message {
  font-size: 24rpx;
  color: #666;
}

.chat-item-footer {
  text-align: right;
  font-size: 24rpx;
  color: #999;
  .msg-count {
    padding: 0 10rpx;
    background-color: #ff3f33;
    color: white;
    border-radius: 16rpx;
  }
}

.loading-status {
  padding: 30rpx;
  text-align: center;
  color: #999;
}
.loading-text,
.no-more-text {
  font-size: 28rpx;
}


::v-deep .chat-list ::-webkit-scrollbar {
  display: block !important;
  width: 8px;
  opacity: 1;
  visibility: visible;
}

</style>
