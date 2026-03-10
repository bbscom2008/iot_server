<template>
  <view
    class="profile-container"
    :style="{ paddingTop: $store.state.navBarHeight + 'rpx' }"
  >
    <custom-nav-bar title="个人信息"></custom-nav-bar>

    <!-- 加载状态 -->
    <uni-load-more v-if="loading" status="loading"></uni-load-more>

    <!-- 个人信息展示 -->
    <view v-else class="profile-card">
      <view class="info-item">
        <text class="info-label">账号</text>
        <text class="info-value">{{ profileData.providerId || '' }}</text>
      </view>

      <view class="info-item">
        <text class="info-label">用户名称</text>
        <text class="info-value">{{ profileData.userNickName || '' }}</text>
      </view>

      <view class="info-item">
        <text class="info-label">登录设备</text>
        <text class="info-value">{{ profileData.loginDevice || '' }}</text>
      </view>

      <view class="info-item">
        <text class="info-label">登录IP</text>
        <text class="info-value">{{ profileData.loginIp || '' }}</text>
      </view>

      <view class="info-item">
        <text class="info-label">最后登录时间</text>
        <text class="info-value">{{ profileData.lastLoginDate || '' }}</text>
      </view>

      <view class="info-item">
        <text class="info-label">创建时间</text>
        <text class="info-value">{{ profileData.createTime || '' }}</text>
      </view>
    </view>

    <view class="notice">
      <text class="notice-text">重置谷歌密钥，请联系系统管理员</text>
    </view>

    <view class="profile-card menu-box">
      <view class="menu-item" @click="jumpTo('/pages/login/changePassword')">
        <text class="">修改登录密码</text>
        <text class=""
          ><uni-icons type="right" size="20" color="#666"></uni-icons
        ></text>
      </view>

      <view
        class="menu-item"
        @click="jumpTo('/pages/login/changeTradePassword')"
      >
        <text class="">修改交易密码</text>
        <text class=""
          ><uni-icons type="right" size="20" color="#666"></uni-icons
        ></text>
      </view>
    </view>

    <view class="notice">
      <text class="notice-text">其他设置</text>
    </view>

    <view class="profile-card menu-box">
      <!-- 此处时一个开关按钮，来控制是否是聊天室模式 -->
      <view class="menu-item">
        <text class="">开启聊天室订单模式</text>
        <my-switch :value="isChatRoomMode" @change="onChatRoomModeChange" />
      </view>

      <!-- 当开关打开时显示支付设置菜单 -->
      <view
        v-if="isChatRoomMode === 1"
        class="menu-item"
        @click="jumpToPaymentSettings"
      >
        <text class="">支付设置</text>
        <text class=""
          ><uni-icons type="right" size="20" color="#666"></uni-icons
        ></text>
      </view>
      <view
        v-if="isChatRoomMode === 1"
        class="menu-item"
        @click="jumpToQuickMessageSettings"
      >
        <text class="">快捷短语设置</text>
        <text class=""
          ><uni-icons type="right" size="20" color="#666"></uni-icons
        ></text>
      </view>

      <view
        v-if="isChatRoomMode === 1"
        class="menu-item"
        @click="jumpToQuickMessageCardSettings"
      >
        <text class="">快捷卡片设置</text>
        <text class=""
          ><uni-icons type="right" size="20" color="#666"></uni-icons
        ></text>
      </view>

      <view class="menu-item">
        <view @click="clearCache" style="flex: 1">强制清除缓存</view>
      </view>
      <view class="menu-item">
        <view @click="checkUpdate" style="flex: 1">检查更新</view>
      </view>
    </view>

    <button type="primary" @click="showConfirmLogout()" class="logout-btn">
      退出登录
    </button>

    <view v-if="getApkVersion()"  class="version-info">当前APK版本：{{ getApkVersion() }}</view>
  </view>
</template>

<script>
// import {
// 	getProviderInfoDetailByProvider
// } from '@/api/personal-info.js'
import { logout } from '@/api/user.js'

