<template>
  <div class="container">
    <el-card class="mt-10">
      <div class="tips mt-10">
        汇总信息：
        <span class="mr-10"
          >订单数量: {{ summaryData.orderCount ? summaryData.orderCount : 0 }}
        </span>
        <span class="mr-10"
          >订单金额: {{ summaryData.orderAmount ? summaryData.orderAmount : 0 }}
        </span>
        <span class="mr-10"
          >成功订单数: {{ summaryData.successfulOrderCount ? summaryData.successfulOrderCount : 0 }}
        </span>
        <span class="mr-10"
          >成功订单金额:
          {{ summaryData.successfulOrderAmount ? summaryData.successfulOrderAmount : 0 }}
        </span>
        <span class="mr-10"
          >成功率(%): {{ summaryData.successfulRate ? summaryData.successfulRate : 0 }}%
        </span>
        <!-- <span class="mr-10"
          >分润: {{ summaryData.merchantAgentCost ? summaryData.merchantAgentCost : 0 }}
        </span> -->
      </div>

      <my-table
        class="mt-10"
        ref="tableRef"
        :loadData="getOrderTodayReport"
        :tableData="tableData"
        style="width: 100%"
        border
      >
        <el-table-column label="序号" align="center" type="index" width="60" />
        <el-table-column label="统计日期" align="center" prop="statisticsDate">
          <template slot-scope="{ row }">
            {{ row.statisticsDate }}
          </template>
        </el-table-column>
        <el-table-column label="商户名称" align="center" prop="merchantName">
          <template slot-scope="{ row }">
            {{ row.merchantName }}
          </template>
        </el-table-column>

        <el-table-column label="订单数量" align="center" prop="orderCount" />
        <el-table-column label="订单金额(元)" align="center" prop="orderAmount" width="130px" />
        <el-table-column label="成功订单数" align="center" prop="successfulOrderCount" />
        <el-table-column
          label="成功订单金额(元)"
          align="center"
          prop="successfulOrderAmount"
          width="160px"
        />
        <el-table-column label="实付金额(元)" align="center" prop="payAmount" />
        <el-table-column label="成功实付金额(元)" align="center" prop="successfulPayAmount" />
        <el-table-column label="成功率(%)" align="center" prop="successfulRate" />
        <!-- <el-table-column
          label="分润比例(%)"
          align="center"
          prop="merchantAgentRate"
          width="130px"
        />
        <el-table-column label="分润(元)" align="center" prop="merchantAgentCost" width="130px" /> -->
      </my-table>
    </el-card>
  </div>
</template>

<script>
import { getOrderTodayReport, getOrderTodaySummaryReport } from '@/api/report-center'
export default {
  name: 'TodayReport',
  data() {
    return {
      tableData: [],
      summaryData: {}
    }
  },

  methods: {
    async getOrderTodayReport(page) {
      let obj = {
        tenantId: this.tenantId,
        userId: this.$store.state.userAccount.userId
      }
      let res = await getOrderTodayReport({ ...page, ...obj })
      this.tableData = res.data.list
      console.log(res)
      return res
    },
    async getOrderTodaySummaryReport() {
      let obj = {
        tenantId: this.tenantId,
        userId: this.$store.state.userAccount.userId
      }
      let res = await getOrderTodaySummaryReport(obj)
      if (res.data) {
        this.summaryData = res.data
      }
      console.log(res)
    }
  },
  mounted() {
    this.getOrderTodaySummaryReport()
  }
}
</script>

<style lang="scss" scoped></style>
