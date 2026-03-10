<template>
  <div class="container" :class="isShowUi ? 'isShowUi' : 'noUi'">
    <div v-if="isShowUi" class="report-summary">
      <div class="tool-box">
        <div class="btns" style="height: 32px">
          <el-button type="primary" plain icon="el-icon-download" @click="exportReport()"
            >导出</el-button
          >

          <!-- <el-button type="success" plain icon="el-icon-folder-add" @click="showCreateDialog()"
            >生成</el-button
          > -->
        </div>

        <div class="item-box">
          <div class="item s1">
            平台利润(元) <span class="value">{{ summaryData.platformProfit | amountFormat }}</span>
          </div>

          <div class="item s3">
            订单数量(单) <span class="value">{{ summaryData.orderCount }}</span>
          </div>
          <div class="item s3">
            订单金额(元) <span class="value">{{ summaryData.orderAmount | amountFormat }}</span>
          </div>
          <div class="item s3">
            实付金额(元) <span class="value">{{ summaryData.payAmount | amountFormat }}</span>
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

          <div class="item s6">
            成功率(%)
            <span class="value"
              >{{ summaryData.successfulRate
              }}<i v-if="summaryData.successfulRate != null">%</i></span
            >
          </div>
        </div>
      </div>
    </div>

    <el-card class="mt-10">
      <TradeTypeSwitch v-model="tradeType" @input="onTradeTypeChange"> </TradeTypeSwitch>
      <my-table
        class="mt-10"
        ref="tableRef"
        :loadData="dailyChannelReport"
        :tableData="tableData"
        style="width: 100%"
        border
      >
        <el-table-column label="序号" align="center" type="index" width="60" />
        <el-table-column label="统计日期" align="center" prop="statisticsDate" />
        <el-table-column label="通道名称" align="center" prop="channelName" />
        <el-table-column label="商户名称" align="center" prop="merchantName" />
        <el-table-column label="平台利润" align="center" prop="platformProfit" />

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
          >
            <template slot-scope="{ row }">
              <div style="color: green; font-weight: 600">{{ row.successfulOrderCount }}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="成功订单金额(元)"
            align="center"
            sortable
            :sort-method="(a, b) => a.successfulOrderAmount - b.successfulOrderAmount"
            prop="successfulOrderAmount"
          >
            <template slot-scope="{ row }">
              <div style="color: green; font-weight: 600">{{ row.successfulOrderAmount }}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="成功实付金额(元)"
            align="center"
            sortable
            :sort-method="(a, b) => a.successfulPayAmount - b.successfulPayAmount"
            prop="successfulPayAmount"
          >
            <template slot-scope="{ row }">
              <div style="color: green; font-weight: 600">{{ row.successfulPayAmount }}</div>
            </template>
          </el-table-column>
        </el-table-column>

        <el-table-column
          label="成功率"
          align="center"
          sortable
          :sort-method="(a, b) => a.successfulRate - b.successfulRate"
          prop="successfulRate"
        />
      </my-table>
    </el-card>
  </div>
</template>

<script>
import { dailyChannelReport, dailyChannelReportSummary } from '@/api/today-report'

import { channelReportExportToday } from '@/api/today-report'
import TradeTypeSwitch from '@/components/TradeTypeSwitch'
import FileSaver from 'file-saver'

export default {
  name: 'ChannelTodayReport',
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
      this.dailyChannelReportSummary()
      this.$refs.tableRef.getTableData(1)
    }
  },

  methods: {
    onTradeTypeChange(e) {
      this.tradeType = e
      this.dailyChannelReportSummary()
      this.$refs.tableRef.getTableData(1)
    },
    async exportReport() {
      let obj = {
        tenantId: this.$store.state.tenant.selectTenantId
      }

      let res = await channelReportExportToday(obj)
      FileSaver.saveAs(res, '通道今日报表.xlsx')
    },

    async dailyChannelReport(page) {
      let obj = {
        tenantId: this.selectTenantId,
        userId: this.$store.state.user.userId,
        tradeType: this.tradeType
      }
      let res = await dailyChannelReport({ ...obj, ...page })
      this.tableData = res.data.list
      console.log(res)
      return res
    },
    async dailyChannelReportSummary() {
      let obj = {
        tenantId: this.selectTenantId,
        userId: this.$store.state.user.userId,
        tradeType: this.tradeType
      }
      let res = await dailyChannelReportSummary(obj)
      if (res.data) {
        this.summaryData = res.data
      }
      console.log(res)
    }
  },
  mounted() {
    this.dailyChannelReportSummary()
  }
}
</script>

<style lang="scss" scoped></style>
