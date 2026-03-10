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
        <span class="mr-10"
          >商户费用: {{ summaryData.merchantCost ? summaryData.merchantCost : 0 }}
        </span>
      </div>

      <my-table
        class="mt-10"
        ref="tableRef"
        :loadData="merchantDailyReport"
        :tableData="tableData"
        style="width: 100%"
        border
      >
        <el-table-column label="序号" align="center" type="index" width="50" />
        <el-table-column label="统计日期" align="center" prop="statisticsDate" />
        <el-table-column label="订单数量" align="center" prop="orderCount" />
        <el-table-column label="订单金额(元)" align="center" prop="orderAmount" />
        <el-table-column label="成功订单数" align="center" prop="successfulOrderCount" />
        <el-table-column label="成功订单金额(元)" align="center" prop="successfulOrderAmount" />
        <el-table-column label="实付金额(元)" align="center" prop="payAmount" />
        <el-table-column label="成功实付金额(元)" align="center" prop="successfulPayAmount" />
        <el-table-column label="成功率(%)" align="center" prop="successfulRate" />
        <el-table-column label="商户费用(元)" align="center" prop="merchantCost" />
        <el-table-column label="日终余额(元)" align="center" prop="dailyAvailableBalance" />
      </my-table>
    </el-card>
  </div>
</template>

<script>
import {
merchantDailyReport,merchantDailyReportSummary
} from '@/api/today-report'
export default {
  name: 'MerchantTodayReport',
  data() {
    return {
      tableData: [],
      summaryData: {}
    }
  },
  methods: {
    async merchantDailyReport(page) {
      let obj = {
        tenantId: this.tenantId,
        userId: this.$store.state.userAccount.userId
      }
      let res = await merchantDailyReport({ ...page, ...obj })
      this.tableData = res.data.list
      console.log(res)
      return res
    },
    async merchantDailyReportSummary() {
      let obj = {
        tenantId: this.tenantId,
        userId: this.$store.state.userAccount.userId
      }
      let res = await merchantDailyReportSummary(obj)
      if (res.data) {
        this.summaryData = res.data
      }
      console.log(res)
    }
  },
  mounted() {
    this.merchantDailyReportSummary()
  }
}
</script>

<style lang="scss" scoped></style>
