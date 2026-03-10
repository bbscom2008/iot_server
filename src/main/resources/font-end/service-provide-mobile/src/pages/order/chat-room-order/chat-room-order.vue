<template>
  <!-- paddingBottom: $store.state.tabBarHeight + 'rpx' -->
  <view
    class="container"
    :style="{
      paddingTop: $store.state.navBarHeight + 'rpx'
    }"
  >
    <custom-nav-bar title="订单列表"> </custom-nav-bar>

    <scroll-view
      class="chat-list"
      ref="scrollViewRef"
      :show-scrollbar="true"
      scroll-y
      :scroll-with-animation="true"
      @scrolltolower="onScrollToLower"
      lower-threshold="50"
      refresher-enabled
      :refresher-triggered="refreshTriggered"
      @refresherrefresh="onScrollRefresh"
    >
      <!-- 搜索框 -->

      <view class="search-container">
        <uni-easyinput
          v-model="queryFormData.systemOrderNo"
          placeholder="请输入订单号"
          class="search-input"
        />
        <view class="search-btn" @click="onSearch">搜索</view>
      </view>
      <view class="chat-list-container">
        <!-- 聊天列表项循环展示 -->
        <view
          class="chat-item"
          v-for="(chat, index) in $store.state.allConversationList"
          :key="index"
          @click="goToChatDetail(chat)"
        >
          <view class="chat-item-left">
            <!-- 第一行：订单号和时间 -->
            <view class="order-info">
              <text class="order-number"
                ><text class="order-number-label">订单号：</text
                >{{ chat.orderId }}</text
              >
              <text class="order-time"
                ><text class="order-time-label">时间：</text
                >{{ chat.time }}</text
              >
            </view>

            <!-- 第二行：支付方式、金额、状态 -->
            <view class="payment-info">
              <text class="payment-method">{{ chat.paymentMethod || '--' }}</text>
              <text class="payment-amount">¥{{ chat.orderAmount || '--' }}</text>
              <text class="payment-status">
                <u-tag size="mini" :text="chat.orderStatusStr" :type="chat.orderStatusType" style="align-items: self-end;" >
            </u-tag>
              </text>

               


              <text class="msg-count-box">

                <text class="msg-count" v-if="chat.msgCount>0">{{ chat.msgCount }}</text> 

              </text>
            </view>
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
  </view>
</template>

<script>
import { getHistoryConversation } from '@/api/chat.js'

import { getLastMsg, getLastTime } from '@/utils/chat.js'
import {orderStateOptions, paymentMethods} from '@/utils/constants.js'


