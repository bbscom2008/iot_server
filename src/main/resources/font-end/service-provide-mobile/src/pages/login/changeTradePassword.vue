<template>
  <view
    class="change-password-container isShowUi"
    style="padding-top: 130rpx; padding-bottom: 200rpx"
  >
    <custom-nav-bar title="修改交易密码"></custom-nav-bar>

    <view class="form-box">
      <uni-forms
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="180rpx"
        label-position="top"
      >
        <!-- 用户名展示 -->
        <uni-forms-item label="用户名" name="username">
          <uni-easyinput :value="$store.state.userName" disabled />
        </uni-forms-item>

        <!-- 原密码输入 -->
        <uni-forms-item label="原交易密码" name="oldTradePwd" >
          <uni-easyinput
            type="password"
            v-model="formData.oldTradePwd"
            placeholder="请输入原交易密码"
            @blur="validateField('oldTradePwd')"
          />
        </uni-forms-item>

        <!-- 新密码输入 -->
        <uni-forms-item label="新密码" name="newTradePwd" required>
          <uni-easyinput
            type="password"
            v-model="formData.newTradePwd"
            placeholder="新输入新密码"
            @blur="validateField('newTradePwd')"
          />
        </uni-forms-item>

        <!-- 确认密码 -->
        <uni-forms-item label="确认密码" name="confirmPassword" required>
          <uni-easyinput
            type="password"
            v-model="formData.confirmPassword"
            @blur="validateField('confirmPassword')"
            placeholder="请再次输入新密码"
          />
        </uni-forms-item>
        
        <uni-forms-item label="登录密码" name="loginPwd" required>
          <uni-easyinput
            type="password"
            v-model="formData.loginPwd"
            @blur="validateField('loginPwd')"
            placeholder="请输入登录密码"
          />
        </uni-forms-item>
        

        <uni-forms-item label="谷歌密钥" name="googleCode" required>
          <uni-easyinput
            type="number"
            maxlength="6"
            v-model="formData.googleCode"
            @blur="validateField('googleCode')"
            placeholder="请输入6位密钥"
          />
        </uni-forms-item>

        <!-- 操作按钮 -->
        <view class="button-group">
          <u-button icon="reload" class="reset-btn" @click="handleReset"
            >重置</u-button
          >
          <u-button
            icon="checkbox-mark"
            class="confirm-btn"
            @click="handleSubmit"
            >确认修改</u-button
          >
        </view>
      </uni-forms>
    </view>
  </view>
</template>

<script>
import { userNameRule, passwordRule, googleCodeRule } from '@/utils/validate.js'

import { changeTradePassword } from '@/api/login.js'

export default {
  data() {
    return {
      formData: {
      },
      rules: {
        oldTradePwd: {
          rules: [
            passwordRule
          ]
        },
        
        newTradePwd: {
          rules: [
            {
              required: true,
              errorMessage: '请输入新密码'
            },
            passwordRule
          ]
        },
        
        confirmPassword: {
          rules: [
            {
              required: true,
              errorMessage: '请确认新密码'
            },
            passwordRule,
            {
              validateFunction: (rule, value, data, callback) => {
                if (value !== this.formData.newTradePwd) {
                  callback('两次输入的密码不一致')
                }
                return true
              }
            }
          ]
        },
        loginPwd: {
          rules: [
            {
              required: true,
              errorMessage: '请输入登录密码'
            },
            passwordRule
          ]
        },
        
        googleCode: {
          rules: [
            {
              required: true,
              errorMessage: '请输入谷歌验证码'
            },
            googleCodeRule
          ]
        }
      }
    }
  },
  methods: {
    // 提交修改
    handleSubmit() {
      this.$refs.formRef
        .validate()
        .then((res) => {
          changeTradePassword({
            ...this.formData
          }).then((ret) => {
            console.log(ret)
            this.$message.success('交易密码设置成功')
            uni.navigateBack()
          })
        })
        .catch((err) => {
          console.log('表单验证失败:', err)
        })
    },

    // 重置表单
    handleReset() {
      this.formData.oldTradePwd = ''
      this.formData.newTradePwd = ''
      this.formData.confirmPassword = ''
      this.formData.loginPwd = ''
      this.formData.googleCode = ''
      this.$refs.formRef.clearValidate()
    },

    // 单独校验字段
    validateField(name) {
      this.$refs.formRef.validateField(name)
    }
  }
}
</script>

<style scoped>
.change-password-container {
  padding: 30rpx;
  background-color: #eff4ff;
  min-height: 100vh;
}
.form-box{
  background-color: #fff;
  padding: 20rpx 30rpx;
  border-radius: 20rpx;
}
/* 表单项样式 */
/deep/ .uni-forms-item {
  margin-bottom: 30rpx;
}

/* 按钮组样式 */
.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 60rpx;
}

.reset-btn,
.confirm-btn {
  width: 48%;
  height: 90rpx;
  line-height: 90rpx;
  border-radius: 8rpx;
  font-size: 32rpx;
}

.reset-btn {
  background-color: #f5f5f5;
  color: #666;
  border: 1rpx solid #ddd;
}

.confirm-btn {
  background-color: #409eff;
  color: #fff;
}

/* 禁用状态下的用户名输入框样式 */
/deep/ .is-disabled .uni-easyinput__content {
  background-color: #f5f5f5;
  color: #666;
}
</style>
