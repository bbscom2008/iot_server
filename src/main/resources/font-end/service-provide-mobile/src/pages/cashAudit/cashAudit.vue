<template>
  <view class="container" :style="{paddingTop:$store.state.navBarHeight+'rpx'}">
	  <custom-nav-bar :showBack="true" title="提现申请"></custom-nav-bar>
    <view class="header">
      <text class="title">提现申请</text>
      <view class="filter-tabs">
        <text 
          v-for="(tab, index) in tabs" 
          :key="index"
          :class="['tab-item', activeTab === index ? 'active' : '']"
          @click="switchTab(index)"
        >
          {{ tab }}
        </text>
      </view>
    </view>
    
    <view class="withdraw-list">
      <view class="withdraw-card" v-for="(item, index) in filteredList" :key="index">
        <view class="card-row">
          <text class="label">交易编号:</text>
          <text class="value">{{ item.transactionId }}</text>
        </view>
        <view class="card-row">
          <text class="label">账号:</text>
          <text class="value">{{ item.account }}</text>
        </view>
        <view class="card-row">
          <text class="label">代理名称:</text>
          <text class="value">{{ item.agentName }}</text>
        </view>
        <view class="card-row">
          <text class="label">提现金额:</text>
          <text class="value amount">¥{{ item.amount.toFixed(2) }}</text>
        </view>
        <view class="card-row">
          <text class="label">提现说明:</text>
          <text class="value">{{ item.remark || '无' }}</text>
        </view>
        <view class="card-row">
          <text class="label">审核状态:</text>
          <text class="value status" :class="getStatusClass(item.status)">{{ getStatusText(item.status) }}</text>
        </view>
        <view class="card-row">
          <text class="label">创建时间:</text>
          <text class="value">{{ item.createTime }}</text>
        </view>
        
        <view class="action-btns" v-if="item.status === 0">
          <button class="btn reject" @click="handleAction(index, 'reject')">拒绝</button>
          <button class="btn approve" @click="handleAction(index, 'approve')">通过</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      tabs: ['全部', '待审核', '已通过', '已拒绝'],
      activeTab: 0,
      withdrawList: []
    }
  },
  computed: {
    filteredList() {
      if (this.activeTab === 0) return this.withdrawList
      return this.withdrawList.filter(item => item.status === this.activeTab - 1)
    }
  },
  onLoad() {
    this.generateMockData()
  },
  methods: {
    generateMockData() {
      // 模拟10条提现记录数据
      const mockData = []
      const agentNames = ['一级代理张', '二级代理李', '金牌代理王', '银牌代理赵', '普通代理刘']
      const remarks = ['日常提现', '紧急用款', '业务结算', null, '货款提取', '资金周转']
      
      for (let i = 0; i < 10; i++) {
        const status = Math.floor(Math.random() * 3) // 0:待审核, 1:已通过, 2:已拒绝
        const amount = (Math.random() * 10000 + 100).toFixed(2)
        
        mockData.push({
          transactionId: `TX${Date.now()}${Math.floor(Math.random() * 1000)}`,
          account: `user${Math.floor(Math.random() * 10000)}`,
          agentName: agentNames[Math.floor(Math.random() * agentNames.length)],
          amount: parseFloat(amount),
          remark: remarks[Math.floor(Math.random() * remarks.length)],
          status: status,
          createTime: this.formatTime(new Date())
        })
        
        // 确保时间戳不同
        setTimeout(() => {}, 10)
      }
      
      this.withdrawList = mockData
    },
    formatTime(date) {
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      
      return `${year}-${month}-${day} ${hours}:${minutes}`
    },
    switchTab(index) {
      this.activeTab = index
    },
    getStatusText(status) {
      const statusMap = ['待审核', '已通过', '已拒绝']
      return statusMap[status] || ''
    },
    getStatusClass(status) {
      const classMap = ['pending', 'approved', 'rejected']
      return classMap[status] || ''
    },
    handleAction(index, action) {
      if (action === 'approve') {
        this.withdrawList[index].status = 1
        uni.showToast({
          title: '提现申请已通过',
          icon: 'success'
        })
      } else {
        this.withdrawList[index].status = 2
        uni.showToast({
          title: '提现申请已拒绝',
          icon: 'none'
        })
      }
      
      // 更新列表数据
      this.withdrawList = [...this.withdrawList]
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
  margin-bottom: 20rpx;
}

.filter-tabs {
  display: flex;
  margin-bottom: 20rpx;
  background-color: #fff;
  border-radius: 10rpx;
  overflow: hidden;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 20rpx 0;
  font-size: 28rpx;
  color: #666;
}

.tab-item.active {
  color: #2979FF;
  font-weight: bold;
  background-color: #f0f7ff;
}

.withdraw-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.withdraw-card {
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

.amount {
  font-weight: bold;
  color: #e64340;
}

.status.pending {
  color: #FF9900;
}

.status.approved {
  color: #09bb07;
}

.status.rejected {
  color: #e64340;
}

.action-btns {
  display: flex;
  justify-content: space-between;
  margin-top: 20rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid #eee;
}

.btn {
  flex: 1;
  margin: 0 10rpx;
  height: 60rpx;
  line-height: 60rpx;
  font-size: 26rpx;
  border-radius: 8rpx;
}

.btn.reject {
  background-color: #fff5f5;
  color: #e64340;
  border: 1rpx solid #e64340;
}

.btn.approve {
  background-color: #f0f9eb;
  color: #09bb07;
  border: 1rpx solid #09bb07;
}
</style>