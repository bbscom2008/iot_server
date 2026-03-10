<template>
  <div class="container" :class="isShowUi ? 'isShowUi' : 'noUi'">
    <el-card>
      <el-form
        :inline="true"
        :rules="rules"
        ref="queryFormData"
        :model="queryFormData"
        class="demo-form-inline"
      >
        <el-form-item label="商户代理名称" prop="merchantAgentName">
          <el-input
            v-model="queryFormData.merchantAgentName"
            placeholder="请输入商户代理名称"
            size="small"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="统计日期" prop="">
          <el-date-picker
            v-model="queryFormData.statisticDate"
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="myPickerOptionsAll"
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
        <div class="btns">
          <el-button type="primary" plain icon="el-icon-download" @click="exportReport()"
            >导出</el-button
          >
          <el-button type="success" plain icon="el-icon-folder-add" @click="showCreateDialog()"
            >生成</el-button
          >
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
              >{{ summaryData.successfulRate }} <i v-if="summaryData.successfulRate != null">%</i>
            </span>
          </div>

          <div class="item s8">
            分润(元)
            <span class="value">{{ summaryData.merchantAgentCost | amountFormat }}</span>
          </div>

          <div class="item s7">
            单笔费用(元)
            <span class="value">{{ summaryData.merchantTransactionFee | amountFormat }}</span>
          </div>

        </div>
      </div>
    </div>

    <el-card class="mt-10">
      
      <TradeTypeSwitch v-model="tradeType" @input="onTradeTypeChange"> </TradeTypeSwitch>

      <my-table
        class="mt-10"
        ref="tableRef"
        :loadData="merchantAgentDailyReportGetReportPage"
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
        <el-table-column label="商户代理名称" align="center" prop="merchantAgentName" />

        <el-table-column label="总订单" align="center" >
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


        <el-table-column label="成功订单" align="center" >
          <el-table-column
            label="成功订单数量"
            align="center"
            sortable
            :sort-method="(a, b) => a.successfulOrderCount - b.successfulOrderCount"
            prop="successfulOrderCount"
          >
            <template slot-scope="{ row }">
              <div style="color: green; font-weight: 600;">{{ row.successfulOrderCount }}</div>
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
              <div style="color: green; font-weight: 600;">{{ row.successfulOrderAmount }}</div>
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
              <div style="color: green; font-weight: 600;">{{ row.successfulPayAmount }}</div>
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
        <!-- <el-table-column
          label="商户交易额(元)"
          align="center"
          prop="merchantTransactionFee"
          width="130px"
        /> -->
        <el-table-column
          label="分润比例(%)"
          align="center"
          sortable
          :sort-method="(a, b) => a.merchantAgentRate - b.merchantAgentRate"
          prop="merchantAgentRate"
          width="130px"
        />
        <el-table-column
          label="分润(元)"
          align="center"
          sortable
          :sort-method="(a, b) => a.merchantAgentCost - b.merchantAgentCost"
          prop="merchantAgentCost"
          width="130px"
        />

        <el-table-column
          label="日终余额(元)"
          align="center"
          sortable
          :sort-method="(a, b) => a.dailyAvailableBalance - b.dailyAvailableBalance"
          prop="dailyAvailableBalance"
          width="130px"
        >
          <template slot-scope="{ row }">
            {{ row.dailyAvailableBalance }}
          </template>
        </el-table-column>
        <!-- <el-table-column
          label="日终冻结金额(元)"
          align="center"
          prop="dailyFreezeAmount"
          width="130px"
        >
          <template slot-scope="{ row }">
            {{ row.dailyFreezeAmount }}
          </template>
        </el-table-column> -->
      </my-table>
    </el-card>

    <el-dialog :visible.sync="dialogVisible" title="生成报表" width="350px">
      <el-form>
        <el-form-item label="生成日期" prop="createdTime">
          <el-date-picker
            v-model="createdTime"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            :picker-options="shengchengPickerOptions"
          >
          </el-date-picker>
          <div class="help-tip mt-10">报表由系统自动生成，如有遗漏，可选择日期，手动生成报表!</div>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="onDialogBtnCancel()" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import TradeTypeSwitch from '@/components/TradeTypeSwitch'

