<template>
    <div class="container">
          <!-- <div class="tips">字典管理列表：</div> -->
      <el-form :inline="true" :model="formData" class="demo-form-inline">
        <el-form-item label="选择时间:" prop="dateRange">
          <el-date-picker
            v-model="formData.createdTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
:default-time="['00:00:00', '23:59:59']"
            size="small"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" size="small" icon="el-icon-search"
            >搜索</el-button
          >
        </el-form-item>
      </el-form>
        <div class="tips">总充值：0.00 总下发0.00 总支付金领:0 总支付笔数:0 总代付金额:0总代付笔数:0 总佣金: 总成本: 总利润: 0</div>
      <my-table
        class="mt-10"
        ref="infoTable"
        :tableData="list"
        :total="total"
        :loadData="getDataList"
        style="width: 100%"
      >
        <el-table-column align="center" label="时间" width="160px">
          <template slot-scope="{ row }">
            <span>{{ row.time }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="充值金额">
          <template slot-scope="{ row }">
            <span class="money">{{ row.topUpMoney }} 元</span>
          </template>
        </el-table-column>
  
        <el-table-column align="center" label="充值笔数">
          <template slot-scope="{ row }">
            <span>{{ row.topUpCount }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="充值手续费">
          <template slot-scope="{ row }">
            <span>{{ row.topUpHand }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="下发金额">
          <template slot-scope="{ row }">
            <span class="money">{{ row.issueMoney }} 元</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="下发笔数">
          <template slot-scope="{ row }">
            <span>{{ row.issueCount }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="下发金额手续费" width="130px">
          <template slot-scope="{ row }">
            <span>{{ row.issueHand }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="支付金额">
          <template slot-scope="{ row }">
            <span class="money">{{ row.payMoney }} 元</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="支付笔数">
          <template slot-scope="{ row }">
            <span>{{ row.payCount }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="支付成功率">
          <template slot-scope="{ row }">
            <el-tag type="success">{{ row.payRate }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="代付金额">
          <template slot-scope="{ row }">
            <span class="money">{{ row.replacePay }} 元</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="代付笔数">
          <template slot-scope="{ row }">
            <span>{{ row.replaceCount }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="代付成功率">
          <template slot-scope="{ row }">
            <el-tag type="success">{{ row.replaceRate }}</el-tag>
          </template>
        </el-table-column>
  
        <el-table-column align="center" label="代理佣金">
          <template slot-scope="{ row }">
            <span>{{ row.agentMoney }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="代收成本">
          <template slot-scope="{ row }">
            <span>{{ row.incomeCost }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="代付成本">
          <template slot-scope="{ row }">
            <span>{{ row.replaceCost }}</span>
          </template>
        </el-table-column>
  
        <el-table-column align="center" label="当日总盈利">
          <template slot-scope="{ row }">
            <template>
              <span class="money"> {{ row.dayAllMoney }} 元 </span>
            </template>
          </template>
        </el-table-column>
      </my-table>
    </div>
  </template>
  
  <script>
  import { platformDailyReport } from '@/api/report-center'
  export default {
    name: 'PlatformDailyReport',
  
    data() {
      return {
        list: [],
        formData: {
          createdTime: ''
        },
        total: 0,
      }
    },
    methods: {
      async getDataList(currentPage, pageSize) {
        console.log('---getDataList----' + currentPage + '---' + pageSize)
        let ret = await platformDailyReport()
        console.log('ret.total : ' + ret.total)
        this.list = ret.data
        this.total = ret.total
      },
      onSubmit() {
        console.log('submit!')
      },
    },
    mounted() {
      // 由 my-table 组件自己加载数据
      // this.getDataList()
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .tips {
    color: #8a6d3b;
    background-color: #fcf8e3;
    border: 1px solid #eee;
    padding: 15px;
    margin-bottom: 20px;
  }
  .money{
    color: #1a53ff;
    font-weight: bold;
  }
  </style>
  