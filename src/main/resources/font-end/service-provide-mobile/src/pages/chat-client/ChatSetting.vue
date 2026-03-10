<template>
  <uni-popup
    ref="queryPopupRef"
    :show="dialogVisible"
    @maskClick="onDialogBtnCancel()"
  >
    <view class="query-popup">
      <view class="popup-header">
        <text class="popup-title">快捷短语配置</text>
        <uni-icons
          type="closeempty"
          class="close-icon"
          size="26"
          @click="onDialogBtnCancel()"
        ></uni-icons>
      </view>

      <scroll-view class="modal-content" scroll-y :scroll-top="scrollTop">
        <view class="chat-setting-popup">
          <uni-forms :model="formData" label-position="left" label-width="0">
            <!-- <view style="margin-bottom: 30rpx">
              <u-button
                type="primary"
                style="width: 60%"
                @click="addInputMsg()"
                >增加一条</u-button
              >
            </view> -->

            <view
              class="input-line"
              v-for="(item, index) in formData.messageList"
              :key="index"
            >
              <u-row align="top" gutter="10" >
                <u-col :span="10">
                  <uni-forms-item label="">
                    <uni-easyinput
                      v-model="item.text"
                      placeholder="请输入内容"
                    />
                  </uni-forms-item>
                </u-col>

                <u-col :span="2" style="padding-top: 16rpx" >
                  <u-button
                    type="error"
                    size="mini"
                    @click="removeInput(index)"
                    >删除</u-button
                  >
                </u-col>
              </u-row>
            </view>
          </uni-forms>
        </view>
      </scroll-view>

      <view class="query-buttons">
        <button class="reset-btn" @click="onDialogBtnCancel()">取消</button>
        <button class="search-btn" @click="onDialogBtnOk()">确定</button>
        <button class="search-btn" @click="addInputMsg()">增加一条</button>
      </view>
    </view>
  </uni-popup>
</template>

<script>
import { addShortMessage, getShortMessage } from '@/api/chat'

export default {
  name: 'ChatSetting',
  data() {
    return {
      dialogVisible: true,
      formData: {
        messageList: [
          {
            text: ''
          }
        ]
      },
      responseData: null,
      scrollTop: 99999,
    }
  },
  computed: {},
  mounted() {
    this.$refs.queryPopupRef.open('bottom')
    this.getShortMessage()
  },
  methods: {
    scrollToBottom() {
      this.scrollTop = 99998
      this.$nextTick(() => {
        this.scrollTop = 99999 // 足够大的值确保滚动到底
      })
    },
    /**
     * 获取快捷短语
     */
    async getShortMessage() {
      const res = await getShortMessage(
        this.$store.state.personalInfo.providerId
      )
      if (res.data && res.data.length > 0) {
        this.responseData = res.data[0]
        this.formData.messageList = JSON.parse(res.data[0].content)
        this.$store.commit('updateQuickMessageList', this.formData.messageList)
      }
    },
    showChatSetting() {
      this.dialogVisible = true
    },

    onDialogBtnCancel() {
      console.log('===onDialogBtnCancel==')
      this.dialogVisible = false
      this.$emit('close')
      this.$refs.queryPopupRef.close()
    },

    addInputMsg() {
      this.formData.messageList.push({
        text: ''
      })
      this.scrollToBottom()
    },

    removeInput(index) {
      this.formData.messageList.splice(index, 1)
    },

    onDialogBtnOk() {

      this.formData.messageList = this.formData.messageList.filter(item => item.text.trim().length>0)

       if(this.formData.messageList.length == 0){
        this.$message.error('请输入快捷短语')
        return
      }

      const params = {
        providerId: this.$store.state.personalInfo.providerId,
        content: JSON.stringify(this.formData.messageList)
      }

      if (this.responseData && this.responseData.id) {
        params.id = this.responseData.id
      }

      addShortMessage(params).then((res) => {
        
        this.$message.success('保存成功')
        this.$store.commit(
          'updateQuickMessageList',
          this.formData.messageList
        )
        this.$emit('close')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.chat-setting-popup {
  background-color: #fff;
  padding-top: 40rpx;
}

::v-deep .uni-forms-item{
  margin-bottom: 8px;
}
</style>
