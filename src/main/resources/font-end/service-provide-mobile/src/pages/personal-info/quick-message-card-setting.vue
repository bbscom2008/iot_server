<template>
  <view
    class="page-container"
    :style="{ paddingTop: $store.state.navBarHeight + 'rpx' }"
  >
    <custom-nav-bar title="快捷卡片配置"></custom-nav-bar>

    <view class="page-buttons">
      <button class="add-btn" @click="addInputMsg()">增加一条</button>
      <button class="save-btn" @click="onSave()">保存</button>
    </view>

    <uni-forms :model="formData" label-position="left" label-width="30">
      <view
        class="input-line"
        v-for="(item, index) in formData.cardList"
        :key="index"
      >
        <view class="content-wrapper">
          <uni-forms-item label="标题">
            <uni-easyinput
              v-model="item.title"
              placeholder="请输入标题"
              @input="hasChanges = true"
            />
          </uni-forms-item>

          <uni-forms-item label="内容">
            <uni-easyinput
              v-model="item.value"
              placeholder="请输入内容"
              type="textarea"
              :rows="2"
              @input="hasChanges = true"
            />
          </uni-forms-item>

          <uni-forms-item label="账号">
            <uni-easyinput
              v-model="item.username"
              placeholder="请输入账号"
              @input="hasChanges = true"
            />
          </uni-forms-item>

          <uni-forms-item label="备注">
            <uni-easyinput
              v-model="item.remark"
              placeholder="请输入备注"
              @input="hasChanges = true"
            />
          </uni-forms-item>

          <u-row align="bottom" gutter="10">
            <u-col :span="10">
              <view class="qr-code-wrapper">
                <my-qr-code v-if="item.value" :value="item.value" :size="140">
                </my-qr-code>
              </view>
            </u-col>
            <u-col :span="2" style="padding-top: 16rpx">
              <u-button type="error" size="mini" @click="removeInput(index)">删除</u-button>
            </u-col>
          </u-row>
        </view>
      </view>
    </uni-forms>
  </view>
</template>

<script>
import { addShortMessage, getShortMessage } from '@/api/chat'
import MyQrCode from '@/components/MyQrCode/MyQrCode.vue'

export default {
  name: 'QuickMessageCardSetting',
  components: { MyQrCode },
  data() {
    return {
      formData: {
        cardList: [
          // {
          //   text: ''
          // }
        ]
      },
      // originalData: null, // 保存原始数据用于比较
      hasChanges: false // 标记是否有修改
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
      if (this.$store.state.quickCardList.length == 0) {
        await this.$store.dispatch('getShortMessageAction')
      }

      this.formData.cardList = this.$store.state.quickCardList
    },

    addInputMsg() {
      this.formData.cardList.push({
        type: 'card',
        title: '',
        value: '',
        username: '',
        remark: ''
      })
      this.hasChanges = true
    },

    removeInput(index) {
      this.formData.cardList.splice(index, 1)
      this.hasChanges = true
    },

    onSave() {
      this.formData.cardList = this.formData.cardList.filter(
        (item) => item.value.trim().length > 0
      )

      if (this.formData.cardList.length == 0) {
        uni.showToast({
          title: '请添加快捷卡片',
          icon: 'none'
        })
        return
      }

      const params = {
        providerId: this.$store.state.personalInfo.providerId,
        content: JSON.stringify(
          this.formData.cardList.concat(this.$store.state.quickMessageList)
        )
      }

      if(this.$store.state.allQuickMessageList.length > 0){
        params.id = this.$store.state.allQuickMessageList[0].id
      }

      addShortMessage(params).then((res) => {
        uni.showToast({
          title: '保存成功',
          icon: 'success'
        })
        this.$store.commit('updateQuickCardList', this.formData.cardList)
        this.hasChanges = false // 保存成功后重置修改标记
        // this.originalData = JSON.parse(JSON.stringify(this.formData.cardList)) // 更新原始数据
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
  padding: 20rpx;
  margin: 20rpx;
  border-radius: 20rpx;

  .qr-code-wrapper {
    display: flex;
    justify-content: center;
    margin-bottom: 20rpx;
  }
}

.add-btn {
  flex: 1;
  background-image: linear-gradient(
    to right,
    #edd0be 0%,
    #fff6ed 50%,
    #ae9281 100%
  );
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
  background-image: linear-gradient(
    to right,
    #edd0be 0%,
    #fff6ed 50%,
    #ae9281 100%
  );
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
