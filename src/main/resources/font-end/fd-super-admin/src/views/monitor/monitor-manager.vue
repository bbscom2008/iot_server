<template>
  <div class="container monitor-manager el-card">
    <!-- 顶部控制栏 -->
    <div class="top-control-bar">
      <!-- <div class="left-tabs"> -->
        <!-- <el-tabs v-model="activeIndex" @tab-click="handleTabClick">
          <el-tab-pane
            v-for="(item, index) in tabsList"
            :key="index"
            :label="item.productName"
            :name="index + ''"
          ></el-tab-pane>
        </el-tabs> -->

      <span>请选择产品：</span>
      <el-select
        v-model="activeIndex"
        filterable
        placeholder="请选择产品"
        @change="handleTabClick"
      >
        <el-option
          v-for="(item, index) in tabsList"
          :key="index"
          :label="item.productName"
          :value="index"
        />
      </el-select>
      <!-- </div> -->
      <!-- <div class="right-controls"> -->
        <!-- <el-select
          filterable
          placeholder="请选择刷新方式"
          size="small"
          v-model="flushType"
          @change="handleRefreshCommand"
        >
          <el-option label="手动刷新" :value="0"></el-option>
          <el-option label="10秒" :value="10"></el-option>
          <el-option label="30秒" :value="30"></el-option>
          <el-option label="60秒" :value="60"></el-option>
        </el-select> -->
        <span style="font-weight: 600;" >自动刷新</span>
        <el-checkbox-group v-model="flushType" @change="handleRefreshCommand">
          <el-checkbox :label="10">10秒</el-checkbox>
          <el-checkbox :label="30">30秒</el-checkbox>
          <el-checkbox :label="60">60秒</el-checkbox>
        </el-checkbox-group>

        <span class="flush-tips ml-10"  style="color: red;" >{{ flushTips }}</span>
        <el-button style="margin-left: 20px;"  type="success" icon="el-icon-refresh" @click="handleRefresh">手动刷新</el-button>
      <!-- </div> -->
    </div>

    <div class="tips summary" v-if="tabsList[activeIndex]" >
      <span>码商总数：{{ tabsList[activeIndex].totalProviderCount }}个</span>
      <span>可用码商：{{ tabsList[activeIndex].activeProviderCount }}个</span>
      <span>收款码总数：{{ tabsList[activeIndex].totalPayeeAccountCount }}个</span>
      <span>可用收款码：{{ tabsList[activeIndex].activePayeeAccountCount }}个</span>
      <span>{{ tabsList[activeIndex].limitSummaryList }}</span>
    </div>

    <!-- 代理卡片列表 -->
    <div class="agent-cards-container" v-loading="loading" >
      <div v-for="(agent, index) in cardList" :key="agent.providerId" class="agent-card" :class="{nextcard: agent.isNext}"    >
        <el-card>
          <!-- 卡片头部 -->
          <div class="card-header">
            <el-tag type="primary" size="small">第{{ index + 1 }}位</el-tag>
            <div class="header-buttons">
              <!-- <el-button type="success" size="mini" @click="updateAgentWeight(agent)">
                更新码商权重
              </el-button> -->
              <!-- <el-button type="danger" size="mini" @click="removeAgent(agent)">
                移除码商
              </el-button> -->
            </div>
          </div>

          <!-- 代理信息 -->
          <div class="agent-info">
            <!-- <div class="agent-avatar">
              <i class="el-icon-user-solid"></i>
            </div> -->
            <div class="agent-details">
              <div class="agent-name">
                {{ agent.userName }}
              </div>
              <!-- <div class="info-row">
                <span class="label">余额:</span>
                <span class="value balance" :class="{ zero: agent.balance === 0 }">
                  {{ agent.balance }}
                </span>
              </div> -->
              <!-- <div class="info-row">
                <span class="label">加入时间:</span>
                <span class="value">{{ agent.joinTime }}</span>
              </div> -->

              <!-- <div class="info-row">
                <span class="label">可用余额:</span>
                <span class="value">{{ agent.availableBalance }}</span>
              </div> -->
              <div class="info-row">
                <span class="label">接单金额/可用余额：</span>
                <span class="value">{{ agent.freezeBalance }} / {{ agent.availableBalance }}</span>
              </div>
              <!-- <div class="info-row">
                <span class="label">最小接单金额:</span>
                <span class="value">{{ agent.minAllowableCollectAmount }}</span>
              </div> -->
              <div class="info-row">
                <span class="label">接单数量/最大单数：</span>
                <span class="value"
                  >{{ agent.currentOrderCount }} /
                  {{
                    agent.maxConcurrentCollectOrdersCount == 0
                      ? '无限制'
                      : agent.maxConcurrentCollectOrdersCount
                  }}</span
                >
              </div>

              <div class="info-row">
                <span class="label">权重值：</span>
                <span class="value">{{ agent.weight }}</span>
              </div>

              <div class="info-row">
                <span class="label">在线收款码数：</span>
                <span class="value">{{ agent.onlinePayeeAccountCount }}</span>
              </div>
              <!-- <div class="info-row">
                <span class="label">当前已接单数:</span>
                <span class="value">{{ agent.currentOrderCount }}</span>
              </div> -->
              <!-- <div class="info-row">
                <span class="label">是否为下个接单码商:</span>
                <span class="value">{{ agent.isNext }}</span>
              </div> -->
            </div>
          </div>

          <!-- 数据表格 -->
          <div class="code-table">
            <el-table :data="agent.payeeAccountList" 
            :row-class-name="tableRowClassName"
             border size="mini" style="width: 100%">
              <el-table-column
                prop="payeeAccountName"
                label="收款码"
                align="center"
                width="80"
              ></el-table-column>

              <el-table-column prop="limitAmount" label="区间" align="center" min-width="80">
                <template slot-scope="{ row }">
                  <span v-if="row.limitAmountType == '0'">无限制</span>

                  <el-tag v-else-if="row.limitAmountType == '1'" size="small">{{
                    row.limitAmount
                  }}</el-tag>

                  <span v-if="row.limitAmountType == '2'">
                    <el-tag style="padding: 0 5px" size="small">{{ row.minAmount }}</el-tag>
                    ~
                    <el-tag style="padding: 0 5px" size="small">{{ row.maxAmount }}</el-tag>
                  </span>
                </template>
              </el-table-column>

              <el-table-column label="当日限制">
                <template slot-scope="{ row }">
                  <div style="padding: 0 10px;">
                    <div>单数：{{ row.dailyMaxCount == 0? '无限制' : row.dailyMaxCount }}</div>
                    <div>金额：{{ row.dailyMaxAmount == 0? '无限制' : row.dailyMaxAmount }}</div>
                  </div>
                </template>
              </el-table-column>

              <el-table-column label="今日统计">
                <template slot-scope="{ row }">
                  <div style="padding: 0 10px">
                    <div>成功单数：{{ row.todayOrderCount }}</div>
                    <div>成功金额：{{ row.todayOrderAmount }}</div>
                    <div>接单金额：{{ row.businessAmount }}</div>
                  </div>
                </template>
              </el-table-column>

              <template slot="empty">
                <div class="empty-data">暂无数据</div>
              </template>
            </el-table>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getProductMonitorList,
  getProviderMonitorList,
  getPayeeAccountMonitorList
} from '@/api/monitor.js'

