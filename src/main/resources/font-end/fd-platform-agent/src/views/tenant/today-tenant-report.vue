<template>
  <div class="container">
    <el-card class="mt-10">
      <div class="tips mt-10">
        汇总信息：
        <span class="mr-10"
          >订单 数量: {{ summaryData.orderCount ? summaryData.orderCount : 0 }}
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
          >系统费用: {{ summaryData.systemCost ? summaryData.systemCost : 0 }}
        </span>
        <span class="mr-10"
          >分润: {{ summaryData.tenantAgentCost ? summaryData.tenantAgentCost : 0 }}
        </span>
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
        <el-table-column label="平台名称" align="center" prop="tenantName" />

        <el-table-column label="订单数量" align="center" prop="orderCount" />
        <el-table-column label="订单金额(元)" align="center" prop="orderAmount" width="130px" />
        <el-table-column label="成功订单数" align="center" prop="successfulOrderCount" />
        <el-table-column
          label="成功订单金额(元)"
          align="center"
          prop="successfulOrderAmount"
          width="140px"
        />
        <el-table-column label="实付金额(元)" align="center" prop="payAmount" />
        <el-table-column label="成功实付金额(元)" align="center" prop="successfulPayAmount" width="140px"/>
        <el-table-column label="成功率(%)" align="center" prop="successfulRate" />
        <el-table-column label="系统费用(元)" align="center" prop="systemCost" width="130px" />
        <el-table-column label="分润比例(%)" align="center" prop="tenantAgentRate" width="130px" />
        <el-table-column label="分润(元)" align="center" prop="tenantAgentCost" width="130px" />
        <el-table-column
          label="日终余额(元)"
          align="center"
          prop="dailyAvailableBalance"
          width="130px"
        />
      </my-table>
    </el-card>
  </div>
</template>

<script>
import { getOrderTodayReportPlatform, getOrderTodaySummaryReportPlatform } from '@/api/report-center'
export default {
  name: 'TodayTenantTeamReport',
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
      let res = await getOrderTodayReportPlatform({ ...page, ...obj })
      this.tableData = res.data.list
      console.log(res)
      return res
    },
    async getOrderTodaySummaryReport() {
      let obj = {
        tenantId: this.tenantId,
        userId: this.$store.state.userAccount.userId
      }
      let res = await getOrderTodaySummaryReportPlatform(obj)
      if (res.data) {
        this.summaryData = res.data
      }
      console.log(res)
    }
  },
  mounted() {this.getOrderTodaySummaryReport()}
}
</script>

<style lang="scss" scoped></style>
