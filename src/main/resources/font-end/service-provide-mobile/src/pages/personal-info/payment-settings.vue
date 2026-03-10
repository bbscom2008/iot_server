<template>
  <view
    class="profile-container"
    :style="{ paddingTop: $store.state.navBarHeight + 'rpx' }"
  >
    <custom-nav-bar title="支付设置"></custom-nav-bar>

    <!-- 保存按钮 -->
    <view class="save-button-container">
      <view class="save-button" @click="handleSave">
        <text class="save-button-text">保存</text>
      </view>
    </view>

    <!-- 支付方式列表 -->
    <view class="payment-list">
      <view
        v-for="(item, index) in paymentMethods"
        :key="item.id"
        class="payment-item-wrapper"
      >
        <view class="payment-item">
          <view class="payment-info">
            <image
              :src="'/static/img_bank/' + item.icon"
              class="payment-icon"
              mode="aspectFit"
            ></image>
            <view class="payment-details">
              <text class="payment-name">{{ item.name }}</text>
              <text class="payment-desc">{{ item.description }}</text>
            </view>
          </view>
          <my-switch
            :value="item.enabled"
            @change="onPaymentMethodChange(index, $event)"
          />
        </view>
        <!-- 控制盒子：当支付方式开启时显示 -->
        <view v-if="item.enabled === 1" class="control-box">
          <!-- 上移下移按钮（左侧） -->
          <view class="move-buttons">
            <view
              class="control-btn-small"
              :class="{ disabled: index === 0 }"
              @click="moveUp(index)"
            >
              <text class="control-btn-text-small">上移</text>
            </view>
            <view
              class="control-btn-small"
              :class="{ disabled: index === paymentMethods.length - 1 }"
              @click="moveDown(index)"
            >
              <text class="control-btn-text-small">下移</text>
            </view>
          </view>
          <!-- 标签选择框（右侧） -->
          <view class="tags-box">
            <checkbox-group
              class="tags-group"
              @change="onTagChange(index, $event)"
            >
              <label
                class="tag-item"
                v-for="tag in tagOptions"
                :key="tag.value"
              >
                <checkbox
                  :value="tag.value"
                  :checked="item.tags && item.tags.includes(tag.value)"
                />
                <text class="tag-text">{{ tag.label }}</text>
              </label>
            </checkbox-group>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { setPaysetting, getPaysetting } from '@/api/pay-setting.js'

import { paymentMethods } from '@/utils/constants.js'

export default {
  data() {
    return {
      paymentMethods: [],
      tagOptions: [
        { label: '强烈推荐', value: 'strongly_recommended' },
        { label: '成功率高', value: 'high_success_rate' },
        { label: '无风控', value: 'no_risk' },
        { label: '秒上分', value: 'instant_credit' }
      ]
    }
  },

  onLoad() {
    // 从后端获取当前支付设置
    this.getPaymentSettings()
  },

  methods: {
    // 上移：找到上一个已开启的条目并交换位置
    moveUp(index) {
      // 从当前索引往前查找已开启的条目
      for (let i = index - 1; i >= 0; i--) {
        if (this.paymentMethods[i].enabled === 1) {
          // 找到上一个已开启的条目，交换位置
          const tempSort = this.paymentMethods[index]
          this.$set(this.paymentMethods, index, this.paymentMethods[i])
          this.$set(this.paymentMethods, i, tempSort)

          this.$nextTick(() => {
            this.$forceUpdate()
          })
          return
        }
      }
      // 如果没找到，说明已经在最顶部或者上面没有已开启的条目
      uni.showToast({
        title: '没有可移动的条目',
        icon: 'none'
      })
    },

    // 下移：找到下一个已开启的条目并交换位置
    moveDown(index) {
      // 从当前索引往后查找已开启的条目
      for (let i = index + 1; i < this.paymentMethods.length; i++) {
        if (this.paymentMethods[i].enabled === 1) {
          // 找到下一个已开启的条目，交换位置
          const tempSort = this.paymentMethods[index]
          this.$set(this.paymentMethods, index, this.paymentMethods[i])
          this.$set(this.paymentMethods, i, tempSort)
          this.$nextTick(() => {
            this.$forceUpdate()
          })
          return
        }
      }
      // 如果没找到，说明已经在最底部或者下面没有已开启的条目
      uni.showToast({
        title: '没有可移动的条目',
        icon: 'none'
      })
    },

    // 获取服务商支付配置
    async getPaymentSettings() {
      // 显示加载框
      uni.showLoading({
        title: '加载中...',
        mask: true
      })

      try {
        let res = await getPaysetting(this.$store.state.personalInfo.providerId)
        console.log('=======getPaymentSettings===========', res)
        if (res.data) {
          let temp = JSON.parse(res.data.paySetting)
          // 是数组，且长度大于 0
          if (
            Array.isArray(temp) &&
            temp.length > 0 &&
            Array.isArray(temp[0].tags)
          ) {
            this.paymentMethods = temp
            return true
          }
        }

        // 默认的数据
        this.paymentMethods = paymentMethods
      } catch (error) {
        console.error('获取支付设置失败:', error)
        // 如果出错，使用默认数据
        this.paymentMethods = paymentMethods
      } finally {
        // 隐藏加载框
        uni.hideLoading()
      }
    },

    // 保存支付设置
    async savePaymentSettings() {
      console.log('savePaymentSettings', this.paymentMethods)

      // 显示加载框
      uni.showLoading({
        title: '保存中...',
        mask: true
      })

      try {
        let res = await setPaysetting({
          providerId: this.$store.state.personalInfo.providerId,
          data: this.paymentMethods
        })

        console.log('=====savePaymentSettings========', res)
        
        // 保存成功提示
        uni.showToast({
          title: '保存成功',
          icon: 'success'
        })
        this.getPaymentSettings()
      } catch (error) {
        console.error('保存支付设置失败:', error)
        uni.showToast({
          title: '保存失败，请重试',
          icon: 'none'
        })
      } finally {
        // 隐藏加载框
        uni.hideLoading()
      }
    },

    // 处理保存按钮点击
    handleSave() {
      this.savePaymentSettings()
    },

    // 标签选择变化
    onTagChange(index, e) {
      const selectedTags = e.detail.value
      this.paymentMethods[index].tags = selectedTags
    },

    // 支付方式开关切换
    onPaymentMethodChange(index, value) {
      this.paymentMethods[index].enabled = value
      this.$forceUpdate()

      const method = this.paymentMethods[index]
      uni.showToast({
        title: value === 1 ? `${method.name}已开启` : `${method.name}已关闭`,
        icon: 'none'
      })
    },

  }
}
</script>

