<template>
  <div class="chat-container" :style="{height: isMobile ? '100%' : '90%'}" >
    <div class="title">客服系统</div>
    
    <!-- WebSocket 状态提示 -->
    <transition name="slide-down">
      <div class="ws-status-tip" v-if="showWsStatus" :class="wsStatusClass">
        <i :class="wsStatusIcon"></i>
        <span>{{ wsStatusText }}</span>
      </div>
    </transition>
    
    <VisibilityHandler></VisibilityHandler>
    <div
      class="chat-box"
      v-scroll="{
        onReachTop: loadHistoreMsg,
      }"
      ref="chatContainer"
    >
      <div class="chat">
        <!-- 加载状态提示 -->
        <div class="loading-status">
          <!-- 加载中 -->
          <div v-if="isLoading" class="loading-text">加载中...</div>
          <!-- 没有更多数据了 -->
          <div
            v-if="isNoMore && messageList.length > page.pageSize"
            class="no-more-text"
          >
            没有数据了哦~
          </div>
        </div>

        <template v-for="message in [...welcomeMsg, ...messageList]">
          <!-- 码商的消息在左边， -->
          <div
            class="item-l"
            v-if="message.from == FromType.provider"
            :key="message.messageId"
          >
            <div class="avatar">
              <img src="@/assets/img/server.jpg" alt="" />
            </div>

            <div class="content">
              <div :key="i" v-for="(item, i) in message.content">
                <span
                  v-if="item.type == MessageType.text"
                  @click="(e) => copyInfo(e, item.text)"
                  >{{ item.text }}</span
                >

                <div
                  v-else-if="item.type == MessageType.system"
                  v-html="item.text"
                ></div>

                <br v-else-if="item.type == MessageType.br" :key="i" />

                <span
                  v-else-if="item.type == MessageType.image"
                  style="position: relative"
                >
                  <ImageMessageItem
                    :item="item"
                    :allImagePreview="allImagePreview"
                  />
                </span>
                <div v-else-if="item.type == MessageType.qrcard">
                     <QrCodeItem :item="item.text" />
                  </div>
                <div
                  v-else-if="item.type == MessageType.video"
                  style="position: relative"
                >
                  <VideoMessageItem :item="item" @playVideo="playVideo" />
                </div>
              </div>
            </div>
            <!-- <div class="time">{{ getLastTime(message.time) }}</div> -->
            <div class="time">{{ message.time }}</div>
          </div>

          <!-- 客户的消息在右边  自己本地发送的   -->
          <div
            class="item-r"
            v-if="message.from == FromType.client"
            :key="message.messageId"
          >
            <!-- <div class="time">{{ getLastTime(message.time) }}</div> -->
            <div class="time">{{ message.time }}</div>

            <div :key="i" v-for="(item, i) in message.content" class="content"  :style="{padding: item.type == MessageType.system ? '0px' : '2rem'}"  >
              <div >
                <span
                  v-if="item.type == MessageType.text"
                  @click="(e) => copyInfo(e, item.text)"
                  :key="i"
                  >{{ item.text }}</span
                >

                <div
                  v-else-if="item.type == MessageType.system"
                >
                  <OrderStatusItem :item="item.item" />
                </div>

                <br v-else-if="item.type == MessageType.br" />

                <span
                  v-else-if="item.type == MessageType.image"
                  style="position: relative"
                >
                  <ImageMessageItem
                    :item="item"
                    :allImagePreview="allImagePreview"
                  />
                </span>
                <div v-else-if="item.type == MessageType.qrcard">
                     <QrCodeItem :item="item.text" />
                </div>
                <div
                  v-else-if="item.type == MessageType.video"
                  style="position: relative"
                >
                  <VideoMessageItem :item="item" @playVideo="playVideo" />
                </div>
              </div>
              <!-- <span class="time">2025-02-20</span> -->
            </div>
            <div class="avatar">
              <img
                :src="require(`@/assets/heads/icon${headIcon}.png`)"
                alt=""
              />
            </div>
          </div>
        </template>
      </div>
    </div>
    <!-- <div class="test" style="background-color: pink; font-size: 20px;" >
      {{ message }} --  {{ message.length }}
    </div> -->
    <!-- 输入区域 -->
    <div class="chat-input-area">
      <!-- 输入框 -->
      <div
        ref="inputBoxRef"
        class="input-box"
        contenteditable="true"
        @click="closeToolBox"
        @input="handleInput"
        @keydown.enter.prevent="handleKeyDown"
        @blur="saveSelection"
        @keyup="saveSelection"
        @mouseup="saveSelection"
        placeholder="请输入内容..."
      ></div>

      <!-- 其他工具按钮，如图片、文件 -->
      <div
        class="toolbar"
        :style="{ width: isHaveInput ? '25rem' : '16.5333rem' }"
      >
        <svg-icon
          icon-class="happy"
          class="happy"
          @mousedown.prevent="showEmojiBox"
          @touchstart.prevent="showEmojiBox"
        />
        <!-- @click="showEmojiBox"   -->

        <i
          class="el-icon-circle-plus-outline"
          v-if="!isHaveInput"
          @mousedown.prevent
          @click="showPickerBox"
        ></i>

        <div class="action-bar" v-else>
          <button @click="sendMessage" @mousedown.prevent>发送</button>
        </div>
      </div>
    </div>

    <!-- 表情框 -->
    <div class="emoji-box" v-if="isShowEmojiBox">
      <div class="item-wraper">
        <div
          class="emoji-item"
          v-for="(item, i) in emojiList"
          :key="i"
          @mousedown.prevent="insertEmoji(item)"
        >
          {{ item }}
        </div>
      </div>
    </div>

    <!-- 选择框 -->
    <div class="picker-box" v-if="isShowPickerBox">
      <ImagePicker @select-image="insertLocalMedia"></ImagePicker>
      <videoPicker @select-video="insertLocalMedia"> </videoPicker>
    </div>

    <div class="video-wrap" @click="closeVideo" v-if="isPlayVideo">
      <video class="video-box" :src="currentVideo" controls autoplay 
      @webkitfullscreenchange="onFullChange"
      @mozfullscreenchange="onFullChange"
      @msfullscreenchange="onFullChange"
      @fullscreenchange="onFullChange" ></video>
    </div>
  </div>
