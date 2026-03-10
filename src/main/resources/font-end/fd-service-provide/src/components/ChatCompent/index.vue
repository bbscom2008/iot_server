<template>
  <div class="chat-compent">
    <VisibilityHandler></VisibilityHandler>

    <div
      v-drag="{
        boundary: 'window',
        onStart: onDragStart,
        onEnd: onDragEnd
      }"
      class="img-box server"
      v-if="!isShowChatBox"
      :style="serverPosition"
      @click="serverClickHandler"
    >
      <img class="server-img" src="@/assets/img/server.jpg" />
      <span class="bardge" v-if="$store.state.chat.newMessageCount">{{
        $store.state.chat.newMessageCount
      }}</span>
    </div>

    <DraggableBox class="chat-box" v-show="isShowChatBox" handle=".chat-title">
      <!-- <div  v-drag="{
        handle: '.chat-title',
      }"  class="chat-box" v-show="isShowChatBox"> -->

      <div class="chat-title">
        <div class="back">
          <i v-if="canGoBack" class="el-icon-arrow-left" @click="exitChatRoom()"></i>
        </div>

        <div class="title">客服系统</div>
        <div class="actions">
          <i class="el-icon-s-tools setting" @click="handleChatSetting()"></i>
          <i class="el-icon-close" @click="closeChat()"></i>
        </div>
      </div>

      <div v-if="isShowChatBox" class="content">
        <div class="conversation-list">
          <ChatList />
        </div>
        <div class="chat-panel">
          <Chat v-if="hasSelectedChat"></Chat>
          <div v-else class="chat-placeholder">
            <img src="@/assets/img/server.jpg" alt="" />
            <p>请选择会话开始聊天</p>
          </div>
        </div>
      </div>

      <!-- </div> -->
    </DraggableBox>

    <ChatSetting
      ref="chatSettingRef"
      @close="showChatSetting = false"
      v-if="showChatSetting"
    ></ChatSetting>
  </div>
</template>

<script>
import DraggableBox from './DraggableBox.vue'
import VisibilityHandler from './VisibilityHandler.vue'
import ChatSetting from './ChatSetting.vue'
import ChatList from './chat-list.vue'
import Chat from './chat/chat.vue'

