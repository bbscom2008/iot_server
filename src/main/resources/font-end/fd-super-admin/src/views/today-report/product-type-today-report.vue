<template>
  <div class="container" :class="isShowUi ? 'isShowUi' : 'noUi'">
    <div class="report-summary">
      <div class="tool-box">
        <div class="btns" style="height: 32px;">
          <el-button type="primary" plain icon="el-icon-download" @click="exportReport()"
            >导出</el-button
          >
          
          <!-- <el-button type="success" plain icon="el-icon-folder-add" @click="showCreateDialog()"
            >生成</el-button
          > -->
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

          <div class="item s6">
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
        </div>
      </div>
    </div>

    <el-card class="mt-10">
      
      <TradeTypeSwitch v-model="tradeType" @input="onTradeTypeChange"> </TradeTypeSwitch>

      <my-table
        class="mt-10"
        ref="tableRef"
        :loadData="dailyProductTypeReport"
        :tableData="tableData"
        style="width: 100%"
        border
      >
        <el-table-column label="序号" align="center" type="index" width="60" />
        <el-table-column label="统计日期" align="center" prop="statisticsDate" />
        <el-table-column label="产品类型名称" align="center" prop="productTypeName" width="110" />
        
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
          label="成功率"
          align="center"
          sortable
          :sort-method="(a, b) => a.successfulRate - b.successfulRate"
          prop="successfulRate"
          width="95"
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
      </my-table>
    </el-card>
  </div>
</template>

<script>
import { dailyProductTypeReport, dailyProductTypeReportSummary } from '@/api/today-report'
import TradeTypeSwitch from '@/components/TradeTypeSwitch'
import {dailyProductTypeReportExportToday} from '@/api/today-report'
import FileSaver from 'file-saver'

export default {
  name: 'ProductTypeTodayReport',
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
      this.dailyProductTypeReportSummary()
      this.$refs.tableRef.getTableData(1)
    }
  },
  methods: {
    onTradeTypeChange(e) {
      this.tradeType = e
      this.$refs.tableRef.getTableData(1)
      this.dailyProductTypeReportSummary()

    },
    async exportReport() {
      let obj = {
        tenantId: this.$store.state.tenant.selectTenantId
      }
     
      let res = await dailyProductTypeReportExportToday(obj)
      FileSaver.saveAs(res, '产品类型今日报表.xlsx')
    },
    async dailyProductTypeReport(page) {
      let obj = {
        tenantId: this.$store.state.tenant.currTenantId,
        userId: this.$store.state.user.userId,
        tradeType: this.tradeType
      }
      let res = await dailyProductTypeReport({ ...obj, ...page })
      this.tableData = res.data.list
      console.log(res)
      return res
    },
    async dailyProductTypeReportSummary() {
      let obj = {
        tenantId: this.$store.state.tenant.currTenantId,
        userId: this.$store.state.user.userId,
        tradeType: this.tradeType
      }
      let res = await dailyProductTypeReportSummary(obj)
      if (res.data) {
        this.summaryData = res.data
      }
      console.log(res)
    }
  },
  mounted() {
    this.dailyProductTypeReportSummary()
  }
}
</script>

<style lang="scss" scoped></style>