</template>

<script>
import { getFileById, uploadFileToServer } from "@/api/upload";



import { base64ToBlob, parseCiphertext } from "@/utils/index";

import { emojis } from "./emoji";

import { getLastTime } from "@/utils/chat.js";

import { getClientHistoryMessage, getWelcomeMessage } from "@/api/chat";

import ImageMessageItem from "./image-message-item.vue";
import VideoMessageItem from "./video-message-item.vue";

import { generateUniqueId, parseNow, randomHeadIcon } from "@/utils/index";

import { webSocketService } from "@/utils/websocket";

import videoPicker from "./video-picker.vue";

import clipboard from "@/utils/clipboard";

import ImagePicker from "./image-picker.vue";
import VisibilityHandler from "./VisibilityHandler.vue";

import { PaymentMethods } from "@/utils/constants";
import OrderStatusItem from "./order-status-item.vue";
import QrCodeItem from "./qr-code-item.vue";
/**
 * 消息类型
 */
const MessageType = {
  br: "BR", // 换行
  text: "text",
  image: "image",
  qrcard: "qrcard",
  video: "video", //
  system: "system", //
  mixed: "mixed", // 混合类型，即有文本，又有图片，
};

const FromType = {
  provider: "provider",
  client: "client",
  system: "system", //
};

/**
 * 将所有的消息都做为 混合类型的消息发送。！！！
 */

