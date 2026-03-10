<template>
  <div class="container" :class="isShowUi ? 'isShowUi' : 'noUi'">
    <div v-if="isShowUi" class="report-summary">
      <div class="tool-box">
        <div class="btns" style="height: 32px">
          <el-button type="primary" plain icon="el-icon-download" @click="exportReport()"
            >导出</el-button
          >
          <!-- <el-button type="success" plain icon="el-icon-folder-add" @click="showCreateDialog()"
            >生成</el-button> -->
        </div>

        <div class="item-box">
          <div class="item s3">
            订单数量(单) <span class="value">{{ summaryData.orderCount }}</span>
          </div>
          <div class="item s3">
            订单金额(元) <span class="value">{{ summaryData.orderAmount | amountFormat }}</span>
          </div>

          <div class="item s3">
            实付金额(元)
            <span class="value">{{ summaryData.payAmount | amountFormat }}</span>
          </div>

          <div class="item s5">
            成功订单数(单)
            <span class="value">{{ summaryData.successfulOrderCount }}</span>
          </div>
          <div class="item s5">
            成功订单金额(元)
            <span class="value">{{ summaryData.successfulOrderAmount | amountFormat }}</span>
          </div>
          <div class="item s5">
            成功实付金额(元)
            <span class="value">{{ summaryData.successfulPayAmount | amountFormat }}</span>
          </div>

          <div class="item s2">
            成功率(%)
            <span class="value"
              >{{ summaryData.successfulRate
              }}<i v-if="summaryData.successfulRate != null">%</i></span
            >
          </div>
          <div class="item s6">
            系统费用(元)
            <span class="value">{{ summaryData.systemCost | amountFormat }}</span>
          </div>
          <div class="item s7">
            分润(元) <span class="value">{{ summaryData.tenantAgentCost | amountFormat }}</span>
          </div>
        </div>
      </div>
    </div>

    <el-card class="mt-10">
      <TradeTypeSwitch v-model="tradeType" @input="onTradeTypeChange"> </TradeTypeSwitch>

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
        <el-table-column label="平台代理名称" align="center" prop="tenantAgentName" />

        <el-table-column label="总订单" align="center">
          <el-table-column
            label="订单数量"
            align="center"
            sortable
            :sort-method="(a, b) => a.orderCount - b.orderCount"
            prop="orderCount"
          />
          <el-table-column
            label="订单金额(元)"
            align="center"
            sortable
            :sort-method="(a, b) => a.orderAmount - b.orderAmount"
            prop="orderAmount"
          />
          <el-table-column
            label="实付金额(元)"
            align="center"
            sortable
            :sort-method="(a, b) => a.payAmount - b.payAmount"
            prop="payAmount"
          />
        </el-table-column>

        <el-table-column label="成功订单" align="center">
          <el-table-column
            label="成功订单数量"
            align="center"
            sortable
            :sort-method="(a, b) => a.successfulOrderCount - b.successfulOrderCount"
            prop="successfulOrderCount"
            width="100px"
          >
            <template slot-scope="{ row }">
              <div style="color: green; font-weight: 600">
                {{ row.successfulOrderCount }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="成功订单金额(元)"
            align="center"
            sortable
            :sort-method="(a, b) => a.successfulOrderAmount - b.successfulOrderAmount"
            prop="successfulOrderAmount"
            width="100px"
          >
            <template slot-scope="{ row }">
              <div style="color: green; font-weight: 600">
                {{ row.successfulOrderAmount }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="成功实付金额(元)"
            align="center"
            sortable
            :sort-method="(a, b) => a.successfulPayAmount - b.successfulPayAmount"
            prop="successfulPayAmount"
            width="100px"
          >
            <template slot-scope="{ row }">
              <div style="color: green; font-weight: 600">
                {{ row.successfulPayAmount }}
              </div>
            </template>
          </el-table-column>
        </el-table-column>

        <el-table-column
          label="成功率(%)"
          align="center"
          sortable
          :sort-method="(a, b) => a.successfulRate - b.successfulRate"
          prop="successfulRate"
        />
        <el-table-column
          label="系统费用(元)"
          align="center"
          sortable
          :sort-method="(a, b) => a.systemCost - b.systemCost"
          prop="systemCost"
        >
          <template slot-scope="{ row }">
            {{ row.systemCost }}
          </template>
        </el-table-column>

        <el-table-column
          label="分润比例(%)"
          align="center"
          sortable
          :sort-method="(a, b) => a.tenantAgentRate - b.tenantAgentRate"
          prop="tenantAgentRate"
          width="130px"
        />
        <el-table-column
          label="分润(元)"
          align="center"
          sortable
          :sort-method="(a, b) => a.tenantAgentCost - b.tenantAgentCost"
          prop="tenantAgentCost"
          width="130px"
        />
        <el-table-column
          label="日终余额(元)"
          align="center"
          prop="dailyAvailableBalance"
          sortable
          :sort-method="(a, b) => a.dailyAvailableBalance - b.dailyAvailableBalance"
          width="130px"
        />
      </my-table>
    </el-card>
  </div>
</template>

<script>
import TradeTypeSwitch from '@/components/TradeTypeSwitch'

import { getOrderTodayReport, getOrderTodaySummaryReport } from '@/api/today-report'
import { tenantAgentReportExportToday } from '@/api/today-report'

import FileSaver from 'file-saver'

export default {
  name: 'TenantAgentTodayReport',
  components: {
    TradeTypeSwitch
  },
  data() {
    return {
      tableData: [],
      summaryData: {},
      tradeType: 0
    }
  },
  computed: {
    selectTenantId() {
      return this.$store.state.tenant.selectTenantId
    }
  },
  watch: {
    selectTenantId(newVal, oldVal) {
      this.getOrderTodaySummaryReport()
      this.$refs.tableRef.getTableData(1)
    }
  },

  methods: {
    onTradeTypeChange(e) {
      this.tradeType = e
      this.getOrderTodaySummaryReport()
      this.$refs.tableRef.getTableData(1)
    },
    async exportReport() {
      let obj = {
        tenantId: this.$store.state.tenant.selectTenantId
      }

      let res = await tenantAgentReportExportToday(obj)
      FileSaver.saveAs(res, '平台代理今日报表.xlsx')
      console.log(res, 'res')
    },

    async getOrderTodayReport(page) {
      let obj = {
        tenantId: this.$store.state.tenant.currTenantId,
        userId: this.$store.state.user.userId,
        tradeType: this.tradeType
      }
      // Object.keys(this.queryFormData).forEach((key) => {
      //   if (this.queryFormData[key] !== '' && this.queryFormData[key] !== undefined) {
      //     if (key == 'statisticDate') {
      //       obj['startDate'] = this.queryFormData['statisticDate'][0]
      //       obj['endDate'] = this.queryFormData['statisticDate'][1]
      //     } else {
      //       obj[key] = this.queryFormData[key]
      //     }
      //   }
      // })
      let res = await getOrderTodayReport({ ...page, ...obj })
      this.tableData = res.data.list
      console.log(res)
      return res
    },
    async getOrderTodaySummaryReport() {
      let obj = {
        tenantId: this.$store.state.tenant.currTenantId,
        userId: this.$store.state.user.userId,
        tradeType: this.tradeType
      }
      // Object.keys(this.queryFormData).forEach((key) => {
      //   if (this.queryFormData[key] !== '' && this.queryFormData[key] !== undefined) {
      //     if (key == 'statisticDate') {
      //       obj['startDate'] = this.queryFormData['statisticDate'][0]
      //       obj['endDate'] = this.queryFormData['statisticDate'][1]
      //     } else {
      //       obj[key] = this.queryFormData[key]
      //     }
      //   }
      // })
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
