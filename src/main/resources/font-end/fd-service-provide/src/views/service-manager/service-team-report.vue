<template>
  <div class="container">
    <el-card>
      <el-form
        :inline="true"
        ref="queryFormData"
        :rules="queryRules"
        :model="queryFormData"
        class="demo-form-inline"
      >
        <el-form-item label="码商名称" prop="providerName">
          <el-input
            v-model="queryFormData.providerName"
            placeholder="请输入码商名称"
            size="small"
          />
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

    <el-card class="mt-10">
      <el-button type="warning" plain icon="el-icon-download" @click="exportReport()"
        >导出</el-button
      >
      <el-button type="success" plain icon="el-icon-folder-add" @click="showCreateDialog()"
        >生成</el-button
      >

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
          >实付金额: {{ summaryData.payAmount ? summaryData.payAmount : 0 }}
        </span>
        <span class="mr-10"
          >成功率(%): {{ summaryData.successfulRate ? summaryData.successfulRate : 0 }}%
        </span>
        <span class="mr-10"
          >分润: {{ summaryData.providerCost ? summaryData.providerCost : 0 }}
        </span>
      </div>

      <my-table
        class="mt-10"
        ref="tableRef"
        :loadData="providerTeamReportGetReportPage"
        :tableData="tableData"
        style="width: 100%"
        border
      >
        <el-table-column label="序号" align="center" type="index" />
        <el-table-column label="统计日期" align="center" prop="statisticsDate" />
        <el-table-column label="码商名称" align="center" prop="providerName" />
        <el-table-column label="订单数量" align="center" prop="orderCount" />
        <el-table-column label="订单金额(元)" align="center" prop="orderAmount" />
        <el-table-column label="成功订单数" align="center" prop="successfulOrderCount" />
        <el-table-column label="成功订单金额(元)" align="center" prop="successfulOrderAmount" />
        <el-table-column label="实付金额(元)" align="center" prop="payAmount" />
        <el-table-column label="成功实付金额(元)" align="center" prop="successfulPayAmount" />
        <el-table-column label="成功率(%)" align="center" prop="successfulRate" />
        <el-table-column label="分润(元)" align="center" prop="providerCost" width="120" />
        <el-table-column label="日终余额(元)" align="center" prop="dailyAvailableBalance" />
      </my-table>
    </el-card>

    <el-dialog :visible.sync="dialogVisible" title="生成" width="350px">
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
        </el-form-item>
        <div class="help-tip mt-10">报表由系统自动生成，如有遗漏，可选择日期，手动生成报表!</div>
      </el-form>

      <div slot="footer">
        <el-button @click="onDialogBtnCancel()" size="small"> 取消 </el-button>
        <el-button type="primary" @click="onDialogBtnOk()" size="small"> 确定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryRules } from './rules.js'
import { formatDateDate } from '@/utils'
import {
  providerTeamReportGetReportPage,
  providerTeamReportSummary,
  providerTeamReportExport,
  providerTeamReportGenerate
} from '@/api/report-center'
import FileSaver from 'file-saver'
export default {
  name: 'ServiceTeamReport',
  data() {
    return {
      queryRules: queryRules,
      tableData: [],
      dialogVisible: false,
      createdTime: '',
      queryFormData: this.getQueryForm(),
      summaryData: {}
    }
  },
  methods: {
    async providerTeamReportGetReportPage(page) {
      let obj = {
        tenantId: this.tenantId
      }
      Object.keys(this.queryFormData).forEach((key) => {
        if (this.queryFormData[key] !== '' && this.queryFormData[key] !== undefined&&this.queryFormData[key] !== null) {
          if (key == 'statisticDate') {
            obj['startDate'] = this.queryFormData['statisticDate'][0]
            obj['endDate'] = this.queryFormData['statisticDate'][1]
          } else {
            obj[key] = this.queryFormData[key]
          }
        }
      })
      let res = await providerTeamReportGetReportPage(obj, page)
      this.tableData = res.data.list
      console.log(res)
      return res
    },
    async providerTeamReportSummary() {
      let obj = {
        tenantId: this.tenantId
      }
      Object.keys(this.queryFormData).forEach((key) => {
        if (this.queryFormData[key] !== '' && this.queryFormData[key] !== undefined&&this.queryFormData[key] !== null) {
          if (key == 'statisticDate') {
            obj['startDate'] = this.queryFormData['statisticDate'][0]
            obj['endDate'] = this.queryFormData['statisticDate'][1]
          } else {
            obj[key] = this.queryFormData[key]
          }
        }
      })
      let res = await providerTeamReportSummary(obj)
      this.summaryData = res.data
      console.log(res)
    },
    async exportReport() {
      let obj = {
        tenantId: this.tenantId
      }
      Object.keys(this.queryFormData).forEach((key) => {
        if (this.queryFormData[key] !== '' && this.queryFormData[key] !== undefined&&this.queryFormData[key] !== null) {
          if (key == 'statisticDate') {
            obj['startDate'] = this.queryFormData['statisticDate'][0]
            obj['endDate'] = this.queryFormData['statisticDate'][1]
          } else {
            obj[key] = this.queryFormData[key]
          }
        }
      })
      let res = await providerTeamReportExport(obj)
      console.log(res, 'res')
      FileSaver.saveAs(res, '团队报表.xlsx')
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
      let res = await providerTeamReportGenerate({
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
      this.providerTeamReportSummary()
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
          this.providerTeamReportSummary()
        }
      })
    }
  },
  mounted() {
    this.providerTeamReportSummary()
  }
}
</script>

<style lang="scss" scoped></style>