export default {
  name: "Chat",
  components: {
    videoPicker,
    ImageMessageItem,
    VideoMessageItem,
    ImagePicker,
    VisibilityHandler,
    OrderStatusItem,
    QrCodeItem,
  },
  computed: {
    isHaveInput() {
      if (
        this.message.length == 0 ||
        this.message.trim() == "" ||
        this.message == "<br>"
      ) {
        return false;
      }
      return true;
    },
    emojiList() {
      return emojis;
    },
    isMobile() {
      const ua = navigator.userAgent.toLowerCase();
      return /mobile/i.test(ua);
    },
    // WebSocket 状态相关计算属性
    wsStatusText() {
      const statusMap = {
        connecting: '正在连接...',
        connected: '连接成功',
        disconnected: '连接已断开',
        reconnecting: '正在重连...',
        error: '连接错误',
        failed: '连接失败',
        'chatroom-closed': '聊天室已关闭'
      };
      return statusMap[this.wsStatus] || '未知状态';
    },
    wsStatusClass() {
      return `ws-status-${this.wsStatus}`;
    },
    wsStatusIcon() {
      const iconMap = {
        connecting: 'el-icon-loading',
        connected: 'el-icon-success',
        disconnected: 'el-icon-warning',
        reconnecting: 'el-icon-loading',
        error: 'el-icon-error',
        failed: 'el-icon-error',
        'chatroom-closed': 'el-icon-warning'
      };
      return iconMap[this.wsStatus] || 'el-icon-info';
    }
  },

  data() {
    return {
      headIcon: 0,
      wsService: null,
      showOrderInfo: false,
      allImagePreview: [],
      FromType,
      isSending: false,
      MessageType,
      message: "",
      isShowEmojiBox: false,
      isShowPickerBox: true,
      // WebSocket 状态相关
      wsStatus: 'disconnected',
      showWsStatus: false,
      wsStatusTimer: null,
      messageList: [
        // {
        //   time: parseNow(),
        //   id: generateUniqueId(),
        //   from: FromType.system, // 1 码商  2  客户
        //   content: [
        //     {
        //       type: MessageType.text,
        //       text: "1-✨欢迎，欢迎，热烈欢迎🎉🎉<br>2-✨✨欢迎，欢迎，热烈欢迎🎉🎉",
        //     },
        //   ],
        // },
      ],
      pickerType: 1, // 1 普通文本(为了和发送消息同步，实际用不到)  2  图片   3  视频  4 文件
      lastRange: null, // 保存光标位置
      isPlayVideo: false,
      currentVideo: "",
      page: {
        pageSize: 20,
        pageNum: 1,
      },
      isLoading: false,
      isNoMore: false,
      scrollContainer: null,
      welcomeMsg: [],
    };
  },
  beforeDestroy() {
    // 清除状态提示定时器
    if (this.wsStatusTimer) {
      clearTimeout(this.wsStatusTimer);
    }
    
    if (this.wsService) {
      this.wsService.close();
      this.wsService.removeMessageHandler(this.handleMessage);
      this.wsService.removeStatusChangeHandler(this.handleWsStatusChange);
    }
  },
  mounted() {
   this.hideGlobalSkeleton();

    console.log('=====this.$_isMobile()=====', this.isMobile);

    console.log(this.$route.params.ciphertext);

    if(this.$route.query.oid){
      this.$store.commit("app/setOrderId", this.$route.query.oid);
    }else{
      // 从 sessionStorage 中取
      const orderId = sessionStorage.getItem('app/setOrderId');
      if(orderId){
        this.$store.commit("app/setOrderId", orderId);
      }

      // 直接发进入聊天室的，没有这个 oid，从 sessionStorage 中取
    }
  

    let ciphertext = this.$route.params.ciphertext;
    if (!ciphertext) {
      ciphertext = parseCiphertext();
    }
    this.$store.commit("app/setCiphertext", this.$route.params.ciphertext);

    this.loadHistoreMsg(true);
    this.loadWelcomeMsg();
    // 创建 webSocket
    this.initWebSocket();
    
    // 监听聊天室关闭状态
    this.watchChatRoomStatus();
   
     // 直接聊天的，无此参数，频道列表聊天，有这个参数
    const paymentMethod = this.$route.query.mid;
    if (paymentMethod) {
      console.log('=====paymentMethod=====', paymentMethod);
      this.sendPaymentMethodMessage(paymentMethod);
    }

    this.scrollContainer = this.$refs.chatContainer;

    // this.$refs.inputBoxRef.focus();
    this.scrollToBottom(); // 初始加载时滚动到底部
  },
  methods: {
    hideGlobalSkeleton() {
      console.log('----------------hideGlobalSkeleton----------------');
      
      const skeleton = document.getElementById("global-skeleton");
      if (skeleton) {
        skeleton.classList.add("fade-out");
        setTimeout(() => {
          const el = document.getElementById("global-skeleton");
          if (el && el.parentNode) {
            el.parentNode.removeChild(el);
          }
        }, 20);
      }
    },
    // WebSocket 状态变化处理
    handleWsStatusChange(newStatus, oldStatus) {
      console.log('WebSocket状态变化:', oldStatus, '->', newStatus);
      this.wsStatus = newStatus;
      
      // 显示状态提示
      this.showWsStatus = true;
      
      // 清除之前的定时器
      if (this.wsStatusTimer) {
        clearTimeout(this.wsStatusTimer);
      }
      
      // 连接成功后3秒自动隐藏提示
      if (newStatus === 'connected') {
        this.wsStatusTimer = setTimeout(() => {
          this.showWsStatus = false;
        }, 3000);
        
        // 连接成功时，重试所有待重发的图片消息
        this.retryPendingImageMessages();
      }
      // 其他状态（连接中、重连中、错误等）持续显示
    },
    
    // 监听聊天室关闭状态
    watchChatRoomStatus() {
      // 使用 Vue 的 watch 监听 store 中的聊天室状态
      this.$watch(
        () => this.$store.state.chat.isChatRoomClose,
        (isClosed) => {
          if (isClosed) {
            console.log('检测到聊天室已关闭，显示提示');
            this.wsStatus = 'chatroom-closed';
            this.showWsStatus = true;
            
            // 清除之前的定时器
            if (this.wsStatusTimer) {
              clearTimeout(this.wsStatusTimer);
            }
            
            // 聊天室关闭提示持续显示，不自动隐藏
          }
        },
        { immediate: true } // 立即执行一次，检查初始状态
      );
    },
    
    // 重试待重发的图片消息
    retryPendingImageMessages() {
      this.messageList.forEach(message => {
        if (message.from === FromType.client) {
          message.content.forEach(item => {
            if (item.type === MessageType.image && item.pendingResend) {
              console.log('重试发送图片消息:', item.id);
              // 重新发送WebSocket消息
              const newContent = message.content.map((contentItem) => {
                if (contentItem.type === MessageType.image && contentItem.id === item.id) {
                  return {
                    id: contentItem.id,
                    fileId: contentItem.fileId,
                    type: contentItem.type
                  };
                }
                return contentItem;
              });

              const newMessageItem = {
                time: message.time,
                id: message.id,
                from: message.from,
                content: newContent
              };

              const sendResult = this.wsService.send({
                type: "message",
                data: newMessageItem,
              });
              
              if (sendResult) {
                item.pendingResend = false;
                console.log('图片消息重发成功');
              }
            }
          });
        }
      });
    },
    
    sendPaymentMethodMessage(paymentMethod) {

      const orderitem = PaymentMethods.find(item => item.id == paymentMethod);

      const messageItem = {
        time: parseNow(),
        id: generateUniqueId(),
        from: FromType.client,
        content: [{ type: MessageType.system, subType:'orderStatus' ,item: {
          ...orderitem,
          oid: this.$route.query.oid,
        } }],
      };
      
      this.wsService.send({
        type: "message",
        data: messageItem,
      });
      this.insertLocalMedia(messageItem);
      this.scrollToBottom()
    },
    copyInfo(e, content) {
      clipboard(content, e);
    },
    async loadWelcomeMsg() {
      let ret = await getWelcomeMessage(this.$route.params.ciphertext);

      let infos = JSON.parse(ret.data).welcomeMessage;

      infos && infos.forEach((item) => {

        const messageItem = {
          time: parseNow(),
          id: generateUniqueId(),
          from: FromType.provider, // 1 码商  2  客户
          content: [
          ],
        };

        if (item.type == "html") {
          messageItem.content.push({
            type: MessageType.system,
            text: item.html,
          });
        } else if (item.type == "image") {
          messageItem.content.push({
            type: MessageType.image,
            fileId: item.imageFileId,
          });
        } else if (item.type == "video") {
          messageItem.content.push({
            type: MessageType.video,
            videoFileId: item.videoFileId,
          });
        }
        this.welcomeMsg.push(messageItem);
        this.scrollToBottom()
      });
    },
    getLastTime,
    async loadHistoreMsg(isFirst = false) {
      if (this.isLoading || this.isNoMore) {
        return;
      }
      this.isLoading = true;

      try {
        this.$store.commit("app/setLoadingEnable", false);
        let res = await getClientHistoryMessage(
          this.$store.state.app.ciphertext,
          this.page
        );
        this.isLoading = false;
        // 返回数据，时间最大的在最前面，
        res.data.list.forEach((ele) => {
          if (isFirst) {
            ele.payload.data.content.forEach((item) => (item.isFirst = true));
          }

          // 每一条都是收到的消息
          this.handleMessage(ele.payload, true);
        });
        this.keepScrollTop();
        this.page.pageNum++;

        // 判断是否还有更多数据
        if (this.messageList.length >= res.data.total) {
          this.isNoMore = true;
        }
      } catch (err) {
        console.log('==========loadHistoreMsg=============', err);
        
        console.log("err", err);
      } finally {
        this.isLoading = false;
      }

      if (isFirst) {
        this.scrollToBottom();
      }
    },
    initWebSocket() {
      this.headIcon = randomHeadIcon();
      this.wsService = webSocketService;
      this.wsService.connentIfy();
      this.wsService.addMessageHandler(this.handleMessage);
      // 添加状态变化监听器
      this.wsService.addStatusChangeHandler(this.handleWsStatusChange);
    },

    closeVideo() {
      this.isPlayVideo = false;
      this.currentVideo = "";
    },
    onFullChange(state){
      console.log('===onFullChange===', state);
      this.isFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );

      console.log('全屏状态变化:', this.isFullscreen);
      
      if (this.isFullscreen) {
        // this.onEnterFullscreen();
      } else {
        // this.onExitFullscreen();
        this.closeVideo()
      }
    },
    playVideo(item) {
      this.closeToolBox();
      this.isPlayVideo = true;

      // 如果是本地视频
      if (item.videoFileObj) {
        this.currentVideo = URL.createObjectURL(item.videoFileObj);
      } else {
        this.currentVideo = item.videoUrl;
      }
    },
    // 插入本地的图片，视频， 消息
    insertLocalMedia(messageItem) {
      console.log("--messageItem--", messageItem);

      // messageItem.content.forEach((item) => {
        // if (item.type == MessageType.image) {
          // 加个下标，方便预览时定位
          // item.index = this.allImagePreview.length;
          // this.allImagePreview.push(item.imgSrc);
        // } else if (item.type == MessageType.video) {
        // }
      // });
      this.messageList.push(messageItem);
    },

    // 收到的 webSocket 的消息
    handleMessage(data, isHistory = false) {
      if (data.type !== "message") {
        return;
      }
      const message = data.data;

      if (isHistory) {
        message.content.forEach((item) => (item.isHistory = true));
        this.messageList.unshift(message);
      } else {
        message.content.forEach((item) => (item.isHistory = false));
        this.messageList.push(message);
        this.scrollToBottom();
      }

      // this.parseAndShow(message);
    },

    // parseAndShow(message) {
    //   // 如果message 中有图片，获得 url
    //   message.content.forEach((item) => {
    //     if (item.type == MessageType.image) {
    //       item.loading = true;
    //       this.$store.commit("app/setLoadingEnable", false);

    //       getFileById(item.fileId).then((res) => {
    //         item.imgSrc = res.data.fileUrl;
    //         item.loading = false;
    //         // 加入预览
    //         item.index = this.allImagePreview.length;
    //         this.allImagePreview.push(item.imgSrc);
    //       });
    //     } else if (item.type == MessageType.video) {
    //       item.loading = true;

    //       this.$store.commit("app/setLoadingEnable", false);
    //       getFileById(item.videoFileId).then((res) => {
    //         item.videoUrl = res.data.fileUrl;
    //       });

    //       this.$store.commit("app/setLoadingEnable", false);
    //       getFileById(item.thumbFileId).then((res) => {
    //         item.thumbImgSrc = res.data.fileUrl;
    //         item.loading = false;
    //         this.$forceUpdate();
    //       });
    //     }
    //   });
    // },

    // testReceiveMessage() {
    //   this.handleMessage({
    //     time: parseNow(),
    //     id: generateUniqueId(),
    //     from: FromType.provider, // 1 码商  2  客户
    //     content: [
    //       {
    //         type: MessageType.text,
    //         text: "你好",
    //       },
    //     ],
    //   });

    //   const messageItem = {
    //     // 所有的消息都是 mixed 类型的
    //     time: parseNow(), // 发送的时间
    //     id: generateUniqueId(), // 唯一值
    //     from: FromType.provider,
    //     content: [
    //       {
    //         type: MessageType.text,
    //         text: "欢迎使用 无忧支付",
    //       },
    //       {
    //         type: MessageType.br,
    //       },
    //       {
    //         type: MessageType.image,
    //         fileId: "214739443874152448", // fileId 需联网获取再显示
    //         file: "", // 本地发送文件，直接显示
    //         imgSrc: "", // 图片的 base64形式，可直接做为 url
    //         id: generateUniqueId(),
    //         loading: true,
    //       },
    //       {
    //         type: MessageType.br,
    //       },
    //       {
    //         type: MessageType.text,
    //         text: "欢迎使用 无忧支付",
    //       },
    //       {
    //         type: MessageType.br,
    //       },
    //       {
    //         type: MessageType.image,
    //         fileId: "214739443874152448", // fileId 需联网获取再显示
    //         imgSrc: "", // 图片的 base64形式，可直接做为 url
    //         id: generateUniqueId(),
    //         loading: true,
    //       },
    //     ],
    //   };

    //   this.handleMessage(messageItem);
    // },

    handleKeyDown(event) {
      if (event.ctrlKey || event.metaKey) {
        // Ctrl+Enter：插入换行
        event.preventDefault();
        this.insertLineBreak(); // 插入换行
      } else {
        // 普通 Enter：发送消息
        event.preventDefault();
        this.sendMessage();
      }
    },

    insertLineBreak() {
      const selection = window.getSelection();
      if (!selection.rangeCount) return;

      const range = selection.getRangeAt(0);

      // 1. 在当前光标位置插入换行（浏览器原生方式）
      document.execCommand("insertLineBreak");

      // 2. 清除可能多余的 <br>（防止双换行）
      const currentNode = selection.anchorNode;
      if (currentNode.parentNode.lastChild?.nodeName === "BR") {
        currentNode.parentNode.removeChild(currentNode.parentNode.lastChild);
      }

      // 3. 确保光标在新行开头
      const newRange = document.createRange();
      newRange.selectNodeContents(this.$refs.inputBoxRef);
      newRange.collapse(false); // 移动到末尾
      selection.removeAllRanges();
      selection.addRange(newRange);
    },

    // 解析编辑器内容
    parseEditorContent(editor) {
      const content = [];
      let textBuffer = "";

      // 遍历所有子节点
      const nodes = editor.childNodes;

      // 处理图片上传 Promise 数组
      let uploadImgPromises = [];

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        // console.log(
        //   "node.nodeType : ",
        //   node.nodeType,
        //   " node.tagName : ",
        //   node.tagName
        // );

        // 处理文本节点
        if (node.nodeType === Node.TEXT_NODE) {
          textBuffer += node.textContent;
        }
        // 处理元素节点（主要是图片）
        else if (node.nodeType === Node.ELEMENT_NODE) {
          // 先把缓冲的文本内容存入
          if (textBuffer.trim()) {
            content.push({ type: MessageType.text, text: textBuffer.trim() });
            textBuffer = "";
          }

          // 处理图片
          if (node.tagName === "BR") {
            content.push({ type: MessageType.br });
          }

          if (node.tagName === "IMG") {
            const imgSrc = node.getAttribute("src");
            if (imgSrc.startsWith("data:")) {
              // 将base64转为blob 上传，获得文件ID
              let file = base64ToBlob(imgSrc);
              // console.log("base64ToBlob ---  : ", file);
              // console.log("base64ToBlob ---  : ", file.name);

              const imageItem = {
                type: MessageType.image,
                fileId: "",
                imgSrc: imgSrc, // 图片 base64 格式
                file: file,
                id: generateUniqueId(),
                loading: true,
              };

              content.push(imageItem);

              // 加入图片列表
              this.allImagePreview.push(imgSrc);

              // 将图片上传至服务器
              let uploadImgPromise = this.uploadImage(imageItem);
              uploadImgPromises.push(uploadImgPromise);
            } else {
              console.log("---error------", imgSrc);
            }
          }
        }
      }

      // 处理最后剩余的文本
      if (textBuffer.trim()) {
        content.push({ type: MessageType.text, text: textBuffer.trim() });
      }

      return [content, uploadImgPromises];
    },

    /**
     * 将图片上传至服务器，并更新页面
     * @param file
     */
    async uploadImage(imageItem) {
      let file = imageItem.file;
      try {
        let res = await uploadFileToServer(file);
        imageItem.fileId = res.data;
        imageItem.loading = false;
        return { status: "success", data: imageItem }; // 明确返回成功状态
      } catch (e) {
        console.error("图片上传失败:", e);
        imageItem.loading = false;
        imageItem.error = true; // 标记失败状态
        return { status: "error", data: imageItem, error: e }; // 返回错误详情
      }
    },

    closeToolBox() {
      this.isShowEmojiBox = false;
      this.isShowPickerBox = false;
    },

    showPickerBox() {
      this.isShowPickerBox = !this.isShowPickerBox;
      this.isShowEmojiBox = false;
    },

    showEmojiBox() {
      console.log("--showEmojiBox----");

      this.isShowEmojiBox = !this.isShowEmojiBox;
      this.isShowPickerBox = false;
      // 关闭键盘（如果有）
      // 确保键盘不会弹出
      this.$refs.inputBoxRef.blur();
      document.activeElement.blur(); // 双重保险
    },

    saveSelection() {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        this.lastRange = selection.getRangeAt(0);
      }
    },

    handleInput(event) {
      // 你可以在这里获取 div 的 innerHTML，它包含了文本和图片标签
      this.message = event.target.innerHTML;
      // console.log("Current input HTML:", this.message);
    },

    insertEmoji(emoji) {
      const inputBox = this.$refs.inputBoxRef;

      // 1. 确保不触发键盘
      inputBox.blur();

      // 2. 恢复光标位置
      const selection = window.getSelection();
      let range;

      if (this.lastRange) {
        // 优先使用保存的光标位置
        range = this.lastRange;
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        // 如果没有保存的位置，创建新范围
        range = document.createRange();
        range.selectNodeContents(inputBox);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }

      // 3. 插入表情
      const emojiNode = document.createTextNode(emoji);
      range.deleteContents();
      range.insertNode(emojiNode);

      // 4. 移动光标到表情后面
      const newRange = document.createRange();
      newRange.setStartAfter(emojiNode);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);

      // 5. 更新保存的光标位置
      this.lastRange = newRange;

      // 6. 手动触发输入事件
      this.handleInput({ target: inputBox });

      // 7. 保持表情框可见
      this.isShowEmojiBox = true;

      // 8. 阻止任何可能的焦点恢复
      setTimeout(() => {
        inputBox.blur();
        document.activeElement?.blur();
      }, 50);
    },

    sendMessage() {
      // 可能是文本消息，也可能是复合消息, 全部当做复合消息来处理
      // 如果输入框中即没有图片，也没有文本内容，那就弹出警告框
      const inputBox = this.$refs.inputBoxRef;
      const isHaveText = inputBox.textContent.trim().length > 0;
      const isHaveImg = !!inputBox.querySelector("img");
      console.log("inputBox.textContent", inputBox.textContent);

      // 1. 检查输入框是否为空
      if (!isHaveText && !isHaveImg) {
        this.$message.error("不能发送空消息");
        return;
      }

      this.isSending = true;

      try {
        // 解析编辑器内容
        const [content, uploadImgPromises] = this.parseEditorContent(inputBox);
        if (content.length === 0) return;

        const messageItem = {
          time: parseNow(),
          id: generateUniqueId(),
          from: FromType.client,
          content: content,
        };
        // 先添加到本地列表
        this.messageList.push(messageItem);

        // 所有图片上传完成后，才有了fileId，才会给服务器发送消息
        if (uploadImgPromises.length > 0) {
          Promise.all(uploadImgPromises.map((p) => p.catch((e) => e))) // 确保所有Promise都能完成
            .then((results) => {
              const failedItems = results.filter((r) => r.status === "error");
              const successItems = results.filter(
                (r) => r.status === "success"
              );

              if (failedItems.length > 0) {
                this.$message.error(`${failedItems.length}张图片上传失败`);
                // 可以在这里显示具体哪些图片失败
                failedItems.forEach((item) => {
                  console.error("上传失败的图片:", item.data.file.name);
                });
              }

              if (successItems.length > 0) {
                this.sendMixedMessage(content);
              }
            });
        } else {
          this.sendMixedMessage(content);
        }
      } catch (error) {
        console.error("发送消息失败:", error);
      } finally {
        this.isSending = false;
      }

      // 保持键盘不收起的关键步骤
      this.$nextTick(() => {
        // 1. 先清空输入框
        inputBox.innerHTML = " ";
        this.message = "";

        // 2. 立即恢复焦点
        inputBox.focus();

        // 3. 滚动到底部
        this.scrollToBottom();

        // 4. 对于某些浏览器需要强制重新聚焦
        setTimeout(() => {
          inputBox.focus();
        }, 50);
      });
    },

    sendMixedMessage(content) {
      const newContent = content.map((item) => {
        if (item.type != MessageType.image) {
          return item;
        }
        // 图片去掉 imgSrc 和 file
        const newItem = { ...item };
        delete newItem.imgSrc;
        delete newItem.file;
        return newItem;
      });

      console.log(newContent);

      const messageItem = {
        time: parseNow(),
        id: generateUniqueId(),
        from: FromType.client,
        content: newContent,
      };

      // 发送到服务器
      this.wsService.send({
        type: "message",
        data: messageItem,
      });
    },

    keepScrollTop() {
      // 保存当前滚动位置和高度
      const scrollTop = this.scrollContainer.scrollTop;
      const scrollHeight = this.scrollContainer.scrollHeight;

      this.$nextTick(() => {
        // 计算新内容的高度
        const newScrollHeight = this.scrollContainer.scrollHeight;
        const heightDiff = newScrollHeight - scrollHeight;

        // 设置滚动位置到原来的位置加上新内容的高度
        this.scrollContainer.scrollTop = scrollTop + heightDiff;
      });
    },

    // 新增滚动方法
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.chatContainer;
        container.scrollTop = container.scrollHeight;
      });

      // 方法1：使用scrollIntoView（平滑滚动）
      // container.scrollTo({
      //   top: container.scrollHeight,
      //   behavior: 'smooth'
      // });

      // 方法2：直接设置scrollTop（立即滚动）

      // 方法3：滚动到最后一个消息元素（更精确）
      // const messages = container.querySelectorAll('.item-l, .item-r');
      // if (messages.length > 0) {
      //   messages[messages.length - 1].scrollIntoView({
      //     behavior: 'smooth'
      //   });
      // }
    },
  },
};
</script>
<style lang="scss" scoped>
i {
  font-style: normal;
}

