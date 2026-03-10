<template>
  <view class="container" :style="{paddingTop:$store.state.navBarHeight+'rpx'}">
	  <custom-nav-bar :showBack="true" title="代收订单 XXX"></custom-nav-bar>
    <!-- 顶部统计数据 -->
    <!-- <view class="stats-container">
      <view class="time-tabs">
        <text 
          v-for="(tab, index) in timeTabs" 
          :key="index"
          :class="['time-tab', activeTimeTab === index ? 'active' : '']"
          @click="switchTimeTab(index)"
        >
          {{ tab }}
        </text>
      </view>
      
      <view class="stats-grid">
        <view class="stat-item">
          <text class="stat-label">订单数量</text>
          <text class="stat-value">{{ currentStats.orderCount }}</text>
        </view>
        <view class="stat-item">
          <text class="stat-label">成交订单</text>
          <text class="stat-value">{{ currentStats.successCount }}</text>
        </view>
        <view class="stat-item">
          <text class="stat-label">成功率</text>
          <text class="stat-value">{{ currentStats.successRate }}%</text>
        </view>
        <view class="stat-item">
          <text class="stat-label">订单金额</text>
          <text class="stat-value">¥{{ currentStats.orderAmount.toFixed(2) }}</text>
        </view>
        <view class="stat-item">
          <text class="stat-label">成交金额</text>
          <text class="stat-value">¥{{ currentStats.successAmount.toFixed(2) }}</text>
        </view>
        <view class="stat-item">
          <text class="stat-label">实付金额</text>
          <text class="stat-value">¥{{ currentStats.paidAmount.toFixed(2) }}</text>
        </view>
      </view>
    </view> -->
    
    <!-- 订单列表 -->
    <!-- <view class="order-list">
      <view class="order-card" v-for="(item, index) in orderList" :key="index">
        <view class="card-row">
          <text class="label">系统订单号:</text>
          <text class="value">{{ item.systemOrderId }}</text>
        </view>
        <view class="card-row">
          <text class="label">商户订单号:</text>
          <text class="value">{{ item.merchantOrderId }}</text>
        </view>
        <view class="card-row">
          <text class="label">订单金额:</text>
          <text class="value">¥{{ item.orderAmount.toFixed(2) }}</text>
        </view>
        <view class="card-row">
          <text class="label">实付金额:</text>
          <text class="value">¥{{ item.paidAmount.toFixed(2) }}</text>
        </view>
        <view class="card-row">
          <text class="label">产品名称:</text>
          <text class="value">{{ item.productName }}</text>
        </view>
        <view class="card-row">
          <text class="label">通道名称:</text>
          <text class="value">{{ item.channelName }}</text>
        </view>
        <view class="card-row">
          <text class="label">商户:</text>
          <text class="value">{{ item.merchant }}</text>
        </view>
        <view class="card-row">
          <text class="label">码商:</text>
          <text class="value">{{ item.provider }}</text>
        </view>
        <view class="card-row">
          <text class="label">创建时间:</text>
          <text class="value">{{ item.createTime }}</text>
        </view>
        <view class="card-row">
          <text class="label">接单时间:</text>
          <text class="value">{{ item.acceptTime || '-' }}</text>
        </view>
        <view class="card-row">
          <text class="label">确认时间:</text>
          <text class="value">{{ item.confirmTime || '-' }}</text>
        </view>
        <view class="card-row">
          <text class="label">订单状态:</text>
          <text class="value status" :class="getStatusClass(item.status)">{{ getStatusText(item.status) }}</text>
        </view>
        <view class="card-row">
          <text class="label">转账备注:</text>
          <text class="value">{{ item.remark || '无' }}</text>
        </view>
      </view>
    </view> -->
  </view>
</template>