import {
  merchantAgentDailyReportGetReportPage,
  merchantAgentDailyReportSummary,
  merchantAgentDailyReportExport,
  merchantAgentDailyReportGenerate
} from '@/api/report-center'
import { queryRules } from './rules'
import { formatDateDate } from '@/utils'
import FileSaver from 'file-saver'
export default {
  name: 'PlatformDailyReport',
  components: {
    TradeTypeSwitch
  },
  data() {
    return {
      tradeType:0,
      tableData: [],
      rules: queryRules,
      dialogVisible: false,
      createdTime: '',
      queryFormData: this.getQueryForm(),
      summaryData: {}
    }
  },
  methods: {
    onTradeTypeChange(e) {
      this.tradeType = e
      this.merchantAgentDailyReportSummary()
      this.$refs.tableRef.getTableData(1)
    },
    async merchantAgentDailyReportGetReportPage(page) {
      let obj = {
        tenantId: this.tenantId,
        tradeType: this.tradeType
      }
      Object.keys(this.queryFormData).forEach((key) => {
        if (
          this.queryFormData[key] !== '' &&
          this.queryFormData[key] !== undefined &&
          this.queryFormData[key] !== null
        ) {
          if (key == 'statisticDate') {
            obj['startDate'] = this.queryFormData['statisticDate'][0]
            obj['endDate'] = this.queryFormData['statisticDate'][1]
          } else {
            obj[key] = this.queryFormData[key]
          }
        }
      })
      let res = await merchantAgentDailyReportGetReportPage(obj, page)
      this.tableData = res.data.list
      console.log(res)
      return res
    },
    async merchantAgentDailyReportSummary() {
      let obj = {
        tenantId: this.tenantId,
        tradeType: this.tradeType
      }
      Object.keys(this.queryFormData).forEach((key) => {
        if (
          this.queryFormData[key] !== '' &&
          this.queryFormData[key] !== undefined &&
          this.queryFormData[key] !== null
        ) {
          if (key == 'statisticDate') {
            obj['startDate'] = this.queryFormData['statisticDate'][0]
            obj['endDate'] = this.queryFormData['statisticDate'][1]
          } else {
            obj[key] = this.queryFormData[key]
          }
        }
      })
      let res = await merchantAgentDailyReportSummary(obj)
      this.summaryData = res.data
      console.log(res)
    },
    async exportReport() {
      let obj = {
        tenantId: this.tenantId
      }
      Object.keys(this.queryFormData).forEach((key) => {
        if (
          this.queryFormData[key] !== '' &&
          this.queryFormData[key] !== undefined &&
          this.queryFormData[key] !== null
        ) {
          if (key == 'statisticDate') {
            obj['startDate'] = this.queryFormData['statisticDate'][0]
            obj['endDate'] = this.queryFormData['statisticDate'][1]
          } else {
            obj[key] = this.queryFormData[key]
          }
        }
      })
      let res = await merchantAgentDailyReportExport(obj)
      console.log(res, 'res')
      FileSaver.saveAs(res, '商户代理日报表.xlsx')
    },
    showCreateDialog() {
      this.dialogVisible = true
    },
    onDialogBtnCancel() {
      this.dialogVisible = false
      this.createdTime = ''
    },
    async onDialogBtnOk() {
      if (!this.createdTime) {
        this.$message.error('请先选择日期！')
        return
      }
      let res = await merchantAgentDailyReportGenerate({
        date: this.createdTime,
        tenantId: this.tenantId
      })
      this.createdTime = ''
      console.log(res, 'res')
      this.dialogVisible = false
      this.$refs.tableRef.getTableData(1)
    },
    resetQueryForm() {
      this.queryFormData = this.getQueryForm()
      this.$refs.tableRef.getTableData(1)
      this.merchantAgentDailyReportSummary()
      this.$refs.queryFormData.resetFields()
    },
    getQueryForm() {
      let now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
      let sevenStr = formatDateDate(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1))
      let todayStr = formatDateDate(today)
      return {
        statisticDate: [sevenStr, todayStr]
        // statisticDate: []
      }
    },

    queryTableData() {
      this.$refs.queryFormData.validate(async (valid) => {
        if (valid) {
          this.$refs.tableRef.getTableData(1)
          this.merchantAgentDailyReportSummary()
        }
      })
    }
  },
  mounted() {
    this.merchantAgentDailyReportSummary()
  }
}
</script>

<style lang="scss" scoped></style>
