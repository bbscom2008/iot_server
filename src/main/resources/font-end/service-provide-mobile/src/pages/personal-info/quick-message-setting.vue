<template>
  <view 
    class="page-container"
    :style="{ paddingTop: $store.state.navBarHeight + 'rpx' }"
  >
    <custom-nav-bar title="快捷短语配置"></custom-nav-bar>

    <view class="page-buttons">
      <button class="add-btn" @click="addInputMsg()">增加一条</button>
      <button class="save-btn" @click="onSave()">保存</button>
    </view>

    <view class="content-wrapper">
      <uni-forms :model="formData" label-position="left" label-width="0">
        <view
          class="input-line"
          v-for="(item, index) in formData.messageList"
          :key="index"
        >
          <u-row align="top" gutter="10">
            <u-col :span="10">
              <uni-forms-item label="">
                <uni-easyinput
                  v-model="item.text"
                  placeholder="请输入内容"
                  @input="hasChanges = true"
                />
              </uni-forms-item>
            </u-col>

            <u-col :span="2" style="padding-top: 16rpx">
              <u-button
                type="error"
                size="mini"
                @click="removeInput(index)"
              >删除</u-button>
            </u-col>
          </u-row>
        </view>
      </uni-forms>
    </view>
  </view>
</template>

<script>
import { addShortMessage, getShortMessage } from '@/api/chat'

export default {
  name: 'QuickMessageSetting',
  data() {
    return {
      formData: {
        messageList: [
          // {
          //   text: ''
          // }
        ]
      },
      hasChanges: false, // 标记是否有修改
    }
  },
  computed: {},
  created() {
    this.getShortMessage()
  },
  
  // 页面离开时检查是否有未保存的修改
  onBackPress() {
    if (this.hasChanges) {
      uni.showModal({
        title: '提示',
        content: '您有未保存的修改，确定要离开吗？',
        success: (res) => {
          if (res.confirm) {
            // 用户确认离开
            uni.navigateBack()
          }
          // 用户取消，不执行任何操作
        }
      })
      return true // 阻止默认返回行为
    }
    return false // 允许正常返回
  },
  methods: {
    /**
     * 获取快捷短语
     */
    async getShortMessage() {

      if (this.$store.state.quickMessageList.length == 0) {
        await this.$store.dispatch('getShortMessageAction')
      }

      this.formData.messageList = this.$store.state.quickMessageList
    },

    addInputMsg() {
      this.formData.messageList.push({
        text: ''
      })
      this.hasChanges = true
    },

    removeInput(index) {
      this.formData.messageList.splice(index, 1)
      this.hasChanges = true
    },

    onSave() {
      this.formData.messageList = this.formData.messageList.filter(item => item.text.trim().length > 0)

      if (this.formData.messageList.length == 0) {
        uni.showToast({
          title: '请输入快捷短语',
          icon: 'none'
        })
        return
      }

      const params = {
        providerId: this.$store.state.personalInfo.providerId,
        content: JSON.stringify(this.formData.messageList.concat(this.$store.state.quickCardList))
      }

      if(this.$store.state.allQuickMessageList.length > 0){
        params.id = this.$store.state.allQuickMessageList[0].id
      }

      addShortMessage(params).then((res) => {
        uni.showToast({
          title: '保存成功',
          icon: 'success'
        })
        this.$store.commit(
          'updateQuickMessageList',
          this.formData.messageList
        )
        this.hasChanges = false // 保存成功后重置修改标记
        // this.originalData = JSON.parse(JSON.stringify(this.formData.messageList)) // 更新原始数据
        uni.navigateBack()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-container {
  background-color: #f5f5f5;
  min-height: 100vh;
}

.page-buttons {
  display: flex;
  justify-content: space-between;
  padding: 20rpx;
  background-color: #fff;
  border-bottom: 1rpx solid #f0f0f0;
  gap: 20rpx;
}

.content-wrapper {
  background-color: #fff;
  padding: 40rpx 20rpx;
  margin: 20rpx;
  border-radius: 20rpx;
}

.add-btn {
  flex: 1;
  background-image: linear-gradient(to right, #edd0be 0%, #fff6ed 50%, #ae9281 100%);
  color: #232738;
  border: none;
  border-radius: 40rpx;
  padding: 20rpx;
  font-size: 28rpx;
  line-height: 1;
  font-weight: 600;
}

.save-btn {
  flex: 1;
  background-image: linear-gradient(to right, #edd0be 0%, #fff6ed 50%, #ae9281 100%);
  color: #232738;
  border: none;
  line-height: 1;
  border-radius: 40rpx;
  padding: 20rpx;
  font-size: 28rpx;
  font-weight: 600;
}

::v-deep .uni-forms-item {
  margin-bottom: 8px;
}
</style>