import { checkApkVersion, getApkVersion } from '@/utils/checkApkVersion'
import { isAndroidApp } from '@/utils/index.js'

export default {
  data() {
    return {
      loading: true,
      profileData: {
        providerId: '',
        userNickName: '',
        loginDevice: '',
        loginIp: '',
        lastLoginDate: '',
        createTime: ''
      }
    }
  },
  computed: {
    isChatRoomMode() {
      // 直接返回 store 中的数字值 (0 或 1)
      return this.$store.state.isChatRoomMode
    }
  },
  created() {
    this.fetchProfileData()
  },
  methods: {
    getApkVersion,
    clearCache() {
      // 弹出确认框
      uni.showModal({
        title: '确认',
        content: '确定要清除缓存吗？',
        success: (res) => {
          if (res.confirm) {
            uni.clearStorageSync()
            uni.showToast({
              title: '缓存已清除',
              icon: 'none'
            })
          }
        }
      })
    },
    checkUpdate() {
      console.log('--------checkUpdate------------')

      checkApkVersion()
    },
    jumpTo(page) {
      uni.navigateTo({
        url: page
      })
    },

    // 跳转到支付设置页面
    jumpToPaymentSettings() {
      uni.navigateTo({
        url: '/pages/personal-info/payment-settings'
      })
    },

    // 聊天室模式开关切换
    onChatRoomModeChange(value) {
      // 直接使用数字值 (0 或 1)
      this.$store.commit('setIsChatRoomMode', value)

      uni.showToast({
        title: value === 1 ? '已开启聊天室订单模式' : '已关闭聊天室订单模式',
        icon: 'none'
      })
    },

    // 跳转到快捷短语设置页面
    jumpToQuickMessageSettings() {
      uni.navigateTo({
        url: '/pages/personal-info/quick-message-setting'
      })
    },

    // 跳转到快捷卡片设置页面
    jumpToQuickMessageCardSettings() {
      uni.navigateTo({
        url: '/pages/personal-info/quick-message-card-setting'
      })
    },

    // 获取个人信息
    async fetchProfileData() {
      this.loading = true
      try {
        // let ret = await getProviderInfoDetailByProvider()
        this.profileData = await this.$store.dispatch('getPersonalInfo')
      } catch (error) {
        uni.showToast({
          title: '获取信息失败',
          icon: 'none'
        })
        console.error('API Error:', error)
      } finally {
        this.loading = false
      }
    },

    showConfirmLogout() {
      uni.showModal({
        title: '提示',
        content: '确认要退出吗？',
        success: async (res) => {
          if (res.confirm) {
            console.log('用户点击了确认')

            // 退出登陆，
            logout()
            this.$store.dispatch('logout_clean')
            uni.reLaunch({
              url: '/pages/login/login'
            })
          } else if (res.cancel) {
            console.log('用户点击了取消')
          }
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.profile-container {
  padding: 20rpx 20rpx 100rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
  box-sizing: border-box;
}

.profile-card {
  margin-top: 40rpx;
  border-radius: 40rpx;
  padding: 40rpx;
  .info-item {
    .info-label {
      text-align: left;
    }
    .info-value {
      text-align: right;
    }
  }
}

.logout-btn {
  margin-top: 100rpx;
}

.notice {
  margin-top: 40rpx;
  text-align: center;
  color: #ff4d4f;
}

.k-btn {
  margin-top: 100rpx;
  background-image: linear-gradient(to right, #ae9281 0%, #edd0be 100%);
  font-weight: 600;
  color: #000;
  border-radius: 20rpx;
}

.menu-box {
  padding: 20rpx 50rpx;
  .menu-item {
    padding: 20rpx 0;
    display: flex;
    justify-content: space-between;
    border-bottom: 2rpx solid #ccc;
    margin: 20rpx 0;
  }
  .switch-item {
    align-items: center;
    .switch-label {
      font-size: 32rpx;
      color: #333;
    }
  }

  .menu-item:last-child {
    border-bottom: none;
  }
}
.version-info {
  text-align: center;
  margin-top: 40rpx;
  font-size: 12px;
  color: #888;
}
</style>