<style scoped lang="scss">
.profile-container {
  padding: 20rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
  box-sizing: border-box;
}

.save-button-container {
  margin-top: 20rpx;
  margin-bottom: 20rpx;
  padding: 0 20rpx;
}

.save-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 88rpx;
  background: linear-gradient(to right, #edd0be 0%, #fff6ed 50%, #ae9281 100%);
  border-radius: 44rpx;
  box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.3);
  transition: all 0.3s;

  &:active {
    transform: scale(0.98);
    box-shadow: 0 2rpx 8rpx rgba(102, 126, 234, 0.2);
  }
}

.save-button-text {
  font-size: 32rpx;
  color: #000;
  font-weight: 600;
}

.payment-list {
  margin-top: 40rpx;
  border-radius: 20rpx;
  overflow: hidden;
}

.payment-item-wrapper {
  border: 1rpx solid #ccc;
  margin-bottom: 30rpx;
}

.payment-item {
  display: flex;
  align-items: center;
  background-color: #fff;

  justify-content: space-between;
  padding: 30rpx 40rpx;
}

.payment-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.payment-icon {
  width: 80rpx;
  height: 80rpx;
  margin-right: 30rpx;
  border-radius: 20rpx;
}

.payment-details {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.payment-name {
  font-size: 32rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 10rpx;
}

.payment-desc {
  font-size: 26rpx;
  color: #999;
  line-height: 1.4;
}

.control-box {
  display: flex;
  align-items: flex-start;
  padding: 20rpx 0 20rpx 40rpx;
  background-color: #f8f8f8;
  border-top: 1rpx solid #f0f0f0;
  gap: 40rpx;
}

.move-buttons {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  flex-shrink: 0;
}

.control-btn-small {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12rpx 30rpx;
  background-color: #fff;
  border: 1rpx solid #e0e0e0;
  border-radius: 8rpx;
  transition: all 0.3s;
  min-width: 120rpx;

  &:active {
    background-color: #f5f5f5;
    transform: scale(0.98);
  }

  &.disabled {
    opacity: 0.5;
    background-color: #f5f5f5;
    pointer-events: none;
  }
}

.control-btn-text-small {
  font-size: 24rpx;
  color: #333;
  font-weight: 500;
}

.tags-box {
  flex: 1;
  height: 100%;
  padding-top: 20rpx;
}

checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx 30rpx;
}

.tag-item {
  display: flex;
  width: 40%;
  align-items: center;
  cursor: pointer;
}

.tags-group {
  height: 100%;
}

.tag-text {
  font-size: 26rpx;
  color: #333;
  margin-left: 10rpx;
}
</style>