export default {
  name: 'ChatList',
  data() {
    return {
      paymentMethods,
      orderStateOptions,
      queryFormData: this.getQueryForm(),
      // 模拟聊天列表数据
      chatList: [],

      scrollTop: 0,
      refreshTriggered: false,
      showChatSetting: false,
      page: {
        pageSize: 10,
        pageNum: 1
      },
      total: 0, // 总共多少个
      isLoading: false, // 是否正在加载
      isNoMore: false, // 是否没有更多数据
      isRefreshing: false // 是否正在刷新（虽然不需要下拉刷新，但防抖可能需要）
    }
  },

  beforeDestroy() {
    console.log('----beforeDestroy---')
    // 更新红点数目
    this.$store.dispatch('getNewMessageCount')
  },

  created() {
    this.getList()
  },
  methods: {
    getQueryForm() {
      return {
        systemOrderNo: ''
      }
    },
    goToChatDetail(chat) {
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

    // 下拉刷新事件
    onScrollRefresh() {
      console.log('-----onScrollRefresh----')
      // 防止重复刷新
      if (this.isRefreshing) {
        return
      }

      this.refreshTriggered = true
      this.isRefreshing = true

      // 重置分页参数
      this.page.pageNum = 1
      this.isNoMore = false

      // 重新获取数据
      this.getList().finally(() => {
        // 延迟关闭刷新状态，让用户看到刷新效果
        setTimeout(() => {
          this.refreshTriggered = false
          this.isRefreshing = false
        }, 500)
      })
    },

    formatTime(time) {
      const date = new Date(time)
      // 格式化时间  月：日 时：分
      // 补足2位数字
      const month = date.getMonth() + 1
      const day = date.getDate()
      const hours = date.getHours()
      const minutes = date.getMinutes()
      return (
        month.toString().padStart(2, '0') +
        '-' +
        day.toString().padStart(2, '0') +
        ' ' +
        hours.toString().padStart(2, '0') +
        ':' +
        minutes.toString().padStart(2, '0')
      )
    },
    onSearch(){
      const orderId = this.queryFormData.systemOrderNo
      this.page = {
        pageSize: 10,
        pageNum: 1
      }
      this.getList(orderId)
    },
    // 获取列表数据
    async getList(orderId) {
      // 防止重复请求（除非是刷新操作）
      if (this.isLoading && !this.isRefreshing) return
      this.isLoading = true

      try {
        this.$store.commit('setLoadingEnable', false)
        const providerId = this.$store.state.personalInfo.providerId
        const response = await getHistoryConversation(providerId, this.page, orderId)

        // 假设返回的数据格式为 { data: { list: [], total: 100 } }
        const newList = response.data.list || []
        // 补充 newList
        newList.forEach((ele) => {
          // 最近一条消息
          ele.lastMessage = getLastMsg(ele.lastMessageData.data.content)
          ele.time = this.formatTime(ele.lastMessageTime)
          ele.msgCount = ele.conversationUnreadMessageCount

          let orderItem = this.orderStateOptions.find(item=>item.value == ele.orderStatus)
          ele.orderStatusStr = orderItem?orderItem.label:'--'
          ele.orderStatusType = orderItem?orderItem.type:''

          ele.payerName = JSON.parse(ele.payerName || '{}')
          if(ele.payerName && ele.payerName.paymentId){
            ele.paymentMethod = this.paymentMethods.find(item=>item.id == ele.payerName.paymentId).name
          }else{
            ele.paymentMethod =  '--'
          } 


        })

        this.total = response.data.total || 0

        // 如果是第一页（刷新或首次加载），替换数据；否则追加数据
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

        // 刷新成功提示
        if (this.isRefreshing) {
          uni.showToast({
            title: '刷新成功',
            icon: 'success',
            duration: 1000
          })
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
        // 注意：isRefreshing 在 onScrollRefresh 的 finally 中处理
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.img-box {
  display: flex;
  justify-content: center;
}
.search-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10rpx;
  padding: 20rpx 20rpx 0;
  .search-input {
    height: 70rpx;
    ::v-deep .uni-easyinput__content {
      border-radius: 70rpx !important;
    }
  }
  .search-btn {
    border-radius: 70rpx;
    padding: 6rpx 20rpx;
    background-image: linear-gradient(
      to right,
      #edd0be 0%,
      #fff6ed 50%,
      #ae9281 100%
    );
    color: #232738;
  }
}
.chat-list {
  height: 100%;
  background-color: #efefef;
}
.chat-list-container {
  padding: 20rpx;
}
.chat-item {
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  border-bottom: 1rpx solid #f0f0f0;
  margin-bottom: 20rpx;
}

.chat-item-left {
  display: flex;
  font-size: 28rpx;
  flex-direction: column;
  padding: 10rpx 20rpx;
  background-color: #fff;
  width: 100%;
}

.order-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15rpx;
  .order-number-label,
  .order-time-label {
    color: #999;
  }
}

.order-number,
.order-time {
  color: #000;
  font-weight: normal;
}

.payment-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .payment-method {
    flex: 2;
    color: #409eff;
  }

  .payment-amount {
    flex: 2;
    color: #ff0000;
    text-align: center;
    font-weight: bold;
  }

  .payment-status {
    flex: 2;
    text-align: right;
    color: #409eff;
  }

  .msg-count-box {
    flex: 1;
    text-align: right;
    font-size: 20rpx;
    font-weight: 600;
    .msg-count {
      padding: 0 10rpx;
      background-color: #ff3f33;
      color: white;
      border-radius: 16rpx;
    }
  }
}

.loading-status {
  padding: 10rpx;
  text-align: center;
  color: #999;
}
.loading-text,
.no-more-text {
  font-size: 24rpx;
}

::v-deep .chat-list ::-webkit-scrollbar {
  display: block !important;
  width: 8px;
  opacity: 1;
  visibility: visible;
}
</style>
