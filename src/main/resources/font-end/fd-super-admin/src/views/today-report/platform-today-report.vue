<template>
  <div class="container" :class="isShowUi ? 'isShowUi' : 'noUi'">


    <el-card>
      <el-form
        :inline="true"
        ref="queryFormData"
        :model="queryFormData"
        class="demo-form-inline"
      >
        <el-form-item label="平台名称" prop="platformName">
          <el-input
            v-model="queryFormData.platformName"
            placeholder="请输入平台名称"
            size="small"
          />
        </el-form-item>

        <el-form-item label="统计日期" prop="">
          <el-date-picker
            v-model="queryFormData.statisticDate"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            :picker-options="shengchengPickerOptions"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="small" icon="el-icon-search" @click="queryTableData"
            >搜索</el-button
          >
          <el-button size="small" icon="el-icon-refresh" @click="resetQueryForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

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
            成功实付金额(元) <span class="value">{{ summaryData.successfulPayAmount | amountFormat }}</span>
          </div>

          <div class="item s1">
            成功率(%)
            <span class="value"
              >{{ summaryData.successfulRate
              }}<i v-if="summaryData.successfulRate != null">%</i></span
            >
          </div>
          <div class="item s7">
            系统费用(元)
            <span class="value">{{ summaryData.systemCost | amountFormat }}</span>
          </div>
          <!-- <div class="item s7">
            平台代理费用(元)
            <span class="value">{{ summaryData.tenantAgentCost | amountFormat }}</span>
          </div> -->

          <div class="item s7">
            码商分润(元)
            <span class="value">{{ summaryData.providerCost | amountFormat }}</span>
          </div>
          <div class="item s7">
            商户费用(元)
            <span class="value">{{ summaryData.merchantCost | amountFormat }}</span>
          </div>
          <div class="item s7">
            平台利润(元)
            <span class="value">{{ summaryData.platformProfit | amountFormat }}</span>
          </div>
        </div>
      </div>
    </div>

    <el-card class="mt-10">
      <TradeTypeSwitch v-model="tradeType" @change="onTradeTypeChange"> </TradeTypeSwitch>

      <my-table
        class="mt-10"
        ref="tableRef"
        :loadData="getTenantTodayReport"
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

        <el-table-column label="总订单" align="center" prop="orderCount">
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

        <el-table-column label="成功订单" align="center" prop="orderCount">
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
          label="成功率(%)"
          align="center"
          sortable
          :sort-method="(a, b) => a.successfulRate - b.successfulRate"
          prop="successfulRate"
        />
        <el-table-column
          label="商户费用(元)"
          align="center"
          sortable
          :sort-method="(a, b) => a.merchantCost - b.merchantCost"
          prop="merchantCost"
          width="90px"
        />
        <el-table-column
          label="系统费用(元)"
          align="center"
          sortable
          :sort-method="(a, b) => a.systemCost - b.systemCost"
          prop="systemCost"
          width="90px"
        >
          <template slot-scope="{ row }">
            {{ row.systemCost }}
          </template>
        </el-table-column>
        <el-table-column
          label="商户代理分润(元)"
          align="center"
          sortable
          :sort-method="(a, b) => a.merchantAgentCost - b.merchantAgentCost"
          prop="merchantAgentCost"
          width="90px"
        />
        <el-table-column
          label="码商分润(元)"
          align="center"
          sortable
          :sort-method="(a, b) => a.providerCost - b.providerCost"
          prop="providerCost"
          width="90px"
        />
        <el-table-column
          label="平台利润(元)"
          align="center"
          sortable
          :sort-method="(a, b) => a.platformProfit - b.platformProfit"
          prop="platformProfit"
          width="90px"
        />
        <el-table-column
          label="日终余额(元)"
          align="center"
          sortable
          :sort-method="(a, b) => a.dailyAvailableBalance - b.dailyAvailableBalance"
          prop="dailyAvailableBalance"
          width="90px"
        />
        <!-- <el-table-column
          label="日终冻结金额(元)"
          align="center"
          prop="dailyFreezeBalance"
          width="130px"
        /> -->
      </my-table>
    </el-card>
  </div>
</template>

<script>
import { getTenantTodayReport, dailyPlatformReportSummary } from '@/api/today-report'
import { dailyPlatformReportExportToday } from '@/api/today-report'
import TradeTypeSwitch from '@/components/TradeTypeSwitch'
import FileSaver from 'file-saver'

import { formatDateDate } from '@/utils'

export default {
  name: 'PlatformTodayReport',
  components: {
    TradeTypeSwitch
  },
  data() {
    return {
      tableData: [],
      summaryData: {},
      tradeType: 0,
      queryFormData: this.getQueryForm()
    }
  },
  computed: {
    selectTenantId() {
      return this.$store.state.tenant.selectTenantId
    }
  },
  watch: {
    selectTenantId(newVal, oldVal) {
      console.log(newVal, oldVal)
        this.dailyPlatformReportSummary()
        this.$refs.tableRef.getTableData(1)
    }
  },
  methods: {
    resetQueryForm() {
      this.queryFormData = this.getQueryForm()
      this.$refs.tableRef.getTableData(1)
      this.dailyPlatformReportSummary()
      this.$refs.queryFormData.resetFields()
    },
    queryTableData(){
      this.$refs.queryFormData.validate(async (valid) => {
        if (valid) {
          this.$refs.tableRef.getTableData(1)
          this.dailyPlatformReportSummary()
        }
      })
    },
    getQueryForm(){
      let now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate() )
      let todayStr = formatDateDate(today)
      return {
        statisticDate: todayStr
      }
    },
    onTradeTypeChange(e){
      this.tradeType = e
      this.dailyPlatformReportSummary()
      this.$refs.tableRef.getTableData(1)
    },
    async exportReport() {
      let obj = {
        tenantId: this.$store.state.tenant.selectTenantId,
        tradeType: this.tradeType,
        statisticDate: this.queryFormData.statisticDate,
        platformName: this.queryFormData.platformName
      }

      let res = await dailyPlatformReportExportToday(obj)
      FileSaver.saveAs(res, '平台今日报表.xlsx')
      console.log(res, 'res')
    },

    async getTenantTodayReport(page) {
      let obj = {
        tenantId: this.$store.state.tenant.currTenantId,
        userId: this.$store.state.user.userId,
        tradeType: this.tradeType,
        statisticDate: this.queryFormData.statisticDate,
        platformName: this.queryFormData.platformName
      }
      let res = await getTenantTodayReport({ ...page, ...obj })
      this.tableData = res.data.list
      console.log(res)
      return res
    },
    async dailyPlatformReportSummary() {
      let obj = {
        tenantId: this.$store.state.tenant.currTenantId,
        userId: this.$store.state.user.userId,
        tradeType: this.tradeType,
        statisticDate: this.queryFormData.statisticDate,
        platformName: this.queryFormData.platformName
      }

      let res = await dailyPlatformReportSummary(obj)
      if (res.data) {
        this.summaryData = res.data
      }
      console.log(res)
    }
  },
  mounted() {
    this.dailyPlatformReportSummary()
  }
}
</script>

<style lang="scss" scoped></style>
