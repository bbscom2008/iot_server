<template>
  <div
    class="profile-container"
  >
    <!-- 保存按钮 -->
    <!-- <div class="save-button-container">
      <el-button type="primary" @click="handleSave()" size="small"> 确定 </el-button>
    </div> -->

    <!-- 支付方式列表 -->
    <div class="payment-list">
      <div
        v-for="(item, index) in paymentMethods"
        :key="item.id"
        class="payment-item-wrapper"
      >
        <div class="payment-item">
          <div class="payment-info">
            <image
              :src="'/assets/img_bank/' + item.icon"
              class="payment-icon"
              mode="aspectFit"
            />
            <div class="payment-details">
              <span class="payment-name">{{ item.name }}</span>
              <span class="payment-desc">{{ item.description }}</span>
            </div>
          </div>
          <my-switch
            :value="item.enabled"
            @change="onPaymentMethodChange(index, $event)"
          />
        </div>
        <!-- 控制盒子：当支付方式开启时显示 -->
        <div v-if="item.enabled === 1" class="control-box">
          <!-- 上移下移按钮（左侧） -->
          <div class="move-buttons">
            <div
              class="control-btn-small"
              :class="{ disabled: index === 0 }"
              @click="moveUp(index)"
            >
              <span class="control-btn-text-small">上移</span>
            </div>
            <div
              class="control-btn-small"
              :class="{ disabled: index === paymentMethods.length - 1 }"
              @click="moveDown(index)"
            >
              <span class="control-btn-text-small">下移</span>
            </div>
          </div>
          <!-- 标签选择框（右侧） -->
          <div class="tags-box">
            <el-checkbox-group
              class="tags-group"
              @change="onTagChange(index, $event)"
              v-model="item.tags"
            >
              
                <el-checkbox
                v-for="tag in tagOptions"
                  :key="tag.label"
                  :label="tag.value"
                >
                <span class="tag-text">{{ tag.label }}</span>
                </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
    </div>
  </div>
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

  mounted() {
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
    this.$message({
        message: '没有可移动的条目',
        type: 'info'
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
      this.$message({
        message: '没有可移动的条目',
        type: 'info'
      })
    },

    // 获取服务商支付配置
    async getPaymentSettings() {
      try {
        let res = await getPaysetting(this.$store.state.user.personalInfo.providerId)
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
      }
    },

    // 保存支付设置
    async savePaymentSettings() {
      console.log('savePaymentSettings', this.paymentMethods)

      try {
        let res = await setPaysetting({
          providerId: this.$store.state.user.personalInfo.providerId,
          data: this.paymentMethods
        })

        console.log('=====savePaymentSettings========', res)
        
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        this.getPaymentSettings()
      } catch (error) {
        console.error('保存支付设置失败:', error)
        this.$message({
          message: '保存失败，请稍后重试',
          type: 'error'
        })
      }
    },

    // 处理保存按钮点击
    async handleSave() {
     await this.savePaymentSettings()
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
    //   this.$message({
    //     message: value === 1 ? `${method.name}已开启` : `${method.name}已关闭`,
    //     type: 'success'
    //   })
    },

  }
}
</script>

<style scoped lang="scss">
.profile-container {
  padding: 10px;
  background-color: #f5f5f5;
  min-height: 100vh;
  box-sizing: border-box;
}

.save-button-container {
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 0 10px;
}

.save-button-text {
  font-size: 16px;
  color: #000;
  font-weight: 600;
}

.payment-list {
  margin-top: 20px;
  border-radius: 10px;
  overflow: hidden;
}

.payment-item-wrapper {
  border: 0.5px solid #ccc;
  margin-bottom: 15px;
}

.payment-item {
  display: flex;
  align-items: center;
  background-color: #fff;

  justify-content: space-between;
  padding: 15px 20px;
}

.payment-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.payment-icon {
  width: 40px;
  height: 40px;
  margin-right: 15px;
  border-radius: 10px;
}

.payment-details {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.payment-name {
  font-size: 16px;
  color: #333;
  font-weight: 500;
  margin-bottom: 5px;
}

.payment-desc {
  font-size: 13px;
  color: #999;
  line-height: 1.4;
}

.control-box {
  display: flex;
  align-items: flex-start;
  padding: 10px 0 10px 20px;
  background-color: #f8f8f8;
  border-top: 0.5px solid #f0f0f0;
  gap: 20px;
}

.move-buttons {
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex-shrink: 0;
}

.control-btn-small {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6px 15px;
  background-color: #fff;
  border: 0.5px solid #e0e0e0;
  border-radius: 4px;
  transition: all 0.3s;
  min-width: 60px;

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
  font-size: 12px;
  color: #333;
  font-weight: 500;
}

.tags-box {
  flex: 1;
  height: 100%;
  padding-top: 10px;
}

checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 15px;
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
  font-size: 13px;
  color: #333;
  margin-left: 5px;
}
</style>