export default {
  name: 'ChatCompent',
  components: {
    DraggableBox,
    ChatList,
    VisibilityHandler,
    ChatSetting,
    Chat
  },
  data() {
    return {
      showChatSetting: false,
      msg: 'hello world',
      isShowChatBox: false,
      hasSelectedChat: false,
      isServerDragged: false,
      serverPosition: {
        left: (window.innerWidth - 300) + 'px',
        top: (window.innerHeight - 300) + 'px'
      }, 
      startPos:{
        x: 0,
        y: 0
      },
      conversationHistory: []
    }
  },
  computed: {
    canGoBack() {
      return this.conversationHistory.length > 0
    }
  },
  mounted() {
    // 显示聊天页面
    this.$eventBus.$on('show-chat', this.handleShowChat)

    this.$eventBus.$on('exitChatRoom', this.exitChatRoom)

    this.handleKeydown = (e) => {
      if (e.key === 'Escape' && this.isShowChatBox && this.hasSelectedChat) {
        this.exitChatRoom()
      }
    }
    window.addEventListener('keydown', this.handleKeydown)
  },
  beforeDestroy() {
    this.$eventBus.$off('show-chat', this.handleShowChat)
    this.$eventBus.$off('exitChatRoom', this.exitChatRoom)
    window.removeEventListener('keydown', this.handleKeydown)
  },
  methods: {
    handleShowChat(chat) {
      const targetConversation = chat || this.$store.state.chat.currConversation
      if (!targetConversation) {
        return
      }
      this.pushConversation(targetConversation)
    },
    setCurrentConversation(chat) {
      if (!chat) {
        return
      }
      this.$store.state.chat.currChatOrderId = chat.orderId
      this.$store.state.chat.currConversation = chat
      this.hasSelectedChat = true
    },
    pushConversation(chat) {
      const existingIndex = this.conversationHistory.findIndex(
        (item) => item.orderId === chat.orderId
      )
      if (existingIndex !== -1) {
        this.conversationHistory.splice(existingIndex, 1)
      }
      this.conversationHistory.push(chat)
      this.isShowChatBox = true
      this.setCurrentConversation(chat)
    },
    clearConversation() {
      this.hasSelectedChat = false
      this.$store.state.chat.currChatOrderId = ''
      this.$store.state.chat.currConversation = null
    },
    goBackConversation() {
      if (!this.hasSelectedChat) {
        return
      }
      this.conversationHistory.pop()
      const previous = this.conversationHistory[this.conversationHistory.length - 1]
      if (previous) {
        this.setCurrentConversation(previous)
      } else {
        this.clearConversation()
      }
    },
    onDragStart({ el, x, y }) {
      this.startPos = {
        x: x,
        y: y
      }
      console.log('开始拖拽', { x, y }, " isServerDragged = false")
      this.isServerDragged = false
    },

    onDragEnd({ el, x, y, hasMoved }) {
      console.log('拖拽结束', { x, y }, "  isServerDragged ", hasMoved)
      if (hasMoved) {
        // 更新位置到 left/top
        this.serverPosition.left = `${x}px`
        this.serverPosition.top = `${y}px`
      }

      if (Math.abs(x - this.startPos.x) > 5 || Math.abs(y - this.startPos.y) > 5) {
        this.isServerDragged = true
      }

  
    },
    serverClickHandler() {
      console.log('=====serverClickHandler=========', this.isServerDragged)

      // 不是拖动时，才触发点击
      if (!this.isServerDragged) {
        this.isShowChatBox = true
      }
    },
    closeChat() {
      this.isShowChatBox = false
      this.$store.dispatch('chat/getNewMessageCount')
      this.conversationHistory = []
      this.clearConversation()
    },
    handleChatSetting() {
      this.showChatSetting = true
      // this.$refs.chatSettingRef.showChatSetting()
      // this.closeChat()
    },
    exitChatRoom() {
      this.goBackConversation()
    }
  }
}
</script>

<style lang="scss" scoped>
.chat-compent {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 2000;
  width: 100%;
  height: 100%;
  pointer-events: none;

  .img-box {
    // position: relative;
    .bardge {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: 0px;
      right: 0px;
      background-color: #c22;
      color: white;
      padding: 0 5px;
      box-sizing: border-box;
      height: 24px;
      border-radius: 12px;
    }
  }

  .server {
    position: fixed;
    cursor: pointer;
    // left: 屏幕宽度-300px;
    // top: 屏幕高度-300px;
  }

  .server-img {
    pointer-events: auto;
    border-radius: 50%;
    border: 2px solid #fff;
    width: 60px;
    height: 60px;
  }

  .chat-box {
    pointer-events: auto;
    display: flex;
    flex-direction: column;
    background-color: #eff4ff;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    .content {
      flex: 1;
      height: calc(100% - 36px);
      display: flex;
      background: #fff;
      border-radius: 0 0 10px 10px;
      overflow: hidden;
    }
    .conversation-list {
      min-width: 400px;
      border-right: 1px solid #e0e0e0;
      background: #eff4ff;
      display: flex;
      flex-direction: column;
    }
    .conversation-list ::v-deep .container-box {
      flex: 1;
    }
    .chat-panel {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: #f5f7fb;
      position: relative;
    }
    .chat-panel > * {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .chat-placeholder {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #909399;
      font-size: 14px;
      gap: 16px;
    }
    .chat-placeholder img {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      opacity: 0.2;
    }
    .chat-title {
      background-color: #0078d4;
      display: flex;
      height: 36px;
      justify-content: space-between;
      align-items: center;
      cursor: move;
      padding: 10px;

      .setting {
        color: white;
        font-size: 18px;
      }

      .actions {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .title {
        color: #fff;
        font-size: 18px;
      }
      .back {
        cursor: pointer;
        font-size: 20px;
        color: white;
        padding: 0 8px;
      }
      .el-icon-close {
        color: #fff;
        font-size: 26px;
        cursor: pointer;
      }
    }
  }
}
</style>