<script>
export default {
  data() {
    return {
      timeTabs: ['实时', '今日', '昨日'],
      activeTimeTab: 0,
      statsData: {
        realtime: {
          orderCount: 0,
          successCount: 0,
          successRate: 0,
          orderAmount: 0,
          successAmount: 0,
          paidAmount: 0
        },
        today: {
          orderCount: 0,
          successCount: 0,
          successRate: 0,
          orderAmount: 0,
          successAmount: 0,
          paidAmount: 0
        },
        yesterday: {
          orderCount: 0,
          successCount: 0,
          successRate: 0,
          orderAmount: 0,
          successAmount: 0,
          paidAmount: 0
        }
      },
      orderList: []
    }
  },
  computed: {
    currentStats() {
      const keys = ['realtime', 'today', 'yesterday']
      return this.statsData[keys[this.activeTimeTab]]
    }
  },
  onLoad() {
    this.generateMockData()
  },
  methods: {
    generateMockData() {
      // 生成模拟统计数据
      this.statsData.realtime = {
        orderCount: 15,
        successCount: 12,
        successRate: 80,
        orderAmount: 12500.50,
        successAmount: 10200.00,
        paidAmount: 10000.00
      }
      
      this.statsData.today = {
        orderCount: 68,
        successCount: 60,
        successRate: 88.24,
        orderAmount: 56800.75,
        successAmount: 52000.50,
        paidAmount: 51000.00
      }
      
      this.statsData.yesterday = {
        orderCount: 72,
        successCount: 65,
        successRate: 90.28,
        orderAmount: 61200.00,
        successAmount: 58000.00,
        paidAmount: 57000.00
      }
      
      // 生成模拟订单数据
      const mockOrders = []
      const products = ['话费充值', '游戏点卡', '水电缴费', '信用卡还款', '保险缴费']
      const channels = ['支付宝通道', '微信通道', '银联通道', '快捷支付', '网银支付']
      const merchants = ['商户A', '商户B', '商户C', '商户D', '商户E']
      const providers = ['码商1', '码商2', '码商3', '码商4', '码商5']
      const remarks = ['工资代发', '货款结算', '奖金发放', '项目款', '退款', null]
      
      for (let i = 0; i < 10; i++) {
        const status = Math.floor(Math.random() * 4) // 0:待接单, 1:处理中, 2:已完成, 3:已取消
        const orderAmount = (Math.random() * 1000 + 100).toFixed(2)
        const paidAmount = (orderAmount * 0.95).toFixed(2)
        
        const order = {
          systemOrderId: `DS${Date.now()}${Math.floor(Math.random() * 1000)}`,
          merchantOrderId: `MCH${Date.now()}${Math.floor(Math.random() * 1000)}`,
          orderAmount: parseFloat(orderAmount),
          paidAmount: parseFloat(paidAmount),
          productName: products[Math.floor(Math.random() * products.length)],
          channelName: channels[Math.floor(Math.random() * channels.length)],
          merchant: merchants[Math.floor(Math.random() * merchants.length)],
          provider: providers[Math.floor(Math.random() * providers.length)],
          createTime: this.formatTime(new Date()),
          acceptTime: status > 0 ? this.formatTime(new Date(Date.now() - Math.random() * 3600000)) : null,
          confirmTime: status === 2 ? this.formatTime(new Date(Date.now() - Math.random() * 1800000)) : null,
          status: status,
          remark: remarks[Math.floor(Math.random() * remarks.length)]
        }
        
        mockOrders.push(order)
        setTimeout(() => {}, 10) // 确保时间戳不同
      }
      
      this.orderList = mockOrders
    },
    formatTime(date) {
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      
      return `${year}-${month}-${day} ${hours}:${minutes}`
    },
    switchTimeTab(index) {
      this.activeTimeTab = index
    },
    getStatusText(status) {
      const statusMap = ['待接单', '处理中', '已完成', '已取消']
      return statusMap[status] || ''
    },
    getStatusClass(status) {
      const classMap = ['pending', 'processing', 'completed', 'canceled']
      return classMap[status] || ''
    }
  }
}
</script>

<style>


/* 统计区域样式 */
.stats-container {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.time-tabs {
  display: flex;
  margin-bottom: 20rpx;
  background-color: #f5f5f5;
  border-radius: 8rpx;
  overflow: hidden;
}

.time-tab {
  flex: 1;
  text-align: center;
  padding: 15rpx 0;
  font-size: 26rpx;
  color: #666;
}

.time-tab.active {
  color: #2979FF;
  font-weight: bold;
  background-color: #fff;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15rpx;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15rpx;
  background-color: #f9f9f9;
  border-radius: 8rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 10rpx;
}

.stat-value {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

/* 订单列表样式 */
.order-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.order-card {
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
  width: 160rpx;
}

.value {
  color: #333;
  flex: 1;
  text-align: right;
}

/* 状态样式 */
.status.pending {
  color: #FF9900;
}

.status.processing {
  color: #2979FF;
}

.status.completed {
  color: #09bb07;
}

.status.canceled {
  color: #e64340;
}
</style>