export default {
  name: 'MonitorManager',
  data() {
    return {
      loading: false,
      flushTips: '',
      currFlushSecond: 0,
      flushType: [],
      activeIndex: 0,
      hideNoCode: false,
      totalCodeCount: 0,
      // 假数据 - 代理列表
      cardList: [],
      tabsList: []
    }
  },
  computed: {
    // filteredAgentList() {
    //   if (this.hideNoCode) {
    //     return this.cardList.filter(agent => agent.codeCount > 0)
    //   }
    //   return this.cardList
    // }
  },
  watch: {
    '$store.state.tenant.selectTenantId'(newV, oldV) {
      this.loadProductData()
      this.activeIndex = 0
    }
  },
  methods: {
     tableRowClassName({row, rowIndex}) {
        if (row.isNext) {
          console.log('row.isNext : ',row.isNext);
          
          return 'next-row';
        } 
        return '';
    },
    handleTabClick(tab) {
      console.log('切换标签:', tab.name)
      this.loadCardList()
    },
    handleRefreshCommand(ele) {
      if (ele.length > 0) {
        this.currFlushSecond = ele[ele.length - 1]
        this.flushTips = `${this.currFlushSecond} 秒后自动刷新`
        this.flushType = [ele[ele.length - 1]]

        clearInterval(this.autoFlushFlag)
        this.autoFlushFlag = setInterval(() => {
          this.currFlushSecond--
          if (this.currFlushSecond == 0) {
            this.currFlushSecond = ele[ele.length - 1]

            this.flushPage()
          }
          this.flushTips = `${this.currFlushSecond} 秒后自动刷新`
        }, 1000)
      } else {
        clearInterval(this.autoFlushFlag)
        this.flushTips = ''
      }
     
    },
    async handleRefresh() {
      console.log('刷新数据')
      await this.loadCardList()
      this.$message.success('刷新成功')
    },
    handleRefreshAll() {
      console.log('刷新全部数据')
      this.loadCardList()
      // this.$message.success('全部刷新成功')
    },
    toggleHideNoCode() {
      this.hideNoCode = !this.hideNoCode
    },
    showCodeStatistics() {
      this.$message.info('码统计功能待开发')
      // TODO: 显示码统计弹窗
    },
    updateAgentWeight(agent) {
      this.$prompt('请输入新的权重值', '更新代理权重', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^\d+$/,
        inputErrorMessage: '权重值必须为数字'
      })
        .then(({ value }) => {
          agent.weight = parseInt(value)
          this.$message.success('权重更新成功')
        })
        .catch(() => {
          this.$message.info('已取消更新')
        })
    },
    removeAgent(agent) {
      this.$confirm(`确定要移除代理 [${agent.id}]${agent.name} 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // const index = this.cardList.findIndex(item => item.id === agent.id)
          // if (index > -1) {
          //   this.cardList.splice(index, 1)
          //   this.$message.success('移除成功')
          // }
        })
        .catch(() => {
          this.$message.info('已取消移除')
        })
    },
    async loadCardList() {
      this.loading = true
      let ret = await getProviderMonitorList(this.tabsList[this.activeIndex].productId)
      console.log(ret)
      this.cardList = ret.data
      this.loading = false
    },
    flushPage(){
      this.loadCardList();
    },
    async loadProductData() {
      // TODO: 调用接口获取数据
      this.loading = true
      let ret = await getProductMonitorList(this.$store.state.tenant.selectTenantId)
      console.log(ret)
      this.tabsList = ret.data

      this.loadCardList()
    }
  },
  mounted() {
    this.loadProductData()
  }
}
</script>


<style lang="scss" >
.dark #app{
  .el-tag{
    color: #7bd2ff;
  }


  .agent-info .agent-details .info-row .label{
    color: #b3c0e7;
  }
  .agent-info .agent-details .agent-name,
  .agent-info .agent-details .info-row .value{
      color: white;
  }
  .agent-cards-container .agent-card{
    // background-color: rebeccapurple;
  }
  .nextcard{
    .el-card{
      background-color: rgb(70, 108, 123);
      border-radius: 20px;
    }
  }
  
}

.showui #app .el-table tr.next-row{
  background-color: #87ebc9;
}

.showui.dark #app .el-table tr.next-row{
  background-color: #305549;
}
</style>

<style lang="scss" scoped>

.monitor-manager {
  padding: 20px;
  background-color: #fff;
  border-radius: 20px;
}

.top-control-bar {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 15px;
  // margin-bottom: 20px;
  // padding: 10px 0;

  .left-tabs {
    flex: 1;
    margin-bottom: 20px;

    ::v-deep .el-tabs__header {
      margin: 0;
    }

    ::v-deep .el-tabs__item {
      padding: 0 20px;
      height: 40px;
      line-height: 40px;
    }
  }

  .right-controls {
    display: flex;
    align-items: center;
    gap: 15px;

    .total-code-info {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 14px;

      .total-count {
        color: #409eff;
        font-weight: bold;
        font-size: 16px;
      }
    }
  }
}

.agent-cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  .agent-card {
    // flex: 1;
    width: calc(33.33% - 7.5px);
    // width: 33%;

    ::v-deep .el-card {
      height: 100%;
    }

    ::v-deep .el-card__body {
      padding: 15px;
    }
  }
}

.dark .card-header {
  border-bottom: 1px solid #999;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e4e7ed;

  .header-buttons {
    display: flex;
    gap: 10px;
  }
}

.agent-info {
  display: flex;
  gap: 15px;
  // margin-bottom: 15px;

  .agent-avatar {
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f5f7fa;
    border-radius: 50%;
    flex-shrink: 0;

    i {
      font-size: 24px;
      color: #909399;
    }
  }

  .agent-details {
    flex: 1;

    .agent-name {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 10px;
      color: #303133;
    }

    .info-row {
      display: flex;
      margin-bottom: 8px;
      font-size: 14px;

      .label {
        color: #606266;
        min-width: 80px;
      }

      .value {
        color: #303133;

        &.balance {
          font-weight: bold;

          &.zero {
            color: #f56c6c;
          }
        }
      }
    }
  }
}

.code-table {
  // margin-top: 15px;

  ::v-deep .el-table {
    font-size: 12px;
  }

  .empty-data {
    text-align: center;
    padding: 20px;
    color: #909399;
  }
}

@media (max-width: 1400px) {
  .agent-cards-container {
    .agent-card {
      max-width: calc(50% - 10px);
    }
  }
}

@media (max-width: 768px) {
  .agent-cards-container {
    .agent-card {
      max-width: 100%;
      min-width: 100%;
    }
  }

  .top-control-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;

    .right-controls {
      flex-wrap: wrap;
      width: 100%;
    }
  }
}

::v-deep .el-table__row .cell {
  padding: 0;
}

.summary {
  display: flex;
  gap: 15px;
  padding: 10px 20px;
  margin: 15px 0;
}

::v-deep .nextcard{
  .el-card{
    background-color: skyblue;
    border-radius: 20px;
  }
}



</style>
