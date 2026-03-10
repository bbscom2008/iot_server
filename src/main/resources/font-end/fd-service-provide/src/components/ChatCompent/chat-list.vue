<template>
  <!-- paddingBottom: $store.state.tabBarHeight + 'rpx' -->
  <div class="container-box">
    <div
      class="chat-list"
      v-scroll="{
        onReachBottom: onScrollToLower
      }"
    >
      <!-- 在列表的头部加一个搜索框，和搜索按钮 -->
      <div class="search-box">
        <el-dropdown
          class="avatar-container right-menu-item hover-effect"
          :hide-on-click="false"
          trigger="click"
        >
          <i class="el-icon-s-tools setting"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <el-checkbox v-model="isFilterClose">不显示关闭的订单</el-checkbox>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <el-input
          v-model="inputOrderId"
          placeholder="搜索订单ID"
          @keyup.enter.native="searchOrderIdHandler"
        >
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <el-button type="primary" @click="searchOrderIdHandler">搜索</el-button>
      </div>

      <div class="chat-list-container">
        <!-- 聊天列表项循环展示 -->
        <div
          class="chat-item"
          :class="{
            'curr-item':
              $store.state.chat.currConversation &&
              chat.conversationId === $store.state.chat.currConversation.conversationId
          }"
          v-for="(chat, index) in $store.state.chat.allConversationList"
          :key="index"
          @click="goToChatDetail(chat)"
        >
          <div class="chat-item-header">
            <!-- <img :src="require(`@/assets/heads/icon${chat.avatar != null ? chat.avatar : 0
              }.png`)" class="chat-avatar" /> -->

            <div class="chat-info">
              <div class="chat-title">
                <span>订单号：</span>
                <span>{{ chat.title }}</span>
                <span  class="msg-count ml-10" v-if="chat.msgCount"> {{ chat.msgCount }} </span>
              </div>

              <div class="chat-last-message">
                <span>{{ chat.paymentMethod }}</span>
                <span class="red">{{ chat.orderAmount }}</span>
                <el-tag :type="chat.orderStatusType">{{ chat.orderStatusStr }}</el-tag>
                <!-- <span class="last-msg" >{{ chat.lastMessage }}</span> -->
                <!-- <el-tag  >{{ chat.payerName }}</el-tag>
                <el-tag type="chat.orderStatus.type" >{{ chat.orderStatus?chat.orderStatus.label:'' }}</el-tag> -->
              </div>
            </div>
          </div>
          <div class="chat-item-footer">
            <div class="chat-time">{{ chat.time }}</div>

            <div>
              

              <span style="font-size: 10px; color: #c00" v-if="chat.status == 'CLOSE'">已关闭</span>
              <el-tag type="danger" v-else @click="closeChat(chat)">关闭</el-tag>

            </div>
          </div>
        </div>
      </div>
      <!-- 底部加载状态提示 -->
      <div class="loading-status">
        <!-- 加载中 -->
        <div v-if="isLoading" class="loading-text">加载中...</div>
        <!-- 没有更多数据了 -->
        <div
          v-if="isNoMore && $store.state.chat.allConversationList.length > page.pageSize"
          class="no-more-text"
        >
          没有数据了哦~
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { paymentMethods, orderStateOptions } from '@/utils/constants.js'
import { getHistoryConversation } from '@/api/chat.js'

import { getLastMsg, getLastTime } from '@/utils/chat.js'
import { webSocketService } from '@/utils/websocket.js'

import { closeConversation } from '@/api/chat.js'

export default {
  data() {
    return {
      inputOrderId: '',
      paymentMethods,
      orderStateOptions,
      isFilterClose: false,
      // 模拟聊天列表数据
      chatList: [],

      scrollTop: 0,
      refreshTriggered: false,

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
    console.log('---onShow------')
    webSocketService.connentIfy()
    this.getList()

    this.$eventBus.$on('flushChatList', this.getList)
  },

  beforeDestroy() {
    this.$eventBus.$off('flushChatList', this.getList)
  },

  created() {
    const isFilterClose = localStorage.getItem('chat_isFilterClose')
    if (isFilterClose !== null) {
      this.isFilterClose = isFilterClose === 'true'
    }
  },
  watch: {
    // 监听 全部会话列表 变化
    '$store.state.chat.flushChatListFlag'(newVal) {
      console.log('---watch flushChatListFlag------', newVal)
      this.getList()
    },
    isFilterClose(newV, oldV) {
      console.log('---watch isFilterClose------', newV, oldV)
      this.page.pageNum = 1
      localStorage.setItem('chat_isFilterClose', newV)
      this.getList()
    }
  },
  methods: {
    closeChat(chat) {
      this.$confirm('确定要关闭该会话吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 这里调用接口关闭会话
        await closeConversation(chat.conversationId)

        this.$message({
          message: '聊天室已关闭',
          type: 'success'
        })

        // 刷新列表
        this.getList()

        // 如果关闭的会话是当前正在聊天的会话，则退出聊天详情页
        const currConversation = this.$store.state.chat.currConversation
        if (currConversation && currConversation.conversationId === chat.conversationId) {
          this.$eventBus.$emit('exitChatRoom') // 关闭会话后刷新列表
        }
      })
    },
    searchOrderIdHandler() {
      console.log('-----searchOrderIdHandler----', this.inputOrderId)
      this.page.pageNum = 1
      this.getList()
    },
    // 模拟跳转到聊天详情页面
    goToChatDetail(chat) {
      // if(chat.status == 'CLOSE'){

      // 	this.$alert('该会话已关闭', '警告', {
      //     confirmButtonText: '确定',
      //   });

      // 	return
      // }

      chat.msgCount = 0 // 将消息未读数清零

      this.$store.state.chat.currChatOrderId = chat.orderId
      this.$store.state.chat.currConversation = chat

      this.$eventBus.$emit('show-chat', chat)
    },
    // scroll-div 触底事件
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
        this.$store.commit('app/setLoadingEnable', false)
        const providerId = this.$store.state.user.personalInfo.providerId
        const isFilterClose = this.isFilterClose ? 1 : 0 // 是否过滤已关闭的会话
        const response = await getHistoryConversation(
          { providerId, isFilterClose },
          this.page,
          this.inputOrderId
        )

        // 假设返回的数据格式为 { data: { list: [], total: 100 } }
        const newList = response.data.list || []
        // 补充 newList
        newList.forEach((ele) => {
          // 最近一条消息

          try {
            // ele.title = `${ele.payeeAccountName} : ${ele.productName} : ${ele.orderId}`
            ele.lastMessage = getLastMsg(ele.lastMessageData.data.content)
            ele.title = `${ele.orderId}`
            ele.time = this.formatTime(ele.lastMessageTime)
            ele.msgCount = ele.conversationUnreadMessageCount

            ele.orderAmount = `￥${ele.orderAmount ? ele.orderAmount.toFixed(2) : ''}`

            let orderItem = this.orderStateOptions.find((item) => item.value == ele.orderStatus)
            ele.orderStatusStr = orderItem ? orderItem.label : '未知状态'
            ele.orderStatusType = orderItem ? orderItem.type : 'info'

            // ele.payerName = ele.payerName?this.paymentMethods.find(item => item.id === JSON.parse(ele.payerName).paymentId).name:'未知'
            ele.payerName = JSON.parse(ele.payerName || '{}')
            if (ele.payerName && ele.payerName.paymentId) {
              ele.paymentMethod = this.paymentMethods.find(
                (item) => item.id == ele.payerName.paymentId
              ).name
            } else {
              ele.paymentMethod = '--'
            }
          } catch (e) {
            console.log(e)
          }
        })

        this.total = response.data.total || 0

        if (this.page.pageNum === 1) {
          this.chatList = newList
        } else {
          this.chatList = [...this.chatList, ...newList]
        }

        // 保存至仓库
        this.$store.state.chat.allConversationList = this.chatList

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
        // uni.showToast({
        //   title: '加载失败',
        //   icon: 'none'
        // })
      } finally {
        this.isLoading = false
        this.isRefreshing = false
      }
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
    }

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
.container-box {
  height: 100%;
}

.search-box {
  padding: 8px 10px;
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .el-input {
    width: 80%;
    margin-right: 10px;
  }
  .el-button {
    width: 20%;
  }

  .setting {
    font-size: 20px;
    padding: 0 10px 0 0;
    color: #0078d4;
    cursor: pointer;
  }
}

.chat-list {
  height: 100%;
  overflow-y: auto;
  background-color: #eff4ff;
}

.chat-list-container {
  // background-color: #eff4ff;
  max-width: 400px;
  padding: 10px;
}

.chat-item {
  display: flex;
  cursor: pointer;
  justify-content: space-between;
  background-color: #fff;
  border-bottom: 2px solid #f5f5f5;
  /* 4rpx → 2px */
  padding: 8px;
  border: 2px solid #fff;
  border-radius: 10px;
  /* 20rpx → 10px */
  margin-bottom: 5px;
  /* 10rpx → 5px */
}

.curr-item {
  border: 1px solid #0078d4;
}

.chat-item-header {
  display: flex;
  flex: 1;
  align-items: center;
}

.chat-avatar {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  margin-right: 10px;
}

.chat-info {
  flex: 1;
  gap: 6px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;
}

.chat-title {
  font-size: 14px;
  /* 28rpx → 14px */
  font-weight: 500;
}

.chat-last-message {
  display: flex;
  align-items: center;
  gap: 15px;
  width: 100%;
  padding: 0 10px;
  justify-content: space-between;
  font-size: 12px;
  /* 24rpx → 12px */
  color: #666;

  .last-msg {
    flex: 1;
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.chat-item-footer {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-end;
  text-align: right;
  font-size: 12px;
  color: #999;


}

  .msg-count {
    padding: 0 5px;
    /* 10rpx → 5px */
    background-color: #ff3f33;
    color: white;
    border-radius: 8px;
    text-align: center;
    /* 16rpx → 8px */
  }

.loading-status {
  padding: 15px;
  /* 30rpx → 15px */
  text-align: center;
  color: #999;
}

.loading-text,
.no-more-text {
  font-size: 14px;
  /* 28rpx → 14px */
}
</style>