.video-wrap {
  height: 100vh;
  width: 160rem;
  position: absolute;
  top: 0;
  left: 0;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: #000;
  z-index: 100;
}

.video-box {
  height: 106.6667rem;
  width: 160rem;
  position: absolute;
  top: 0;
  left: 0;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.chat-container {
  position: relative;
  
  display: flex;
  flex-direction: column;
  max-width: 160rem;
  margin: 0 auto;

  .title {
    font-size: 3.7333rem;
    padding: 2.6667rem;
    text-align: center;
    color: white;
    background-color: #0078d4;
  }

  // WebSocket 状态提示
  .ws-status-tip {
    position: absolute;
    top: 13.3333rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    padding: 2rem 4rem;
    border-radius: 1rem;
    font-size: 3.2rem;
    color: white;
    display: flex;
    align-items: center;
    gap: 1.5rem;
    box-shadow: 0 0.5rem 2rem rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;

    i {
      font-size: 4rem;
    }

    // 连接中
    &.ws-status-connecting {
      background-color: #409EFF;
    }

    // 连接成功
    &.ws-status-connected {
      background-color: #67C23A;
    }

    // 连接断开
    &.ws-status-disconnected {
      background-color: #E6A23C;
    }

    // 重连中
    &.ws-status-reconnecting {
      background-color: #409EFF;
    }

    // 错误
    &.ws-status-error {
      background-color: #F56C6C;
    }

    // 连接失败
    &.ws-status-failed {
      background-color: #F56C6C;
    }

    // 聊天室已关闭
    &.ws-status-chatroom-closed {
      background-color: #909399;
    }
  }
}

// 状态提示动画
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter,
.slide-down-leave-to {
  transform: translateX(-50%) translateY(-100%);
  opacity: 0;
}

.order-box {
  background-color: white;
  // height: 300px;
  // border-radius: 0 0 15px 15px;
  padding: 0 2.6667rem;
  font-size: 3.7333rem;
  color: #333;

  .order-info {
    padding: 2.6667rem 4rem;
    border: 1px solid #409eff;
    border-radius: 10px;

    .line-item {
      display: flex;
      justify-content: space-between;
      border-bottom: 0.2667rem dotted #333;
      padding-bottom: 2.1333rem;

      .item {
        text-align: center;

        .label {
          font-size: 12px;
        }

        .money {
          color: #ea443b;
        }

        .value {
          font-weight: 600;
          font-size: 3.7333rem;
          margin-top: 10px;
        }
      }
    }

    .remark {
      font-size: 3.2rem;
      display: flex;
      justify-content: space-between;
      margin-top: 1.3333rem;
    }
  }

  .ext-info {
    padding: 1.6rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .num-info {
      .line {
        display: flex;
        line-height: 1.5;
        align-items: center;

        .label {
          font-size: 3.2rem;
          color: #8c8e92;
        }

        .value {
          font-size: 3.7333rem;
          color: #333;
          margin-left: 2.6667rem;
        }
      }
    }

    .msg-info {
      color: #333;
      font-size: 3.7333rem;
    }

    .btn-box {
      // display: flex;
      // flex-direction: column-reverse;
      .close {
        // background-image: linear-gradient(to right, #edd0be 0%, #fff6ed 50%, #ae9281 100%);
        // color: #1d2129;
        // border-radius: 12px;
      }
    }
  }
}

.chat-box {
  font-size: 3.7333rem;
  overflow-y: auto;
  flex: 1;
  ::v-deep p{
    margin: 0;
    padding: 0;
  }
}

.chat {
  padding: 1.6rem;
  background-color: #f5f5f5;
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  align-items: flex-end;
  line-height: 1.4;
  min-height: 100%;

  .item-r,
  .item-l {
    display: flex;
    justify-content: flex-start;
    margin: 1.3333rem 0;
    width: 100%;
    align-items: flex-start;

    ::v-deep .el-loading-spinner .circular {
      width: 8rem;
      height: 8rem;
    }

    .avatar {
      width: 8rem;
      height: 8rem;
      border-radius: 1.3333rem;
      overflow: hidden;

      // border: .5333rem solid white;
      img {
        width: 100%;
      }
    }

    .time {
      align-self: flex-end;
      font-size: 10px;
      margin: 5px;
      color: #aaa;
    }

    .content {
      position: relative;
      padding: 1.3333rem 2.9333rem;
      /* 4.9999px / 3.75, 10.9999px / 3.75 */
      // display: flex;
      // flex-wrap: wrap;
      font-size: 3.7333rem;
      background-color: #fff;
      min-height: 8rem;
      /* 49.9999px / 3.75 */
      max-width: 70%;
      border-radius: 2rem;
      overflow-wrap: anywhere;
      /* 4.9999px / 3.75 */

      .time {
        font-size: 3.2rem;
        /* 12px / 3.75 */
        color: #999;
      }

      .play-icon {
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 12rem;
        font-size: 8rem;
        color: #333;
        height: 12rem;
        background-color: rgba($color: #fff, $alpha: 0.7);
        border-radius: 50%;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }

      .img {
        max-width: 26.6667rem;
        // border-radius: 2.1333rem;
      }
    }
  }

  .item-l {
    justify-content: flex-start;

    .content {
      background-color: #fff;
      margin-left: 2.6667rem;

      .time {
        text-align: left;
      }

      &::after {
        position: absolute;
        // background-color: red;
        content: "";
        width: 0;
        height: 0;
        border-top: 1.6rem solid transparent;
        border-left: 1.6rem solid transparent;
        border-right: 1.6rem solid #fff;
        border-bottom: 1.6rem solid transparent;
        top: 1.6rem;
        left: -2.6667rem;
      }
    }
  }

  .item-r {
    justify-content: flex-end;

    .content {
      margin-right: 2.6667rem;
      background-color: #95ec69;

      .time {
        text-align: right;
      }

      &::after {
        position: absolute;
        content: "";
        width: 0;
        height: 0;
        border-top: 1.6rem solid transparent;
        border-left: 1.6rem solid #95ec69;
        border-right: 1.6rem solid transparent;
        border-bottom: 1.6rem solid transparent;
        top: 1.6rem;
        right: -2.6667rem;
      }
    }
  }
}

.chat-input-area {
  display: flex;
  align-items: center;
  border-top: 0.2667rem solid #ccc;
  background-color: #eee;
  padding: 1.6rem;

  .toolbar {
    display: flex;
    align-items: center;
    height: 8rem;
    overflow: hidden;
    transition: width 0.2s linear;

    // padding: 4.9999px;
    .happy {
      font-size: 6.4rem;
      margin-right: 2.6667rem;
    }

    .el-icon-circle-plus-outline {
      font-size: 7.4667rem;
    }

    .action-bar {
      overflow: hidden;

      button {
        padding: 1.6rem 4rem;
        font-size: 3.7333rem;
        color: white;
        border-radius: 1.3333rem;
        background-color: #07c160;
        border: none;
      }
    }
  }

  .input-box {
    flex: 1;
    min-height: 8rem;
    font-size: 3.7333rem;
    background-color: #fff;
    line-height: 1.5;
    outline: none;
    /* 移除焦点时的边框 */
    overflow-y: auto;
    max-height: 32rem;
    margin-right: 2.6667rem;
    padding-left: 1.3333rem;
    padding-top: 1.3333rem;
  }
}

/* 实现 placeholder 的效果 */
.input-box:empty:before {
  content: attr(placeholder);
  color: #999;
  cursor: text;
}

.item-wraper {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  background-color: #fff;

  .emoji-item {
    width: 10%;
    height: 8rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 4.2667rem;
  }
}

.picker-box {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  height: 40rem;
  background-color: #eee;
  padding: 3rem;
  border-top: 0.2667rem solid #ccc;
}

.loading-status {
  width: 100%;
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
