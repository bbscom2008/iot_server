<template>
  <div class="picker-box">
    <el-popover placement="top" width="300" trigger="click">
      <div class="msg-list">
        <div class="msg-item" v-for="(msg, i) in msgList" 
        :key="i" @click="sendTextMessage(msg)">
          {{ msg.text }}
        </div>
      </div>

      <div class="item" slot="reference">
        <i class="el-icon-tickets" style="font-size: 30px"></i>
        <span>快捷短语</span>
      </div>
    </el-popover>
  </div>
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
   
    }
  },
  computed: {
    msgList() {
      return this.$store.state.chat.quickMessageList
    }
  },
  mounted(){
    this.getShortMessage()
  },
  methods: {
     /**
     * 获取快捷短语
     */
    async getShortMessage() {
      if(this.$store.state.chat.quickMessageList.length == 0){
        await this.$store.dispatch('chat/getShortMessageAction')
      }
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
        type: MessageType.text,
        id: generateUniqueId(),
        text: msg.text
      }

      messageItem.content.push(textItem)
      this.$emit('select-msg', messageItem)

      this.sendWsMessage(messageItem)
    },

    sendWsMessage(messageItem) {

      // 发送 webSocket
      webSocketService.send({
        type: 'message',
        orderId: this.$store.state.chat.currChatOrderId,
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

.msg-list{
  .msg-item{
    cursor: pointer;
    padding: 5px 10px;
    color: #333;
    border-bottom: 1px solid #ccc;
  }
  .msg-item:hover{
    background-color: #eee;
  }
}
</style>
