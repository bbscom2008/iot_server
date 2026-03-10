<template>
  <view>
    <uni-popup
      ref="queryPopupRef"
      :show="dialogVisible"
      @maskClick="onDialogBtnCancel()"
    >
      <view class="query-popup">
        <view class="popup-header">
          <text class="popup-title">快捷卡片</text>
          <uni-icons
            type="closeempty"
            class="close-icon"
            size="26"
            @click="onDialogBtnCancel()"
          ></uni-icons>
        </view>

        <scroll-view class="modal-content" scroll-y>
          <view class="msg-list">
            <view
              class="msg-item"
              v-for="(msg, i) in cardList"
              :key="i"
              @click="sendTextMessage(msg)"
            >
              {{ msg.title }}
            </view>

            <u-button type="primary" class="btn-go"  @click="toEditCard()"
              >编辑快捷卡片</u-button
            >

          </view>
        </scroll-view>
      </view>
    </uni-popup>

    <view class="item" @click="showQuickMessageDialog">
      <view class="wraper">
        <u-icon name="coupon" color="#000000" size="34"></u-icon>
      </view>
      <view class="label"> 快捷卡片 </view>
    </view>
  </view>
</template>

<script>
import { MessageType, FromType } from './utils.js'

import { generateUniqueId, parseNow, copyInfo } from '@/utils/index'

import { webSocketService } from '@/utils/websocket'

export default {
  name: 'MessagePicker',

  data() {
    return {
      FromType,
      MessageType,
      dialogVisible: false
    }
  },
  mounted() {},
  computed: {
    // 快捷短语列表
    cardList() {
      return this.$store.state.quickCardList
    }
  },
  methods: {
    toEditCard(){
      uni.navigateTo({
        url: '/pages/personal-info/quick-message-card-setting'
      });
    },
    async showQuickMessageDialog() {
      if (this.$store.state.quickCardList.length == 0) {
        await this.getShortMessage()
      }

      if (this.cardList.length == 0) {
        uni.showToast({
          title: '暂无快捷短语，请添加',
          duration: 2000
        })
      } else {
        this.dialogVisible = true
        this.$refs.queryPopupRef.open('bottom')
      }
    },
    onDialogBtnCancel() {
      this.$refs.queryPopupRef.close()
    },
    /**
     * 获取快捷短语
     */
    async getShortMessage() {
      await this.$store.dispatch('getShortMessageAction')
    },

    async sendTextMessage(msg) {
      const messageItem = {
        // 所有的消息都是 mixed 类型的
        time: parseNow(), // 发送的时间
        id: generateUniqueId(), // 唯一值
        from: FromType.provider,
        content: []
      }

      const textItem = {
        type: MessageType.qrcard,
        id: generateUniqueId(),
        text: msg
      }

      messageItem.content.push(textItem)
      this.$refs.queryPopupRef.close()
      this.$emit('select-msg', messageItem)

      this.sendWsMessage(messageItem)
    },

    sendWsMessage(messageItem) {
      // 发送 webSocket
      webSocketService.send({
        type: 'message',
        orderId: this.$store.state.currChatOrderId,
        data: messageItem
      })
    }
  }
}
</script>
<style lang="scss" scoped>
i {
  font-style: normal;
}

// .chat-container {
//   height: 100%;
//   display: flex;
//   flex-direction: column;
//   max-width: 600px;
//   margin: 0 auto;

//   .title {
//     font-size: 13.9999px;
//     padding: 10.0001px;
//     text-align: center;
//     // background-color: #07c160;
//   }
// }

.picker-box {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  // background-color: #eee;
  border-top: 1.0001px solid #ccc;

  .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    margin: 10.0001px;

    i {
      padding: 10.0001px;
      background-color: #fff;
      border-radius: 4.9999px;
      margin-bottom: 7.9999px;
      color: #333;
    }
  }
}

.msg-list {
  padding-bottom: 40rpx;
  .msg-item {
    cursor: pointer;
    padding: 5px 10px;
    border-bottom: 1px solid #ccc;
  }
  .msg-item:hover {
    background-color: #eee;
  }

  .btn-go {
    width: 50%;
    margin: 20rpx auto;
  }

}
</style>
