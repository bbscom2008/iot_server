<template>
<view class="container" :style="{paddingTop:$store.state.navBarHeight+'rpx'}">
    <custom-nav-bar :showBack="true" title="账变记录"></custom-nav-bar>
    
    <view class="record-list">
      <view class="record-card" v-for="(item, index) in recordList" :key="index">
        <view class="card-row">
          <text class="label">账号:</text>
          <text class="value">{{ item.account }}</text>
        </view>
        <view class="card-row">
          <text class="label">码商名称:</text>
          <text class="value">{{ item.provider }}</text>
        </view>
        <view class="card-row">
          <text class="label">业务类型:</text>
          <text class="value">{{ item.businessType }}</text>
        </view>
        <view class="card-row">
          <text class="label">账变金额:</text>
          <text class="value" :class="{ 'income': item.amount > 0, 'expense': item.amount < 0 }">
            {{ item.amount > 0 ? '+' : '' }}{{ item.amount }}
          </text>
        </view>
        <view class="card-row">
          <text class="label">系统订单号:</text>
          <text class="value">{{ item.systemOrder }}</text>
        </view>
        <view class="card-row">
          <text class="label">商户订单号:</text>
          <text class="value">{{ item.merchantOrder }}</text>
        </view>
        <view class="card-row">
          <text class="label">时间:</text>
          <text class="value">{{ item.time }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      recordList: []
    }
  },
  onLoad() {
    this.generateMockData()
  },
  methods: {
    generateMockData() {
      // 模拟10条账变记录数据
      const mockData = []
      const businessTypes = ['充值', '消费', '转账', '退款', '提现']
      const providers = ['支付宝', '微信支付', '银联', '京东支付', '云闪付']
      
      for (let i = 0; i < 10; i++) {
        const isIncome = Math.random() > 0.5
        const amount = isIncome ? 
          (Math.random() * 1000).toFixed(2) : 
          -(Math.random() * 500).toFixed(2)
        
        mockData.push({
          account: `user${Math.floor(Math.random() * 10000)}`,
          provider: providers[Math.floor(Math.random() * providers.length)],
          businessType: businessTypes[Math.floor(Math.random() * businessTypes.length)],
          amount: parseFloat(amount),
          systemOrder: `SYS${Date.now()}${Math.floor(Math.random() * 1000)}`,
          merchantOrder: `MCH${Date.now()}${Math.floor(Math.random() * 1000)}`,
          time: this.formatTime(new Date())
        })
        
        // 确保时间戳不同
        setTimeout(() => {}, 10)
      }
      
      this.recordList = mockData
    },
    formatTime(date) {
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      
      return `${year}-${month}-${day} ${hours}:${minutes}`
    }
  }
}
</script>

<style>


.header {
  padding: 20rpx 0;
  margin-bottom: 20rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.record-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.record-card {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.card-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16rpx;
  font-size: 28rpx;
}

.card-row:last-child {
  margin-bottom: 0;
}

.label {
  color: #666;
  width: 180rpx;
}

.value {
  color: #333;
  flex: 1;
  text-align: right;
}

.income {
  color: #09bb07;
}

.expense {
  color: #e64340;
}
</style>