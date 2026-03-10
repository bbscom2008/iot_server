<template>
  <!-- 确认 、 接单 、 补单  弹窗 -->
  <view class="container isShowUi">
    <uni-popup
      class="check-popup"
      ref="procOrderPopupRef"
      style="width: 80%"
      :show="showCheckPwdPopup"
      @maskClick="closeOrderModal()"
    >
      <view class="query-popup">
        <view class="popup-header">
          <text class="popup-title">校验交易密码</text>
          <uni-icons type="closeempty" class="close-icon" size="26" @click="closeSearchModal()"></uni-icons>
        </view>
        <view class="txt-info">
          请输入交易密码，如有疑问，<text class="setting-link" @click="goToSetting">请前去设置</text>。
        </view>
        <uni-forms
          ref="queryFormDataRef"
          class="deal-info"
          :model="formData"
          label-position="left"
          label-width="200"
        >
          <uni-forms-item label="" name="">
            <uni-easyinput v-model="formData.password"
                placeholder="请输入交易密码"
             type="password" />
          </uni-forms-item>
        </uni-forms>

        <view class="query-buttons">
          <button class="reset-btn" @click="closeOrderModal()">取消</button>
          <button class="search-btn" @click="orderBtnOk()">确认</button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import { checkTradePassword } from '@/api/user.js'

export default {
  name: 'checkTradePassword',
  props: {
    showCheckPwdPopup: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {
        password: ''
      }
    }
  },
  watch: {
    showCheckPwdPopup(v) {
      if (this.$refs.procOrderPopupRef) {
        if (v) {
          this.$refs.procOrderPopupRef.open('center')
        } else {
          this.$refs.procOrderPopupRef.close()
        }
      }
    }
  },
  methods: {
    // 校验交易密码
    async orderBtnOk() {
      if (!this.formData.password) {
        uni.showToast({
          title: '请输入交易密码',
          icon: 'none'
        })
        return
      }
      try {
        const res = await checkTradePassword(this.formData.password)
        if (res.data) {
          uni.showToast({
            title: '校验成功',
            icon: 'success'
          })
          this.$emit('checkSuccess')
          this.closeOrderModal()
        } else {
          uni.showToast({
            title: '校验失败',
            icon: 'none'
          })
        }
      } catch (error) {
        uni.showToast({
          title: '校验失败',
          icon: 'none'
        })
      }
    },
    // 关闭弹窗
    closeOrderModal() {
      this.formData.password = ''
      this.$emit('update:showCheckPwdPopup', false)
    },
    // 跳转到设置页面
    goToSetting() {
      this.closeOrderModal()
      uni.navigateTo({
        url: '/pages/login/changeTradePassword'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.query-popup {
  background-color: #eff4ff;
}
.txt-info{
  padding: 30rpx;
}
.setting-link {
  color: #007aff;
  text-decoration: underline;
  cursor: pointer;
}
::v-deep .uni-popup__wrapper{
    width:80%
}
</style>
